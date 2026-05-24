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

type FeaturedWork = {
  title: string | null;
  description: string | null;
  category: string | null;
  image_url: string | null;
  project_url: string | null;
  sort_order: number | null;
};

type CollaborationOption = {
  title: string | null;
  description: string | null;
  deliverables: string | null;
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
  profile_badge: string | null;
  profile_template: string | null;
  logo_color: string | null;
  photo_placement: string | null;
  font_style: string | null;
  font_color: string | null;
  content_focus: string | null;
  collaboration_note: string | null;
  audience_size: number | null;
  rate_card_url: string | null;
  is_published: boolean | null;
  creator_social_links?: SocialLink[];
  creator_featured_work?: FeaturedWork[];
  creator_collaboration_options?: CollaborationOption[];
};

type FormVariant = "free" | "impact-kit";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function safeReturnTo(value: string | null) {
  return value === "/create-profile/impact-kit" ? value : "/create-profile/free";
}

function entryText(entries: FormDataEntryValue[], index: number) {
  const value = entries[index];
  return typeof value === "string" ? value.trim() : "";
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

  const returnTo = safeReturnTo(text(formData, "return_to"));
  if (!isSupabaseConfigured()) {
    redirect(`${returnTo}?config=required`);
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${returnTo}?auth=required`);
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
        profile_badge: text(formData, "profile_badge") ?? "Free creator profile",
        profile_template: text(formData, "profile_template") ?? "light_profile",
        logo_color: text(formData, "logo_color") ?? "electric_cyan",
        photo_placement: text(formData, "photo_placement") ?? "middle",
        font_style: text(formData, "font_style") ?? "editorial_serif",
        font_color: text(formData, "font_color") ?? "black",
        content_focus: text(formData, "content_focus"),
        collaboration_note: text(formData, "collaboration_note"),
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

  const workTitles = formData.getAll("work_title");
  const workDescriptions = formData.getAll("work_description");
  const workCategories = formData.getAll("work_category");
  const workImageUrls = formData.getAll("work_image_url");
  const workProjectUrls = formData.getAll("work_project_url");

  await supabase
    .from("creator_featured_work")
    .delete()
    .eq("creator_profile_id", creatorProfile.id);

  const featuredWork = workTitles
    .map((title, index) => ({
      creator_profile_id: creatorProfile.id,
      title: typeof title === "string" ? title.trim() : "",
      description: entryText(workDescriptions, index) || null,
      category: entryText(workCategories, index) || null,
      image_url: entryText(workImageUrls, index) || null,
      project_url: entryText(workProjectUrls, index) || null,
      sort_order: index
    }))
    .filter((work) => work.title);

  if (featuredWork.length > 0) {
    const { error: featuredWorkError } = await supabase
      .from("creator_featured_work")
      .insert(featuredWork);

    if (featuredWorkError) {
      throw new Error(featuredWorkError.message);
    }
  }

  const optionTitles = formData.getAll("collaboration_title");
  const optionDescriptions = formData.getAll("collaboration_description");
  const optionDeliverables = formData.getAll("collaboration_deliverables");

  await supabase
    .from("creator_collaboration_options")
    .delete()
    .eq("creator_profile_id", creatorProfile.id);

  const collaborationOptions = optionTitles
    .map((title, index) => ({
      creator_profile_id: creatorProfile.id,
      title: typeof title === "string" ? title.trim() : "",
      description: entryText(optionDescriptions, index) || null,
      deliverables: entryText(optionDeliverables, index) || null,
      sort_order: index
    }))
    .filter((option) => option.title);

  if (collaborationOptions.length > 0) {
    const { error: collaborationError } = await supabase
      .from("creator_collaboration_options")
      .insert(collaborationOptions);

    if (collaborationError) {
      throw new Error(collaborationError.message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/creator/${creatorProfile.slug}`);
  redirect(`/creator/${creatorProfile.slug}`);
}

export async function CreatorProfileFormPage({
  searchParams,
  variant = "free"
}: {
  searchParams: Promise<{ saved?: string; auth?: string; config?: string }>;
  variant?: FormVariant;
}) {
  const { auth, config } = await searchParams;
  const isImpactKit = variant === "impact-kit";
  const returnTo = isImpactKit ? "/create-profile/impact-kit" : "/create-profile/free";
  const profileBadge = isImpactKit ? "Impact Kit" : "Free creator profile";
  const isConfigured = isSupabaseConfigured();

  const supabase = isConfigured ? await createClient() : null;
  const {
    data: { user }
  } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };

  const { data } =
    supabase && user
      ? await supabase
          .from("creator_profiles")
          .select("*, creator_social_links(*), creator_featured_work(*), creator_collaboration_options(*)")
          .eq("user_id", user.id)
          .maybeSingle()
      : { data: null };

  const creatorProfile = data as CreatorProfile | null;
  const links = creatorProfile?.creator_social_links ?? [];
  const featuredWork = creatorProfile?.creator_featured_work ?? [];
  const collaborationOptions = creatorProfile?.creator_collaboration_options ?? [];
  const linkRows = Array.from({ length: 3 }, (_, index) => links[index] ?? null);
  const workRows = Array.from({ length: 3 }, (_, index) => featuredWork[index] ?? null);
  const collaborationRows = Array.from(
    { length: 3 },
    (_, index) => collaborationOptions[index] ?? null
  );

  return (
    <main className="stack">
      <section className="hero">
        <p className="eyebrow">{isImpactKit ? "Impact Kit" : "Free creator profile"}</p>
        {!isImpactKit ? <h2>FREE CREATOR PROFILE FORM</h2> : null}
        <h1 className="page-title">
          {isImpactKit ? "Build your creator Impact Kit." : "Build your free creator profile."}
        </h1>
        <p className="lede">
          {isImpactKit
            ? "Add audience stats, rate card details, featured collaborations, and partnership options for brands."
            : "Add the story, proof points, and URLs brands need. Images stay as URL fields for now."}
        </p>
        {!isConfigured || config === "required" ? (
          <p className="status-pill">
            Add Supabase environment variables before saving this form.
          </p>
        ) : null}
        {isConfigured && !user ? (
          <p className="status-pill">Sign-in is required before saving this form.</p>
        ) : null}
        {auth === "required" ? (
          <p className="status-pill">Authentication is required to save.</p>
        ) : null}
      </section>

      <form action={saveCreatorProfile} className="card stack">
        <input name="return_to" type="hidden" value={returnTo} />
        <input
          name="profile_template"
          type="hidden"
          value={creatorProfile?.profile_template ?? "light_profile"}
        />
        <input
          name="logo_color"
          type="hidden"
          value={creatorProfile?.logo_color ?? "electric_cyan"}
        />
        <input
          name="photo_placement"
          type="hidden"
          value={creatorProfile?.photo_placement ?? "middle"}
        />
        <input
          name="font_style"
          type="hidden"
          value={creatorProfile?.font_style ?? "editorial_serif"}
        />
        <input
          name="font_color"
          type="hidden"
          value={creatorProfile?.font_color ?? "black"}
        />
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
          <div className="field">
            <label htmlFor="profile_badge">Profile badge</label>
            <input
              id="profile_badge"
              name="profile_badge"
              defaultValue={creatorProfile?.profile_badge ?? profileBadge}
              placeholder={profileBadge}
            />
          </div>
          <div className="field">
            <label htmlFor="content_focus">Content focus</label>
            <input
              id="content_focus"
              name="content_focus"
              defaultValue={creatorProfile?.content_focus ?? ""}
              placeholder="Food. Travel. Lifestyle."
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
          <div className="field full">
            <label htmlFor="collaboration_note">Collaboration note</label>
            <textarea
              id="collaboration_note"
              name="collaboration_note"
              defaultValue={creatorProfile?.collaboration_note ?? ""}
              placeholder="Share any availability, profile tier, or collaboration details brands should know."
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

        <section className="stack" aria-label="Featured work">
          <div>
            <p className="eyebrow">Featured work</p>
            <h2>Projects to show on your public profile</h2>
          </div>
          <div className="grid">
            {workRows.map((work, index) => (
              <div className="card" key={`work-${index}`}>
                <div className="field">
                  <label htmlFor={`work_title_${index}`}>Project title</label>
                  <input
                    id={`work_title_${index}`}
                    name="work_title"
                    defaultValue={work?.title ?? ""}
                    placeholder="Fresh Market Miami"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`work_category_${index}`}>Category</label>
                  <input
                    id={`work_category_${index}`}
                    name="work_category"
                    defaultValue={work?.category ?? ""}
                    placeholder="Food & Grocery"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`work_image_url_${index}`}>Image URL</label>
                  <input
                    id={`work_image_url_${index}`}
                    name="work_image_url"
                    type="url"
                    defaultValue={work?.image_url ?? ""}
                    placeholder="https://example.com/project.jpg"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`work_project_url_${index}`}>Project URL</label>
                  <input
                    id={`work_project_url_${index}`}
                    name="work_project_url"
                    type="url"
                    defaultValue={work?.project_url ?? ""}
                    placeholder="https://example.com/case-study"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`work_description_${index}`}>Description</label>
                  <textarea
                    id={`work_description_${index}`}
                    name="work_description"
                    defaultValue={work?.description ?? ""}
                    placeholder="Instagram reel + stories, travel guide series, or campaign summary."
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="stack" aria-label="Ways to work together">
          <div>
            <p className="eyebrow">Ways to work together</p>
            <h2>Collaboration choices</h2>
          </div>
          <div className="grid">
            {collaborationRows.map((option, index) => (
              <div className="card" key={`collaboration-${index}`}>
                <div className="field">
                  <label htmlFor={`collaboration_title_${index}`}>Offer title</label>
                  <input
                    id={`collaboration_title_${index}`}
                    name="collaboration_title"
                    defaultValue={option?.title ?? ""}
                    placeholder="Sponsored Content"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`collaboration_deliverables_${index}`}>Deliverables</label>
                  <input
                    id={`collaboration_deliverables_${index}`}
                    name="collaboration_deliverables"
                    defaultValue={option?.deliverables ?? ""}
                    placeholder="Reels, Stories, Posts"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`collaboration_description_${index}`}>Description</label>
                  <textarea
                    id={`collaboration_description_${index}`}
                    name="collaboration_description"
                    defaultValue={option?.description ?? ""}
                    placeholder="Describe what brands get and the kind of campaigns you prefer."
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
              Preview profile
            </Link>
          ) : null}
        </div>
      </form>
    </main>
  );
}

export default async function CreatorOnboardingPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; auth?: string; config?: string }>;
}) {
  return CreatorProfileFormPage({ searchParams, variant: "free" });
}
