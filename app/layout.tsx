import type { Metadata } from "next";
import "./globals.css";
import AnalyticsTracker from "./components/analytics-tracker";

export const metadata: Metadata = {
  title: "DA.dev | Diriba Adugna Teka",
  description: "Portfolio of Diriba Adugna Teka, a full-stack developer and competitive programmer.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  keywords: ["Diriba Adugna Teka", "full-stack developer", "software engineer", "competitive programmer"],
  authors: [{ name: "Diriba Adugna Teka" }],
  openGraph: {
    title: "Diriba Adugna Teka | Full-Stack Developer",
    description: "Building useful software that solves real problems.",
    type: "website",
    siteName: "DA.dev"
  },
  twitter: {
    card: "summary",
    title: "Diriba Adugna Teka | Full-Stack Developer",
    description: "Building useful software that solves real problems."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><AnalyticsTracker />{children}</body>
    </html>
  );
}
