import { MinistryFormEdit } from "@/components/ministries";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditMinistryPage({ params }: PageProps) {
  const { id } = await params;
  return <MinistryFormEdit ministryId={id} />;
}
