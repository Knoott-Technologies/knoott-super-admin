import { createAdminClient } from "@/lib/supabase/admin";
import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

// Esquema de validación para la API
const userSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  phone_number: z.string().min(10).regex(/^\d+$/),
  password: z.string().min(8),
  role: z.enum(["superadmin", "mod", "account_manager", "marketing"]),
});

export async function POST(request: NextRequest) {
  try {
    // Obtener y validar los datos del cuerpo de la solicitud
    const body = await request.json();
    const validatedData = userSchema.parse(body);

    const { email, first_name, last_name, phone_number, password, role } =
      validatedData;

    const supabase = createAdminClient();

    // Verificar si el usuario ya existe en la tabla users
    const { data: existingUser, error: searchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (searchError && searchError.code !== "PGRST116") {
      // Error diferente a "no se encontró ningún registro"
      console.error("Error al buscar usuario:", searchError);
      return NextResponse.json(
        { error: "Error al buscar usuario" },
        { status: 500 }
      );
    }

    let updated = false;

    if (existingUser) {
      // El usuario ya existe, solo actualizar el rol
      const { error: updateError } = await supabase
        .from("users")
        .update({ role })
        .eq("id", existingUser.id);

      if (updateError) {
        console.error("Error al actualizar rol:", updateError);
        return NextResponse.json(
          { error: "Error al actualizar rol" },
          { status: 500 }
        );
      }

      updated = true;
    } else {
      // Crear nuevo usuario en Auth
      const { data: authUser, error: createAuthError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            first_name,
            last_name,
            phone_number,
          },
        });

      if (createAuthError || !authUser.user) {
        console.error("Error al crear usuario en Auth:", createAuthError);
        return NextResponse.json(
          {
            error: createAuthError?.message || "Error al crear usuario en Auth",
          },
          { status: 500 }
        );
      }

      const userId = authUser.user.id;

      // Insertar en la tabla users usando el mismo UUID de auth
      const { error: insertError } = await supabase.from("users").insert({
        id: userId, // Usar el mismo UUID de auth como ID en la tabla users
        email,
        first_name,
        last_name,
        phone_number,
        role,
        status: "active", // Valor por defecto según la definición de la tabla
      });

      if (insertError) {
        console.error("Error al insertar usuario en tabla users:", insertError);

        // Intentar eliminar el usuario de Auth si falló la inserción en la tabla users
        await supabase.auth.admin.deleteUser(userId);

        return NextResponse.json(
          { error: "Error al crear usuario en la base de datos" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      message: updated ? "Usuario actualizado" : "Usuario creado exitosamente",
    });
  } catch (error) {
    console.error("Error en la API:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos de formulario inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
