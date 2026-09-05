import { useTranslations } from "@/hooks";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationData } from "@/lib/types/apiEnvelopeTypes";

type PaginationProps = {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
};

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const t = useTranslations("comum");
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-sm text-muted-foreground">
        {t("paginaDe", { page, totalPages })}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={t("paginaAnteriorAria")}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={t("proximaPaginaAria")}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
