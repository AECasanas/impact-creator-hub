import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

function safeRedirectPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/create-profile/free";
}

async function signIn(formData: FormData) {
  "use server";

  const redirectTo = safeRedirectPath(text(formData, "redirect_to"));

  if (!isSupabaseConfigured()) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}&config=required`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: text(formData, "email"),
    password: text(formData, "password")
  });

  if (error) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(redirectTo);
}

async function signUp(formData: FormData) {
  "use server";

  const redirectTo = safeRedirectPath(text(formData, "redirect_to"));
  const email = text(formData, "email");
  const password = text(formData, "password");
  const fullName = text(formData, "full_name");

  if (!isSupabaseConfigured()) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}&config=required`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(redirectTo);
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ redirect?: string; auth?: string; config?: string; error?: string }>;
}) {
  const { redirect: redirectParam, auth, config, error } = await searchParams;
  const redirectTo = safeRedirectPath(redirectParam ?? "/create-profile/free");

  return (
    <main className="stack">
      <section className="hero">
        <p className="eyebrow">Creator account</p>
        <h1 className="page-title">Log in or create your creator account.</h1>
        <p className="lede">
          Your profile choices, social links, photos, and public page are saved
          to your signed-in Supabase user account.
        </p>
        {auth === "required" ? (
          <p className="status-pill">Create an account or log in before saving your profile.</p>
        ) : null}
        {config === "required" ? (
          <p className="status-pill">Add Supabase environment variables before using auth.</p>
        ) : null}
        {error ? <p className="status-pill">{error}</p> : null}
      </section>

      <section className="grid">
        <form action={signUp} className="card stack">
          <div>
            <p className="eyebrow">New creator</p>
            <h2>Create account</h2>
            <p className="muted">Start saving your creator profile choices.</p>
          </div>
          <input name="redirect_to" type="hidden" value={redirectTo} />
          <div className="field">
            <label htmlFor="signup_full_name">Full name</label>
            <input id="signup_full_name" name="full_name" required placeholder="Avery Impact" />
          </div>
          <div className="field">
            <label htmlFor="signup_email">Email</label>
            <input id="signup_email" name="email" required type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="signup_password">Password</label>
            <input id="signup_password" name="password" required minLength={6} type="password" />
          </div>
          <button className="button" type="submit">
            Create account
          </button>
        </form>

        <form action={signIn} className="card stack">
          <div>
            <p className="eyebrow">Returning creator</p>
            <h2>Log in</h2>
            <p className="muted">Continue editing your saved creator profile.</p>
          </div>
          <input name="redirect_to" type="hidden" value={redirectTo} />
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
      </section>

      <Link className="secondary-button" href="/create-profile/free">
        Back to free profile form
      </Link>
    </main>
  );
}
