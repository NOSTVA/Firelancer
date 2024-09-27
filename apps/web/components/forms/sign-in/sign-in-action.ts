"use server";
import { actionClient } from "@/lib/safe-action";
import { signInSchema } from "./sign-in-validation";
import { auth } from "@firelancer/modules/controllers";
import { cookies } from "next/headers";
import { AuthenticationError, InputParseError } from "@firelancer/modules/errors";
import { redirect } from "next/navigation";

export const signInAction = actionClient.schema(signInSchema).action(async ({ parsedInput }) => {
  try {
    const { cookie } = await auth.signIn(parsedInput);
    cookies().set(cookie.name, cookie.value, cookie.attributes);
  } catch (err) {
    if (err instanceof InputParseError || err instanceof AuthenticationError) {
      return {
        failure: err.message,
      };
    }

    return {
      failure: "An error happened. The developers have been notified. Please try again later.",
    };
  }

  return redirect("/dashboard");
});
