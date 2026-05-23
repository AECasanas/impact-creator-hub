"use client";

const designChoices = [
  {
    title: "Light Profile",
    label: "Bright editorial",
    description:
      "A clean white, blush, and coral profile like Maya Rivera's example page.",
    theme: "light",
  },
  {
    title: "Dark Profile",
    label: "High-impact night mode",
    description:
      "A premium dark creator profile with cyan glow accents and high contrast.",
    theme: "dark",
  },
  {
    title: "Editorial Template",
    label: "Story-first layout",
    description:
      "A larger hero, postcard note, featured work, and an about section for lifestyle creators.",
    theme: "editorial",
  },
  {
    title: "Portfolio Template",
    label: "Work-first layout",
    description:
      "A compact profile that highlights stats, campaigns, services, and links first.",
    theme: "portfolio",
  },
];

const logoColors = [
  ["Electric Cyan", "#00e8f0"],
  ["Cobalt Blue", "#0877ff"],
  ["Royal Blue", "#1f4cff"],
  ["Teal Blue", "#13d2d8"],
  ["Vivid Red", "#ff0718"],
  ["Warm Orange", "#ff7a00"],
  ["Amber Orange", "#ff9a0a"],
  ["Emerald Green", "#00e95d"],
];

export default function FreeCreatorProfileSetupPage() {
  return (
    <main className="freeSetupPage">
      <section className="setupShell">
        <header className="nav">
          <a className="brand" href="/create-profile">
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

          <nav className="navLinks" aria-label="Free profile setup navigation">
            <a href="/create-profile">All Options</a>
            <a href="/creator-profile">Example Profile</a>
            <a className="navButton" href="/signup">
              Save My Choices
            </a>
          </nav>
        </header>

        <section className="hero">
          <p className="eyebrow">Free Creator Profile</p>
          <h1>Choose your starter profile design.</h1>
          <p>
            Start with the free version: pick a profile direction, choose a
            template, and select the logo color that best matches your creator
            brand.
          </p>
        </section>

        <section className="choiceSection" aria-labelledby="design-heading">
          <div className="sectionHeader">
            <p className="eyebrow">Step 1</p>
            <h2 id="design-heading">Choose one of four free profile starts</h2>
          </div>

          <div className="designGrid">
            {designChoices.map((choice) => (
              <article className={`designCard ${choice.theme}`} key={choice.title}>
                <div className="miniPreview">
                  <div className="miniNav"></div>
                  <div className="miniHero">
                    <span></span>
                    <div>
                      <strong></strong>
                      <p></p>
                      <p></p>
                    </div>
                  </div>
                  <div className="miniRows">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <p>{choice.label}</p>
                <h3>{choice.title}</h3>
                <span>{choice.description}</span>
                <button type="button">Choose {choice.title}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="choiceSection logoChoiceSection" aria-labelledby="logo-heading">
          <div className="sectionHeader">
            <p className="eyebrow">Step 2</p>
            <h2 id="logo-heading">Pick a color logo style</h2>
            <span>
              These are free starter logo color choices inspired by the neon
              Impact Creator mark.
            </span>
          </div>

          <div className="logoGrid">
            {logoColors.map(([name, color]) => (
              <button className="logoOption" style={{ "--logo-color": color }} type="button" key={name}>
                <span className="logoTile">
                  <span className="logoMark"></span>
                </span>
                <strong>{name}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="nextStepBanner">
          <div>
            <p>Free version selected</p>
            <span>
              Start with limited profile details, public links, featured work,
              and basic collaboration options.
            </span>
          </div>
          <a href="/creator-profile">Preview Free Profile</a>
        </section>
      </section>

      <style jsx>{`
        .freeSetupPage {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 16%, rgba(0, 232, 240, 0.18), transparent 28%),
            radial-gradient(circle at 86% 10%, rgba(242, 140, 130, 0.14), transparent 28%),
            linear-gradient(135deg, #05090b 0%, #08131a 48%, #05090b 100%);
          color: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 30px;
        }

        .setupShell {
          width: min(1220px, 100%);
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
          gap: 24px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.95rem;
          font-weight: 800;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .navButton {
          border-radius: 999px;
          background: #00e8f0;
          color: #020617;
          padding: 13px 22px;
          box-shadow: 0 0 28px rgba(0, 232, 240, 0.25);
        }

        .hero {
          max-width: 920px;
          padding: clamp(54px, 8vw, 92px) 0 32px;
        }

        .eyebrow {
          margin: 0;
          color: #00e8f0;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.055em;
          line-height: 1;
        }

        h1 {
          margin-top: 18px;
          font-size: clamp(3.2rem, 8vw, 7rem);
        }

        .hero p:not(.eyebrow) {
          max-width: 770px;
          margin: 26px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: clamp(1.05rem, 2vw, 1.25rem);
          line-height: 1.8;
        }

        .choiceSection {
          margin-top: 24px;
          padding: clamp(24px, 4vw, 34px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(18px);
        }

        .sectionHeader {
          display: grid;
          gap: 10px;
          margin-bottom: 24px;
        }

        .sectionHeader h2 {
          font-size: clamp(2rem, 4vw, 3.5rem);
        }

        .sectionHeader span {
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.7;
        }

        .designGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .designCard {
          min-height: 430px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 26px;
          background: rgba(255, 255, 255, 0.08);
        }

        .designCard.light {
          color: #10172f;
          background: #fff7f4;
        }

        .designCard.dark {
          background: #070b12;
          box-shadow: inset 0 0 0 1px rgba(0, 232, 240, 0.18);
        }

        .designCard.editorial {
          color: #10243f;
          background: linear-gradient(135deg, #fffaf5, #f7efe5);
        }

        .designCard.portfolio {
          background: linear-gradient(135deg, #0d2430, #071014);
        }

        .miniPreview {
          min-height: 170px;
          border-radius: 18px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.86);
        }

        .dark .miniPreview,
        .portfolio .miniPreview {
          background: rgba(0, 0, 0, 0.34);
        }

        .miniNav,
        .miniRows span,
        .miniHero p,
        .miniHero strong {
          display: block;
          border-radius: 999px;
          background: rgba(16, 23, 47, 0.16);
        }

        .dark .miniNav,
        .dark .miniRows span,
        .dark .miniHero p,
        .dark .miniHero strong,
        .portfolio .miniNav,
        .portfolio .miniRows span,
        .portfolio .miniHero p,
        .portfolio .miniHero strong {
          background: rgba(255, 255, 255, 0.18);
        }

        .miniNav {
          width: 64%;
          height: 8px;
          margin-bottom: 18px;
        }

        .miniHero {
          display: grid;
          grid-template-columns: 54px 1fr;
          gap: 12px;
          align-items: center;
        }

        .miniHero > span {
          width: 54px;
          height: 54px;
          border: 5px solid #ffffff;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffb8aa, #ff6a61);
        }

        .miniHero strong {
          width: 70%;
          height: 14px;
        }

        .miniHero p {
          width: 88%;
          height: 8px;
          margin: 9px 0 0;
        }

        .miniRows {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 20px;
        }

        .miniRows span {
          height: 34px;
        }

        .designCard > p {
          margin: 0;
          color: #f28c82;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .designCard h3 {
          font-size: 1.7rem;
        }

        .designCard > span {
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.6;
        }

        .light > span,
        .editorial > span {
          color: #5f6879;
        }

        .designCard button {
          min-height: 46px;
          margin-top: auto;
          border: 0;
          border-radius: 14px;
          background: #00e8f0;
          color: #020617;
          cursor: pointer;
          font: inherit;
          font-weight: 900;
        }

        .logoChoiceSection {
          background: rgba(0, 0, 0, 0.28);
        }

        .logoGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .logoOption {
          display: grid;
          gap: 14px;
          justify-items: center;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--logo-color);
          cursor: pointer;
          font: inherit;
          font-weight: 900;
          padding: 20px;
        }

        .logoTile {
          width: 142px;
          height: 112px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: #020202;
          box-shadow: inset 0 0 28px rgba(255, 255, 255, 0.03);
        }

        .logoMark,
        .logoMark::before,
        .logoMark::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          border-style: solid;
          border-color: var(--logo-color);
          border-right-color: transparent;
          filter: drop-shadow(0 0 9px var(--logo-color));
        }

        .logoMark {
          position: relative;
          width: 78px;
          height: 78px;
          border-width: 10px;
        }

        .logoMark::before {
          inset: 16px;
          border-width: 8px;
        }

        .logoMark::after {
          inset: 35px;
          border-width: 8px;
          border-right-color: var(--logo-color);
        }

        .nextStepBanner {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: 28px 34px;
          border-radius: 28px;
          background: #fff0ed;
          color: #10172f;
        }

        .nextStepBanner p {
          margin: 0 0 6px;
          font-weight: 900;
        }

        .nextStepBanner span {
          color: #596273;
        }

        .nextStepBanner a {
          flex: 0 0 auto;
          border: 1px solid #ff6a61;
          border-radius: 999px;
          color: #ff6a61;
          padding: 14px 26px;
          font-weight: 900;
        }

        @media (max-width: 1060px) {
          .designGrid,
          .logoGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 720px) {
          .freeSetupPage {
            padding: 18px;
          }

          .nav,
          .nextStepBanner {
            align-items: flex-start;
            flex-direction: column;
          }

          .navLinks {
            flex-wrap: wrap;
            gap: 16px;
          }

          .designGrid,
          .logoGrid {
            grid-template-columns: 1fr;
          }

          .brandLogo {
            width: 50px;
            height: 50px;
          }

          .brand p {
            letter-spacing: 0.17em;
          }
        }
      `}</style>
    </main>
  );
}
