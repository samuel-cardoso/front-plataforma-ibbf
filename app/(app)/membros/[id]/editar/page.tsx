import { MemberFormEdit } from "@/components/members";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditMemberPage({ params }: PageProps) {
  const { id } = await params;
  return <MemberFormEdit memberId={id} />;
}
