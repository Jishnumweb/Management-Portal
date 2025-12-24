"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Bell,
  User,
  LogOut,
  Settings,
  Calendar,
  Calculator,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Message from "./admin/Message";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export function Navbar({ setSidebarOpen }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcPrevValue, setCalcPrevValue] = useState(null);
  const [calcOperation, setCalcOperation] = useState(null);
  const [calcPos, setCalcPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const router = useRouter();
  const { logout } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCalcPos({
        x: window.innerWidth - 280,
        y: 384,
      });
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch {}
  };

  const handleClick = () => setMessageOpen(!messageOpen);
  const onClose = () => setMessageOpen(false);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        calendarMonth.getMonth() === new Date().getMonth() &&
        calendarMonth.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`p-2 text-center rounded cursor-pointer text-sm ${
            isToday ? "bg-blue-500 text-white font-bold" : "hover:bg-gray-200"
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleCalcInput = (value) => {
    if (value === "C") {
      setCalcDisplay("0");
      setCalcPrevValue(null);
      setCalcOperation(null);
      return;
    }

    if (value === "=") {
      if (calcPrevValue !== null && calcOperation) {
        const result = performCalculation(
          parseFloat(calcPrevValue),
          parseFloat(calcDisplay),
          calcOperation
        );
        setCalcDisplay(result.toString());
        setCalcPrevValue(null);
        setCalcOperation(null);
      }
      return;
    }

    if (["+", "-", "*", "/"].includes(value)) {
      setCalcPrevValue(calcDisplay);
      setCalcDisplay("0");
      setCalcOperation(value);
      return;
    }

    if (value === ".") {
      if (!calcDisplay.includes(".")) {
        setCalcDisplay(calcDisplay === "0" ? "0." : calcDisplay + ".");
      }
      return;
    }

    setCalcDisplay(calcDisplay === "0" ? value : calcDisplay + value);
  };

  const performCalculation = (prev, current, operation) => {
    switch (operation) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "*":
        return prev * current;
      case "/":
        return prev / current;
      default:
        return current;
    }
  };

  const calcButtons = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
    ["C"],
  ];

  const handleCalcMouseDown = (e) => {
    if (e.target.closest("button")) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - calcPos.x,
      y: e.clientY - calcPos.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      setCalcPos({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <header className="sticky top-0 z-10   bg-[#f5f5f5] border-b border-gray-200 px-4 md:px-16 py-3 flex items-center justify-between ">
      {/* Left Section */}
      <div className="hidden md:flex flex-col items-center py-2 rounded-lg">
        <div className="text-lg font-semibold text-[#00aeef]">
          {mounted ? formatTime(currentTime) : "--:--:--"}
        </div>
        <div className="text-xs text-gray-600">
          {mounted ? formatDate(currentTime) : ""}
        </div>
      </div>

      <SidebarTrigger
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      />

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <h1 className="uppercase text-[#00aeef] font-bold md:block hidden">
          Jishnu M
        </h1>

        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100"
          onClick={() => setCalendarOpen(!calendarOpen)}
        >
          <Calendar size={20} className="text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100"
          onClick={() => setCalculatorOpen(!calculatorOpen)}
        >
          <Calculator size={20} className="text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100"
          onClick={handleClick}
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-none">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src="/avatar.png" alt="user avatar" />
                <AvatarFallback>
                  <div className="">
                    <img
                      src="https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png"
                      alt=""
                      className="h-14 w-full object-contain "
                    />
                  </div>
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {messageOpen && <Message onClose={onClose} />}

      {calendarOpen && (
        <div className="fixed top-20 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72 z-50">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() =>
                setCalendarMonth(
                  new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() - 1
                  )
                )
              }
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-semibold">
              {calendarMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={() =>
                setCalendarMonth(
                  new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() + 1
                  )
                )
              }
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setCalendarOpen(false)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-bold text-gray-600"
              >
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>
      )}

      {calculatorOpen && (
        <div
          className="fixed bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-84 z-50 cursor-move"
          style={{
            left: `${calcPos.x}px`,
            top: `${calcPos.y}px`,
            userSelect: isDragging ? "none" : "auto",
          }}
          onMouseDown={handleCalcMouseDown}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Calculator</h3>
            <button
              onClick={() => setCalculatorOpen(false)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="bg-gray-900 text-white text-right p-4 rounded mb-2 text-2xl font-mono overflow-hidden">
            {calcDisplay}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {calcButtons.map((row, rowIdx) =>
              row.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcInput(btn)}
                  className={`p-3 rounded font-semibold text-sm ${
                    btn === "C"
                      ? "col-span-4 border border-[red] text-[red] hover:bg-red-600 hover:text-white"
                      : ["+", "-", "*", "/"].includes(btn)
                      ? "bg-[#00aeef] text-white hover:bg-[#0276a0]"
                      : btn === "="
                      ? "bg-[#30a830] text-white hover:bg-green-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {btn}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  );
}
