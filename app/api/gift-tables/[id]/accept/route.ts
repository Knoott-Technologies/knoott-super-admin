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
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !verifyRecord) {
      return NextResponse.json(
        { error: "Gift table not found" },
        { status: 404 }
      );
    }

    // Update the status to verified
    const { error: updateError } = await supabase
      .from("wedding_verify")
      .update({ status: "verified" })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update status" },
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
