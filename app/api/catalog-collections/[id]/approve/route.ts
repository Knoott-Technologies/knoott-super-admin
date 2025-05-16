import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();

    // Get the collection record
    const { data: collectionRecord, error: fetchError } = await supabase
      .from("catalog_collections")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !collectionRecord) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    // Update the status to active
    const { error: updateError } = await supabase
      .from("catalog_collections")
      .update({ status: "active" })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update collection status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving collection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
