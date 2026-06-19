"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  CalendarDays,
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  Search,
} from "lucide-react";

const navItems = [
  { name: "Tổng quan", href: "/", icon: LayoutDashboard },
  { name: "Lịch trực", href: "/schedule", icon: CalendarDays },
  { name: "Bác sĩ", href: "/doctors", icon: Users },
  { name: "Khoa", href: "/departments", icon: Building2 },
  { name: "Quản trị", href: "/admin", icon: Settings },
];

export function Header() {
  const pathname = usePathname();

  const currentNavItem = navItems.find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b glass px-4 md:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center lg:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="mr-2" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex items-center gap-2 px-2 pb-6 pt-4 font-semibold">
                <CalendarDays className="h-6 w-6 text-primary" />
                <span className="text-lg">Lịch Trực BV</span>
              </div>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-semibold lg:hidden">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span className="text-lg">Lịch Trực BV</span>
          </Link>
        </div>

        {/* Desktop Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
          {currentNavItem && currentNavItem.href !== "/" && (
            <>
              <span>/</span>
              <span className="text-foreground">{currentNavItem.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full xl:rounded-md transition-all duration-200"
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true })
            )
          }}
        >
          <Search className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Tìm kiếm nhanh...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
