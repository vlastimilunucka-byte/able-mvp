import { cookies, headers } from "next/headers";

export function getActor() {
  try {
    const headerActor = headers().get("x-actor");
    const cookieActor = cookies().get("actor")?.value;
    return headerActor ?? cookieActor ?? "demo@able";
  } catch {
    return "system@able";
  }
}
