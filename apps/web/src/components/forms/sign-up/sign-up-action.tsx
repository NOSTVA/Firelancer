"use server";
import { actionClient } from "@/lib/safe-action";
import { signUpSchema } from "./sign-up-validation";
import { auth } from "@firelancer/modules/controllers";
import { cookies } from "next/headers";
import {
  AuthenticationError,
  InputParseError
} from "@firelancer/modules/errors";
import { redirect } from "next/navigation";

export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { cookie } = await auth.signUp(parsedInput);
      cookies().set(cookie.name, cookie.value, cookie.attributes);
    } catch (err) {
      if (
        err instanceof InputParseError ||
        err instanceof AuthenticationError
      ) {
        return {
          failure: err.message
        };
      }

      return {
        failure:
          "An error happened. The developers have been notified. Please try again later."
      };
    }

    return redirect("/dashboard");
  });
