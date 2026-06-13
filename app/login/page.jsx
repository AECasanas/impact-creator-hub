"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    const signedInUser = authData?.user;

    if (!signedInUser) {
      setLoading(false);
      setMessage("Login succeeded, but no user was found.");
      return;
    }

    const explicitRedirect = searchParams.get("redirect");

    if (explicitRedirect) {
      setLoading(false);
      router.push(explicitRedirect);
      return;
    }

    const { data: brandProfile, error: brandError } = await supabase
      .from("brand_profiles")
      .select("id, slug")
      .eq("user_id", signedInUser.id)
      .maybeSingle();

    if (brandError) {
      setLoading(false);
      setMessage(brandError.message);
      return;
    }

    if (brandProfile?.slug) {
      setLoading(false);
      router.push(`/brand/${brandProfile.slug}`);
      return;
    }

    if (brandProfile) {
      setLoading(false);
      router.push("/dashboard/brand");
      return;
    }

    const { data: creatorProfile, error: creatorError } = await supabase
      .from("creator_profiles")
      .select("id, slug")
      .eq("user_id", signedInUser.id)
      .maybeSingle();

    if (creatorError) {
      setLoading(false);
      setMessage(creatorError.message);
      return;
    }

    setLoading(false);

    if (creatorProfile?.slug) {
      router.push(`/creator/${creatorProfile.slug}`);
      return;
    }

    if (creatorProfile) {
      router.push("/dashboard/profile");
      return;
    }

    router.push("/create-profile/free");
  }

  return (
    <main className="loginPage">
      <section className="loginCard">
        <a className="brand" href="/">
          <img
            src="/logo-ripple.png"
            alt="Impact Creator Hub logo"
            className="brandLogo"
          />

          <div>
            <strong>Impact Creator Hub</strong>
            <p>Build your brand. Grow your impact.</p>
          </div>
        </a>

        <div className="loginGrid">
          <section className="introPanel">
            <p className="eyebrow">Welcome Back</p>
            <h1>Sign in to your Impact Hub.</h1>
            <p>
              Access your profile, manage your creator or brand presence, and
              continue building your impact.
            </p>
          </section>

          <section className="formPanel">
            <p className="eyebrow">Login</p>
            <h2>Access your account</h2>

            <form onSubmit={handleLogin}>
              <label>
                <span>Email address</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {message && <p className="message">{message}</p>}
            </form>

            <p className="signupPrompt">
              New to Impact Creator Hub?{" "}
              <a href="/signup">Create an account</a>
            </p>
          </section>
        </div>
      </section>

      <style jsx>{`
        .loginPage {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 18% 18%,
              rgba(103, 232, 249, 0.18),
              transparent 28%
            ),
            radial-gradient(
              circle at 84% 12%,
              rgba(242, 140, 130, 0.16),
              transparent 26%
            ),
            linear-gradient(135deg, #05090b 0%, #08131a 48%, #05090b 100%);
          color: #ffffff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          padding: 32px;
        }

        .loginCard {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 34px;
          color: #ffffff;
          text-decoration: none;
        }

        .brandLogo {
          width: 64px;
          height: 64px;
          object-fit: contain;
        }

        .brand strong {
          display: block;
          font-size: 1.35rem;
          letter-spacing: -0.03em;
        }

        .brand p {
          margin: 4px 0 0;
          color: #f28c82;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .loginGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.7fr);
          gap: 28px;
          align-items: stretch;
        }

        .introPanel,
        .formPanel {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 34px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
        }

        .introPanel {
          min-height: 620px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(34px, 5vw, 58px);
          background:
            linear-gradient(
              180deg,
              rgba(5, 9, 11, 0.1),
              rgba(5, 9, 11, 0.84)
            ),
            radial-gradient(
              circle at 78% 18%,
              rgba(103, 232, 249, 0.18),
              transparent 26%
            ),
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.03)
            );
        }

        .eyebrow {
          margin: 0 0 14px;
          color: #67e8f9;
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h1,
        h2 {
          margin: 0;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        h1 {
          max-width: 680px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(3rem, 7vw, 6.4rem);
        }

        .introPanel p:not(.eyebrow) {
          max-width: 640px;
          margin: 26px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 1.08rem;
          line-height: 1.8;
        }

        .formPanel {
          padding: clamp(28px, 4vw, 44px);
          background: rgba(255, 255, 255, 0.96);
          color: #10172f;
        }

        .formPanel h2 {
          margin-bottom: 28px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.3rem, 5vw, 3.6rem);
        }

        form {
          display: grid;
          gap: 18px;
        }

        label {
          display: grid;
          gap: 8px;
          color: #1f2937;
          font-size: 0.88rem;
          font-weight: 800;
        }

        input {
          width: 100%;
          height: 54px;
          border: 1px solid #d9dee8;
          border-radius: 14px;
          background: #ffffff;
          color: #10172f;
          font: inherit;
          outline: none;
          padding: 0 16px;
        }

        input:focus {
          border-color: #17c9d5;
          box-shadow: 0 0 0 4px rgba(23, 201, 213, 0.14);
        }

        button {
          height: 56px;
          border: 0;
          border-radius: 16px;
          background: #67e8f9;
          color: #020617;
          cursor: pointer;
          font: inherit;
          font-weight: 900;
          box-shadow: 0 14px 28px rgba(103, 232, 249, 0.28);
        }

        button:hover {
          background: #a5f3fc;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .message {
          margin: 4px 0 0;
          color: #007585;
          font-size: 0.9rem;
          font-weight: 900;
          text-align: center;
        }

        .signupPrompt {
          margin: 24px 0 0;
          color: #596273;
          text-align: center;
        }

        .signupPrompt a {
          color: #007585;
          font-weight: 900;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .loginGrid {
            grid-template-columns: 1fr;
          }

          .introPanel {
            min-height: auto;
          }
        }

        @media (max-width: 640px) {
          .loginPage {
            padding: 18px;
          }

          .brandLogo {
            width: 50px;
            height: 50px;
          }

          .brand strong {
            font-size: 1.08rem;
          }

          .brand p {
            letter-spacing: 0.12em;
          }
        }
      `}</style>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main style={{ padding: 40 }}>Loading...</main>}>
      <LoginContent />
    </Suspense>
  );
}