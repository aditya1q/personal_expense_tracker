import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppSidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Personal Expense Tracker",
  description: "Track your daily expenses and manage your budget with ease. Built with Next.js for a fast and seamless experience.",
  keywords: "expense tracker, personal finance, budgeting, Next.js",
  author: "Your Name or Team",
  viewport: "width=device-width, initial-scale=1.0",
  charset: "UTF-8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased dark flex h-screen w-screen overflow-hidden`}>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex flex-col h-full w-full overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-hidden overflow-y-auto">{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
