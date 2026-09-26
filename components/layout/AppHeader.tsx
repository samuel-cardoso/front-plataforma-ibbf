"use client";

import { useTheme } from "@/hooks";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AppBreadcrumb } from "./AppBreadcrumb";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Moon, Sun } from "lucide-react";

export function AppHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="mx-1 data-vertical:h-4 data-vertical:self-center"
      />
      <AppBreadcrumb />
      <div className="flex-1" />
      <div className="mr-2 flex items-center gap-1">
        <LanguageSwitcher />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Alternar tema"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </div>
    </header>
  );
}
