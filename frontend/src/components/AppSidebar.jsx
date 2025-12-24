"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  Home,
  Settings,
  LogOut,
  Users,
  ClipboardCheck,
  FileText,
  CalendarClock,
  BarChart3,
  MessageSquare,
  Timer,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useAuthStore from "@/stores/useAuthStore";

const adminItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Leave", url: "/employee/leaves", icon: FileText },

  { title: "Attendance", url: "/employee/attendence", icon: Users },
  { title: "Tasks", url: "/employee/tasks", icon: Calendar },
  { title: "Meetings", url: "/employee/meetings", icon: Timer },
  { title: "Profile", url: "/employee/profile", icon: User },
  // { title: "Meetings", url: "/admin/clients", icon: Users },
  // { title: "Leaves", url: "/admin/leaves", icon: FileText },
  // { title: "Meetings", url: "/admin/meetings", icon: CalendarClock },
  // { title: "Projects", url: "/admin/projects", icon: BarChart3 },
  // { title: "Messages", url: "/admin/messages", icon: MessageSquare },
  // { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {}
  };

  return (
    <Sidebar className=" h-full   shadow-sm flex flex-col justify-between">
      <div className=" bg-cover bg-center h-full">
        {/* Logo / Header */}
        <div className="flex items-center gap-2 px-5 py-4  bg-[#f5f5f5] ">
          <img
            src="/images/vydurya-logo.png"
            alt="Logo"
            className="h-10 object-contain"
          />
        </div>

        {/* Menu Section */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3 mt-4">
                {adminItems.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`flex items-center gap-3 px-5 py-3 rounded-md font-sans transition-all duration-150 
                            ${
                              isActive
                                ? "bg-[#00afef4d] text-[#3a3737] hover:bg-[black]"
                                : "text-black hover:bg-[yellow] hover:text-[blue]"
                            }`}
                        >
                          <item.icon
                            className={`h-5 w-5 ${
                              isActive ? "text-[#00aeef]" : "text-black"
                            }`}
                          />
                          <span className="text-sm md:text-base">
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>

      {/* Footer Section */}
      <div className="px-5 py-4 border-t  border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-black hover:text-red-600 transition-colors w-full px-2 py-2 rounded-md hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </Sidebar>
  );
}
