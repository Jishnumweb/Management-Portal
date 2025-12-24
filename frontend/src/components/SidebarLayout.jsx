"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "./Navbar";
import { AdminSidebarTwo } from "./AdminSidebarTwo";

export default function SidebarLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f5f5f5] overflow-hidden">
        <AdminSidebarTwo
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MAIN CONTENT */}
        <div className="flex flex-col flex-1 min-w-0 ml-0 md:ml-80 transition-all duration-300">
          <Navbar setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto lg:p-10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
