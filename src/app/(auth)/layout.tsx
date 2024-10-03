// import Sidebar from "@/layout/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authOptions } from "../api/auth/[...nextauth]/nextAuthOptions";
import Container from "@/layouts/Container";
// import Header from "@/layout/header";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    const headersList = headers();
    const domain = headersList.get("x-forwarded-host") || "";
    const protocol = headersList.get("x-forwarded-proto") || "";
    // const pathname = headersList.get("x-invoke-path") || "";

    const pathname = headersList.get("next-url");
    let url = "/login";
    if (pathname) {
      url = url + "?" + encodeURIComponent(pathname);
    }
    redirect(url);

    return null;
  }

  return <Container>{children}</Container>;
}
