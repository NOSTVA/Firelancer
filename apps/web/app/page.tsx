import { ModeToggle } from "@/components/custom/theme-toggle";
import { getSession } from "@/lib/auth";
import { ActionResult, Form } from "@/lib/form";
import { auth } from "@firelancer/modules/controllers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
      <Form action={logout}>
        <button>Sign out</button>
      </Form>
    </>
  );
}

async function logout(): Promise<ActionResult> {
  "use server";
  const { session } = await getSession();

  const { blankCookie } = await auth.signOut(session?.id);
  cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);

  return redirect("/signin");
}
