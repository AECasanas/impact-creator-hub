import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SocialLink = {
  platform: string | null;
  url: string | null;
  follower_count: number | null;
  sort_order: number | null;
};

type CreatorProfile = {
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
  audience_size: number | null;
  rate_card_url: string | null;
  is_published: boolean | null;
  creator_social_links?: SocialLink[];
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function saveCreatorProfile(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/onboarding/creator?auth=required");
  }

  const displayName = text(formData, "display_name") ?? "Impact Creator";
  const slug = toSlug(text(formData, "slug") ?? displayName);

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: displayName,
      avatar_url: text(formData, "profile_image_url"),
      role: "creator"
    },
    { onConflict: "id" }
  );

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: creatorProfile, error: creatorError } = await supabase
    .from("creator_profiles")
    .upsert(
      {
        user_id: user.id,
        display_name: displayName,
        slug,
        headline: text(formData, "headline"),
        bio: text(formData, "bio"),
        niche: text(formData, "niche"),
        location: text(formData, "location"),
        website_url: text(formData, "website_url"),
        profile_image_url: text(formData, "profile_image_url"),
        cover_image_url: text(formData, "cover_image_url"),
        impact_statement: text(formData, "impact_statement"),
        audience_size: Number(text(formData, "audience_size") ?? 0),
        rate_card_url: text(formData, "rate_card_url"),
        is_published: formData.get("is_published") === "on"
      },
      { onConflict: "user_id" }
    )
    .select("id, slug")
    .single();

  if (creatorError) {
    throw new Error(creatorError.message);
  }

  const platforms = formData.getAll("social_platform");
  const urls = formData.getAll("social_url");
  const followerCounts = formData.getAll("social_follower_count");

  await supabase
    .from("creator_social_links")
    .delete()
    .eq("creator_profile_id", creatorProfile.id);

  const socialLinks = platforms
    .map((platform, index) => ({
      creator_profile_id: creatorProfile.id,
      platform: typeof platform === "string" ? platform.trim() : "",
      url: typeof urls[index] === "string" ? urls[index].trim() : "",
      follower_count:
        typeof followerCounts[index] === "string" && followerCounts[index].trim()
          ? Number(followerCounts[index])
          : 0,
      sort_order: index
    }))
    .filter((link) => link.platform && link.url);

  if (socialLinks.length > 0) {
    const { error: socialError } = await supabase
      .from("creator_social_links")
      .insert(socialLinks);

    if (socialError) {
      throw new Error(socialError.message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/creator/${creatorProfile.slug}`);
  redirect(`/dashboard?saved=${creatorProfile.slug}`);
}

export default async function CreatorOnboardingPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; auth?: string }>;
}) {
  const { auth } = await searchParams;
  if (!isSupabaseConfigured()) {
    return (
      <main className="hero">
        <p className="eyebrow">Creator onboarding</p>
        <h1 className="page-title">Connect Supabase to start onboarding.</h1>
        <p className="lede">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your
          environment, then apply supabase/schema.sql before creators save data.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="hero">
        <p className="eyebrow">Creator onboarding</p>
        <h1 className="page-title">Sign in before creating your profile.</h1>
        <p className="lede">
          Supabase Auth should be connected to your preferred sign-in flow. Once
          signed in, creators can manage only their own profile data.
        </p>
        {auth === "required" ? (
          <p className="status-pill">Authentication is required to save.</p>
        ) : null}
      </main>
    );
  }

  const { data } = await supabase
    .from("creator_profiles")
    .select("*, creator_social_links(*)")
    .eq("user_id", user.id)
    .maybeSingle();

  const creatorProfile = data as CreatorProfile | null;
  const links = creatorProfile?.creator_social_links ?? [];
  const linkRows = Array.from({ length: 3 }, (_, index) => links[index] ?? null);

  return (
    <main className="stack">
      <section className="hero">
        <p className="eyebrow">Creator onboarding</p>
        <h1 className="page-title">Build your public impact profile.</h1>
        <p className="lede">
          Add the story, proof points, and URLs brands need. Images stay as URL
          fields for now, with payments, uploads, and brand search intentionally
          left out.
        </p>
      </section>

      <form action={saveCreatorProfile} className="card stack">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="display_name">Display name</label>
            <input
              id="display_name"
              name="display_name"
              required
              defaultValue={creatorProfile?.display_name ?? ""}
              placeholder="Avery Impact"
            />
          </div>
          <div className="field">
            <label htmlFor="slug">Profile slug</label>
            <input
              id="slug"
              name="slug"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              defaultValue={creatorProfile?.slug ?? ""}
              placeholder="avery-impact"
            />
          </div>
          <div className="field full">
            <label htmlFor="headline">Headline</label>
            <input
              id="headline"
              name="headline"
              defaultValue={creatorProfile?.headline ?? ""}
              placeholder="Climate storyteller helping brands earn trust"
            />
          </div>
          <div className="field full">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={creatorProfile?.bio ?? ""}
              placeholder="Share your creator story and partnership style."
            />
          </div>
          <div className="field">
            <label htmlFor="niche">Niche</label>
            <input
              id="niche"
              name="niche"
              defaultValue={creatorProfile?.niche ?? ""}
              placeholder="Sustainable lifestyle"
            />
          </div>
          <div className="field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              defaultValue={creatorProfile?.location ?? ""}
              placeholder="Austin, TX"
            />
          </div>
          <div className="field">
            <label htmlFor="audience_size">Audience size</label>
            <input
              id="audience_size"
              name="audience_size"
              type="number"
              min="0"
              defaultValue={creatorProfile?.audience_size ?? 0}
            />
          </div>
          <div className="field">
            <label htmlFor="website_url">Website URL</label>
            <input
              id="website_url"
              name="website_url"
              type="url"
              defaultValue={creatorProfile?.website_url ?? ""}
              placeholder="https://example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="profile_image_url">Profile image URL</label>
            <input
              id="profile_image_url"
              name="profile_image_url"
              type="url"
              defaultValue={creatorProfile?.profile_image_url ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="cover_image_url">Cover image URL</label>
            <input
              id="cover_image_url"
              name="cover_image_url"
              type="url"
              defaultValue={creatorProfile?.cover_image_url ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="rate_card_url">Rate card URL</label>
            <input
              id="rate_card_url"
              name="rate_card_url"
              type="url"
              defaultValue={creatorProfile?.rate_card_url ?? ""}
            />
          </div>
          <div className="field full">
            <label htmlFor="impact_statement">Impact statement</label>
            <textarea
              id="impact_statement"
              name="impact_statement"
              defaultValue={creatorProfile?.impact_statement ?? ""}
              placeholder="Describe the measurable change your content advances."
            />
          </div>
        </div>

        <section className="stack" aria-label="Social links">
          <div>
            <p className="eyebrow">Social proof</p>
            <h2>Creator social links</h2>
          </div>
          <div className="grid">
            {linkRows.map((link, index) => (
              <div className="card" key={`social-${index}`}>
                <div className="field">
                  <label htmlFor={`social_platform_${index}`}>Platform</label>
                  <input
                    id={`social_platform_${index}`}
                    name="social_platform"
                    defaultValue={link?.platform ?? ""}
                    placeholder="Instagram"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`social_url_${index}`}>URL</label>
                  <input
                    id={`social_url_${index}`}
                    name="social_url"
                    type="url"
                    defaultValue={link?.url ?? ""}
                    placeholder="https://instagram.com/creator"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`social_follower_count_${index}`}>Followers</label>
                  <input
                    id={`social_follower_count_${index}`}
                    name="social_follower_count"
                    type="number"
                    min="0"
                    defaultValue={link?.follower_count ?? 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <label className="status-pill">
          <input
            name="is_published"
            type="checkbox"
            defaultChecked={creatorProfile?.is_published ?? false}
          />
          Publish this creator profile
        </label>

        <div className="actions">
          <button className="button" type="submit">
            Save creator profile
          </button>
          {creatorProfile?.slug ? (
            <Link className="secondary-button" href={`/creator/${creatorProfile.slug}`}>
              View public profile
            </Link>
          ) : null}
        </div>
      </form>
    </main>
  );
}
