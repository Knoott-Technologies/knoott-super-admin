import { PageHeaderBackButton } from "@/components/common/headers";
import { NewUserForm } from "./_components/new-user-form";

const NewPersonalPage = () => {
  return (
    <main className="h-fit w-full md:max-w-2xl px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      <PageHeaderBackButton
        title="Nuevo personal"
        description="Crea una nueva cuenta de personal en Knoott"
      />
      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        <NewUserForm />
      </section>
    </main>
  );
};

export default NewPersonalPage;
