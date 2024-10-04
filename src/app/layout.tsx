import type { Metadata } from "next";
import "./globals.css";
import RootProvider from "@/providers/providers";
import { Roboto_Mono } from "next/font/google";

const main = Roboto_Mono({
  subsets: ["latin"],
  // display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Demo Admin",
  description: "Credot",
};

export default function RootLayout({ children, session }: any) {
  return (
    <html lang="en">
      <body className={main.className}>
        <RootProvider session={session}>{children}</RootProvider>
      </body>
    </html>
  );
}
