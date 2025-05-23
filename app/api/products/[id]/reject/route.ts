import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();

    // Get the request body
    const body = await request.json();
    const { rejectionReason } = body;

    if (
      !rejectionReason ||
      typeof rejectionReason !== "string" ||
      !rejectionReason.trim()
    ) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Get the product record
    const { data: productRecord, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !productRecord) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update the status to rejected and add rejection reason
    const { error: updateError } = await supabase
      .from("products")
      .update({
        status: "rejected",
        rejected_reason: rejectionReason,
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update product status" },
        { status: 500 }
      );
    }

    revalidatePath("(platform)/@superadmin/dashboard/mod/products", "page");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
