import { SignInForm } from "@/components/forms/sign-in/sign-in-form";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await getSession();

  if (user) {
    return redirect("/");
  }

  return (
    <>
      <div className="relative h-full min-h-screen flex-col items-center justify-center grid lg:px-0">
        <div className="flex flex-col space-y-8">
          <div className="border border-1 rounded-lg shadow-lg p-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-start">
                <p className="text-muted-foreground">Welcome back! 👋</p>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sign in to your account
                </h1>
              </div>
              <SignInForm />
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            <span className="mr-1">Don&apos;t have an account?</span>
            <Link href="/signup" className="hover:underline text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
