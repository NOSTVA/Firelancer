import { getSession } from "@/lib/auth";

export default async function Page() {
  const { user } = await getSession();

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 flex flex-col">
        <div className="my-6">
          {user && (
            <>
              <h1>Hi, {user.username}!</h1>
              <p>Your ID is {user.id}.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
