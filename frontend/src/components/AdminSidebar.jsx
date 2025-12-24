"use client";

import { useState, useEffect } from "react";
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
  FilePen,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Landmark,
  ShoppingCart,
  BaggageClaim,
  BookPlus,
  Goal,
  FileChartPie,
  TentTree,
  UserRoundCog,
  ShieldHalf,
  CalendarCheck,
  ShieldAlert,
  ScanEye,
  Timer,
  CreditCard,
  Wallet,
  Receipt,
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

  {
    title: "Masters",
    icon: LayoutGrid,
    subItems: [
      {
        title: "Bank Details",
        url: "/admin/masters/bank-details",
        icons: Landmark,
      },
      {
        title: "Product Category",
        url: "/admin/masters/product-category",
        icons: ShoppingCart,
      },

      {
        title: "Leave Type",
        url: "/admin/masters/leave-type",
        icons: BookPlus,
      },
      {
        title: "Lead Reference",
        url: "/admin/masters/lead-reference",
        icons: Goal,
      },
      {
        title: "Lead Status",
        url: "/admin/masters/lead-status",
        icons: FileChartPie,
      },
      { title: "Holiday", url: "/admin/masters/holiday", icons: TentTree },
      {
        title: "Position",
        url: "/admin/masters/position",
        icons: UserRoundCog,
      },
      {
        title: "Department",
        url: "/admin/masters/department",
        icons: ShieldHalf,
      },
      {
        title: "Task Status",
        url: "/admin/masters/task-status",
        icons: CalendarCheck,
      },
      { title: "Priority", url: "/admin/masters/priority", icons: ShieldAlert },
    ],
  },

  { title: "Leads", url: "/admin/leads", icon: FileText },
  { title: "Clients", icon: Users, url: "/admin/clients" },
  { title: "Employees", icon: Users, url: "/admin/employees" },
  { title: "Attendance", url: "/admin/attendance", icon: Calendar },

  {
    title: "Tasks",
    icon: FilePen,
    subItems: [
      {
        title: "All Tasks",
        url: "/admin/tasks/newtask",
        icons: ClipboardCheck,
      },
      { title: "View Summary", url: "/admin/tasks", icons: ScanEye },
    ],
  },

  { title: "Leaves", icon: FileText, url: "/admin/leaves" },
  { title: "Meetings", icon: Timer, url: "/admin/meetings" },
  { title: "Invoices & Payments", icon: Receipt, url: "/admin/invoices" },
  { title: "Expenses", icon: Wallet, url: "/admin/Expenses" },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    adminItems.forEach((item) => {
      if (item.subItems) {
        const isSubActive = item.subItems.some((sub) => pathname === sub.url);
        if (isSubActive) {
          setExpandedItems((prev) => ({
            ...prev,
            [item.title]: true,
          }));
        }
      }
    });
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {}
  };

  const toggleExpand = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Sidebar className="shadow-sm flex flex-col bg-slate-50 border-r border-slate-200 h-screen">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-5 bg-white border-b border-slate-200">
          <img
            src="/images/vydurya-logo.png"
            alt="Logo"
            className="h-9 object-contain"
          />
        </div>

        {/* SCROLL AREA ONLY FOR MENU */}
        <SidebarContent className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3 mt-4 px-3">
                {" "}
                {adminItems.map((item) => {
                  const isActive = pathname === item.url;
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isExpanded = expandedItems[item.title];
                  const isSubActive =
                    hasSubItems &&
                    item.subItems.some((sub) => pathname === sub.url);

                  return (
                    <div key={item.title}>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          {hasSubItems ? (
                            <button
                              onClick={() => toggleExpand(item.title)}
                              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm transition-all
                                  ${
                                    isSubActive
                                      ? "bg-cyan-100 text-cyan-900 hover:bg-cyan-200"
                                      : "text-slate-700 hover:bg-slate-100"
                                  }`}
                            >
                              <item.icon className="h-5 w-5" />
                              <span className="flex-1 font-medium">
                                {item.title}
                              </span>

                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          ) : (
                            <a
                              href={item.url}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all
                                  ${
                                    isActive
                                      ? "bg-cyan-100 text-cyan-900 hover:bg-cyan-200"
                                      : "text-slate-700 hover:bg-slate-100"
                                  }`}
                            >
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.title}</span>
                            </a>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {hasSubItems && isExpanded && (
                        <div className="ml-2 mt-2 pl-2 border-l-2 border-cyan-200 space-y-2">
                          {item.subItems.map((subItem) => {
                            const isSubItemActive = pathname === subItem.url;
                            return (
                              <SidebarMenuItem key={subItem.title}>
                                <SidebarMenuButton asChild>
                                  <a
                                    href={subItem.url}
                                    className={`flex items-center gap-3 px-4 py-2 text-sm rounded transition-all
                                        ${
                                          isSubItemActive
                                            ? "bg-cyan-50 text-cyan-900 font-semibold"
                                            : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                  >
                                    {subItem.icons && (
                                      <subItem.icons className="h-4 w-4" />
                                    )}

                                    {subItem.title}
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer - stays fixed bottom */}
        <div className="px-3 py-4 border-t border-slate-200 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-700 hover:text-red-600 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-sm font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
