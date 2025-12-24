

import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Navbar } from "@/components/Navbar";
import { AdminSidebarTwo } from "@/components/AdminSidebarTwo";
import SidebarLayout from "@/components/SidebarLayout";

export const metadata = {
  title: "Admin Dashboard | Vydurya Portal",
  description: "Modern employee management system",
};

export default function AdminLayout({ children }) {
  
  return (
<SidebarLayout>{children}</SidebarLayout>
  );
}

