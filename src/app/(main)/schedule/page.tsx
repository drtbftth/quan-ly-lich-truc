"use client";

import * as React from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { useStore } from "@/store/useStore";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Building2, Search, Users, LayoutList, CalendarDays } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR from "swr";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SchedulePage() {
  const { doctors, departments, schedules, setDoctors, setDepartments, setSchedules } = useStore();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const { data: docsData, isLoading: docsLoading } = useSWR("/api/doctors", fetcher, {
    onSuccess: (data) => setDoctors(data),
  });
  const { data: depsData, isLoading: depsLoading } = useSWR("/api/departments", fetcher, {
    onSuccess: (data) => setDepartments(data),
  });
  const { data: schedsData, isLoading: schedsLoading } = useSWR("/api/schedules", fetcher, {
    onSuccess: (data) => setSchedules(data),
  });

  const loading = docsLoading || depsLoading || schedsLoading;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Filter schedules based on search and department
  const filteredSchedules = schedules.filter((s) => {
    if (selectedDept !== "all" && s.departmentId !== selectedDept) return false;
    
    if (searchTerm) {
      const dept = departments.find(d => d.id === s.departmentId);
      const docs = doctors.filter(d => s.doctorIds.includes(d.id));
      
      const searchLower = searchTerm.toLowerCase();
      const matchDept = dept?.name.toLowerCase().includes(searchLower);
      const matchDoc = docs.some(d => 
        d.name.toLowerCase().includes(searchLower) || 
        d.title.toLowerCase().includes(searchLower)
      );
      
      return matchDept || matchDoc;
    }
    
    return true;
  });

  // Get schedules for selected date
  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : "";
  const selectedDateSchedules = filteredSchedules.filter((s) => s.date === selectedDateStr);

  const handleDayClick = (day: Date) => {
    setDate(day);
    setIsDrawerOpen(true);
  };

  // Find days that have schedules to highlight in calendar
  const scheduleDates = filteredSchedules.map(s => parseISO(s.date));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider animate-pulse-slow">
              📅 SCHEDULE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            Lịch Trực Bác Sĩ
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Tra cứu lịch trực theo ngày và theo khoa
          </p>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2 max-w-sm mt-4 md:mt-0">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm bác sĩ, khoa..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedDept} onValueChange={(val) => val && setSelectedDept(val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn khoa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khoa</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 lg:col-span-4 h-fit glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
              <CalendarDays className="h-5 w-5" />
              Lịch Tháng
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground">Chọn ngày để xem chi tiết</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-0 pb-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && handleDayClick(d)}
              locale={vi}
              className="rounded-md border shadow-sm p-3 w-full"
              modifiers={{
                hasSchedule: scheduleDates
              }}
              modifiersStyles={{
                hasSchedule: { fontWeight: 'bold', textDecoration: 'underline', color: 'var(--primary)' }
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-7 lg:col-span-8 glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
              <LayoutList className="h-5 w-5 text-amber-500" />
              Chi tiết {date ? format(date, "dd/MM/yyyy") : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateSchedules.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <motion.div 
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {selectedDateSchedules.map((schedule) => {
                    const dept = departments.find((d) => d.id === schedule.departmentId);
                    const docs = schedule.doctorIds
                      .map(id => doctors.find((d) => d.id === id))
                      .filter((d): d is NonNullable<typeof d> => Boolean(d));

                    return (
                      <motion.div key={schedule.id} variants={itemVariants} className="flex flex-col space-y-3 rounded-lg border p-4 shadow-sm glass">
                        <div className="flex items-center gap-2 font-semibold text-lg border-b border-white/10 dark:border-white/5 pb-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          {dept?.name || "Khoa không xác định"}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {docs.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-start gap-3 rounded-md border p-3 bg-card/60 hover:glow-primary hover:-translate-y-1 transition-all"
                            >
                              <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
                                <Users className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold">{doc.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {doc.title}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </ScrollArea>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                <CalendarDays className="h-10 w-10 mb-4 opacity-20" />
                <p className="text-lg">Không có lịch trực nào trong ngày này.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <div className="mx-auto w-full max-w-3xl">
            <DrawerHeader>
              <DrawerTitle>Lịch trực ngày {date ? format(date, "dd/MM/yyyy") : ""}</DrawerTitle>
              <DrawerDescription>Danh sách chi tiết phân công</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
               {selectedDateSchedules.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateSchedules.map((schedule) => {
                      const dept = departments.find((d) => d.id === schedule.departmentId);
                      const docs = schedule.doctorIds
                        .map(id => doctors.find((d) => d.id === id))
                        .filter((d): d is NonNullable<typeof d> => Boolean(d));
                      return (
                        <div key={schedule.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-primary mb-2">{dept?.name}</h4>
                          <ul className="space-y-2">
                            {docs.map(doc => (
                              <li key={doc.id} className="text-sm">
                                <span className="font-medium">{doc.name}</span> - <span className="text-muted-foreground">{doc.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
               ) : (
                 <p className="text-center text-muted-foreground py-8">Không có lịch phân công</p>
               )}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Đóng</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
