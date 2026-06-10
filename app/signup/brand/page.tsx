"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BrandSignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [lastSignupEmail, setLastSignupEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function getBrandRedirectUrl() {
    return `${window.location.origin}/create-brand`;
  }

  async function upsertUserAccount(userId: string) {
    return supabase.from("user_accounts").upsert(
      {
        user_id: userId,
        account_type: "brand",
        active_profile_type: "brand",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );
  }

  async function handleResendVerification() {
    const cleanEmail = lastSignupEmail.trim();

    if (!cleanEmail) {
      setMessage("Enter your work email and create an account first, then resend.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: cleanEmail,
      options: {
        emailRedirectTo: getBrandRedirectUrl(),
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Verification email resent. Please check your inbox and spam folder.");
  }

  async function handleBrandSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const cleanCompanyName = companyName.trim();
    const cleanEmail = workEmail.trim();

    if (!cleanCompanyName || !cleanEmail || !password) {
      setMessage("Please enter your company name, work email, and password.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: getBrandRedirectUrl(),
        data: {
          full_name: cleanCompanyName,
          company_name: cleanCompanyName,
          account_type: "brand",
          industry,
          campaign_goal: campaignGoal,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setLastSignupEmail(cleanEmail);

    if (data?.user) {
      const { error: accountError } = await upsertUserAccount(data.user.id);

      if (accountError) {
        setMessage(accountError.message);
        setLoading(false);
        return;
      }
    }

    if (data?.session) {
      setLoading(false);
      window.location.href = "/create-brand";
      return;
    }

    setMessage(
      "Verification email sent. Please check your inbox and spam folder. After verifying, you will continue to your brand profile setup."
    );

    setLoading(false);
  }

  return (
    <main className="brandPage">
      <div className="overlay"></div>

      <section className="brandContent">
        <div className="brandText">
          <p className="eyebrow">FOR BRANDS</p>

          <h1>
            Find creators who
            <br />
            move your mission forward.
          </h1>

          <p className="brandSubtitle">
            Build campaigns, discover aligned creators, and connect with people
            who can help your brand reach the right audience with authenticity.
          </p>

          <div className="brandBenefits">
            <div>
              <strong>Discover creators</strong>
              <span>Search by niche, audience, location, and content style.</span>
            </div>

            <div>
              <strong>Launch collaborations</strong>
              <span>
                Invite creators for campaigns, events, reviews, and launches.
              </span>
            </div>

            <div>
              <strong>Build meaningful partnerships</strong>
              <span>Connect with creators who match your brand values.</span>
            </div>
          </div>
        </div>

        <div className="brandCard">
          <img
            src="/logo-white-background.png"
            alt="Impact Creator Hub logo"
            className="cardLogo"
          />

          <p className="cardLabel">Brand Account</p>
          <h2>Join as a Brand</h2>
          <p className="cardSubhead">
            Create a brand login first. After confirming your email, you can
            build your full brand profile.
          </p>

          <form onSubmit={handleBrandSignup}>
            <label>
              Brand / Company name
              <input
                type="text"
                placeholder="Your brand name"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                autoComplete="organization"
              />
            </label>

            <label>
              Work email
              <input
                type="email"
                placeholder="Email"
                value={workEmail}
                onChange={(event) => setWorkEmail(event.target.value)}
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>

            <label>
              Industry
              <select
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
              >
                <option value="" disabled>
                  Select industry
                </option>
                <option>Food & Beverage</option>
                <option>Travel & Tourism</option>
                <option>Beauty / Wellness</option>
                <option>Fashion / Lifestyle</option>
                <option>Entertainment / Music</option>
                <option>Education</option>
                <option>Nonprofit / Social Impact</option>
                <option>Technology</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Campaign goal
              <select
                value={campaignGoal}
                onChange={(event) => setCampaignGoal(event.target.value)}
              >
                <option value="" disabled>
                  What are you looking for?
                </option>
                <option>Find creators for a campaign</option>
                <option>Promote a product or launch</option>
                <option>Invite creators to an event</option>
                <option>Build long-term partnerships</option>
                <option>Explore brand opportunities</option>
              </select>
            </label>

            <button type="submit" className="brandPrimary" disabled={loading}>
              {loading ? "Creating Brand Account..." : "Create Brand Account"}
            </button>

            {message && <p className="brandMessage">{message}</p>}

            {lastSignupEmail && (
              <button
                type="button"
                className="resendButton"
                onClick={handleResendVerification}
                disabled={loading}
              >
                Resend verification email
              </button>
            )}

            <p className="terms">
              By continuing, you agree to Impact Creator Hub’s{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>

            <p className="creatorLink">
              Are you a creator?{" "}
              <a href="/signup">Create a creator profile</a>
            </p>

            <p className="creatorLink">
              Already have a brand account?{" "}
              <a href="/login?redirect=/create-brand">Log in</a>
            </p>

            <p className="creatorLink smallHomeLink">
              <a href="/">Home</a>
            </p>
          </form>
        </div>
      </section>

      <style jsx>{`
        .brandPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: #ffffff;
          background-image: url("/impact-creator-signup-collage.jpg");
          background-size: cover;
          background-position: center;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(4, 22, 32, 0.86) 0%,
              rgba(4, 22, 32, 0.64) 48%,
              rgba(4, 22, 32, 0.38) 100%
            ),
            rgba(0, 0, 0, 0.25);
          z-index: 0;
        }

        .brandContent {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 440px;
          align-items: center;
          gap: 70px;
          padding: 56px 8vw;
        }

        .brandText {
          max-width: 760px;
        }

        .eyebrow {
          margin: 0 0 18px;
          color: #00d2df;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.2em;
        }

        .brandText h1 {
          margin: 0;
          font-size: clamp(52px, 6.5vw, 96px);
          line-height: 0.96;
          letter-spacing: -0.06em;
          font-weight: 900;
          color: #ffffff;
          text-shadow: 0 14px 30px rgba(0, 0, 0, 0.34);
        }

        .brandSubtitle {
          max-width: 650px;
          margin: 28px 0 0;
          font-size: 23px;
          line-height: 1.45;
          font-weight: 700;
          color: #fff4ef;
        }

        .brandBenefits {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 34px;
        }

        .brandBenefits div {
          background: rgba(255, 255, 255, 0.11);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 18px;
          backdrop-filter: blur(10px);
        }

        .brandBenefits strong {
          display: block;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .brandBenefits span {
          display: block;
          font-size: 13px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.78);
        }

        .brandCard {
          background: #ffffff;
          color: #111827;
          border-radius: 30px;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 30px 38px 28px;
        }

        .cardLogo {
          display: block;
          width: 44px;
          height: auto;
          margin: 0 auto 18px;
        }

        .cardLabel {
          display: inline-flex;
          margin: 0 0 12px;
          padding: 8px 13px;
          border-radius: 999px;
          background: #fff4ef;
          color: #ff6b61;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .brandCard h2 {
          margin: 0;
          color: #0b1b2b;
          font-size: 31px;
          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .cardSubhead {
          margin: 10px 0 22px;
          font-size: 15px;
          line-height: 1.45;
          color: #4b5563;
        }

        label {
          display: block;
          margin-bottom: 13px;
          font-size: 13px;
          font-weight: 800;
          color: #1f2937;
        }

        input,
        select {
          width: 100%;
          height: 48px;
          margin-top: 7px;
          border-radius: 15px;
          border: 1px solid #cfd6dd;
          padding: 0 16px;
          font-size: 15px;
          outline: none;
          background: #ffffff;
          color: #111827;
        }

        input:focus,
        select:focus {
          border-color: #00b8c8;
          box-shadow: 0 0 0 4px rgba(0, 184, 200, 0.16);
        }

        .brandPrimary {
          width: 100%;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 999px;
          background: #007684;
          color: #ffffff;
          font-size: 16px;
          font-weight: 900;
          margin-top: 8px;
          box-shadow: 0 14px 28px rgba(0, 118, 132, 0.26);
          cursor: pointer;
          text-decoration: none;
        }

        .brandPrimary:disabled {
          cursor: not-allowed;
          opacity: 0.72;
        }

        .brandMessage {
          margin: 16px 0 0;
          color: #007684;
          font-size: 13px;
          font-weight: 900;
          line-height: 1.45;
          text-align: center;
        }

        .resendButton {
          width: 100%;
          margin-top: 14px;
          border: 0;
          background: transparent;
          color: #007684;
          cursor: pointer;
          font: inherit;
          font-size: 14px;
          font-weight: 900;
          text-decoration: underline;
        }

        .resendButton:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .terms {
          margin: 16px auto 0;
          text-align: center;
          font-size: 11.5px;
          line-height: 1.45;
          color: #6b7280;
        }

        .terms a,
        .creatorLink a {
          color: #007684;
          font-weight: 900;
          text-decoration: underline;
        }

        .creatorLink {
          margin: 15px 0 0;
          text-align: center;
          color: #374151;
          font-size: 13px;
        }

        .smallHomeLink {
          margin-top: 10px;
          font-size: 12px;
        }

        @media (max-width: 1000px) {
          .brandContent {
            grid-template-columns: 1fr;
            padding: 48px 22px;
            gap: 38px;
          }

          .brandText {
            text-align: center;
            margin: 0 auto;
          }

          .brandBenefits {
            grid-template-columns: 1fr;
          }

          .brandCard {
            max-width: 500px;
            width: 100%;
            margin: 0 auto;
          }
        }

        @media (max-width: 600px) {
          .brandText h1 {
            font-size: 44px;
          }

          .brandSubtitle {
            font-size: 18px;
          }

          .brandCard {
            padding: 28px 22px;
          }
        }
      `}</style>
    </main>
  );
}