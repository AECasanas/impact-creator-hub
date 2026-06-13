"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

async function handleSignup() {
  setLoading(true);
  setMessage("");

  const cleanFullName = fullName.trim();
  const cleanEmail = email.trim();

  if (!cleanFullName || !cleanEmail || !password) {
    setMessage("Please enter your name, email, and password.");
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
      data: {
        full_name: cleanFullName,
        account_type: "creator",
      },
    },
  });

  if (error) {
    setMessage(error.message);
    setLoading(false);
    return;
  }

  if (data?.user) {
    const { error: accountError } = await supabase.from("user_accounts").upsert(
      {
        user_id: data.user.id,
        account_type: "creator",
        active_profile_type: "creator",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (accountError) {
      setMessage(accountError.message);
      setLoading(false);
      return;
    }
  }

  if (data?.session) {
    setLoading(false);
    window.location.href = "/dashboard/profile";
    return;
  }

  setMessage(
    "Account created. Please check your email to confirm your signup. After confirming, log in to continue to your creator dashboard."
  );
  setLoading(false);
}
  return (
    <main className="signupPage">
      <div className="overlay"></div>
       <div className="redheadShade"></div>

 
      <section className="signupContent">
        <div className="headlineBlock">
          <h1>
            Create.
            <br />
            Connect.
            <br />
            Make an Impact.
          </h1>

          <p className="subtitle">
            Join a hub where creators, brands, and meaningful projects meet.
          </p>

          <p className="supporting">
            
          </p>
        </div>

        <div className="signupCard">
          <img
  src="/logo-white-background.png"
  alt="Impact Creator Hub logo"
  className="cardLogo"
/>
          <h2>Welcome to Impact Creator Hub</h2>
          <p className="cardSubhead">Create your account</p>

          <form>
            <label>
              Full name
              <input type="text" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
            </label>

            <label>
              Email
              <input type="email" placeholder="Email"value={email}
  onChange={(e) => setEmail(e.target.value)}/>
            </label>

            <label>
              Password
              <input type="password" placeholder="Create a password"
  value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>

  

           <button type="button"className="primarySignup"onClick={handleSignup}disabled={loading}>
    {loading ? "Creating Account..." : "Join as a Creator"}
 </button>

 {message && <p className="signupMessage">{message}</p>}

            <div className="divider">
              <span></span>
              OR
              <span></span>
            </div>

            <button type="button" className="googleBtn">
              <span>G</span>
              Continue with Google
            </button>

            <p className="terms">
              By continuing, you agree to Impact Creator Hub’s{" "}
              <a>Terms of Service</a> and <a>Privacy Policy</a>.
            </p>
<p className="loginText">
 Already a member? <a href="/login?redirect=/dashboard/profile">Log in</a>
</p>
           

          </form>

          <div className="brandStrip">
            <span>Creating a brand account?</span>
             <a href="/signup/brand" className="brandButton">
    Join as a Brand
  </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .signupPage {
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
              rgba(4, 22, 32, 0.78) 0%,
              rgba(4, 22, 32, 0.52) 45%,
              rgba(4, 22, 32, 0.28) 100%
            ),
            rgba(0, 0, 0, 0.18);
          z-index: 0;
        }
        .redheadShade {
  position: absolute;
  top: 24%;
  right: 0;
  width: 36%;
  height: 58%;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    rgba(4, 22, 32, 0.62) 0%,
    rgba(4, 22, 32, 0.46) 36%,
    rgba(4, 22, 32, 0.22) 68%,
    rgba(4, 22, 32, 0) 100%
  );
}

        .signupNav {
          position: relative;
          z-index: 2;
          height: 82px;
          padding: 0 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.96);
          color: #0b1b2b;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
        }

        .brandMark {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 4px solid #00b8c8;
          display: grid;
          place-items: center;
        }

        .brandMark span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 3px solid #00b8c8;
          display: block;
        }

        .navLinks {
          display: flex;
          gap: 34px;
          font-size: 15px;
          font-weight: 700;
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        button {
          font-family: inherit;
          cursor: pointer;
        }

        .loginBtn,
        .joinBtn {
          border-radius: 999px;
          padding: 13px 24px;
          font-weight: 800;
          font-size: 14px;
        }

        .loginBtn {
          background: #ffffff;
          border: 1px solid #ccd2d8;
          color: #0b1b2b;
        }

        .joinBtn {
          background: #007684;
          border: 1px solid #007684;
          color: white;
        }

        .signupContent {
           position: relative;
  z-index: 1;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(420px, 0.9fr) 400px;
  align-items: center;
  gap: 48px;
  padding: 36px 6vw;
        }

        .headlineBlock {
           max-width: 500px;
  transform: translateX(90px);;
        }

        .headlineBlock h1 {
          margin: 0;
  font-size: clamp(42px, 5.2vw, 72px);
  line-height: 0.95;
  letter-spacing: -0.06em;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
        }

        .subtitle {
            margin: 22px 0 0;
  max-width: 440px;
  font-size: 20px;
  line-height: 1.35;
  font-weight: 700;
  color: #fff4ef;
        }

        .supporting {
          margin-top: 14px;
          font-size: 17px;
          color: rgba(255, 255, 255, 0.88);
        }

 .signupCard {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  color: #111827;
  border-radius: 24px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.28);
  overflow: hidden;
  transform: translateX(-120px);
}
.cardLogo {
  display: block;
  width: 38px;
  height: auto;
  margin: 16px auto 6px;
}

        .signupCard h2 {
           margin: 0;
  padding: 16px 30px 2px;
  text-align: center;
  color: #0b1b2b;
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.03em;
        }

        .cardSubhead {
          margin: 0 0 14px;
  text-align: center;
  font-size: 15px;
  color: #4b5563;
        }

        form {
          padding: 0 42px 28px;
        }

        label {
          display: block;
          margin-bottom: 15px;
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
        }

        input,
        select {
          width: 100%;
          height: 52px;
          margin-top: 7px;
          border-radius: 15px;
          border: 1px solid #cfd6dd;
          padding: 0 16px;
          font-size: 16px;
          outline: none;
          background: #ffffff;
          color: #111827;
        }
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
  -webkit-text-fill-color: #111827;
  transition: background-color 9999s ease-in-out 0s;
}
        input:focus,
        select:focus {
          border-color: #00b8c8;
          box-shadow: 0 0 0 4px rgba(0, 184, 200, 0.16);
        }

        .primarySignup {
          width: 100%;
          height: 54px;
          border: none;
          border-radius: 999px;
          background: #ff6b61;
          color: #ffffff;
          font-size: 16px;
          font-weight: 900;
          margin-top: 6px;
          box-shadow: 0 12px 24px rgba(255, 107, 97, 0.28);
        }

.signupMessage {
  margin: 14px 0 0;
  text-align: center;
  color: #007684;
  font-size: 14px;
  font-weight: 800;
}
        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 18px 0;
          color: #6b7280;
          font-weight: 900;
          font-size: 13px;
        }

        .divider span {
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .googleBtn {
          width: 100%;
          height: 50px;
          border: 1px solid #d9dee4;
          background: #ffffff;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 800;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .googleBtn span {
          color: #00b8c8;
          font-weight: 900;
          font-size: 20px;
        }

        .terms {
          margin: 18px auto 0;
          max-width: 340px;
          text-align: center;
          font-size: 12px;
          line-height: 1.45;
          color: #6b7280;
        }

        .terms a,
        .loginText a {
          color: #007684;
          font-weight: 800;
          text-decoration: underline;
        }

        .loginText {
          margin: 16px 0 0;
          text-align: center;
          font-size: 14px;
          color: #374151;
        }

        .brandStrip {
          background: #fff4ef;
          padding: 22px 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: #0b1b2b;
          font-weight: 800;
        }

   .brandButton {
  border: 1px solid #ff6b61;
  color: #ff6b61;
  background: #ffffff;
  border-radius: 999px;
  padding: 18px 42px;
  min-width: 170px;
  min-height: 62px;
  font-weight: 900;
  font-size: 18px;
  line-height: 1.25;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

        @media (max-width: 980px) {
          .signupNav {
            padding: 0 22px;
          }

          .navLinks {
            display: none;
          }

          .signupContent {
            grid-template-columns: 1fr;
            padding: 48px 22px;
            gap: 38px;
          }

          .headlineBlock {
            text-align: left;
            margin: 0 auto;
            transform: translateX(90px)
          }

          .headlineBlock h1 {
            font-size: 58px;
          }

          .subtitle {
            font-size: 20px;
            margin-left: auto;
            margin-right: auto;
          }

          .signupCard {
            max-width: 480px;
            width: 100%;
            margin: 0 auto;
          }
        }

        @media (max-width: 600px) {
          .signupNav {
            height: auto;
            padding: 18px;
          }

          .brand strong {
            font-size: 16px;
          }

          .navActions {
            display: none;
          }

          .headlineBlock h1 {
            font-size: 46px;
          }

          .subtitle {
            font-size: 18px;
          }

          form,
          .signupCard h2,
          .brandStrip {
            padding-left: 24px;
            padding-right: 24px;
          }

          .signupCard h2 {
            font-size: 25px;
          }

          .brandStrip {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}