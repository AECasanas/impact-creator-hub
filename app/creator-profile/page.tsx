import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

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

async function saveTemplateChoices(formData: FormData) {
  "use server";

  if (!isSupabaseConfigured()) {
    redirect("/creator-profile?config=required");
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/creator-profile?auth=required");
  }

  const fallbackName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Impact Creator";

  const { data: existingProfile } = await supabase
    .from("creator_profiles")
    .select("display_name, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  const displayName = existingProfile?.display_name ?? fallbackName;
  const slug = existingProfile?.slug ?? `${toSlug(displayName)}-${user.id.slice(0, 8)}`;

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: displayName,
      role: "creator"
    },
    { onConflict: "id" }
  );

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { error: creatorError } = await supabase.from("creator_profiles").upsert(
    {
      user_id: user.id,
      display_name: displayName,
      slug,
      headline: "Creator profile in progress",
      profile_badge: "Free creator profile",
      profile_template: text(formData, "profile_template") ?? "light_profile",
      logo_color: text(formData, "logo_color") ?? "electric_cyan",
      photo_placement: text(formData, "photo_placement") ?? "middle",
      font_style: text(formData, "font_style") ?? "editorial_serif",
      font_color: text(formData, "font_color") ?? "black",
      is_published: false
    },
    { onConflict: "user_id" }
  );

  if (creatorError) {
    throw new Error(creatorError.message);
  }

  redirect(`/creator/${slug}`);
}

export default async function LegacyCreatorProfilePage({
  searchParams
}: {
  searchParams: Promise<{ auth?: string; config?: string }>;
}) {
  const { auth, config } = await searchParams;

  return (
    <main className="stack">
      <section className="hero">
        <p className="eyebrow">Choices summary</p>
        <h1 className="page-title">Light Profile</h1>
        <p className="lede">
          These choices are saved to your creator profile draft. Finish details
          on the free profile form when you are ready.
        </p>
        {config === "required" ? (
          <p className="status-pill">Add Supabase environment variables before saving choices.</p>
        ) : null}
        {auth === "required" ? (
          <p className="status-pill">Sign-in is required before saving choices.</p>
        ) : null}
      </section>

      <section className="grid">
        <article className="card stack">
          <h2>Template choices</h2>
          <p className="muted">Logo color: Electric Cyan</p>
          <p className="muted">Photo placement: Middle</p>
          <p className="muted">Font style: Editorial Serif</p>
          <p className="muted">Font color: Black</p>
        </article>

        <article className="card stack">
          <h2>Next step</h2>
          <p className="muted">
            Save these choices to your account, or continue to the full form to
            add your profile details.
          </p>
          <form action={saveTemplateChoices} className="actions">
            <input name="profile_template" type="hidden" value="light_profile" />
            <input name="logo_color" type="hidden" value="electric_cyan" />
            <input name="photo_placement" type="hidden" value="middle" />
            <input name="font_style" type="hidden" value="editorial_serif" />
            <input name="font_color" type="hidden" value="black" />
            <button className="button" type="submit">
              Save Choices
            </button>
            <button className="secondary-button" type="submit">
              Preview Free Profile
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
