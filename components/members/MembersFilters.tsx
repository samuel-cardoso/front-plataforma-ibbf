"use client";

import { useState, useEffect, useTranslations, useDebounce, useFamilies } from "@/hooks";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MEMBER_STATUS_VALUES, MEMBER_TYPE_VALUES, EMPTY_MEMBER_FILTERS } from "@/lib/consts/member";

export type MembersFiltersState = typeof EMPTY_MEMBER_FILTERS;

type MembersFiltersProps = {
  filters: MembersFiltersState;
  onChange: (filters: MembersFiltersState) => void;
};

export function MembersFilters({ filters, onChange }: MembersFiltersProps) {
  const t = useTranslations("membros");
  const tComum = useTranslations("comum");
  const { families } = useFamilies({ limit: 100 });

  const [searchText, setSearchText] = useState(filters.search);
  const debouncedSearch = useDebounce(searchText, 400);

  useEffect(() => {
    onChange({ ...filters, search: debouncedSearch });
    // Só reagimos a mudanças no texto debounced; `filters`/`onChange` mudam a cada
    // render do pai e não devem re-disparar este efeito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleClear = () => {
    setSearchText("");
    onChange(EMPTY_MEMBER_FILTERS);
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Input
        className="w-56"
        placeholder={t("buscarPlaceholder")}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      <Select
        value={filters.memberType || "all"}
        onValueChange={(value) =>
          onChange({ ...filters, memberType: !value || value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t("memberType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{tComum("todos")}</SelectItem>
          {MEMBER_TYPE_VALUES.map((value) => (
            <SelectItem key={value} value={value}>
              {t(`memberType${value}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.memberStatus || "all"}
        onValueChange={(value) =>
          onChange({ ...filters, memberStatus: !value || value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t("memberStatus")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{tComum("todos")}</SelectItem>
          {MEMBER_STATUS_VALUES.map((value) => (
            <SelectItem key={value} value={value}>
              {t(`memberStatus${value}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.familyId || "all"}
        onValueChange={(value) =>
          onChange({ ...filters, familyId: !value || value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t("family")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{tComum("todos")}</SelectItem>
          {families.map((family) => (
            <SelectItem key={family.id} value={family.id}>
              {family.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
        {tComum("limparFiltros")}
      </Button>
    </div>
  );
}
