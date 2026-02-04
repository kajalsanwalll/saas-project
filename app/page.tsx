import { redirect } from "next/navigation";

export default function RootRedirect() {
  redirect("/home");
  return <p>Redirecting…</p>; // optional, won’t actually be seen
}
