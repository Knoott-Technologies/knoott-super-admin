import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();

    // Get the product record
    const { data: productRecord, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !productRecord) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update the status to draft
    const { error: updateError } = await supabase
      .from("products")
      .update({
        status: "draft",
        // Clear any previous rejection reason if it exists
        rejected_reason: null,
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update product status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
