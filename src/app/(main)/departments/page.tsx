"use client";

import * as React from "react";
import { useStore } from "@/store/useStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Building2, Users } from "lucide-react";

export default function DepartmentsPage() {
  const { departments, doctors, setDepartments, setDoctors } = useStore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [depsRes, docsRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/doctors")
        ]);
        const deps = await depsRes.json();
        const docs = await docsRes.json();
        setDepartments(deps);
        setDoctors(docs);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setDepartments, setDoctors]);

  const filteredDepartments = departments.filter((d) => {
    if (!searchTerm) return true;
    return d.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getDoctorCount = (deptName: string) => {
    return doctors.filter((d) => d.department === deptName).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Danh Sách Khoa</h1>
        <p className="text-muted-foreground">
          Quản lý các khoa và đội ngũ nhân sự tương ứng.
        </p>
      </div>

      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm tên khoa..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted/50 rounded-t-xl" />
              <CardContent className="h-16" />
            </Card>
          ))}
        </div>
      ) : filteredDepartments.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((dept) => {
            const count = getDoctorCount(dept.name);
            return (
              <Card key={dept.id} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="border-b bg-muted/20 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                    {dept.name}
                  </CardTitle>
                  <CardDescription>Mã Khoa: {dept.id}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Nhân sự</span>
                    </div>
                    <div className="text-lg font-bold">
                      {count} <span className="text-sm font-normal text-muted-foreground">BS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
          <Building2 className="h-12 w-12 mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">Không tìm thấy</h3>
          <p className="text-muted-foreground">Không có khoa nào khớp với từ khóa &quot;{searchTerm}&quot;.</p>
        </div>
      )}
    </div>
  );
}
