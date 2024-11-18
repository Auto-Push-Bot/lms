import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./components/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryprovider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS",
  description: "Proyecto PPS Gimenez",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
