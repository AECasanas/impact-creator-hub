import { CreatorProfileFormPage } from "../../onboarding/creator/page";

export const dynamic = "force-dynamic";

export default async function FreeCreatorProfilePage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; auth?: string }>;
}) {
  return CreatorProfileFormPage({ searchParams, variant: "free" });
}
