"use client";

import * as React from "react";
import { useStore } from "@/store/useStore";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Users, Building2, Clock, Settings } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import useSWR from "swr";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { doctors, departments, schedules, setDoctors, setDepartments, setSchedules } = useStore();

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

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaySchedules = schedules.filter((s) => s.date === todayStr);

  const doctorsOnDuty = todaySchedules.reduce(
    (acc, sched) => acc + sched.doctorIds.length,
    0
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-[24px] border border-border/50 bg-card p-8 md:p-12 mb-8 glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest animate-pulse-slow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Hệ thống Live
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent pb-2">
            Hệ Thống Quản Lý Lịch Trực
          </h1>
          <p className="text-muted-foreground text-lg max-w-[600px] font-medium">
            Quản lý và giám sát toàn diện lịch trực bệnh viện Bệnh viện Hữu nghị Việt Đức - Cơ Sở Ngọc Hồi theo thời gian thực.
            Hôm nay: {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
          </p>
          <div className="pt-4 flex gap-4">
            <Link href="/schedule" className={cn(buttonVariants({ size: "lg" }), "rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold")}>
              Xem Lịch Trực Ngay
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="glass-card group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-amber-500 transition-colors">Bác sĩ trực hôm nay</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Users className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">
              {loading ? <Skeleton className="h-10 w-16" /> : doctorsOnDuty}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium flex items-center gap-1">
              <span className="text-amber-500 font-bold">↑ Active</span> Trên toàn viện
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-emerald-500 transition-colors">Khoa có lịch trực</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Building2 className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">
              {loading ? <Skeleton className="h-10 w-16" /> : todaySchedules.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium flex items-center gap-1">
              <span className="text-emerald-500 font-bold">✓ Đã xếp lịch</span> Hôm nay
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-blue-500 transition-colors">Tổng Bác sĩ</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">
              {loading ? <Skeleton className="h-10 w-16" /> : doctors.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium flex items-center gap-1">
              Đang công tác
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-rose-500 transition-colors">Tổng Khoa</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Building2 className="h-5 w-5 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">
              {loading ? <Skeleton className="h-10 w-16" /> : departments.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium flex items-center gap-1">
              Đang hoạt động
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Thao tác nhanh - Premium Horizontal Bar */}
      <div className="flex items-center p-1.5 bg-muted/40 rounded-full overflow-x-auto border border-border/50 glass-card">
        <div className="flex items-center w-full min-w-max gap-1">
          <Link
            href="/schedule"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-primary text-primary-foreground shadow-md transition-all whitespace-nowrap hover:bg-primary/90"
          >
            <CalendarDays className="h-4 w-4" />
            Xem lịch tuần này
          </Link>
          <Link
            href="/doctors"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all whitespace-nowrap"
          >
            <Users className="h-4 w-4" />
            Danh sách bác sĩ
          </Link>
          <Link
            href="/admin"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all whitespace-nowrap"
          >
            <Settings className="h-4 w-4" />
            Quản trị hệ thống
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-emerald-500" />
              Lịch trực hôm nay
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Danh sách chi tiết bác sĩ trực tại các khoa trong ngày hôm nay.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : todaySchedules.length > 0 ? (
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {todaySchedules.map((schedule) => {
                  const dept = departments.find((d) => d.id === schedule.departmentId);
                  const docs = schedule.doctorIds
                    .map(id => doctors.find((d) => d.id === id))
                    .filter((d): d is NonNullable<typeof d> => Boolean(d));

                  return (
                    <motion.div key={schedule.id} variants={itemVariants} className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <Building2 className="h-4 w-4 text-primary" />
                        {dept?.name || "Khoa không xác định"}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {docs.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-2 rounded-md border p-2 text-sm bg-card/50 glass hover:glow-primary hover:-translate-y-1 transition-all"
                          >
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{doc.name}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center text-muted-foreground">
                <Clock className="h-8 w-8 mb-2 opacity-20" />
                <p>Không có lịch trực nào trong hôm nay.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
