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
    const { rejectedReason } = body;

    if (
      !rejectedReason ||
      typeof rejectedReason !== "string" ||
      !rejectedReason.trim()
    ) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Get the wedding verification record
    const { data: verifyRecord, error: fetchError } = await supabase
      .from("wedding_verify")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !verifyRecord) {
      return NextResponse.json(
        { error: "Gift table not found" },
        { status: 404 }
      );
    }

    // Update the status to rejected and add the rejection reason
    const { error: updateError } = await supabase
      .from("wedding_verify")
      .update({
        status: "rejected",
        rejected_reason: rejectedReason,
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update status" },
        { status: 500 }
      );
    }

    revalidatePath("(platform)/@superadmin/dashboard/mod/gift-table", "page");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting gift table:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
