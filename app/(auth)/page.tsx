import { Icon } from "@/components/common/logo";
import { LoginForm } from "./_components/login-form";
import { PageHeader } from "@/components/common/headers";

const AuthPage = () => {
  return (
    <main className="w-full h-dvh place-items-center flex justify-center relative overflow-hidden px-5 md:px-7 lg:px-0">
      <div className="flex items-start justify-start flex-col w-full max-w-lg">
        <PageHeader
          title="Ingresa a tu portal"
          description="Ingresa tus datos para iniciar sesión en tu cuenta, recuerda que necesitarás tu código de acceso."
        />
        <LoginForm />
      </div>
      <Icon className="absolute w-[180%] lg:w-[70%] h-auto lg:h-auto bottom-0 translate-y-1/2 opacity-5" />
    </main>
  );
};

export default AuthPage;
