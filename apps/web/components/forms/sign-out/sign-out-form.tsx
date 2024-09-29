"use client";

import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { signOutAction } from "./sign-out-action";
import { Icons } from "@/components/custom/icons";

export function SignOutForm() {
  const action = useAction(signOutAction);

  return (
    <Button
      type="button"
      variant={"link"}
      disabled={action.isExecuting}
      onClick={() => action.execute()}
    >
      {action.isExecuting && (
        <Icons.spinner className="mr-2 animate-spin h-4 w-4" />
      )}
      Sign out
    </Button>
  );
}
