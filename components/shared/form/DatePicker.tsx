"use client";

import { useState } from "react";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getDateFnsLocale } from "@/lib/utils/format/date";

const ISO_DATE_FORMAT = "yyyy-MM-dd";

type DatePickerProps = {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
};

export function DatePicker({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("comum");
  const dateFnsLocale = getDateFnsLocale(locale);

  const parsedDate = value ? parse(value, ISO_DATE_FORMAT, new Date()) : undefined;
  const selectedDate = parsedDate && isValid(parsedDate) ? parsedDate : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            onBlur={onBlur}
            className={cn("w-full justify-start font-normal", !selectedDate && "text-muted-foreground")}
            {...props}
          >
            <CalendarIcon />
            {selectedDate ? format(selectedDate, "P", { locale: dateFnsLocale }) : (placeholder ?? t("selecionarData"))}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={dateFnsLocale}
          captionLayout="dropdown"
          selected={selectedDate}
          onSelect={(date) => {
            onChange(date ? format(date, ISO_DATE_FORMAT) : "");
            setOpen(false);
          }}
        />
        {selectedDate && (
          <div className="border-t p-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              {t("limpar")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
