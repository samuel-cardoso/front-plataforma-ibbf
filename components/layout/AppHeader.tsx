"use client";

import { useRouter, useTranslations, useSession, useLogout, useTheme } from "@/hooks";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Moon, Sun } from "lucide-react";
import { paths } from "@/lib/utils/paths";

export function AppHeader() {
  const t = useTranslations("comum");
  const router = useRouter();
  const { user } = useSession();
  const { logout, isLoggingOut } = useLogout();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.push(paths.login);
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Alternar tema"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="size-6">
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.email}</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut />
              {t("sair")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
