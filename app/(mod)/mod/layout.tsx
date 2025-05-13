import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type React from "react";

const ModLayout = async ({
  sa,
  md,
  mkt,
  ac,
}: {
  sa: React.ReactNode;
  md: React.ReactNode;
  mkt: React.ReactNode;
  ac: React.ReactNode;
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
      return sa;
    case "mod":
      return md;
    case "marketing":
      return mkt;
    case "account_manager":
      return ac;
  }
};

export default ModLayout;
