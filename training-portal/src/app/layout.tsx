import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { UserProvider } from "@/context/UserContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tactical Shift — Учебный портал",
  description: "Обучение и сертификация для сообщества Tactical Shift",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <UserProvider>
          <Navigation />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
