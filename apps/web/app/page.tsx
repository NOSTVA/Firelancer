import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function Page() {
  const { user } = await getSession();

  return (
    <div className="flex flex-row">
      {!user && (
        <div className="flex flex-row items-center">
          <Button variant={"link"} className="rounded-full" asChild>
            <Link href={"/signin"}>Sign in</Link>
          </Button>
          <span>/</span>
          <Button variant={"link"} className="rounded-full" asChild>
            <Link href={"/signup"}>Sign up</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
