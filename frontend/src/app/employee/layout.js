import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { EmployeeNavbar } from "@/components/EmployeeNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Company Portal",
  description: "Modern employee management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          {/* ✅ Main container — takes full height & width */}
          <div className="flex min-h-screen w-full bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <AppSidebar />

            {/* ✅ Main area fills the rest */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Navbar - full width of remaining space */}
              <EmployeeNavbar/>

              {/* Main content */}
              <main className="flex-1 overflow-y-auto lg:p-10">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
