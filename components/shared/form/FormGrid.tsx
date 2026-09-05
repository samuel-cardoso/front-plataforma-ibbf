import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FormGridProps = {
  columns?: 1 | 2 | 3 | 4;
  children: ReactNode;
  className?: string;
};

const columnsClassName: Record<NonNullable<FormGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function FormGrid({ columns = 2, children, className }: FormGridProps) {
  return <div className={cn("grid gap-4", columnsClassName[columns], className)}>{children}</div>;
}
