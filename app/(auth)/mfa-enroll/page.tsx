import { Icon } from "@/components/common/logo";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MfaEnrollment } from "./_components/mfa-enrollment";

const MfaEnrollPage = async () => {
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

  // Verificar si el usuario ya tiene factores MFA
  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  if (factorsData && factorsData.totp && factorsData.totp.length > 0) {
    // Si ya tiene factores, redirigir a la página de verificación
    redirect("/mfa-verify");
  }

  return (
    <main className="w-full h-dvh place-items-center flex justify-center relative">
      <MfaEnrollment />
      <Icon className="w-full fixed bottom-0 translate-y-1/2 right-1/2 translate-x-1/2 z-0 opacity-5 lg:w-[50%]" />
    </main>
  );
};

export default MfaEnrollPage;
