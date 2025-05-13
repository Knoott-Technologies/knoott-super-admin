import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type React from "react";

export default async function ModLayout({
  superadmin,
  mod,
  marketing,
  account_manager,
}: {
  superadmin: React.ReactNode;
  mod: React.ReactNode;
  marketing: React.ReactNode;
  account_manager: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data, error: aalError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (aalError) {
    throw aalError;
  }

  if (data.currentLevel === "aal1" && data.currentLevel === data.nextLevel) {
    redirect("/mfa-enroll");
  }

  if (data.currentLevel === "aal1" && data.currentLevel !== data.nextLevel) {
    redirect("/mfa-verify");
  }

  if (data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel) {
    redirect("/mfa-verify");
  }

  const { data: role, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !role) {
    redirect("/");
  }

  // Render the appropriate content based on role
  switch (role.role) {
    case "superadmin":
      return <>{superadmin}</>;
    case "mod":
      return <>{mod}</>;
    case "marketing":
      return <>{marketing}</>;
    case "account_manager":
      return <>{account_manager}</>;
  }
}
