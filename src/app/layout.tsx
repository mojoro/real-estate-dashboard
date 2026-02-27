import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { MobileHeader } from "@/components/layout/MobileHeader";
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
        <SidebarProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <MobileHeader />
            <main className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
