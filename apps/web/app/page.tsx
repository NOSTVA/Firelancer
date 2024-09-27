import { auth } from "@firelancer/modules/controllers";

export default async function Home() {
  const { url } = await auth.github.signIn();

  return <div className="bg-primary">{url}</div>;
}
