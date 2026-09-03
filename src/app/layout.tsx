import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/context/app-state";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Outfitters",
  description: "What should I wear today? Outfits from clothes you already own.",
  applicationName: "Online Outfitters",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F4F0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
