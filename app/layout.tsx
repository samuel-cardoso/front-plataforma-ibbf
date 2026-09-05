import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plataforma IBBF",
  description: "Gestão de membros da Plataforma IBBF",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, messages, timeZone] = await Promise.all([
    getLocale(),
    getMessages(),
    getTimeZone(),
  ]);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
