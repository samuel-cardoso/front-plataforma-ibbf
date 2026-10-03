"use client";

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { DatePicker } from "./DatePicker";
import { maskCpf, maskPhone } from "@/lib/utils/format/mask";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type FormFieldMask = "cpf" | "phone";

const MASKS: Record<FormFieldMask, (value: string) => string> = {
  cpf: maskCpf,
  phone: maskPhone,
};

type FormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  type?: FormFieldType;
  placeholder?: string;
  options?: SelectOption[];
  mask?: FormFieldMask;
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
  mask,
  disabled,
  className,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          orientation={type === "checkbox" ? "horizontal" : "vertical"}
          data-invalid={!!fieldState.error}
          className={className}
          data-field-name={name}
        >
          {type === "checkbox" ? (
            <>
              <Checkbox
                id={name}
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
              <FieldLabel htmlFor={name} className="font-normal">
                {label}
              </FieldLabel>
            </>
          ) : (
            <>
              <FieldLabel htmlFor={name}>{label}</FieldLabel>

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
                  items={options}
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

              {type === "date" && (
                <DatePicker
                  id={name}
                  placeholder={placeholder}
                  disabled={disabled}
                  value={field.value ?? ""}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  aria-invalid={!!fieldState.error}
                />
              )}

              {type !== "textarea" && type !== "select" && type !== "date" && (
                <Input
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={(e) =>
                    field.onChange(mask ? MASKS[mask](e.target.value) : e.target.value)
                  }
                  value={field.value ?? ""}
                  aria-invalid={!!fieldState.error}
                />
              )}
            </>
          )}

          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
