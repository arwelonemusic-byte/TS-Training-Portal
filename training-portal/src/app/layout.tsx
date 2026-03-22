import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import Navigation from "@/components/Navigation";
import { UserProvider } from "@/context/UserContext";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: "Tactical Shift — Учебный портал",
  description: "Обучение и сертификация для сообщества Tactical Shift",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={robotoSlab.variable}>
      <head />
      <body className="min-h-screen antialiased">
        <UserProvider>
          <Navigation />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
