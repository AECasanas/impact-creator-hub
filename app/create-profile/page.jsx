"use client";

const profileOptions = [
  {
    label: "Best for getting started",
    title: "Create a Free Creator Profile",
    description:
      "Launch a polished public profile with your bio, platforms, featured work, and ways for brands to connect.",
    href: "/creator-profile",
    cta: "View Free Profile",
  },
  {
    label: "For brand outreach",
    title: "Build an Impact Kit",
    description:
      "Organize your audience stats, past collaborations, rates, and partnership details into a brand-ready kit.",
    href: "/signup",
    cta: "Start Impact Kit",
  },
  {
    label: "For growing creators",
    title: "Upgrade Your Profile",
    description:
      "Unlock deeper insights, more collaboration details, premium layout sections, and advanced brand tools.",
    href: "/signup",
    cta: "Explore Upgrade",
  },
];

const steps = [
  "Choose the profile type that fits your current creator goals.",
  "Add your story, platforms, featured work, and collaboration preferences.",
  "Share one polished link with brands, agencies, and partners.",
];

export default function CreateProfilePage() {
  return (
    <main className="startPage">
      <section className="pageShell">
        <header className="nav">
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

          <nav className="navLinks" aria-label="Creator start navigation">
            <a href="/creator-profile">Example Profile</a>
            <a href="/login">Log In</a>
            <a className="navButton" href="/signup">
              Join the Hub
            </a>
          </nav>
        </header>

        <section className="hero">
          <p className="eyebrow">Creator Onboarding</p>
          <h1>Let&apos;s build your creator presence.</h1>
          <p className="heroText">
            Choose how you want to start. You can preview a free creator
            profile, build a more complete Impact Kit, or explore profile
            upgrades designed for brand collaborations.
          </p>
        </section>

        <section className="optionGrid" aria-label="Creator profile options">
          {profileOptions.map((option) => (
            <article className="optionCard" key={option.title}>
              <p>{option.label}</p>
              <h2>{option.title}</h2>
              <span>{option.description}</span>
              <a href={option.href}>{option.cta}</a>
            </article>
          ))}
        </section>

        <section className="guideCard" aria-label="How it works">
          <div>
            <p className="eyebrow">How it works</p>
            <h2>Start simple, then grow your profile as your brand grows.</h2>
          </div>

          <div className="stepList">
            {steps.map((step, index) => (
              <div className="step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="previewBanner">
          <div>
            <p>Want to see what brands will view?</p>
            <span>
              Open Maya Rivera&apos;s sample creator profile before creating
              your own.
            </span>
          </div>
          <a href="/creator-profile">View Example Profile</a>
        </section>
      </section>

      <style jsx>{`
        .startPage {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 18%, rgba(103, 232, 249, 0.18), transparent 30%),
            radial-gradient(circle at 88% 12%, rgba(242, 140, 130, 0.17), transparent 26%),
            linear-gradient(135deg, #05090b 0%, #08131a 52%, #05090b 100%);
          color: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 30px;
        }

        .pageShell {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.11);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: #ffffff;
          text-decoration: none;
        }

        .brandLogo {
          width: 62px;
          height: 62px;
          object-fit: contain;
        }

        .brand strong {
          display: block;
          font-size: 1.3rem;
          letter-spacing: -0.03em;
        }

        .brand p {
          margin: 4px 0 0;
          color: #f28c82;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .brand p span:first-child {
          color: rgba(255, 255, 255, 0.66);
        }

        .navLinks {
          display: flex;
          align-items: center;
          gap: 28px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.95rem;
          font-weight: 800;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .navLinks a:hover {
          color: #ffffff;
        }

        .navButton {
          border-radius: 999px;
          background: #67e8f9;
          color: #020617;
          padding: 13px 22px;
          box-shadow: 0 0 26px rgba(103, 232, 249, 0.2);
        }

        .hero {
          max-width: 880px;
          padding: clamp(54px, 8vw, 96px) 0 38px;
        }

        .eyebrow {
          margin: 0;
          color: #67e8f9;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h1,
        h2 {
          margin: 0;
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.055em;
          line-height: 1;
        }

        h1 {
          margin-top: 18px;
          font-size: clamp(3.2rem, 8vw, 7rem);
        }

        .heroText {
          max-width: 760px;
          margin: 28px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: clamp(1.05rem, 2vw, 1.28rem);
          line-height: 1.8;
        }

        .optionGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .optionCard {
          min-height: 390px;
          display: flex;
          flex-direction: column;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 30px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.055)),
            rgba(255, 255, 255, 0.06);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(18px);
        }

        .optionCard:nth-child(1) {
          background:
            radial-gradient(circle at top right, rgba(103, 232, 249, 0.2), transparent 34%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.06));
        }

        .optionCard:nth-child(2) {
          background:
            radial-gradient(circle at top right, rgba(242, 140, 130, 0.18), transparent 34%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.055));
        }

        .optionCard p {
          margin: 0 0 24px;
          color: #f28c82;
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .optionCard h2 {
          font-size: clamp(2rem, 4vw, 3rem);
        }

        .optionCard span {
          display: block;
          margin: 22px 0 30px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        .optionCard a {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          border-radius: 16px;
          background: #67e8f9;
          color: #020617;
          font-weight: 900;
          transition:
            transform 160ms ease,
            background 160ms ease;
        }

        .optionCard a:hover {
          background: #a5f3fc;
          transform: translateY(-1px);
        }

        .guideCard,
        .previewBanner {
          margin-top: 22px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.94);
          color: #10172f;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
        }

        .guideCard {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 28px;
          padding: 34px;
        }

        .guideCard .eyebrow {
          color: #007585;
        }

        .guideCard h2 {
          margin-top: 12px;
          color: #10172f;
          font-size: clamp(2rem, 4vw, 3.4rem);
        }

        .stepList {
          display: grid;
          gap: 14px;
        }

        .step {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          align-items: center;
          padding: 18px;
          border: 1px solid #e5e8ef;
          border-radius: 20px;
          background: #ffffff;
        }

        .step span {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #fff0ed;
          color: #f28c82;
          font-weight: 900;
        }

        .step p {
          margin: 0;
          color: #455064;
          line-height: 1.6;
        }

        .previewBanner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: 28px 34px;
          background:
            radial-gradient(circle at 5% 50%, rgba(103, 232, 249, 0.18), transparent 25%),
            #fff0ed;
        }

        .previewBanner p {
          margin: 0 0 6px;
          color: #10172f;
          font-size: 1.1rem;
          font-weight: 900;
        }

        .previewBanner span {
          color: #596273;
        }

        .previewBanner a {
          flex: 0 0 auto;
          border: 1px solid #ff6a61;
          border-radius: 999px;
          color: #ff6a61;
          padding: 14px 26px;
          font-weight: 900;
        }

        @media (max-width: 920px) {
          .nav,
          .previewBanner {
            align-items: flex-start;
            flex-direction: column;
          }

          .navLinks {
            flex-wrap: wrap;
            gap: 16px;
          }

          .optionGrid,
          .guideCard {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .startPage {
            padding: 18px;
          }

          .brandLogo {
            width: 50px;
            height: 50px;
          }

          .brand strong {
            font-size: 1.04rem;
          }

          .brand p {
            letter-spacing: 0.17em;
          }

          .optionCard,
          .guideCard,
          .previewBanner {
            border-radius: 24px;
            padding: 24px;
          }
        }
      `}</style>
    </main>
  );
}
