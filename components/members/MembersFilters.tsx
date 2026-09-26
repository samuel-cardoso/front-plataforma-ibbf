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
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Filter, FilterX } from "lucide-react";
import { MEMBER_STATUS_VALUES, MEMBER_TYPE_VALUES, EMPTY_MEMBER_FILTERS } from "@/lib/consts/member";

export type MembersFiltersState = typeof EMPTY_MEMBER_FILTERS;

type MembersFiltersProps = {
  filters: MembersFiltersState;
  onChange: (filters: MembersFiltersState) => void;
};

export function MembersFilters({ filters, onChange }: MembersFiltersProps) {
  const t = useTranslations("membros");
  const tComum = useTranslations("comum");
  const { families, isLoading: isLoadingFamilies } = useFamilies({ limit: 100 });

  const [searchText, setSearchText] = useState(filters.search);
  const debouncedSearch = useDebounce(searchText, 400);

  useEffect(() => {
    onChange({ ...filters, search: debouncedSearch });
    // Só reagimos a mudanças no texto debounced; `filters`/`onChange` mudam a cada
    // render do pai e não devem re-disparar este efeito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const hasActiveFilters = Boolean(
    searchText || filters.memberType || filters.memberStatus || filters.familyId
  );

  const memberTypeItems = MEMBER_TYPE_VALUES.map((value) => ({
    value,
    label: t(`memberType${value}`),
  }));
  const memberStatusItems = MEMBER_STATUS_VALUES.map((value) => ({
    value,
    label: t(`memberStatus${value}`),
  }));
  const familyItems = families.map((family) => ({ value: family.id, label: family.name }));

  const handleClear = () => {
    setSearchText("");
    onChange(EMPTY_MEMBER_FILTERS);
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="w-56 pl-9"
          placeholder={t("buscarPlaceholder")}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>

      <Select
        value={filters.memberType}
        onValueChange={(value) => onChange({ ...filters, memberType: value ?? "" })}
        items={memberTypeItems}
      >
        <SelectTrigger className="w-40">
          <SelectValue
            placeholder={tComum("filtrarPor", { campo: t("memberType").toLowerCase() })}
          />
        </SelectTrigger>
        <SelectContent>
          {MEMBER_TYPE_VALUES.map((value) => (
            <SelectItem key={value} value={value}>
              {t(`memberType${value}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.memberStatus}
        onValueChange={(value) => onChange({ ...filters, memberStatus: value ?? "" })}
        items={memberStatusItems}
      >
        <SelectTrigger className="w-40">
          <SelectValue
            placeholder={tComum("filtrarPor", { campo: t("memberStatus").toLowerCase() })}
          />
        </SelectTrigger>
        <SelectContent>
          {MEMBER_STATUS_VALUES.map((value) => (
            <SelectItem key={value} value={value}>
              {t(`memberStatus${value}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoadingFamilies ? (
        <Skeleton className="h-9 w-48" />
      ) : (
        <Select
          value={filters.familyId}
          onValueChange={(value) => onChange({ ...filters, familyId: value ?? "" })}
          items={familyItems}
        >
          <SelectTrigger className="w-48">
            <SelectValue
              placeholder={tComum("filtrarPor", { campo: t("family").toLowerCase() })}
            />
          </SelectTrigger>
          <SelectContent>
            {families.map((family) => (
              <SelectItem key={family.id} value={family.id}>
                {family.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!hasActiveFilters}
              onClick={handleClear}
              aria-label={tComum("limparFiltros")}
            >
              {hasActiveFilters ? <FilterX /> : <Filter />}
            </Button>
          }
        />
        <TooltipContent>{tComum("limparFiltros")}</TooltipContent>
      </Tooltip>
    </div>
  );
}
