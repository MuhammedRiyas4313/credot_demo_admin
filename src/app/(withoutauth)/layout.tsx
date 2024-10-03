import { getServerSession } from "next-auth";
import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/nextAuthOptions";

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (session) {
    const headersList = headers();
    const domain = headersList.get("x-forwarded-host") || "";
    const protocol = headersList.get("x-forwarded-proto") || "";
    // const pathname = headersList.get("x-invoke-path") || "";

    const pathname = headersList.get("next-url");
    let url = "/";
    if (pathname) {
      url = url + "?" + encodeURIComponent(pathname);
    }
    console.log(url, "URL WITHOUTAUTH LAYOUT.");
    redirect(url);
  }

  return <>{children}</>;
}
