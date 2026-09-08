import type { Metadata } from "next";
import { Roboto, Roboto_Mono, Crimson_Text } from "next/font/google";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";
import { Providers } from "./providers";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
      className={`${roboto.variable} ${robotoMono.variable} ${crimsonText.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
