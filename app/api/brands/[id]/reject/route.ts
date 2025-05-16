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
      .from("catalog_brands")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !collectionRecord) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    // Delete the collection
    const { error: deleteError } = await supabase
      .from("catalog_brands")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete brand" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
