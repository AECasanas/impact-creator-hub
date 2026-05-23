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

const fontChoices = [
  {
    name: "Editorial Serif",
    value: "editorialSerif",
    description: "Classic, premium, magazine-style headings.",
    sample: "Maya Rivera",
  },
  {
    name: "Modern Sans",
    value: "modernSans",
    description: "Clean, simple, and easy to read for any niche.",
    sample: "Maya Rivera",
  },
  {
    name: "Friendly Script",
    value: "friendlyScript",
    description: "Warm, personal, and creator-led for lifestyle brands.",
    sample: "Maya Rivera",
  },
];

const regularFontColors = {
  light: [
    { name: "Black", value: "black", color: "#10172f" },
    { name: "Gray", value: "grayLight", color: "#596273" },
  ],
  dark: [
    { name: "White", value: "white", color: "#ffffff" },
    { name: "Gray", value: "grayDark", color: "#cbd5e1" },
  ],
};

const scriptFontColors = [
  { name: "Coral", value: "scriptCoral", color: "#ff6a61" },
  { name: "Electric Cyan", value: "scriptCyan", color: "#00e8f0" },
  { name: "Pink", value: "scriptPink", color: "#ff2f95" },
  { name: "Purple", value: "scriptPurple", color: "#8a3ffc" },
];

export default function FreeCreatorProfileSetupPage() {
  const [selectedDesign, setSelectedDesign] = useState(designChoices[0].title);
  const [selectedLogoColor, setSelectedLogoColor] = useState(logoColors[0].name);
  const [photoPlacement, setPhotoPlacement] = useState(photoPlacements[1].value);
  const [selectedFont, setSelectedFont] = useState(fontChoices[0].value);
  const [selectedFontColor, setSelectedFontColor] = useState("black");
  const [photoPreview, setPhotoPreview] = useState("");
  const selectedLogo =
    logoColors.find((logo) => logo.name === selectedLogoColor) ?? logoColors[0];
  const selectedFontChoice =
    fontChoices.find((font) => font.value === selectedFont) ?? fontChoices[0];
  const usesDarkProfileBackground =
    selectedDesign === "Dark Profile" || selectedDesign === "Portfolio Template";
  const availableFontColors =
    selectedFont === "friendlyScript"
      ? scriptFontColors
      : usesDarkProfileBackground
        ? regularFontColors.dark
        : regularFontColors.light;
  const selectedFontColorChoice =
    availableFontColors.find((color) => color.value === selectedFontColor) ??
    availableFontColors[0];

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
            <div
              className={`bannerPreview ${photoPlacement} ${selectedFont}`}
              style={{ "--font-color": selectedFontColorChoice.color }}
            >
              <div className="bannerGlow"></div>
              <div className="photoPlacementGroup">
                <div className="photoCircle">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Creator profile preview" />
                  ) : (
                    <span>Upload Photo</span>
                  )}
                </div>
                <img
                  className="photoLogoBadge"
                  src={selectedLogo.image}
                  alt=""
                  onError={(event) => handleLogoImageError(event, selectedLogo)}
                />
                <div className="bannerText">
                  <strong>Your Name</strong>
                  <span>Food. Travel. Lifestyle.</span>
                </div>
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

        <section className="choiceSection fontChoiceSection" aria-labelledby="font-heading">
          <div className="sectionHeader">
            <p className="eyebrow">Step 4</p>
            <h2 id="font-heading">Choose a profile font style</h2>
            <span>
              Pick the typography direction for your free profile. This affects
              the overall feel of the page, especially your name and section
              headings.
            </span>
          </div>

          <div className="fontGrid">
            {fontChoices.map((font) => (
              <button
                className={`fontOption ${font.value} ${
                  selectedFont === font.value ? "selected" : ""
                }`}
                type="button"
                aria-pressed={selectedFont === font.value}
                onClick={() => setSelectedFont(font.value)}
                key={font.value}
              >
                <strong>{font.sample}</strong>
                <span>{font.name}</span>
                <p>{font.description}</p>
              </button>
            ))}
          </div>

          <div className="fontColorPanel">
            <div>
              <p className="eyebrow">Font color</p>
              {(selectedFont === "friendlyScript" || usesDarkProfileBackground) && (
                <span>
                  {selectedFont === "friendlyScript"
                    ? "Script fonts can use a brand accent color."
                    : "Dark backgrounds use white or gray text."}
                </span>
              )}
            </div>

            <div className="fontColorGrid">
              {availableFontColors.map((color) => (
                <button
                  className={selectedFontColorChoice.value === color.value ? "selected" : ""}
                  style={{ "--font-color": color.color }}
                  type="button"
                  aria-pressed={selectedFontColorChoice.value === color.value}
                  onClick={() => setSelectedFontColor(color.value)}
                  key={color.value}
                >
                  <span></span>
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="choiceSummary" aria-label="Selected free profile choices">
          <div>
            <p className="eyebrow">Choices summary</p>
            <h2>{selectedDesign}</h2>
            <p className="summaryExplainer">
              This box summarizes the choices you have made so far. It is not
              the full profile preview yet; use Preview Free Profile to see the
              sample page layout.
            </p>
            <span>
              Logo color: <strong>{selectedLogoColor}</strong>
            </span>
            <span>
              Photo placement:{" "}
              <strong>
                {photoPlacements.find((placement) => placement.value === photoPlacement)?.label}
              </strong>
            </span>
            <span>
              Font style: <strong>{selectedFontChoice.name}</strong>
            </span>
            <span>
              Font color: <strong>{selectedFontColorChoice.name}</strong>
            </span>
          </div>
          <div className="summaryPreview" style={{ "--logo-color": selectedLogo.color }}>
            <p>Small preview of your choices</p>
            <div
              className={`summaryMiniBanner ${photoPlacement} ${selectedFont}`}
              style={{ "--font-color": selectedFontColorChoice.color }}
            >
              <div className="summaryPlacementGroup">
                <div className="summaryPhotoCircle">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Uploaded creator photo preview" />
                  ) : (
                    <span>Photo</span>
                  )}
                </div>
                <img
                  className="summaryPhotoLogoBadge"
                  src={selectedLogo.image}
                  alt=""
                  onError={(event) => handleLogoImageError(event, selectedLogo)}
                />
                <div className="summaryMiniText">
                  <strong>Your Name</strong>
                  <span>{selectedDesign}</span>
                </div>
              </div>
            </div>
            <div className="summaryLogo">
              <img
                src={selectedLogo.image}
                alt={`${selectedLogo.name} Impact logo preview`}
                onError={(event) => handleLogoImageError(event, selectedLogo)}
              />
            </div>
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

        .fontChoiceSection {
          background:
            radial-gradient(circle at 82% 18%, rgba(242, 140, 130, 0.14), transparent 26%),
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
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
          align-items: stretch;
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
          font-size: clamp(1.45rem, 2.5vw, 2.1rem);
          line-height: 1.05;
        }

        .choiceSummary span {
          display: block;
          margin-top: 8px;
          color: #596273;
        }

        .choiceSummary strong {
          color: #10172f;
        }

        .summaryExplainer {
          max-width: 650px;
          margin: 0 0 14px;
          color: #596273;
          line-height: 1.6;
        }

        .summaryPreview {
          --logo-color: #00e8f0;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items: end;
          padding: 14px;
          border: 1px solid #e5e8ef;
          border-radius: 22px;
          background: #ffffff;
        }

        .summaryPreview > p {
          grid-column: 1 / -1;
          margin: 0;
          color: #596273;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .summaryMiniBanner {
          min-height: 240px;
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          background:
            linear-gradient(135deg, rgba(255, 246, 242, 0.96), rgba(255, 218, 207, 0.9)),
            #fff0ed;
        }

        .summaryPlacementGroup {
          position: absolute;
          top: 14px;
          width: min(240px, calc(100% - 36px));
          display: grid;
          justify-items: center;
          gap: 8px;
          overflow: visible;
        }

        .summaryPhotoCircle {
          width: 155px;
          height: 155px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 6px solid #ffffff;
          border-radius: 50%;
          background: #10172f;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.72rem;
          font-weight: 900;
          box-shadow: 0 14px 28px rgba(16, 23, 47, 0.18);
        }

        .summaryPhotoCircle img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .summaryPhotoLogoBadge {
          position: absolute;
          left: calc(50% + 38px);
          top: 112px;
          z-index: 2;
          width: 48px !important;
          height: 48px !important;
          border: 4px solid #ffffff;
          border-radius: 50%;
          background: #000000;
          object-fit: cover;
          box-shadow: 0 8px 18px rgba(16, 23, 47, 0.22);
        }

        .summaryMiniBanner.topLeft .summaryPlacementGroup {
          left: 18px;
        }

        .summaryMiniBanner.middle .summaryPlacementGroup {
          left: 50%;
          transform: translateX(-50%);
        }

        .summaryMiniBanner.topRight .summaryPlacementGroup {
          right: 18px;
        }

        .summaryMiniText {
          display: grid;
          gap: 4px;
          text-align: center;
        }

        .summaryMiniText strong {
          color: var(--font-color, #10172f);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.45rem;
          letter-spacing: -0.05em;
          line-height: 1;
          white-space: nowrap;
        }

        .summaryMiniBanner.modernSans .summaryMiniText strong {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .summaryMiniBanner.friendlyScript .summaryMiniText strong {
          font-family: "Brush Script MT", "Segoe Script", cursive;
          font-size: 2.55rem;
          font-weight: 400;
          line-height: 0.86;
          letter-spacing: 0;
        }

        .summaryMiniText span {
          margin: 0;
          color: #596273;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .summaryLogo {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          border-radius: 16px;
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
          min-height: 460px;
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

        .photoPlacementGroup {
          position: absolute;
          top: 24px;
          width: min(410px, calc(100% - 68px));
          display: grid;
          justify-items: center;
          gap: 12px;
          overflow: visible;
        }

        .photoCircle {
          width: 230px;
          height: 230px;
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

        .photoLogoBadge {
          position: absolute;
          left: calc(50% + 64px);
          top: 165px;
          z-index: 2;
          width: 64px !important;
          height: 64px !important;
          border: 5px solid #ffffff;
          border-radius: 50%;
          background: #000000;
          object-fit: cover;
          box-shadow: 0 10px 22px rgba(16, 23, 47, 0.24);
        }

        .bannerPreview.topLeft .photoPlacementGroup {
          left: 34px;
        }

        .bannerPreview.middle .photoPlacementGroup {
          left: 50%;
          transform: translateX(-50%);
        }

        .bannerPreview.topRight .photoPlacementGroup {
          right: 34px;
        }

        .bannerText {
          display: grid;
          gap: 6px;
          text-align: center;
        }

        .bannerText strong {
          color: var(--font-color, #10172f);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.9rem, 3vw, 3rem);
          letter-spacing: -0.05em;
          line-height: 1;
          white-space: nowrap;
        }

        .bannerPreview.modernSans .bannerText strong {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          letter-spacing: -0.04em;
        }

        .bannerPreview.friendlyScript .bannerText strong {
          font-family: "Brush Script MT", "Segoe Script", cursive;
          font-size: clamp(3.4rem, 7vw, 5.6rem);
          font-weight: 400;
          line-height: 0.82;
          letter-spacing: 0;
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

        .fontGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .fontOption {
          min-height: 170px;
          display: grid;
          align-content: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.07);
          color: #ffffff;
          cursor: pointer;
          font: inherit;
          padding: 20px;
          text-align: left;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            transform 160ms ease;
        }

        .fontOption strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
        }

        .fontOption.editorialSerif strong {
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.05em;
        }

        .fontOption.modernSans strong {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          letter-spacing: -0.04em;
        }

        .fontOption.friendlyScript strong {
          font-family: "Brush Script MT", "Segoe Script", cursive;
          color: #ff8a80;
          font-weight: 400;
        }

        .fontOption span {
          color: #00e8f0;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .fontOption p {
          margin: 0;
          color: rgba(255, 255, 255, 0.66);
          line-height: 1.5;
        }

        .fontOption.selected {
          border-color: #00e8f0;
          box-shadow:
            0 0 0 2px rgba(0, 232, 240, 0.18),
            0 22px 50px rgba(0, 232, 240, 0.12);
          transform: translateY(-3px);
        }

        .fontColorPanel {
          margin-top: 18px;
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(260px, 1fr);
          gap: 18px;
          align-items: center;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.22);
        }

        .fontColorPanel span {
          color: rgba(255, 255, 255, 0.66);
          line-height: 1.5;
        }

        .fontColorGrid {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .fontColorGrid button {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.82);
          cursor: pointer;
          font: inherit;
          font-size: 0.86rem;
          font-weight: 900;
          padding: 0 14px;
        }

        .fontColorGrid button span {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.68);
          border-radius: 50%;
          background: var(--font-color);
        }

        .fontColorGrid button.selected {
          border-color: #00e8f0;
          box-shadow: 0 0 20px rgba(0, 232, 240, 0.18);
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
          .photoBuilder,
          .fontGrid {
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
          }

          .navLinks {
            flex-wrap: wrap;
            gap: 16px;
          }

          .designGrid,
          .logoGrid,
          .photoBuilder,
          .fontGrid,
          .fontColorPanel,
          .choiceSummary,
          .summaryPreview,
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
