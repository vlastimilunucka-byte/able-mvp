import { cookies, headers } from "next/headers";

export async function getActor() {
  try {
    const headerList = await headers();
    const cookieList = await cookies();
    const headerActor = headerList.get("x-actor");
    const cookieActor = cookieList.get("actor")?.value;
    return headerActor ?? cookieActor ?? "demo@able";
  } catch {
    return "system@able";
  }
}
