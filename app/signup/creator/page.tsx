import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

async function signUpCreator(formData: FormData) {
  "use server";

  const fullName = text(formData, "full_name");
  const email = text(formData, "email");
  const password = text(formData, "password");
  const confirmPassword = text(formData, "confirm_password");

  if (password !== confirmPassword) {
    redirect("/signup/creator?error=Passwords%20do%20not%20match");
  }

  if (!isSupabaseConfigured()) {
    redirect("/signup/creator?config=required");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "creator"
      }
    }
  });

  if (error) {
    redirect(`/signup/creator?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.session || !data.user) {
    redirect("/login?notice=Check%20your%20email%20to%20confirm%20your%20account");
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      email: data.user.email,
      full_name: fullName,
      role: "creator"
    },
    { onConflict: "id" }
  );

  if (profileError) {
    redirect(`/signup/creator?error=${encodeURIComponent(profileError.message)}`);
  }

  redirect("/create-profile/free");
}

export default function CreatorSignupPage() {
  return (
    <main className="stack">
      <section className="card actions" aria-label="Impact Creator Hub signup header">
        <Image
          src="/logo-ripple.png"
          alt="Impact Creator Hub"
          width={44}
          height={44}
          priority
        />
        <div>
          <p className="eyebrow">Impact Creator Hub</p>
          <p className="muted">Build your brand. Grow your impact.</p>
        </div>
      </section>

      <section className="hero">
        <p className="eyebrow">Creator signup</p>
        <h1 className="page-title">Create your creator account.</h1>
        <p className="lede">
          Sign up to save your profile choices, links, photos, and public creator page.
        </p>
      </section>

      <form action={signUpCreator} className="card stack">
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="full_name">Full name</label>
            <input id="full_name" name="full_name" required placeholder="Avery Impact" />
          </div>
          <div className="field full">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" required type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" required minLength={6} type="password" />
          </div>
          <div className="field">
            <label htmlFor="confirm_password">Confirm password</label>
            <input id="confirm_password" name="confirm_password" required minLength={6} type="password" />
          </div>
        </div>
        <div className="actions">
          <button className="button" type="submit">
            Create account
          </button>
          <Link className="secondary-button" href="/login">
            Already have an account?
          </Link>
        </div>
      </form>
    </main>
  );
}
