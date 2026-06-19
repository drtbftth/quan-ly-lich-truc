"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Building2, Users, CalendarDays, Settings } from "lucide-react";
import { useStore } from "@/store/useStore";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { doctors, departments } = useStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
        <Command
          className="relative h-[80vh] w-full max-w-[600px] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl sm:h-auto sm:max-h-[60vh]"
          loop
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
            <Command.Input
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tìm kiếm bác sĩ, khoa, menu..."
              autoFocus
            />
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm">
              Không tìm thấy kết quả.
            </Command.Empty>
            
            <Command.Group heading="Điều hướng" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              <Command.Item
                onSelect={() => runCommand(() => router.push("/"))}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Search className="h-4 w-4" />
                Tổng quan
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/schedule"))}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <CalendarDays className="h-4 w-4" />
                Lịch trực
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/doctors"))}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Users className="h-4 w-4" />
                Quản lý Bác sĩ
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push("/departments"))}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Building2 className="h-4 w-4" />
                Quản lý Khoa
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-1 h-px bg-border" />

            <Command.Group heading="Bác sĩ" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              {doctors.slice(0, 5).map((doc) => (
                <Command.Item
                  key={doc.id}
                  onSelect={() => runCommand(() => router.push(`/doctors?search=${encodeURIComponent(doc.name)}`))}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <Users className="h-4 w-4" />
                  {doc.name} - {doc.title}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="my-1 h-px bg-border" />

            <Command.Group heading="Khoa / Phòng" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              {departments.slice(0, 5).map((dept) => (
                <Command.Item
                  key={dept.id}
                  onSelect={() => runCommand(() => router.push(`/departments?search=${encodeURIComponent(dept.name)}`))}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <Building2 className="h-4 w-4" />
                  {dept.name}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
