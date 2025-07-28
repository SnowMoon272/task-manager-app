import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreInitializer } from "@/components/providers/StoreInitializer";
import RouteGuard from "@/components/guards/RouteGuard";
import StarField from "@/components/ui/StarField";
import { ModalProvider } from "@/contexts/ModalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager App",
  description: "Una aplicación de gestión de tareas con tableros Kanban",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative">
          <StarField />
          <div className="relative z-10 min-h-screen">
            <ModalProvider>
              <StoreInitializer>
                <RouteGuard>{children}</RouteGuard>
              </StoreInitializer>
            </ModalProvider>
          </div>
        </div>
      </body>
    </html>
  );
}

