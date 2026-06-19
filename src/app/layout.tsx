import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Quản Lý Lịch Trực Bệnh Viện",
  description: "Quản Lý Lịch Trực Bệnh Viện Hữu nghị Việt Đức - Cơ Sở Ngọc Hồi",
  manifest: "/manifest.json",
    openGraph: {
    title: "Quản Lý Lịch Trực Bệnh Viện Hữu nghị Việt Đức - Cơ Sở Ngọc Hồi",
    description: "Hệ thống quản lý lịch trực bác sĩ hiện đại, cập nhật, thuận tiện",
    siteName: "Medischedule",
    images: [
      {
        url: "/thumbnail.png", // Next.js sẽ tự động trỏ tới file thumbnail.png trong thư mục public
        width: 1200,
        height: 630,
        alt: "Quản Lý Lịch Trực Bệnh Viện Thumbnail",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quản Lý Lịch Trực Bệnh Viện",
    description: "Hệ thống quản lý lịch trực bác sĩ hiện đại",
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${GeistSans.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
