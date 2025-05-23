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

    // Eliminar todas las categorías seleccionadas
    const { error } = await supabase
      .from("catalog_collections")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Error al rechazar categorías:", error);
      return NextResponse.json(
        { error: "Error al eliminar las categorías" },
        { status: 500 }
      );
    }

    // Revalidar la ruta para actualizar la UI
    revalidatePath("/dashboard/mod/categories");

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error("Error en bulk-reject:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
