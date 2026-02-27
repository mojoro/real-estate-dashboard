import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "RE Screener — Berlin Investment Dashboard",
  description: "Real estate investment screening dashboard for Berlin properties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="flex h-screen overflow-hidden bg-gray-950 text-gray-50 antialiased">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
