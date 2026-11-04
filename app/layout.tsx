import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DA.dev | Diriba Adugna Teka",
  description: "Portfolio of Diriba Adugna Teka, a full-stack developer and competitive programmer."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
