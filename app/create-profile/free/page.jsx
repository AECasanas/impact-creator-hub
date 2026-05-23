"use client";

import { useState } from "react";

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
      "A larger hero, featured work, creator story, and an about section for lifestyle creators.",
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
  {
    name: "Electric Cyan",
    color: "#00e8f0",
    image: "/logo-colors/impact-logo-electric-cyan.png",
  },
  {
    name: "Cobalt Blue",
    color: "#1677ff",
    image: "/logo-colors/impact-logo-cobalt-blue.png",
  },
  {
    name: "Royal Blue",
    color: "#144cff",
    image: "/logo-colors/impact-logo-royal-blue.png",
  },
  {
    name: "Teal Blue",
    color: "#13cfd2",
    image: "/logo-colors/impact-logo-teal-blue.png",
  },
  {
    name: "Orange",
    color: "#ff6a00",
    image: "/logo-colors/impact-logo-orange.png",
  },
  {
    name: "Gray",
    color: "#9a9a9a",
    image: "/logo-colors/impact-logo-gray.png",
  },
  {
    name: "Red",
    color: "#e00016",
    image: "/logo-colors/impact-logo-red.png",
  },
  {
    name: "White",
    color: "#ffffff",
    image: "/logo-colors/impact-logo-white.png",
  },
  {
    name: "Purple",
    color: "#8a3ffc",
    image: "/logo-colors/impact-logo-purple.png",
  },
  {
    name: "Pink",
    color: "#ff2f95",
    image: "/logo-colors/impact-logo-pink.png",
  },
  {
    name: "Emerald Green",
    color: "#00e95d",
    image: "/logo-colors/impact-logo-emerald-green.png",
    fallbacks: [
      "/logo-colors/impact-logo-emeraldgreen.png",
      "/logo-colors/impact-logo-green.png",
    ],
  },
  {
    name: "Yellow",
    color: "#ffd91f",
    image: "/logo-colors/impact-logo-yellow.png",
    fallbacks: [
      "/logo-colors/impact-logo-gold.png",
      "/logo-colors/impact-logo-golden-yellow.png",
      "/logo-colors/impact-logo-gold-yellow.png",
    ],
  },
];

const photoPlacements = [
  {
    label: "Top Left",
    value: "topLeft",
  },
  {
    label: "Middle",
    value: "middle",
  },
  {
    label: "Top Right",
    value: "topRight",
  },
];

export default function FreeCreatorProfileSetupPage() {
  const [selectedDesign, setSelectedDesign] = useState(designChoices[0].title);
  const [selectedLogoColor, setSelectedLogoColor] = useState(logoColors[0].name);
  const [photoPlacement, setPhotoPlacement] = useState(photoPlacements[1].value);
  const [photoPreview, setPhotoPreview] = useState("");
  const selectedLogo =
    logoColors.find((logo) => logo.name === selectedLogoColor) ?? logoColors[0];

  function handleLogoImageError(event, logo) {
    const fallbackIndex = Number(event.currentTarget.dataset.fallbackIndex ?? 0);
    const fallback = logo.fallbacks?.[fallbackIndex];

    if (!fallback) {
      return;
    }

    event.currentTarget.dataset.fallbackIndex = String(fallbackIndex + 1);
    event.currentTarget.src = fallback;
  }

  function handlePhotoUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
  }

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
              <article
                className={`designCard ${choice.theme} ${
                  selectedDesign === choice.title ? "selected" : ""
                }`}
                key={choice.title}
              >
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
                <button
                  type="button"
                  aria-pressed={selectedDesign === choice.title}
                  onClick={() => setSelectedDesign(choice.title)}
                >
                  {selectedDesign === choice.title ? "Selected" : `Choose ${choice.title}`}
                </button>
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
            {logoColors.map((logo) => (
              <button
                className={`logoOption ${selectedLogoColor === logo.name ? "selected" : ""}`}
                style={{ "--logo-color": logo.color }}
                type="button"
                aria-pressed={selectedLogoColor === logo.name}
                onClick={() => setSelectedLogoColor(logo.name)}
                key={logo.name}
              >
                <span className="logoTile">
                  <img
                    className="logoImage"
                    src={logo.image}
                    alt={`${logo.name} Impact logo`}
                    onError={(event) => handleLogoImageError(event, logo)}
                  />
                </span>
                <strong>{logo.name}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="choiceSection photoChoiceSection" aria-labelledby="photo-heading">
          <div className="sectionHeader">
            <p className="eyebrow">Step 3</p>
            <h2 id="photo-heading">Upload your profile photo</h2>
            <span>
              Your free profile uses a circular creator photo over the banner.
              Choose whether it sits top left, centered, or top right.
            </span>
          </div>

          <div className="photoBuilder">
            <div className={`bannerPreview ${photoPlacement}`}>
              <div className="bannerGlow"></div>
              <div className="photoCircle">
                {photoPreview ? (
                  <img src={photoPreview} alt="Creator profile preview" />
                ) : (
                  <span>Upload Photo</span>
                )}
              </div>
              <div className="bannerText">
                <strong>Your Name</strong>
                <span>Food. Travel. Lifestyle.</span>
              </div>
            </div>

            <div className="photoControls">
              <label className="uploadBox">
                <span>Choose image</span>
                <strong>PNG or JPG, square photo recommended</strong>
                <input type="file" accept="image/png,image/jpeg" onChange={handlePhotoUpload} />
              </label>

              <div className="placementOptions" aria-label="Photo placement options">
                {photoPlacements.map((placement) => (
                  <button
                    className={photoPlacement === placement.value ? "selected" : ""}
                    type="button"
                    aria-pressed={photoPlacement === placement.value}
                    onClick={() => setPhotoPlacement(placement.value)}
                    key={placement.value}
                  >
                    {placement.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="choiceSummary" aria-label="Selected free profile choices">
          <div>
            <p className="eyebrow">Your free profile draft</p>
            <h2>{selectedDesign}</h2>
            <span>
              Logo color: <strong>{selectedLogoColor}</strong>
            </span>
            <span>
              Photo placement:{" "}
              <strong>
                {photoPlacements.find((placement) => placement.value === photoPlacement)?.label}
              </strong>
            </span>
          </div>
          <div className="summaryLogo" style={{ "--logo-color": selectedLogo.color }}>
            <img
              src={selectedLogo.image}
              alt={`${selectedLogo.name} Impact logo preview`}
              onError={(event) => handleLogoImageError(event, selectedLogo)}
            />
          </div>
        </section>

        <section className="nextStepBanner">
          <div>
            <p>Free version selected</p>
            <span>
              Start with limited profile details, public links, featured work,
              and basic collaboration options. The creator postcard is reserved
              for a premium profile upgrade.
            </span>
          </div>
          <div className="bannerActions">
            <a href="/creator-profile">Preview Free Profile</a>
            <a href="/signup">Save Choices</a>
          </div>
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
          padding: clamp(18px, 3vw, 26px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
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
          gap: 12px;
        }

        .designCard {
          min-height: 315px;
          display: flex;
          flex-direction: column;
          gap: 11px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            transform 160ms ease;
        }

        .designCard.selected {
          border-color: #00e8f0;
          box-shadow:
            0 0 0 2px rgba(0, 232, 240, 0.18),
            0 24px 60px rgba(0, 232, 240, 0.14);
          transform: translateY(-3px);
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
          min-height: 112px;
          border-radius: 14px;
          padding: 10px;
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
          height: 6px;
          margin-bottom: 12px;
        }

        .miniHero {
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 9px;
          align-items: center;
        }

        .miniHero > span {
          width: 38px;
          height: 38px;
          border: 4px solid #ffffff;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffb8aa, #ff6a61);
        }

        .miniHero strong {
          width: 70%;
          height: 10px;
        }

        .miniHero p {
          width: 88%;
          height: 6px;
          margin: 7px 0 0;
        }

        .miniRows {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 14px;
        }

        .miniRows span {
          height: 22px;
        }

        .designCard > p {
          margin: 0;
          color: #f28c82;
          font-size: 0.66rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .designCard h3 {
          font-size: 1.35rem;
        }

        .designCard > span {
          color: rgba(255, 255, 255, 0.68);
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .light > span,
        .editorial > span {
          color: #5f6879;
        }

        .designCard button {
          min-height: 40px;
          margin-top: auto;
          border: 0;
          border-radius: 12px;
          background: #00e8f0;
          color: #020617;
          cursor: pointer;
          font: inherit;
          font-size: 0.88rem;
          font-weight: 900;
        }

        .designCard.selected button {
          background: #10172f;
          color: #ffffff;
        }

        .logoChoiceSection {
          background: rgba(0, 0, 0, 0.28);
        }

        .photoChoiceSection {
          background:
            radial-gradient(circle at 18% 16%, rgba(0, 232, 240, 0.12), transparent 28%),
            rgba(255, 255, 255, 0.06);
        }

        .logoGrid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }

        .logoOption {
          display: grid;
          gap: 8px;
          justify-items: center;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--logo-color);
          cursor: pointer;
          font: inherit;
          font-size: 0.82rem;
          font-weight: 900;
          padding: 10px;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            transform 160ms ease;
        }

        .logoOption.selected {
          border-color: var(--logo-color);
          box-shadow:
            0 0 0 2px color-mix(in srgb, var(--logo-color) 28%, transparent),
            0 0 28px color-mix(in srgb, var(--logo-color) 34%, transparent);
          transform: translateY(-3px);
        }

        .logoTile {
          width: 82px;
          height: 70px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #020202;
          box-shadow: inset 0 0 28px rgba(255, 255, 255, 0.03);
          overflow: hidden;
        }

        .logoImage {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .choiceSummary {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: 28px 34px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.94);
          color: #10172f;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
        }

        .choiceSummary .eyebrow {
          color: #007585;
        }

        .choiceSummary h2 {
          margin: 10px 0;
          color: #10172f;
          font-size: clamp(2rem, 4vw, 3rem);
        }

        .choiceSummary span {
          color: #596273;
        }

        .choiceSummary strong {
          color: #10172f;
        }

        .summaryLogo {
          --logo-color: #00e8f0;
          width: 88px;
          height: 88px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: #020202;
          box-shadow: 0 0 28px color-mix(in srgb, var(--logo-color) 22%, transparent);
          overflow: hidden;
        }

        .summaryLogo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .photoBuilder {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
          gap: 18px;
          align-items: stretch;
        }

        .bannerPreview {
          min-height: 250px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(255, 246, 242, 0.96), rgba(255, 218, 207, 0.9)),
            #fff0ed;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.26);
        }

        .bannerGlow {
          position: absolute;
          inset: auto -80px -100px auto;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: rgba(0, 232, 240, 0.16);
          filter: blur(8px);
        }

        .photoCircle {
          position: absolute;
          top: 28px;
          width: 132px;
          height: 132px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 7px solid #ffffff;
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(0, 232, 240, 0.22), transparent 30%),
            #10172f;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.78rem;
          font-weight: 900;
          text-align: center;
          box-shadow: 0 18px 38px rgba(16, 23, 47, 0.2);
        }

        .photoCircle img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .bannerPreview.topLeft .photoCircle {
          left: 34px;
        }

        .bannerPreview.middle .photoCircle {
          left: 50%;
          transform: translateX(-50%);
        }

        .bannerPreview.topRight .photoCircle {
          right: 34px;
        }

        .bannerText {
          position: absolute;
          left: 34px;
          right: 34px;
          bottom: 26px;
          display: grid;
          gap: 6px;
          color: #10172f;
        }

        .bannerText strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          letter-spacing: -0.05em;
        }

        .bannerText span {
          color: #ff6a61;
          font-weight: 900;
        }

        .photoControls {
          display: grid;
          gap: 14px;
        }

        .uploadBox {
          min-height: 150px;
          display: grid;
          align-content: center;
          gap: 8px;
          border: 1px dashed rgba(0, 232, 240, 0.52);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.07);
          color: #ffffff;
          cursor: pointer;
          padding: 20px;
        }

        .uploadBox span {
          font-size: 1.2rem;
          font-weight: 900;
        }

        .uploadBox strong {
          color: rgba(255, 255, 255, 0.64);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .uploadBox input {
          width: 1px;
          height: 1px;
          overflow: hidden;
          opacity: 0;
          position: absolute;
          pointer-events: none;
        }

        .placementOptions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .placementOptions button {
          min-height: 46px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.78);
          cursor: pointer;
          font: inherit;
          font-size: 0.85rem;
          font-weight: 900;
        }

        .placementOptions button.selected {
          border-color: #00e8f0;
          background: #00e8f0;
          color: #020617;
          box-shadow: 0 0 24px rgba(0, 232, 240, 0.22);
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

        .bannerActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bannerActions a:last-child {
          background: #ff6a61;
          color: #ffffff;
        }

        @media (max-width: 1060px) {
          .designGrid,
          .logoGrid,
          .photoBuilder {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 720px) {
          .freeSetupPage {
            padding: 18px;
          }

          .nav,
          .choiceSummary,
          .nextStepBanner {
            align-items: flex-start;
            flex-direction: column;
          }

          .navLinks {
            flex-wrap: wrap;
            gap: 16px;
          }

          .designGrid,
          .logoGrid,
          .photoBuilder,
          .placementOptions {
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
