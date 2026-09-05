"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { Toaster } from "@/components/ui/sonner";

type ProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  timeZone: string;
};

export function Providers({ children, locale, messages, timeZone }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      })
  );

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster richColors closeButton />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
