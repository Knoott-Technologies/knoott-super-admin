import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Actualizar el estado de todas las categorías seleccionadas a "active"
    const { error } = await supabase
      .from("catalog_collections")
      .update({ status: "active" })
      .in("id", ids);

    if (error) {
      console.error("Error al aprobar categorías:", error);
      return NextResponse.json(
        { error: "Error al actualizar el estado de las categorías" },
        { status: 500 }
      );
    }

    // Revalidar la ruta para actualizar la UI
    revalidatePath("/dashboard/mod/categories");

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error("Error en bulk-approve:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
