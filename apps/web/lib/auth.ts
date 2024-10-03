import { auth } from "@firelancer/modules/controllers";
import { cookies } from "next/headers";
import { cache } from "react";

export const getSession = cache(async () => {
  const { session, user } = await auth.authenticateUser({
    cookie: cookies().toString()
  });

  return { session, user };
});
