"use client";

export default function LoginPage() {
  return (
    <main className="loginPage">
      <section className="loginShell">
        <a className="brand" href="/">
          <img
            src="/logo-ripple.png"
            alt="Impact Creator Hub logo"
            className="brandLogo"
          />
          <div>
            <strong>Impact Creator Hub</strong>
            <p>
              <span>Build your brand. </span>
              <span>Grow your impact.</span>
            </p>
          </div>
        </a>

        <div className="loginGrid">
          <section className="introPanel" aria-label="Sign in benefits">
            <p className="eyebrow">Creator Dashboard</p>
            <h1>Welcome back to your creator command center.</h1>
            <p className="introText">
              Sign in to update your profile, review brand inquiries, and keep
              your Impact Kit ready for the next collaboration.
            </p>

            <div className="benefitList">
              <div>
                <span>01</span>
                <strong>Manage your profile</strong>
                <p>Refresh your bio, platforms, featured work, and links.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Track brand interest</strong>
                <p>Keep collaboration requests and follow-ups in one place.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Share with confidence</strong>
                <p>Use one polished hub for brands, agencies, and partners.</p>
              </div>
            </div>
          </section>

          <section className="formCard" aria-label="Sign in form">
            <div className="formHeader">
              <p className="eyebrow">Sign In</p>
              <h2>Access your account</h2>
              <p>Use your email and password to continue.</p>
            </div>

            <form>
              <label>
                <span>Email address</span>
                <input type="email" placeholder="maya@example.com" />
              </label>

              <label>
                <span>Password</span>
                <input type="password" placeholder="Enter your password" />
              </label>

              <div className="formMeta">
                <label className="rememberMe">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#">Forgot password?</a>
              </div>

              <button className="submitBtn" type="submit">
                Sign In
              </button>
            </form>

            <div className="divider">
              <span></span>
              <p>or continue with</p>
              <span></span>
            </div>

            <div className="socialButtons">
              <button type="button">Google</button>
              <button type="button">Instagram</button>
            </div>

            <p className="signupPrompt">
              New to Impact Creator Hub? <a href="/signup">Create an account</a>
            </p>
          </section>
        </div>
      </section>

      <style jsx>{`
        .loginPage {
          min-height: 100vh;
          background:
            radial-gradient(circle at 16% 18%, rgba(103, 232, 249, 0.18), transparent 28%),
            radial-gradient(circle at 88% 14%, rgba(242, 140, 130, 0.16), transparent 26%),
            linear-gradient(135deg, #05090b 0%, #08131a 48%, #05090b 100%);
          color: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 32px;
        }

        .loginShell {
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
          font-size: 1.38rem;
          letter-spacing: -0.03em;
        }

        .brand p {
          margin: 4px 0 0;
          color: #f28c82;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.32em;
          text-transform: uppercase;
        }

        .brand p span:first-child {
          color: rgba(255, 255, 255, 0.68);
        }

        .loginGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.75fr);
          gap: 28px;
          align-items: stretch;
        }

        .introPanel,
        .formCard {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 34px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
        }

        .introPanel {
          min-height: 650px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(34px, 5vw, 58px);
          background:
            linear-gradient(180deg, rgba(5, 9, 11, 0.12), rgba(5, 9, 11, 0.84)),
            radial-gradient(circle at 78% 18%, rgba(103, 232, 249, 0.18), transparent 26%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
          overflow: hidden;
          position: relative;
        }

        .introPanel::before {
          content: "";
          position: absolute;
          inset: 34px 34px auto auto;
          width: 170px;
          height: 170px;
          border: 28px solid rgba(103, 232, 249, 0.38);
          border-right-color: transparent;
          border-radius: 50%;
        }

        .eyebrow {
          margin: 0;
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
          margin-top: 18px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(3rem, 7vw, 6.4rem);
        }

        .introText {
          max-width: 640px;
          margin: 26px 0 34px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 1.08rem;
          line-height: 1.8;
        }

        .benefitList {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .benefitList div {
          min-height: 158px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(16px);
        }

        .benefitList span {
          color: #f28c82;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .benefitList strong {
          display: block;
          margin: 12px 0 8px;
        }

        .benefitList p {
          margin: 0;
          color: rgba(255, 255, 255, 0.64);
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .formCard {
          padding: clamp(28px, 4vw, 44px);
          background: rgba(255, 255, 255, 0.96);
          color: #10172f;
        }

        .formHeader {
          margin-bottom: 28px;
        }

        .formHeader h2 {
          margin-top: 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.3rem, 5vw, 3.6rem);
        }

        .formHeader p:not(.eyebrow) {
          margin: 14px 0 0;
          color: #5b6474;
          line-height: 1.6;
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
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        input:focus {
          border-color: #17c9d5;
          box-shadow: 0 0 0 4px rgba(23, 201, 213, 0.14);
        }

        .formMeta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          color: #596273;
          font-size: 0.9rem;
        }

        .rememberMe {
          display: flex;
          grid-template-columns: none;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }

        .rememberMe input {
          width: 16px;
          height: 16px;
          accent-color: #0891a1;
        }

        a {
          color: inherit;
        }

        .formMeta a,
        .signupPrompt a {
          color: #007585;
          font-weight: 900;
          text-decoration: none;
        }

        .submitBtn {
          height: 56px;
          border: 0;
          border-radius: 16px;
          background: #67e8f9;
          color: #020617;
          cursor: pointer;
          font: inherit;
          font-weight: 900;
          box-shadow: 0 14px 28px rgba(103, 232, 249, 0.28);
          transition:
            transform 160ms ease,
            background 160ms ease;
        }

        .submitBtn:hover {
          background: #a5f3fc;
          transform: translateY(-1px);
        }

        .divider {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 12px;
          align-items: center;
          margin: 26px 0 18px;
          color: #798294;
          font-size: 0.82rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .divider span {
          height: 1px;
          background: #e5e8ef;
        }

        .divider p {
          margin: 0;
        }

        .socialButtons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .socialButtons button {
          height: 48px;
          border: 1px solid #dfe3eb;
          border-radius: 14px;
          background: #ffffff;
          color: #10172f;
          cursor: pointer;
          font: inherit;
          font-weight: 900;
        }

        .signupPrompt {
          margin: 24px 0 0;
          color: #596273;
          text-align: center;
        }

        @media (max-width: 980px) {
          .loginGrid {
            grid-template-columns: 1fr;
          }

          .introPanel {
            min-height: auto;
          }

          .benefitList {
            grid-template-columns: 1fr;
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
            letter-spacing: 0.18em;
          }

          .formMeta,
          .socialButtons {
            grid-template-columns: 1fr;
          }

          .formMeta {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
