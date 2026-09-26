"use client";

import { useTranslations, useSession, useLogout, useRouter } from "@/hooks";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, ChevronsUpDown } from "lucide-react";
import { paths } from "@/lib/utils/paths";

export function SidebarFooterMenu() {
  const t = useTranslations("comum");
  const router = useRouter();
  const { user, isLoading } = useSession();
  const { logout, isLoggingOut } = useLogout();

  const handleLogout = async () => {
    await logout();
    router.push(paths.login);
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Skeleton className="size-6 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-28 group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:justify-center">
                <Avatar className="size-6">
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
                <span className="truncate group-data-[collapsible=icon]:hidden">{user.email}</span>
                <ChevronsUpDown className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent align="end" side="top">
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut />
              {t("sair")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
