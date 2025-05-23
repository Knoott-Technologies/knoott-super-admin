import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { withdrawalId: string } }
) {
  try {
    const { withdrawalId } = params;
    const { userReceivedAmount, knoottReceivedAmount } = await request.json();

    // Create Supabase client
    const supabase = createAdminClient();

    // Update the transaction status to completed
    const { data, error } = await supabase
      .from("wedding_transactions")
      .update({
        status: "completed",
        user_received_amount: userReceivedAmount,
        knoott_received_amount: knoottReceivedAmount,
        created_at: new Date().toISOString(),
      })
      .eq("id", withdrawalId)
      .select();

    if (error) {
      console.error("Error updating transaction:", error);
      return NextResponse.json(
        { error: "Failed to update transaction" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in withdrawal confirmation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
