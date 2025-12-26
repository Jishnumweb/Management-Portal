"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Timer,
  Receipt,
  Wallet,
  UserPlus,
  ClipboardList,
  ClipboardCheck,
  ScanEye,
  LayoutGrid,
  Landmark,
  ShoppingCart,
  BookPlus,
  Goal,
  FileChartPie,
  UserRoundCog,
  ShieldHalf,
  CalendarCheck,
  ShieldAlert,
  TentTree,
  X,
  NotebookPen,
  Globe,
  Warehouse,
} from "lucide-react";

export function AdminSidebarTwo({ sidebarOpen, setSidebarOpen }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const core = [
    // { title: "Dashboard", link: "/admin/dashboard", icon: Home },
    {
      title: "Masters",
      icon: LayoutGrid,
      subItems: [
        // {
        //   title: "Bank Details",
        //   link: "/admin/masters/bank-details",
        //   icon: Landmark,
        // },
        {
          title: "Product Category",
          link: "/admin/masters/product-category",
          icon: ShoppingCart,
        },

        // {
        //   title: "Leave Type",
        //   link: "/admin/masters/leave-type",
        //   icon: BookPlus,
        // },
        {
          title: "Lead Reference",
          link: "/admin/masters/lead-reference",
          icon: Goal,
        },
        {
          title: "Lead Status",
          link: "/admin/masters/lead-status",
          icon: FileChartPie,
        },
        // { title: "Holiday", link: "/admin/masters/holiday", icon: TentTree },
        // {
        //   title: "Position",
        //   link: "/admin/masters/position",
        //   icon: UserRoundCog,
        // },
        // {
        //   title: "Department",
        //   link: "/admin/masters/department",
        //   icon: ShieldHalf,
        // },
        // {
        //   title: "Task Status",
        //   link: "/admin/masters/task-status",
        //   icon: CalendarCheck,
        // },
        // {
        //   title: "Priority",
        //   link: "/admin/masters/priority",
        //   icon: ShieldAlert,
        // },
      ],
    },
  ];

  const crm = [
    { title: "Leads", link: "/admin/leads", icon: TrendingUp },
    { title: "Clients", link: "/admin/clients", icon: Users },
    { title: "Domain Manager", link: "/admin/domain", icon: Globe },
    { title: "Address Book", link: "/admin/Address-Book", icon: NotebookPen },
    { title: "Meetings", link: "/admin/meetings", icon: Timer },
  ];

  // const hr = [
  //   { title: "Admins", link: "/admin/admins", icon: Users },
  //   { title: "Employees", link: "/admin/employees", icon: Users },
  //   { title: "Attendance", link: "/admin/attendance", icon: Calendar },
  //   { title: "Leaves", link: "/admin/leaves", icon: FileText },
  //   {
  //     title: "Tasks",
  //     icon: ClipboardList,
  //     subItems: [
  //       {
  //         title: "All Tasks",
  //         link: "/admin/tasks/newtask",
  //         icon: ClipboardCheck,
  //       },
  //       { title: "View Summary", link: "/admin/tasks", icon: ScanEye },
  //     ],
  //   },
  // ];

  const finance = [
    { title: "Invoices & Payments", link: "/admin/invoices", icon: Receipt },
    { title: "Expenses", link: "/admin/Expenses", icon: Wallet },
    { title: "Inventory", link: "/admin/inventory", icon: Warehouse },
  ];

  const Section = ({ title, items }) => (
    <div className="px-4 py-4  ">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname.startsWith(item.link);
          const isExpanded = expandedMenu === item.title;
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.title}>
              <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors group
                  ${
                    isActive
                      ? "bg-[#D2F961] "
                      : "text-[#D2F961] hover:bg-[#d3f961c5]"
                  }`}
                onClick={() => hasSubItems && toggleMenu(item.title)}
              >
                <Link
                  href={item.link ?? "#"}
                  className="flex items-center gap-3 flex-1 text-left"
                  onClick={() => sidebarOpen(false)}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive ? "" : "text-[#D2F961] group-hover:text-gray-800"
                    }`}
                  />
                  <span className="text-sm">{item.title}</span>
                </Link>

                {hasSubItems && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? "rotate-180 text-blue-600" : "text-gray-400"
                    }`}
                  />
                )}
              </button>

              {hasSubItems && isExpanded && (
                <div className="ml-6 space-y-1 py-1">
                  {item.subItems.map((sub) => (
                    <Link
                      onClick={() => sidebarOpen(false)}
                      href={sub.link}
                      key={sub.title}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors
                        ${
                          pathname === sub.link
                            ? "bg-[#00afef63]"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <sub.icon className="w-3 h-3 text-gray-400" />
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside
      className={`fixed left-0 top-0 w-80 h-screen overflow-y-auto z-10   bg-[#000000] border-r  flex flex-col shadow-sm  transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0  md:w-80`}
    >
      <div className="flex items-center px-5 py-4 ">
        {/* <img src="/images/vydurya-logo.png" className="h-10" /> */}
      </div>

      <div className="md:hidden flex justify-end p-3">
        <button onClick={() => setSidebarOpen(false)}>
          <X className="w-6 h-6 text-[#D2F961]" />
        </button>
      </div>

      <Section title="Core " items={core} />
      <Section title="CRM / Business Operations" items={crm} />
      {/* <Section title="Human Resources (HR)" items={hr} /> */}
      <Section title="Finance & Accounting" items={finance} />

      <div className="px-4 py-4 border-t  bg-[#090909]">
        <button className="w-full flex i gap-3 p-3  rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D2F961] to-[#D2F961] flex items-center justify-center text-black font-bold">
            AD
          </div>
          <div className="flex flex-col items-start">
            <p className="text-sm font-medium text-[#D2F961]">Admin</p>
            <p className="text-xs text-[#D2F961]">admin@gmail.com</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
