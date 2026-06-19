import { NextResponse } from "next/server";
import { getDoctors } from "@/lib/googleSheets";

export async function GET() {
  const data = await getDoctors();
  return NextResponse.json(data);
}
