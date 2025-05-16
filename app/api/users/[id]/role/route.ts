import { createAdminClient } from "@/lib/supabase/admin";
import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

// Esquema de validación para la actualización de rol
const roleSchema = z.object({
  role: z
    .enum(["superadmin", "mod", "account_manager", "marketing"])
    .nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que se proporcionó un ID
    if (!params.id) {
      return NextResponse.json(
        { error: "ID de usuario no proporcionado" },
        { status: 400 }
      );
    }

    // Obtener y validar los datos del cuerpo de la solicitud
    const body = await request.json();
    const { role } = roleSchema.parse(body);

    const supabase = createAdminClient();

    // Verificar si el usuario existe
    const { data: existingUser, error: searchError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", params.id)
      .single();

    if (searchError || !existingUser) {
      console.error("Error al buscar usuario:", searchError);
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el usuario es superadmin (no se puede modificar)
    if (existingUser.role === "superadmin") {
      return NextResponse.json(
        { error: "No se puede modificar el rol de un superadmin" },
        { status: 403 }
      );
    }

    // Actualizar el rol del usuario
    const { error: updateError } = await supabase
      .from("users")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", params.id);

    if (updateError) {
      console.error("Error al actualizar rol:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar rol" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        role === null
          ? "Rol eliminado correctamente"
          : "Rol actualizado correctamente",
    });
  } catch (error) {
    console.error("Error en la API:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
