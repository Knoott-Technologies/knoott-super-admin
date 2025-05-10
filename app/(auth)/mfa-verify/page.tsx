import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MfaVerification } from "./_components/mfa-verification";

const MfaVerifyPage = async () => {
  const supabase = await createClient();

  // Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Verificar el nivel de autenticación
  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) {
    throw error;
  }

  // Si el usuario ya está en aal2, redirigir al dashboard
  if (data.currentLevel === "aal2") {
    redirect("/dashboard");
  }

  // Verificar si el usuario tiene factores MFA
  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  if (!factorsData || !factorsData.totp || factorsData.totp.length === 0) {
    // Si no tiene factores, redirigir a la página de registro
    redirect("/mfa-enroll");
  }

  return (
    <main className="w-full h-dvh place-items-center flex justify-center">
      <MfaVerification />
    </main>
  );
};

export default MfaVerifyPage;
