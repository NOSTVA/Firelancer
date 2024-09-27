import { ModeToggle } from "@/components/custom/theme-toggle";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutForm } from "./components/sign-out-form";

export default async function Page() {
  const { user } = await getSession();

  if (!user) {
    return redirect("/signin");
  }

  return (
    <>
      <ModeToggle />
      <h1>Hi, {user.username}!</h1>
      <p>Your user ID is {user.id}.</p>
      <SignOutForm />
    </>
  );
}
