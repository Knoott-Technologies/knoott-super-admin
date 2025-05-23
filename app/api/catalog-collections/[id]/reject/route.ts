import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

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

    // Delete the collection
    const { error: deleteError } = await supabase
      .from("catalog_collections")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete collection" },
        { status: 500 }
      );
    }

    revalidatePath("(platform)/@superadmin/dashboard/mod/categories", "page");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error rejecting collection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
