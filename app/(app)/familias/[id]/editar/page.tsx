import { FamilyFormEdit } from "@/components/families";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditFamilyPage({ params }: PageProps) {
  const { id } = await params;
  return <FamilyFormEdit familyId={id} />;
}
