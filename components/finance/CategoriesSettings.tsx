"use client";

import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useState, useTranslations, useFinanceCategories, useSaveFinanceCategory, useFinanceCategoryForm } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormActions } from "@/components/shared/form";
import { DataLoadErrorState, TableSkeleton } from "@/components/shared";
import { getAxiosErrorMessage } from "@/lib/utils/api/getAxiosErrorMessage";
import { scrollToFirstError } from "@/lib/utils/validation/scrollToFirstError";
import type { FinanceCategory, FinanceCategoryType } from "@/lib/types/financeApiTypes";
import type { FinanceCategoryFormData } from "@/lib/zod/schemas/financeFormSchemas";

type Editing = { category?: FinanceCategory; type: FinanceCategoryType } | null;

export function CategoriesSettings() {
  const t = useTranslations("financeiro");
  const { categories, isLoading, isError, refetch } = useFinanceCategories();
  const [editing, setEditing] = useState<Editing>(null);

  if (isLoading) return <TableSkeleton columns={2} />;
  if (isError) return <DataLoadErrorState onRetry={refetch} />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(["INCOME", "EXPENSE"] as const).map((type) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle>{t(`categorias${type}`)}</CardTitle>
            <CardAction>
              <Button size="sm" variant="outline" onClick={() => setEditing({ type })}>
                {t("novaCategoria")}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y">
              {categories
                .filter((category) => category.type === type)
                .map((category) => (
                  <li key={category.id} className="flex items-center justify-between gap-2 py-1.5 text-sm">
                    <span className="flex items-center gap-2">
                      {category.name}
                      {category.accountingCode && (
                        <span className="font-mono text-xs text-muted-foreground">{category.accountingCode}</span>
                      )}
                      {!category.active && <Badge variant="secondary">{t("inativo")}</Badge>}
                    </span>
                    <Button variant="ghost" size="icon-sm" onClick={() => setEditing({ category, type })} aria-label={t("editar")}>
                      <Pencil />
                    </Button>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      ))}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          {editing && <CategoryForm category={editing.category} type={editing.type} onClose={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoryForm({ category, type, onClose }: { category?: FinanceCategory; type: FinanceCategoryType; onClose: () => void }) {
  const t = useTranslations("financeiro");
  const tValidation = useTranslations("validacao");
  const { control, handleSubmit } = useFinanceCategoryForm(tValidation, category, type);
  const { createCategory, updateCategory, isSaving } = useSaveFinanceCategory();

  const onSubmit = async (data: FinanceCategoryFormData) => {
    try {
      if (category) {
        await updateCategory({
          id: category.id,
          data: { name: data.name, accountingCode: data.accountingCode || null, active: data.active },
        });
      } else {
        await createCategory({ name: data.name, type: data.type, accountingCode: data.accountingCode || undefined });
      }
      onClose();
    } catch (error) {
      toast.error(getAxiosErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, scrollToFirstError)} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>{category ? t("editarCategoria") : t(`novaCategoria${type}`)}</DialogTitle>
      </DialogHeader>
      <FormField control={control} name="name" label={t("nome")} />
      <FormField control={control} name="accountingCode" label={t("codigoContabil")} placeholder={t("codigoContabilPlaceholder")} />
      {category && <FormField control={control} name="active" label={t("ativo")} type="checkbox" />}
      <DialogFooter>
        <FormActions onCancel={onClose} isSubmitting={isSaving} />
      </DialogFooter>
    </form>
  );
}
