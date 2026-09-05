"use client";

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectOption = { label: string; value: string };

type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "date"
  | "tel"
  | "textarea"
  | "select"
  | "checkbox";

type FormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  type?: FormFieldType;
  placeholder?: string;
  options?: SelectOption[];
  disabled?: boolean;
  className?: string;
};

/** Campo de formulário genérico ligado ao React Hook Form via Controller. */
export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  options,
  disabled,
  className,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn("flex flex-col gap-1.5", className)} data-field-name={name}>
          {type !== "checkbox" && <Label htmlFor={name}>{label}</Label>}

          {type === "textarea" && (
            <Textarea
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value ?? ""}
              aria-invalid={!!fieldState.error}
            />
          )}

          {type === "select" && (
            <Select
              value={field.value ?? undefined}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger id={name} className="w-full" aria-invalid={!!fieldState.error}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {type === "checkbox" && (
            <div className="flex items-center gap-2">
              <Checkbox
                id={name}
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
              <Label htmlFor={name}>{label}</Label>
            </div>
          )}

          {type !== "textarea" && type !== "select" && type !== "checkbox" && (
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value ?? ""}
              aria-invalid={!!fieldState.error}
            />
          )}

          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
