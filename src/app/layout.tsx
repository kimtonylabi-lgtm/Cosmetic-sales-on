import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "COSMETIC SALES ON | 뷰티 B2B 통합 솔루션",
  description: "트렌드 분석부터 제조 매칭까지, 뷰티 비즈니스 통합 관리 자동화 시스템",
  keywords: ["뷰티 B2B", "화장품 제조", "OEM", "ODM", "영업 통합 관리", "CRM", "ERP"],
};

import { ThemeProvider } from "@/components/shared/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-black bg-white dark:text-white dark:bg-slate-950 selection:bg-black selection:text-white`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
