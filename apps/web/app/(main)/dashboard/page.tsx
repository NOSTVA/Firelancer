import { getSession } from "@/lib/auth";
import { accounting } from "@firelancer/modules/controllers";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await getSession();

  if (!user) {
    redirect("/");
  }

  const account = await accounting.getAccount({ userId: user.id });

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 flex flex-col">
        <div className="my-6">
          <div className="flex flex-col space-y-4">
            <div>
              <h1>Hi, {user.username}!</h1>
              <p>Your ID is {user.id}.</p>
            </div>
            <div>
              <span className="font-bold">Balance Account Details</span>
              <div>
                Status: <span>{account?.status}</span>
              </div>
              <div>
                Balance: <span>{account?.availableBalance}</span>
              </div>
              <div>
                Pending Balance: <span>{account?.pendingBalance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
