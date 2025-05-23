import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MfaVerification } from "./_components/mfa-verification";
import { PageHeader } from "@/components/common/headers";
import { Icon } from "@/components/common/logo";

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
    <main className="w-full h-dvh place-items-center flex justify-center relative overflow-hidden px-5 md:px-7 lg:px-0">
      <div className="flex items-start justify-start flex-col w-full max-w-lg">
        <PageHeader
          title="Verfica tu código"
          description="Ingresa el código de 6 dígitos de tu aplicación de autenticación."
        />
        <MfaVerification />
      </div>
      <Icon className="absolute w-[180%] lg:w-[70%] h-auto lg:h-auto bottom-0 translate-y-1/2 opacity-5" />
    </main>
  );
};

export default MfaVerifyPage;
