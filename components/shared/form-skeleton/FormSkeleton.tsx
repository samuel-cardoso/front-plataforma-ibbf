import { Skeleton } from "@/components/ui/skeleton";

type FormSkeletonProps = {
  fields?: number;
  columns?: 1 | 2 | 3 | 4;
};

const columnsClassName: Record<NonNullable<FormSkeletonProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function FormSkeleton({ fields = 8, columns = 2 }: FormSkeletonProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className={`grid gap-4 ${columnsClassName[columns]}`}>
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 border-t pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
