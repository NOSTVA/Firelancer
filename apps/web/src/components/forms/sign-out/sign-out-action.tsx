"use server";
import { actionClient } from "@/lib/safe-action";
import { auth } from "@firelancer/modules/controllers";
import { cookies } from "next/headers";
import {
  AuthenticationError,
  InputParseError
} from "@firelancer/modules/errors";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const signOutAction = actionClient.action(async () => {
  try {
    const { session } = await getSession();
    const { blankCookie } = await auth.signOut(session?.id);
    cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);
  } catch (err) {
    if (err instanceof InputParseError || err instanceof AuthenticationError) {
      return {
        failure: err.message
      };
    }

    return {
      failure:
        "An error happened. The developers have been notified. Please try again later."
    };
  }

  return redirect("/");
});
