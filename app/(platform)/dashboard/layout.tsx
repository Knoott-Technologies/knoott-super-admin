import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

const DashboardLayout = async ({
  superadmin,
  mod,
  marketing,
  account_manager,
}: {
  superadmin: React.ReactNode;
  mod: React.ReactNode;
  marketing: React.ReactNode;
  account_manager: React.ReactNode;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const { data, error: aalError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (aalError) {
    throw aalError;
  }

  if (data.currentLevel === "aal1" && data.currentLevel === data.nextLevel) {
    return redirect("/mfa-enroll");
  }

  if (data.currentLevel === "aal1" && data.currentLevel !== data.nextLevel) {
    return redirect("/mfa-verify");
  }

  if (data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel) {
    return redirect("/mfa-verify");
  }

  const { data: role, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !role) {
    return redirect("/");
  }

  switch (role.role) {
    case "superadmin":
      return superadmin;
    case "mod":
      return mod;
    case "marketing":
      return marketing;
    case "account_manager":
      return account_manager;
    default:
      return null;
  }
};

export default DashboardLayout;
