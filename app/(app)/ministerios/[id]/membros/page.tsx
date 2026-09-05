import { MinistryMembersPageContent } from "@/components/ministries";

type PageProps = { params: Promise<{ id: string }> };

export default async function MinistryMembersPage({ params }: PageProps) {
  const { id } = await params;
  return <MinistryMembersPageContent ministryId={id} />;
}
