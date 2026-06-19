import { NextResponse } from "next/server";
import { getDepartments } from "@/lib/googleSheets";

export async function GET() {
  const data = await getDepartments();
  return NextResponse.json(data);
}
