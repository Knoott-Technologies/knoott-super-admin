import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { partner_id: string } }
) {
  try {
    const partnerId = params.partner_id;

    // Parse the multipart form data
    const formData = await request.formData();
    const receipt = formData.get("receipt") as File;
    const orderId = formData.get("orderId") as string;
    const amount = formData.get("amount") as string;

    if (!receipt || !orderId || !amount) {
      return NextResponse.json(
        { message: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createAdminClient();

    // Get provider business details to generate reference
    const { data: providerData, error: providerError } = await supabase
      .from("provider_business")
      .select("reference")
      .eq("id", partnerId)
      .single();

    if (providerError || !providerData) {
      return NextResponse.json(
        { message: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    // Get count of existing transactions for this provider to generate sequential reference
    const { count, error: countError } = await supabase
      .from("provider_business_transactions")
      .select("*", { count: "exact", head: true })
      .eq("provider_business_id", partnerId);

    if (countError) {
      return NextResponse.json(
        { message: "Error al generar referencia" },
        { status: 500 }
      );
    }

    const transactionCount = (count || 0) + 1;
    const reference = `${providerData.reference}${transactionCount}`;

    // Upload receipt to Supabase Storage
    const fileExtension = receipt.name.split(".").pop();
    const fileName = `provider_assets/${partnerId}/receipts/${Date.now()}.${fileExtension}`;
    const filePath = `receipts/${fileName}`;

    // Convert File to ArrayBuffer for Supabase Storage upload
    const fileArrayBuffer = await receipt.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("provider-assets")
      .upload(fileName, fileArrayBuffer, {
        contentType: receipt.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { message: "Error al subir el comprobante" },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("provider-assets")
      .getPublicUrl(fileName);
    const receiptUrl = publicUrlData.publicUrl;

    // Insert transaction into database
    const { data: transaction, error: transactionError } = await supabase
      .from("provider_business_transactions")
      .insert({
        reference,
        amount: Number.parseFloat(amount),
        status: "completed",
        order_id: Number.parseInt(orderId),
        provider_business_id: partnerId,
        receipt_url: receiptUrl,
        description: `Pago a proveedor por orden #${orderId}`,
      })
      .select()
      .single();

      const { data: orderUpdate } = await supabase
      .from("wedding_product_orders")
      .update({
        paid_at: new Date().toISOString(),
        status: "paid",
      })
      .eq("id", orderId);


    if (transactionError) {
      return NextResponse.json(
        {
          message: "Error al registrar la transacción",
          error: transactionError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Pago registrado exitosamente",
      data: transaction,
    });
  } catch (error) {
    console.error("Error en el pago al proveedor:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
