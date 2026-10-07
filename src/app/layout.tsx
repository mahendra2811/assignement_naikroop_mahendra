import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: { icon: "/icon.svg" },
  title: "Message Makeover — Say it your way",
  description:
    "Turn a rough draft into a clear, thoughtful message. Choose your tone, keep your meaning, and make it yours.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
