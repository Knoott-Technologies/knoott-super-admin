import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();

    // Get the provider business record
    const { data: providerRecord, error: fetchError } = await supabase
      .from("provider_business")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !providerRecord) {
      return NextResponse.json(
        { error: "Provider business not found" },
        { status: 404 }
      );
    }

    // Update the is_verified status to true
    const { error: updateError } = await supabase
      .from("provider_business")
      .update({ is_verified: true })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update verification status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving provider business:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
