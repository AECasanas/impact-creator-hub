import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { signUpCreator } from "./actions";

const signupInputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid rgba(15, 23, 42, 0.25)",
  borderRadius: "12px",
  background: "#ffffff",
  color: "#0f172a",
  WebkitTextFillColor: "#0f172a",
  caretColor: "#0f172a",
  colorScheme: "light",
  padding: "14px"
};

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
        <h1 className="page-title">Create your account</h1>
        <p className="lede">
          Sign up to save your profile choices, links, photos, and public creator page.
        </p>
      </section>

      <form action={signUpCreator} className="card stack signup-form">
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="full_name">Full name</label>
            <input
              id="full_name"
              name="full_name"
              required
              placeholder="Avery Impact"
              className="signup-input"
              style={signupInputStyle}
            />
          </div>
          <div className="field full">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              required
              type="email"
              placeholder="you@example.com"
              className="signup-input"
              style={signupInputStyle}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              required
              minLength={6}
              type="password"
              className="signup-input"
              style={signupInputStyle}
            />
          </div>
          <div className="field">
            <label htmlFor="confirm_password">Confirm password</label>
            <input
              id="confirm_password"
              name="confirm_password"
              required
              minLength={6}
              type="password"
              className="signup-input"
              style={signupInputStyle}
            />
          </div>
        </div>
        <div className="actions">
          <button className="button" type="submit">
            Create account
          </button>
          <Link className="secondary-button" href="/login">
            Log in
          </Link>
        </div>
      </form>
    </main>
  );
}
