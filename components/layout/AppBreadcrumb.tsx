"use client";

import { usePathname, useTranslations } from "@/hooks";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { paths } from "@/lib/utils/paths";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const tMembros = useTranslations("membros");
  const tFamilias = useTranslations("familias");
  const tMinisterios = useTranslations("ministerios");

  const segments = pathname.split("/").filter(Boolean);
  const [section, ...rest] = segments;

  const sections = {
    membros: { label: tMembros("titulo"), href: paths.members.list },
    familias: { label: tFamilias("titulo"), href: paths.families.list },
    ministerios: { label: tMinisterios("titulo"), href: paths.ministries.list },
  } as const;

  const current = sections[section as keyof typeof sections];

  if (!current) {
    return null;
  }

  const page = (() => {
    if (rest.length === 0) return null;
    if (rest[0] === "novo") {
      return section === "membros"
        ? tMembros("novoMembro")
        : section === "familias"
          ? tFamilias("novaFamilia")
          : tMinisterios("novoMinisterio");
    }
    if (rest[1] === "editar") {
      return section === "membros"
        ? tMembros("editarMembro")
        : section === "familias"
          ? tFamilias("editarFamilia")
          : tMinisterios("editarMinisterio");
    }
    if (rest[1] === "membros") {
      return tMinisterios("participantes");
    }
    return null;
  })();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {page ? (
            <BreadcrumbLink render={<Link href={current.href}>{current.label}</Link>} />
          ) : (
            <BreadcrumbPage>{current.label}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {page && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{page}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
