import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { message: "Lỗi hệ thống: Chưa cấu hình mật khẩu quản trị." },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: "admin_auth",
        value: "true",
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      });
      return response;
    }

    return NextResponse.json(
      { message: "Mật khẩu không chính xác." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Yêu cầu không hợp lệ." },
      { status: 400 }
    );
  }
}
