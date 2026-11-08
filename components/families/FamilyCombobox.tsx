"use client";

import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import {
  useState,
  useTranslations,
  useDebounce,
  useFamilies,
  useFamily,
  useCreateFamily,
  useQueryClient,
  familyKeys,
} from "@/hooks";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import type { Family } from "@/lib/types/familyApiTypes";

type FamilyOption = Pick<Family, "id" | "name"> & { isNew?: boolean };

const NEW_FAMILY_ID = "__new__";

type FamilyComboboxProps = {
  id?: string;
  /** Id da família selecionada; string vazia = sem família. */
  value: string;
  onChange: (familyId: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
};

/**
 * Seleção de família com busca no servidor e criação inline: se o texto digitado
 * não corresponder a nenhuma família existente, oferece "Criar família …".
 */
export function FamilyCombobox({ id, value, onChange, onBlur, disabled, invalid }: FamilyComboboxProps) {
  const t = useTranslations("membros");
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const { family: selectedFamily } = useFamily(value);
  const { createFamily, isCreating } = useCreateFamily();

  const selected: FamilyOption | null =
    value && selectedFamily ? { id: selectedFamily.id, name: selectedFamily.name } : null;

  // Quando o input só mostra o nome da família selecionada, lista todas em vez de filtrar por ele.
  const query = inputValue.trim() === selected?.name ? "" : inputValue.trim();
  const search = useDebounce(query, 300);
  const { families, isLoading } = useFamilies({ search: search || undefined, limit: 20 });

  const hasExactMatch = families.some(
    (family) => family.name.localeCompare(query, undefined, { sensitivity: "base" }) === 0,
  );
  const options: FamilyOption[] = [
    ...families.map((family) => ({ id: family.id, name: family.name })),
    ...(query && query === search && !isLoading && !hasExactMatch
      ? [{ id: NEW_FAMILY_ID, name: query, isNew: true }]
      : []),
  ];

  const handleValueChange = async (option: FamilyOption | null) => {
    if (!option) return onChange("");
    if (!option.isNew) return onChange(option.id);

    try {
      const family = await createFamily({ name: option.name });
      queryClient.setQueryData(familyKeys.detail(family.id), family);
      onChange(family.id);
      toast.success(t("familiaCriada", { name: family.name }));
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <Combobox<FamilyOption>
      items={options}
      filter={null}
      value={selected}
      onValueChange={handleValueChange}
      onInputValueChange={setInputValue}
      itemToStringLabel={(option) => option.name}
      isItemEqualToValue={(option, current) => option.id === current.id}
      disabled={disabled || isCreating}
    >
      <ComboboxInput
        id={id}
        className="w-full"
        placeholder={t("familyPlaceholder")}
        onBlur={onBlur}
        aria-invalid={invalid}
        disabled={disabled || isCreating}
        showClear={!!selected}
      />
      <ComboboxContent>
        <ComboboxEmpty>{isLoading ? t("buscandoFamilias") : t("nenhumaFamilia")}</ComboboxEmpty>
        <ComboboxList>
          {(option: FamilyOption) => (
            <ComboboxItem key={option.id} value={option}>
              {option.isNew ? (
                <>
                  <PlusIcon />
                  {t("criarFamilia", { name: option.name })}
                </>
              ) : (
                option.name
              )}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
