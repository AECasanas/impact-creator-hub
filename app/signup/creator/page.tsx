"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function CreatorSignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultRedirectTo = "/dashboard/profile";
  const redirectTo = searchParams.get("redirect") || defaultRedirectTo;

  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [message, setMessage] = useState("");
  const [lastSignupEmail, setLastSignupEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "22px",
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid rgba(15, 23, 42, 0.25)",
    borderRadius: "12px",
    fontSize: "16px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#ffffff",
    fontSize: "16px",
  };

  function getCreatorRedirectUrl() {
    return `${window.location.origin}${defaultRedirectTo}`;
  }

  async function upsertUserAccount(userId: string) {
    return supabase.from("user_accounts").upsert(
      {
        user_id: userId,
        account_type: "creator",
        active_profile_type: "creator",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );
  }

  async function routeAfterSignin(userId: string) {
    const { data: account, error: accountError } = await supabase
      .from("user_accounts")
      .select("account_type")
      .eq("user_id", userId)
      .maybeSingle();

    if (accountError) {
      setMessage(accountError.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);

    if (account?.account_type === "brand") {
      router.push("/dashboard/brand");
      return;
    }

    if (account?.account_type === "creator") {
      router.push(redirectTo || defaultRedirectTo);
      return;
    }

    router.push("/signup/creator");
  }

  async function handleResendVerification() {
    const cleanEmail = lastSignupEmail.trim();

    if (!cleanEmail) {
      setMessage("Enter your email and create an account first, then resend.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: cleanEmail,
      options: {
        emailRedirectTo: getCreatorRedirectUrl(),
      },
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Verification email resent. Please check your inbox and spam folder."
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirm_password") || "");

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "signup" && !fullName) {
      setMessage("Please enter your full name.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "signup" && password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getCreatorRedirectUrl(),
          data: {
            full_name: fullName,
            account_type: "creator",
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      setLastSignupEmail(email);

      if (data?.user) {
        const { error: accountError } = await upsertUserAccount(data.user.id);

        if (accountError) {
          setMessage(accountError.message);
          setIsSubmitting(false);
          return;
        }
      }

      if (data?.session) {
        setIsSubmitting(false);
        router.push(defaultRedirectTo);
        return;
      }

      setMessage(
        "Verification email sent. Please check your inbox and spam folder. After verifying, you will continue to your creator profile dashboard."
      );
      setMode("signin");
      setIsSubmitting(false);
      return;
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    const signedInUser = authData?.user;

    if (!signedInUser) {
      setMessage("Sign in succeeded, but no user was found.");
      setIsSubmitting(false);
      return;
    }

    await routeAfterSignin(signedInUser.id);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: "48px",
      }}
    >
      <section
        className="signupCard"
        style={{
          maxWidth: "460px",
          margin: "0 auto",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "24px",
          padding: "28px",
          background: "#000000",
        }}
      >
        <h1 style={{ fontSize: "40px", marginBottom: "16px" }}>
          {mode === "signup"
            ? "Create your creator account"
            : "Sign in to your creator account"}
        </h1>

        <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px" }}>
          {mode === "signup"
            ? "Sign up to access your creator dashboard, build your profile, and publish your public creator page."
            : "Sign in to continue building and saving your creator profile."}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label style={labelStyle}>Full name</label>
              <input
                style={inputStyle}
                name="full_name"
                placeholder="Your name"
                autoComplete="name"
              />
            </>
          )}

          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />

          <label style={labelStyle}>Password</label>
          <input
            style={inputStyle}
            name="password"
            type="password"
            placeholder={
              mode === "signup" ? "Create a password" : "Enter your password"
            }
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
          />

          {mode === "signup" && (
            <>
              <label style={labelStyle}>Confirm password</label>
              <input
                style={inputStyle}
                name="confirm_password"
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "14px",
              background: "#67e8f9",
              color: "black",
              fontWeight: "bold",
              borderRadius: "12px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "signup"
                ? "Create Creator Account"
                : "Sign In"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "18px",
              color: "#67e8f9",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.45,
            }}
          >
            {message}
          </p>
        )}

        {lastSignupEmail && (
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={isSubmitting}
            style={{
              width: "100%",
              marginTop: "16px",
              background: "transparent",
              border: "none",
              color: "#67e8f9",
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "15px",
              textDecoration: "underline",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            Resend verification email
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setMessage("");
            setMode(mode === "signup" ? "signin" : "signup");
          }}
          style={{
            width: "100%",
            marginTop: "22px",
            background: "transparent",
            border: "none",
            color: "#67e8f9",
            fontWeight: 800,
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          {mode === "signup"
            ? "Already have an account? Sign in"
            : "Need a creator account? Create one"}
        </button>

        <p
          style={{
            marginTop: "18px",
            textAlign: "center",
            color: "rgba(255,255,255,0.65)",
            fontSize: "14px",
          }}
        >
          Creating a brand account?{" "}
          <a
            href="/signup/brand"
            style={{
              color: "#67e8f9",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Join as a Brand
          </a>
        </p>
      </section>

      <style jsx>{`
        .signupCard input:-webkit-autofill,
        .signupCard input:-webkit-autofill:hover,
        .signupCard input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
          -webkit-text-fill-color: #0f172a;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </main>
  );
}

export default function CreatorSignupPage() {
  return (
    <Suspense fallback={<main style={{ padding: 40 }}>Loading...</main>}>
      <CreatorSignupContent />
    </Suspense>
  );
}