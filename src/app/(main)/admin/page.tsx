"use client";

import * as React from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Settings, LogOut, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminPage() {
  const router = useRouter();
  const { schedules, setSchedules, departments, setDepartments, doctors, setDoctors } = useStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docsRes, depsRes, schedsRes] = await Promise.all([
          fetch("/api/doctors"),
          fetch("/api/departments"),
          fetch("/api/schedules"),
        ]);
        const docs = await docsRes.json();
        const deps = await depsRes.json();
        const scheds = await schedsRes.json();
        setDoctors(docs);
        setDepartments(deps);
        setSchedules(scheds);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setDoctors, setDepartments, setSchedules]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch trực này?")) return;
    
    try {
      const res = await fetch(`/api/schedules?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSchedules(schedules.filter((s) => s.id !== id));
      } else {
        alert("Xóa thất bại");
      }
    } catch (err) {
      alert("Đã xảy ra lỗi");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Trị Hệ Thống</h1>
          <p className="text-muted-foreground">
            Quản lý lịch trực, bác sĩ và các khoa.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Quản Lý Lịch Trực
            </CardTitle>
            <CardDescription>
              Thêm, sửa, xóa lịch trực của các bác sĩ.
            </CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Thêm lịch mới
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày Trực</TableHead>
                  <TableHead>Khoa</TableHead>
                  <TableHead>Bác Sĩ</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : schedules.length > 0 ? (
                  schedules.map((schedule) => {
                    const dept = departments.find((d) => d.id === schedule.departmentId);
                    const docs = doctors.filter((d) =>
                      schedule.doctorIds.includes(d.id)
                    );
                    
                    return (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">
                          {format(new Date(schedule.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{dept?.name || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {docs.map(d => (
                              <span key={d.id} className="text-sm">{d.name}</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(schedule.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Chưa có dữ liệu lịch trực.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
