import type { ReactNode } from "react";
import { FieldSet, FieldLegend, FieldDescription } from "@/components/ui/field";

type FormSectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <FieldSet>
      {title && <FieldLegend variant="label">{title}</FieldLegend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      {children}
    </FieldSet>
  );
}
