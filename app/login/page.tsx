import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

async function signIn(formData: FormData) {
  "use server";

  if (!isSupabaseConfigured()) {
    redirect("/login?config=required");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: text(formData, "email"),
    password: text(formData, "password")
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", user?.id)
    .maybeSingle();

  redirect(creatorProfile ? "/dashboard" : "/create-profile/free");
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ auth?: string; config?: string; error?: string; notice?: string }>;
}) {
  const { auth, config, error, notice } = await searchParams;

  return (
    <main className="stack">
      <section className="hero">
        <p className="eyebrow">Creator account</p>
        <h1 className="page-title">Log in to Impact Creator Hub.</h1>
        <p className="lede">
          Access your saved profile choices, social links, photos, and dashboard.
        </p>
        {auth === "required" ? (
          <p className="status-pill">Create an account or log in before saving your profile.</p>
        ) : null}
        {config === "required" ? (
          <p className="status-pill">Add Supabase environment variables before using auth.</p>
        ) : null}
        {error ? <p className="status-pill">{error}</p> : null}
        {notice ? <p className="status-pill">{notice}</p> : null}
      </section>

      <section className="grid">
        <form action={signIn} className="card stack">
          <div>
            <p className="eyebrow">Returning user</p>
            <h2>Log in</h2>
            <p className="muted">Continue editing your saved creator profile.</p>
          </div>
          <div className="field">
            <label htmlFor="login_email">Email</label>
            <input id="login_email" name="email" required type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="login_password">Password</label>
            <input id="login_password" name="password" required type="password" />
          </div>
          <button className="secondary-button" type="submit">
            Log in
          </button>
        </form>

        <section className="card stack">
          <p className="eyebrow">New creator</p>
          <h2>Need an account?</h2>
          <p className="muted">
            Create a creator account first, then build and maintain your public profile.
          </p>
          <Link className="button" href="/signup/creator">
            Create creator account
          </Link>
        </section>
      </section>

      <Link className="secondary-button" href="/create-profile/free">
        Back to free profile form
      </Link>
    </main>
  );
}
