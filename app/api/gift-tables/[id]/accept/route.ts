import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();

    // Get the wedding verification record
    const { data: verifyRecord, error: fetchError } = await supabase
      .from("wedding_verify")
      .select("*, wedding:wedding_id(*)")
      .eq("id", params.id)
      .single();

    if (fetchError || !verifyRecord) {
      return NextResponse.json(
        { error: "Gift table not found" },
        { status: 404 }
      );
    }

    // Update the wedding_verify status to verified
    const { error: updateVerifyError } = await supabase
      .from("wedding_verify")
      .update({ status: "verified" })
      .eq("id", params.id);

    if (updateVerifyError) {
      return NextResponse.json(
        { error: "Failed to update verification status" },
        { status: 500 }
      );
    }

    // Also update the associated wedding to active and verified
    const { error: updateWeddingError } = await supabase
      .from("weddings")
      .update({
        status: "active",
        is_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", verifyRecord.wedding_id);

    if (updateWeddingError) {
      console.error("Error updating wedding:", updateWeddingError);
      return NextResponse.json(
        { error: "Failed to activate wedding" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving gift table:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
