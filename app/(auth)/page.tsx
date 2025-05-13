import UnicornScene from "@/components/common/scene";
import { LoginForm } from "./_components/login-form";

const AuthPage = () => {
  return (
    <main className="w-full h-dvh place-items-center flex justify-center relative">
      {/* <UnicornScene className="w-full h-full !absolute z-0" projectId="ofdmjvqBHr9jH1OQNpWe" width={"100%"} height={"100%"} fps={120} dpi={2}/> */}
      <LoginForm />
    </main>
  );
};

export default AuthPage;
