import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SocialLink = {
  id: string;
  platform: string | null;
  url: string | null;
  follower_count: number | null;
};

type BrandInquiry = {
  id: string;
  brand_name: string | null;
  status: string | null;
  created_at: string | null;
};

type CreatorProfile = {
  display_name: string | null;
  slug: string | null;
  headline: string | null;
  niche: string | null;
  profile_template: string | null;
  audience_size: number | null;
  is_published: boolean | null;
  creator_social_links?: SocialLink[];
  brand_inquiries?: BrandInquiry[];
};

type Profile = {
  full_name: string | null;
  email: string | null;
  role: string | null;
};

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  if (!isSupabaseConfigured()) {
    redirect("/login?config=required");
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?auth=required");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .maybeSingle();

  const { data } = await supabase
    .from("creator_profiles")
    .select("*, creator_social_links(*), brand_inquiries(id, brand_name, status, created_at)")
    .eq("user_id", user.id)
    .maybeSingle();

  const profile = profileData as Profile | null;
  const creatorProfile = data as CreatorProfile | null;
  const socialLinks = creatorProfile?.creator_social_links ?? [];
  const inquiries = creatorProfile?.brand_inquiries ?? [];
  const published = creatorProfile?.is_published === true;

  return (
    <main className="stack">
      <section className="hero">
        <p className="eyebrow">Creator dashboard</p>
        <h1 className="page-title">
          {creatorProfile?.display_name
            ? `Welcome back, ${creatorProfile.display_name}.`
            : `Welcome${profile?.full_name ? `, ${profile.full_name}` : ""}.`}
        </h1>
        <p className="lede">
          Manage the profile, social proof, and inbound brand interest attached
          to your creator account.
        </p>
        {profile?.email ? <p className="status-pill">{profile.email}</p> : null}
        {saved ? <p className="status-pill">Profile saved: /creator/{saved}</p> : null}
      </section>

      {!creatorProfile ? (
        <section className="card stack">
          <h2>No creator profile yet</h2>
          <p className="muted">
            Start with the onboarding form to create a private draft, then
            publish it when your profile is ready for brands.
          </p>
          <Link className="button" href="/create-profile/free">
            Start onboarding
          </Link>
          <Link className="secondary-button" href="/logout">
            Log out
          </Link>
        </section>
      ) : (
        <>
          <section className="grid">
            <article className="card metric">
              <span className="muted">Publication status</span>
              <strong>{published ? "Published" : "Draft"}</strong>
              <p className="muted">
                {published
                  ? "Public users can view this creator profile."
                  : "Only you can view this profile until it is published."}
              </p>
            </article>
            <article className="card metric">
              <span className="muted">Audience size</span>
              <strong>{(creatorProfile.audience_size ?? 0).toLocaleString()}</strong>
              <p className="muted">{creatorProfile.niche ?? "Niche not set"}</p>
            </article>
            <article className="card metric">
              <span className="muted">Brand inquiries</span>
              <strong>{inquiries.length}</strong>
              <p className="muted">Visible only to this creator account.</p>
            </article>
            <article className="card metric">
              <span className="muted">Template</span>
              <strong>{creatorProfile.profile_template ?? "Not set"}</strong>
              <p className="muted">Saved to your creator profile.</p>
            </article>
          </section>

          <section className="card stack">
            <div>
              <p className="eyebrow">Profile</p>
              <h2>{creatorProfile.headline ?? "Headline not set"}</h2>
              <p className="muted">Public slug: /creator/{creatorProfile.slug}</p>
            </div>
            <div className="actions">
              <Link className="button" href="/create-profile/free">
                Edit creator profile
              </Link>
              {creatorProfile.slug ? (
                <Link className="secondary-button" href={`/creator/${creatorProfile.slug}`}>
                  Preview profile
                </Link>
              ) : null}
              <Link className="secondary-button" href="/logout">
                Log out
              </Link>
            </div>
          </section>

          <section className="grid">
            <article className="card stack">
              <h2>Social links</h2>
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => (
                  <p className="muted" key={link.id}>
                    {link.platform}: {link.follower_count?.toLocaleString() ?? 0} followers
                  </p>
                ))
              ) : (
                <p className="muted">No social links added yet.</p>
              )}
            </article>
            <article className="card stack">
              <h2>Recent inquiries</h2>
              {inquiries.length > 0 ? (
                inquiries.slice(0, 4).map((inquiry) => (
                  <p className="muted" key={inquiry.id}>
                    {inquiry.brand_name ?? "Brand"} - {inquiry.status ?? "new"}
                  </p>
                ))
              ) : (
                <p className="muted">
                  Published profiles can receive brand inquiries from public visitors.
                </p>
              )}
            </article>
          </section>
        </>
      )}
    </main>
  );
}
