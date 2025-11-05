import type { Metadata } from "next";
import { Inter } from "next/font/google";
// DÒNG QUAN TRỌNG NHẤT: IMPORT CSS CỦA CHÚNG TA
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIZ - AI Interview Platform",
  description: "Nền tảng phỏng vấn AI thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {/*
          Class 'font-sans' (từ globals.css) sẽ không được áp dụng 
          trực tiếp ở đây nếu chúng ta dùng next/font. 
          Nhưng toàn bộ CSS trong globals.css (bao gồm các biến màu)
          sẽ được load.
        */}
        {children}
      </body>
    </html>
  );
}
