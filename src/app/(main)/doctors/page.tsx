"use client";

import * as React from "react";
import { useStore } from "@/store/useStore";
import { parseISO, getMonth } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, ArrowUpDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/lib/types";

export default function DoctorsPage() {
  const { doctors, schedules, setDoctors, setSchedules } = useStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docsRes, schedsRes] = await Promise.all([
          fetch("/api/doctors"),
          fetch("/api/schedules")
        ]);
        const docs = await docsRes.json();
        const scheds = await schedsRes.json();
        setDoctors(docs);
        setSchedules(scheds);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setDoctors, setSchedules]);

  const currentMonth = new Date().getMonth();

  const getShiftsInMonth = (doctorId: string) => {
    return schedules.filter(
      (s) =>
        s.doctorIds.includes(doctorId) &&
        getMonth(parseISO(s.date)) === currentMonth
    ).length;
  };

  const columns: ColumnDef<Doctor, any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Họ và Tên
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium px-4">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "title",
      header: "Chức Danh",
    },
    {
      accessorKey: "department",
      header: "Khoa Trực",
    },
    {
      id: "shifts",
      header: () => <div className="text-right">Ngày Trực (Tháng này)</div>,
      cell: ({ row }) => {
        const doctor = row.original;
        const shifts = getShiftsInMonth(doctor.id);
        return (
          <div className="text-right font-semibold">
            <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs">
              {shifts} ngày
            </span>
          </div>
        )
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
          Danh Sách Bác Sĩ
        </h1>
        <p className="text-muted-foreground font-medium">
          Quản lý thông tin và số ngày trực của đội ngũ y bác sĩ.
        </p>
      </div>

      <Card className="glass-card border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-blue-500">
            <Users className="h-6 w-6" />
            Bác Sĩ Đang Công Tác
          </CardTitle>
          <CardDescription>
            Thống kê số ngày trực được tính trong tháng hiện tại.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">Đang tải dữ liệu...</div>
          ) : (
            <DataTable columns={columns} data={doctors} searchKey="name" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
