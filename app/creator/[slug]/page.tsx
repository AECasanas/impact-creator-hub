/* eslint-disable @next/next/no-img-element -- Creator-provided URLs stay unoptimized until uploads are added. */
import type { CSSProperties } from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SocialLink = {
  id: string;
  platform: string | null;
  url: string | null;
  follower_count: number | null;
  sort_order: number | null;
};

type FeaturedWork = {
  id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  image_url: string | null;
  project_url: string | null;
  sort_order: number | null;
};

type CollaborationOption = {
  id: string;
  title: string | null;
  description: string | null;
  deliverables: string | null;
  sort_order: number | null;
};

type CreatorProfile = {
  id: string;
  display_name: string | null;
  slug: string | null;
  headline: string | null;
  bio: string | null;
  niche: string | null;
  location: string | null;
  website_url: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  impact_statement: string | null;
  profile_badge: string | null;
  content_focus: string | null;
  collaboration_note: string | null;
  audience_size: number | null;
  rate_card_url: string | null;
  creator_social_links?: SocialLink[];
  creator_featured_work?: FeaturedWork[];
  creator_collaboration_options?: CollaborationOption[];
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

async function submitBrandInquiry(formData: FormData) {
  "use server";

  const creatorProfileId = text(formData, "creator_profile_id");
  const creatorSlug = text(formData, "creator_slug");

  if (!creatorProfileId || !creatorSlug) {
    throw new Error("Creator profile is required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("brand_inquiries").insert({
    creator_profile_id: creatorProfileId,
    brand_name: text(formData, "brand_name"),
    contact_name: text(formData, "contact_name"),
    email: text(formData, "email"),
    campaign_goal: text(formData, "campaign_goal"),
    budget_range: text(formData, "budget_range"),
    message: text(formData, "message")
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/creator/${creatorSlug}?inquiry=sent`);
}

export default async function CreatorProfilePage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ inquiry?: string }>;
}) {
  const { slug } = await params;
  const { inquiry } = await searchParams;
  if (!isSupabaseConfigured()) {
    return (
      <main className="hero">
        <p className="eyebrow">Creator profile</p>
        <h1 className="page-title">Supabase is required for public profiles.</h1>
        <p className="lede">
          Configure the Supabase environment variables and apply the schema
          before viewing published creator pages.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("creator_profiles")
    .select("*, creator_social_links(*), creator_featured_work(*), creator_collaboration_options(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const creatorProfile = data as CreatorProfile;
  const socialLinks = (creatorProfile.creator_social_links ?? []).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const featuredWork = (creatorProfile.creator_featured_work ?? []).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const collaborationOptions = (creatorProfile.creator_collaboration_options ?? []).sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const coverStyle = {
    "--cover-image": creatorProfile.cover_image_url
      ? `url(${creatorProfile.cover_image_url})`
      : "none"
  } as CSSProperties;

  return (
    <main className="stack">
      <section className="profile-cover stack" style={coverStyle}>
        {creatorProfile.profile_image_url ? (
          <img
            className="avatar"
            src={creatorProfile.profile_image_url}
            alt={`${creatorProfile.display_name ?? "Creator"} profile`}
          />
        ) : null}
        <div className="stack">
          <p className="eyebrow">{creatorProfile.profile_badge ?? "Impact creator"}</p>
          <h1 className="page-title">{creatorProfile.display_name}</h1>
          {creatorProfile.content_focus ? (
            <p className="script-line">{creatorProfile.content_focus}</p>
          ) : null}
          <p className="lede">
            {creatorProfile.headline ?? "Creator profile headline coming soon."}
          </p>
          <div className="actions">
            {creatorProfile.website_url ? (
              <Link className="button" href={creatorProfile.website_url}>
                Visit website
              </Link>
            ) : null}
            {creatorProfile.rate_card_url ? (
              <Link className="secondary-button" href={creatorProfile.rate_card_url}>
                View rate card
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid">
        <article className="card metric">
          <span className="muted">Audience</span>
          <strong>{(creatorProfile.audience_size ?? 0).toLocaleString()}</strong>
          <p className="muted">
            {[creatorProfile.location, creatorProfile.niche].filter(Boolean).join(" - ") ||
              "Location flexible"}
          </p>
        </article>
        <article className="card metric">
          <span className="muted">Social channels</span>
          <strong>{socialLinks.length}</strong>
          <p className="muted">Verified by creator-provided URLs.</p>
        </article>
        <article className="card metric">
          <span className="muted">Featured work</span>
          <strong>{featuredWork.length}</strong>
          <p className="muted">Projects selected on the creator profile form.</p>
        </article>
      </section>

      <section className="card stack">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured work</p>
            <h2>Selected campaigns and projects</h2>
          </div>
          {creatorProfile.website_url ? (
            <Link href={creatorProfile.website_url} className="secondary-button">
              View all
            </Link>
          ) : null}
        </div>
        {featuredWork.length > 0 ? (
          <div className="grid">
            {featuredWork.map((work) => {
              const content = (
                <article className="work-card">
                  {work.image_url ? (
                    <img
                      className="work-image"
                      src={work.image_url}
                      alt={work.title ?? "Featured work"}
                    />
                  ) : null}
                  <div className="work-card-body">
                    <h3>{work.title}</h3>
                    <p className="muted">{work.description ?? "Project details coming soon."}</p>
                    {work.category ? <span className="tag">{work.category}</span> : null}
                  </div>
                </article>
              );

              return work.project_url ? (
                <Link href={work.project_url} key={work.id} target="_blank">
                  {content}
                </Link>
              ) : (
                <div key={work.id}>{content}</div>
              );
            })}
          </div>
        ) : (
          <p className="muted">Featured work has not been added yet.</p>
        )}
      </section>

      <section className="grid">
        <article className="card stack">
          <div>
            <p className="eyebrow">Creator story</p>
            <h2>Why brands partner here</h2>
          </div>
          <p className="muted">{creatorProfile.bio ?? "Bio coming soon."}</p>
          <p>{creatorProfile.impact_statement ?? "Impact statement coming soon."}</p>
        </article>

        <article className="card stack">
          <div>
            <p className="eyebrow">Ways to work together</p>
            <h2>Collaboration options</h2>
          </div>
          {collaborationOptions.length > 0 ? (
            collaborationOptions.map((option) => (
              <div className="option-row" key={option.id}>
                <div>
                  <h3>{option.title}</h3>
                  <p className="muted">{option.deliverables ?? option.description}</p>
                </div>
                {option.description && option.deliverables ? (
                  <p className="muted">{option.description}</p>
                ) : null}
              </div>
            ))
          ) : (
            <p className="muted">Collaboration options have not been added yet.</p>
          )}
          {creatorProfile.collaboration_note ? (
            <p className="status-pill">{creatorProfile.collaboration_note}</p>
          ) : null}
        </article>

        <article className="card stack">
          <div>
            <p className="eyebrow">Social proof</p>
            <h2>Let&apos;s connect</h2>
          </div>
          {socialLinks.length > 0 ? (
            socialLinks.map((link) => (
              <Link
                className="secondary-button"
                href={link.url ?? "#"}
                key={link.id}
                target="_blank"
              >
                {link.platform} - {link.follower_count?.toLocaleString() ?? 0}
              </Link>
            ))
          ) : (
            <p className="muted">No public social links yet.</p>
          )}
        </article>
      </section>

      <section className="card stack">
        <div>
          <p className="eyebrow">Brand inquiry</p>
          <h2>Pitch a mission-aligned collaboration</h2>
          <p className="muted">
            Anyone can submit this form while the creator profile is published.
          </p>
        </div>
        {inquiry === "sent" ? (
          <p className="status-pill">Inquiry sent. The creator can review it in their dashboard.</p>
        ) : null}
        <form action={submitBrandInquiry} className="form-grid">
          <input name="creator_profile_id" type="hidden" value={creatorProfile.id} />
          <input name="creator_slug" type="hidden" value={creatorProfile.slug ?? slug} />
          <div className="field">
            <label htmlFor="brand_name">Brand name</label>
            <input id="brand_name" name="brand_name" required placeholder="Purpose Co." />
          </div>
          <div className="field">
            <label htmlFor="contact_name">Contact name</label>
            <input id="contact_name" name="contact_name" required placeholder="Jordan Lee" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" required type="email" placeholder="jordan@example.com" />
          </div>
          <div className="field">
            <label htmlFor="budget_range">Budget range</label>
            <input id="budget_range" name="budget_range" placeholder="$5k - $10k" />
          </div>
          <div className="field full">
            <label htmlFor="campaign_goal">Campaign goal</label>
            <input
              id="campaign_goal"
              name="campaign_goal"
              placeholder="Launch an ethical product with creator-led storytelling"
            />
          </div>
          <div className="field full">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              required
              placeholder="Share timing, deliverables, impact goals, and why this creator is a fit."
            />
          </div>
          <div className="actions">
            <button className="button" type="submit">
              Send inquiry
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
