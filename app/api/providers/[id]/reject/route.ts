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

    // Update only the rejection_reason, not changing is_verified
    const { error: updateError } = await supabase
      .from("provider_business")
      .update({
        rejection_reason: rejectionReason,
      })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update rejection reason" },
        { status: 500 }
      );
    }

    revalidatePath("(platform)/@superadmin/dashboard/mod/partners", "page");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting provider business:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
