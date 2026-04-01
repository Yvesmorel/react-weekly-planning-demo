"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import AppContextProvider from "@/app/context/AppContext";
import CalendarTaskContextProvider from "react-weekly-planning/contexts/CalendarTaskContext";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CalendarTaskContextProvider>
        <AppContextProvider>
          <body className={inter.className}>{children}</body>
        </AppContextProvider>
      </CalendarTaskContextProvider>
    </html>
  );
}
