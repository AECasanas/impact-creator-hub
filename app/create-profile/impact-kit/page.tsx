import { CreatorProfileFormPage } from "../../onboarding/creator/page";

export const dynamic = "force-dynamic";

export default async function ImpactKitPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; auth?: string; config?: string }>;
}) {
  return CreatorProfileFormPage({ searchParams, variant: "impact-kit" });
}
