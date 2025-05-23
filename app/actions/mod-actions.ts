"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Acciones para marcas
export async function bulkApproveBrands(ids: string[]) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("catalog_brands")
      .update({ status: "active" })
      .in("id", ids);

    if (error) {
      console.error("Error al aprobar marcas:", error);
      return {
        success: false,
        error: "Error al actualizar el estado de las marcas",
      };
    }

    revalidatePath("/dashboard/mod/brands");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error en bulkApproveBrands:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function bulkRejectBrands(ids: string[]) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("catalog_brands")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Error al rechazar marcas:", error);
      return { success: false, error: "Error al eliminar las marcas" };
    }

    revalidatePath("/dashboard/mod/brands");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error en bulkRejectBrands:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// Acciones para productos
export async function bulkApproveProducts(ids: string[]) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("products")
      .update({ status: "draft" })
      .in("id", ids);

    if (error) {
      console.error("Error al aprobar productos:", error);
      return {
        success: false,
        error: "Error al actualizar el estado de los productos",
      };
    }

    revalidatePath("/dashboard/mod/products");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error en bulkApproveProducts:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function bulkRejectProducts(ids: string[]) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("products")
      .update({ status: "rejected" })
      .in("id", ids);

    if (error) {
      console.error("Error al rechazar productos:", error);
      return {
        success: false,
        error: "Error al actualizar el estado de los productos",
      };
    }

    revalidatePath("/dashboard/mod/products");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error en bulkRejectProducts:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// Acciones para categorías
export async function bulkApproveCategories(ids: string[]) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("catalog_collections")
      .update({ status: "active" })
      .in("id", ids);

    if (error) {
      console.error("Error al aprobar categorías:", error);
      return {
        success: false,
        error: "Error al actualizar el estado de las categorías",
      };
    }

    revalidatePath("/dashboard/mod/categories");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error en bulkApproveCategories:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function bulkRejectCategories(ids: string[]) {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("catalog_collections")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Error al rechazar categorías:", error);
      return { success: false, error: "Error al eliminar las categorías" };
    }

    revalidatePath("/dashboard/mod/categories");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error en bulkRejectCategories:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
