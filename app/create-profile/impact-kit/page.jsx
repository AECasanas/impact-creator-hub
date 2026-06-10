"use client";

import { useMemo, useState } from "react";

const designChoices = [
  {
    title: "Light Profile",
    label: "Bright editorial",
    description: "Soft, clean, lifestyle-focused profile.",
    theme: "light",
  },
  {
    title: "Dark Profile",
    label: "High-impact night mode",
    description: "Bold, neon, music/fashion/artist profile.",
    theme: "dark",
  },
  {
    title: "Editorial Template",
    label: "Story-first layout",
    description: "Magazine-style creator story profile.",
    theme: "editorial",
  },
  {
    title: "Portfolio Template",
    label: "Work-first layout",
    description: "Professional profile for services, work, and links.",
    theme: "portfolio",
  },
];

const logoColors = [
  { name: "Electric Cyan", color: "#00e8f0", image: "/logo-colors/impact-logo-electric-cyan.png" },
  { name: "Cobalt Blue", color: "#1677ff", image: "/logo-colors/impact-logo-cobalt-blue.png" },
  { name: "Royal Blue", color: "#144cff", image: "/logo-colors/impact-logo-royal-blue.png" },
  { name: "Teal Blue", color: "#13cfd2", image: "/logo-colors/impact-logo-teal-blue.png" },
  { name: "Orange", color: "#ff6a00", image: "/logo-colors/impact-logo-orange.png" },
  { name: "Gray", color: "#9a9a9a", image: "/logo-colors/impact-logo-gray.png" },
  { name: "Red", color: "#e00016", image: "/logo-colors/impact-logo-red.png" },
  { name: "White", color: "#ffffff", image: "/logo-colors/impact-logo-white.png" },
  { name: "Purple", color: "#8a3ffc", image: "/logo-colors/impact-logo-purple.png" },
  { name: "Pink", color: "#ff2f95", image: "/logo-colors/impact-logo-pink.png" },
  { name: "Emerald Green", color: "#00e95d", image: "/logo-colors/impact-logo-emerald-green.png" },
  { name: "Yellow", color: "#ffd91f", image: "/logo-colors/impact-logo-yellow.png" },
];

const photoPlacements = [
  { label: "Top Left", value: "topLeft" },
  { label: "Middle", value: "middle" },
  { label: "Top Right", value: "topRight" },
];

const fontChoices = [
  { name: "Editorial Serif", value: "editorialSerif", sample: "Maya Rivera" },
  { name: "Modern Sans", value: "modernSans", sample: "Maya Rivera" },
  { name: "Friendly Script", value: "friendlyScript", sample: "Maya Rivera" },
];

const fontColors = [
  { name: "Black", value: "black", color: "#10172f" },
  { name: "Gray", value: "gray", color: "#596273" },
  { name: "White", value: "white", color: "#ffffff" },
  { name: "Forest Green", value: "forest", color: "#1A4314" },
  { name: "Smoky Blue", value: "smoky", color: "#4A6B82" },
  { name: "Hot Pink", value: "pink", color: "#ff69b4" },
  { name: "Russian Red", value: "red", color: "#CD0101" },
];

const creatorTypes = [
  "Content Creator",
  "Artist",
  "Musician",
  "DJ",
  "Writer",
  "Journalist",
  "Author",
  "Blogger",
  "Vlogger",
  "Coach / Consultant / Trainer",
  "Podcaster",
  "Designer",
  "Entrepreneur",
];

export default function FreeCreatorProfilePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOnly, setPreviewOnly] = useState(false);

  const [selectedDesign, setSelectedDesign] = useState(designChoices[0].title);
  const [selectedLogoColor, setSelectedLogoColor] = useState(logoColors[0].name);
  const [photoPlacement, setPhotoPlacement] = useState(photoPlacements[1].value);
  const [selectedFont, setSelectedFont] = useState(fontChoices[0].value);
  const [selectedFontColor, setSelectedFontColor] = useState(fontColors[0].value);
  const [photoPreview, setPhotoPreview] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const [profile, setProfile] = useState({
    displayName: "",
    creatorType: "",
    tagline: "",
    shortBio: "",
    featuredLink: "",
  });

  const selectedLogo = useMemo(
    () => logoColors.find((logo) => logo.name === selectedLogoColor) ?? logoColors[0],
    [selectedLogoColor]
  );

  const selectedFontChoice = useMemo(
    () => fontChoices.find((font) => font.value === selectedFont) ?? fontChoices[0],
    [selectedFont]
  );

  const selectedFontColorChoice = useMemo(
    () => fontColors.find((color) => color.value === selectedFontColor) ?? fontColors[0],
    [selectedFontColor]
  );

  const selectedDesignChoice = useMemo(
    () => designChoices.find((choice) => choice.title === selectedDesign) ?? designChoices[0],
    [selectedDesign]
  );

  function handlePhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleSaveChoices() {
    const choices = {
      selectedDesign,
      selectedLogoColor,
      photoPlacement,
      selectedFont,
      selectedFontColor,
      profile,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("impactCreatorProfileChoices", JSON.stringify(choices));
    setSaveStatus("Saved locally. Next step: connect this to Supabase.");
  }

  return (
    <main
      className={`page ${selectedDesignChoice.theme}`}
      style={{
        "--accent": selectedLogo.color,
        "--font-color": selectedFontColorChoice.color,
      }}
    >
      <section className="shell">
        <header className="nav">
          <a className="brand" href="/create-profile">
            <img src="/logo-ripple.png" alt="Impact Creator Hub logo" />
            <div>
              <strong>Impact Creator Hub</strong>
              <span>Build your brand. Grow your impact.</span>
            </div>
          </a>

          <nav>
            <a href="/create-profile">All Options</a>
            <a href="/creator-profile">Example Profile</a>
            <button
              type="button"
              onClick={() => {
                setModalOpen(true);
                setPreviewOnly(false);
              }}
            >
              Customize
            </button>
          </nav>
        </header>

        <section className="hero">
          <div className="heroCopy">
            <p className="eyebrow">Premium Creator Profile</p>
            <h1>Build a creator profile that actually feels like your brand.</h1>
            <p>
              Choose a real layout style, logo color, photo placement, font, and
              creator details in one polished popup.
            </p>

            <div className="heroActions">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(true);
                  setPreviewOnly(false);
                }}
              >
                Start Building
              </button>
             
            </div>

            {saveStatus && <p className="saveStatus">{saveStatus}</p>}
          </div>

          <TemplatePreview
            selectedDesign={selectedDesign}
            selectedLogo={selectedLogo}
            selectedFont={selectedFont}
            selectedFontColor={selectedFontColorChoice.color}
            photoPlacement={photoPlacement}
            photoPreview={photoPreview}
            profile={profile}
            large={false}
          />
        </section>

      
      </section>

      {modalOpen && (
        <section className="modalOverlay" aria-label="Creator profile setup">
          <div className={`modal ${previewOnly ? "previewOnlyModal" : ""}`}>
            <div className="modalHeader">
              <div>
                <p className="eyebrow">Free Creator Profile</p>
                <h2>
                  {previewOnly ? selectedDesign : "Customize your profile"}
                </h2>
                <p className="modalIntro">
                  {previewOnly
                    ? "This is how your selected profile style could look. Go back to compare the other styles."
                    : "Pick your profile style, logo color, photo, placement, font, and details in one place."}
                </p>
              </div>

              <button
                className="closeButton"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>

            {previewOnly ? (
              <div className="previewOnlyBody">
                <TemplatePreview
                  selectedDesign={selectedDesign}
                  selectedLogo={selectedLogo}
                  selectedFont={selectedFont}
                  selectedFontColor={selectedFontColorChoice.color}
                  photoPlacement={photoPlacement}
                  photoPreview={photoPreview}
                  profile={profile}
                  large
                />

                <div className="modalFooter previewFooter">
                  <button type="button" onClick={() => setPreviewOnly(false)}>
                    ← Back to style choices
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSaveChoices();
                      setModalOpen(false);
                    }}
                  >
                    Save This Style
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="onePageGrid">
                  <section className="modalPanel profileStylePanel">
                    <p className="panelLabel">Profile style</p>
                    <div className="compactDesignGrid">
                      {designChoices.map((choice) => (
                        <button
                          type="button"
                          key={choice.title}
                          className={`compactDesignChoice ${choice.theme} ${
                            selectedDesign === choice.title ? "selected" : ""
                          }`}
                          onClick={() => setSelectedDesign(choice.title)}
                        >
                          <span>{choice.label}</span>
                          <strong>{choice.title}</strong>
                          <small>{choice.description}</small>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="modalPanel selectedPreviewPanel">
                    <div className="panelHeaderRow">
                      <p className="panelLabel">Selected preview</p>
                      <button type="button" onClick={() => setPreviewOnly(true)}>
                        Enlarge Preview
                      </button>
                    </div>

                    <TemplatePreview
                      selectedDesign={selectedDesign}
                      selectedLogo={selectedLogo}
                      selectedFont={selectedFont}
                      selectedFontColor={selectedFontColorChoice.color}
                      photoPlacement={photoPlacement}
                      photoPreview={photoPreview}
                      profile={profile}
                      large={false}
                    />
                  </section>

                  <section className="modalPanel">
                    <p className="panelLabel">Logo color</p>
                    <div className="compactLogoGrid">
                      {logoColors.map((logo) => (
                        <button
                          type="button"
                          key={logo.name}
                          className={`compactLogoChoice ${
                            selectedLogoColor === logo.name ? "selected" : ""
                          }`}
                          style={{ "--swatch": logo.color }}
                          onClick={() => setSelectedLogoColor(logo.name)}
                          title={logo.name}
                        >
                          <span>
                            <img src={logo.image} alt={`${logo.name} logo`} />
                          </span>
                          <small>{logo.name}</small>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="modalPanel detailsPanel">
                    <p className="panelLabel">Creator details</p>

                    <div className="compactFormGrid">
                      <label>
                        Display name
                        <input
                          value={profile.displayName}
                          placeholder="Maya Rivera"
                          onChange={(event) =>
                            setProfile({
                              ...profile,
                              displayName: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        Creator type
                        <select
                          value={profile.creatorType}
                          onChange={(event) =>
                            setProfile({
                              ...profile,
                              creatorType: event.target.value,
                            })
                          }
                        >
                          <option value="">Select creator type</option>
                          {creatorTypes.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Tagline
                        <input
                          value={profile.tagline}
                          placeholder="Food. Travel. Lifestyle."
                          onChange={(event) =>
                            setProfile({
                              ...profile,
                              tagline: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        Featured link
                        <input
                          value={profile.featuredLink}
                          placeholder="Instagram, TikTok, YouTube, website, or portfolio"
                          onChange={(event) =>
                            setProfile({
                              ...profile,
                              featuredLink: event.target.value,
                            })
                          }
                        />
                      </label>

                      <label className="wide">
                        Short bio
                        <textarea
                          value={profile.shortBio}
                          placeholder="Tell brands who you are, what you create, and what makes your work meaningful."
                          onChange={(event) =>
                            setProfile({
                              ...profile,
                              shortBio: event.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                  </section>

                  <section className="modalPanel">
                    <p className="panelLabel">Photo</p>

                    <label className="compactUploadBox">
                      <span>Choose profile photo</span>
                      <strong>PNG or JPG</strong>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handlePhotoUpload}
                      />
                    </label>

                    <div className="compactPlacementGrid">
                      {photoPlacements.map((placement) => (
                        <button
                          type="button"
                          key={placement.value}
                          className={
                            photoPlacement === placement.value ? "selected" : ""
                          }
                          onClick={() => setPhotoPlacement(placement.value)}
                        >
                          {placement.label}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="modalPanel">
                    <p className="panelLabel">Font style</p>

                    <div className="compactFontGrid">
                      {fontChoices.map((font) => (
                        <button
                          type="button"
                          key={font.value}
                          className={`compactFontChoice ${font.value} ${
                            selectedFont === font.value ? "selected" : ""
                          }`}
                          onClick={() => setSelectedFont(font.value)}
                        >
                          <strong>{font.sample}</strong>
                          <span>{font.name}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="modalPanel">
                    <p className="panelLabel">Font color</p>

                    <div className="compactColorGrid">
                      {fontColors.map((color) => (
                        <button
                          type="button"
                          key={color.value}
                          className={
                            selectedFontColor === color.value ? "selected" : ""
                          }
                          style={{ "--color": color.color }}
                          onClick={() => setSelectedFontColor(color.value)}
                        >
                          <span />
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="modalFooter">
                  <button type="button" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>

                  <div className="footerActions">
                    <button type="button" onClick={() => setPreviewOnly(true)}>
                      Preview Selected Style
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleSaveChoices();
                        setModalOpen(false);
                      }}
                    >
                      Save Choices
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <style jsx>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 15% 12%,
              color-mix(in srgb, var(--accent) 20%, transparent),
              transparent 28%
            ),
            radial-gradient(
              circle at 85% 10%,
              rgba(242, 140, 130, 0.18),
              transparent 28%
            ),
            linear-gradient(135deg, #05090b 0%, #08131a 52%, #05090b 100%);
          color: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 30px;
        }

        .shell {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: #ffffff;
          text-decoration: none;
        }

        .brand img {
          width: 62px;
          height: 62px;
          object-fit: contain;
        }

        .brand strong {
          display: block;
          font-size: 1.25rem;
          letter-spacing: -0.03em;
        }

        .brand span {
          display: block;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 20px;
          font-weight: 900;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          font: inherit;
        }

        nav button,
        .heroActions button,
        .modalFooter button:last-child,
        .panelHeaderRow button,
        .footerActions button:last-child {
          border: none;
          border-radius: 999px;
          background: var(--accent);
          color: #020617;
          padding: 13px 22px;
          cursor: pointer;
          font-weight: 950;
          box-shadow: 0 0 28px
            color-mix(in srgb, var(--accent) 28%, transparent);
        }

        .secondaryButton,
        .footerActions button:first-child,
        .modalFooter > button {
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          box-shadow: none !important;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(360px, 0.8fr);
          gap: 34px;
          align-items: center;
          padding: clamp(54px, 8vw, 92px) 0 28px;
        }

        .eyebrow {
          margin: 0;
          color: var(--accent);
          font-size: 0.78rem;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h1,
        h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.06em;
          line-height: 0.96;
        }

        h1 {
           max-width: 640px;
  margin-top: 18px;
  font-size: clamp(2.1rem, 4vw, 4rem);
        }

        .heroCopy > p:not(.eyebrow) {
          max-width: 680px;
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.74);
          font-size: 1.12rem;
          line-height: 1.75;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 30px;
        }

        .quickSummary {
          margin-top: 24px;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 22px;
          padding: 26px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
        }

        .quickSummary h2 {
          margin-top: 8px;
          font-size: clamp(2rem, 4vw, 3.2rem);
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .summaryItem {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          padding: 16px;
        }

        .summaryItem span {
          display: block;
          color: rgba(255, 255, 255, 0.58);
          font-size: 0.75rem;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .summaryItem strong {
          display: block;
          margin-top: 6px;
        }

        .modalOverlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: grid;
          place-items: center;
          padding: 22px;
          background: rgba(2, 6, 23, 0.74);
          backdrop-filter: blur(14px);
        }

        .modal {
          width: min(1240px, 100%);
          max-height: min(900px, calc(100vh - 44px));
          overflow: auto;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 90% 0%,
              color-mix(in srgb, var(--accent) 15%, transparent),
              transparent 32%
            ),
            #071014;
          box-shadow: 0 36px 120px rgba(0, 0, 0, 0.48);
        }

        .previewOnlyModal {
          width: min(980px, 100%);
        }

        .modalHeader {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 26px 28px 18px;
        }

        .modalHeader h2 {
          margin-top: 8px;
          font-size: clamp(2rem, 4vw, 3.4rem);
        }

        .modalIntro {
          max-width: 720px;
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.66);
          line-height: 1.6;
        }

        .closeButton {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          font-size: 1.8rem;
          line-height: 1;
        }

        .onePageGrid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 16px;
          padding: 20px 28px 28px;
        }

        .modalPanel {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06);
          padding: 16px;
        }

        .profileStylePanel,
        .selectedPreviewPanel,
        .detailsPanel {
          grid-row: span 2;
        }

        .panelHeaderRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .panelHeaderRow .panelLabel {
          margin-bottom: 0;
        }

        .panelHeaderRow button {
          padding: 9px 14px;
          font-size: 0.78rem;
        }

        .panelLabel {
          margin: 0 0 12px;
          color: var(--accent);
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .compactDesignGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .compactDesignChoice {
          min-height: 135px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          padding: 14px;
          text-align: left;
        }

        .compactDesignChoice span {
          display: block;
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .compactDesignChoice strong {
          display: block;
          margin-top: 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.3rem;
          letter-spacing: -0.04em;
        }

        .compactDesignChoice small {
          display: block;
          margin-top: 10px;
          color: rgba(255, 255, 255, 0.58);
          font-size: 0.78rem;
          line-height: 1.35;
        }

        .compactDesignChoice.light,
        .compactDesignChoice.editorial {
          background: rgba(255, 247, 244, 0.95);
          color: #10172f;
        }

        .compactDesignChoice.light span,
        .compactDesignChoice.editorial span {
          color: #596273;
        }

        .compactDesignChoice.light small,
        .compactDesignChoice.editorial small {
          color: #596273;
        }

        .compactLogoGrid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }

        .compactLogoChoice {
          display: grid;
          justify-items: center;
          gap: 6px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.07);
          color: var(--swatch);
          cursor: pointer;
          padding: 8px;
        }

        .compactLogoChoice span {
          width: 46px;
          height: 38px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 10px;
          background: #000000;
        }

        .compactLogoChoice img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .compactLogoChoice small {
          max-width: 64px;
          color: var(--swatch);
          font-size: 0.62rem;
          font-weight: 950;
          line-height: 1.15;
          text-align: center;
        }

        .compactFormGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .compactFormGrid label {
          display: grid;
          gap: 7px;
          color: #ffffff;
          font-size: 0.86rem;
          font-weight: 900;
        }

        .compactFormGrid .wide {
          grid-column: 1 / -1;
        }

        .compactFormGrid input,
        .compactFormGrid select,
        .compactFormGrid textarea {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 12px 13px;
          font: inherit;
          outline: none;
        }

        .compactFormGrid select option {
          color: #10172f;
        }

        .compactFormGrid textarea {
          min-height: 92px;
          resize: vertical;
        }

        .compactUploadBox {
          min-height: 78px;
          display: grid;
          align-content: center;
          gap: 5px;
          border: 1px dashed color-mix(in srgb, var(--accent) 55%, transparent);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.06);
          cursor: pointer;
          padding: 14px;
        }

        .compactUploadBox span {
          font-weight: 950;
        }

        .compactUploadBox strong {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
        }

        .compactUploadBox input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .compactPlacementGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 10px;
        }

        .compactPlacementGrid button {
          min-height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          font-weight: 900;
        }

        .compactFontGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .compactFontChoice {
          min-height: 86px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.07);
          color: #ffffff;
          cursor: pointer;
          padding: 12px;
          text-align: left;
        }

        .compactFontChoice strong {
          display: block;
          font-size: 1.1rem;
        }

        .compactFontChoice.editorialSerif strong {
          font-family: Georgia, "Times New Roman", serif;
        }

        .compactFontChoice.modernSans strong {
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .compactFontChoice.friendlyScript strong {
          font-family: "Brush Script MT", "Segoe Script", cursive;
          color: #ff8a80;
          font-size: 1.6rem;
          font-weight: 400;
        }

        .compactFontChoice span {
          display: block;
          margin-top: 6px;
          color: var(--accent);
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .compactColorGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .compactColorGrid button {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 900;
          padding: 0 12px;
        }

        .compactColorGrid button span {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.65);
          border-radius: 50%;
          background: var(--color);
        }

        .compactLogoChoice.selected {
          border-color: var(--swatch) !important;
          box-shadow:
            0 0 0 2px color-mix(in srgb, var(--swatch) 28%, transparent),
            0 20px 54px color-mix(in srgb, var(--swatch) 18%, transparent);
          transform: translateY(-2px);
        }

        .selected:not(.compactLogoChoice) {
          border-color: var(--accent) !important;
          box-shadow:
            0 0 0 2px color-mix(in srgb, var(--accent) 22%, transparent),
            0 20px 54px color-mix(in srgb, var(--accent) 16%, transparent);
          transform: translateY(-2px);
        }

        .modalFooter {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 0 28px 28px;
        }

        .footerActions,
        .previewFooter {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 12px;
        }

        .modalFooter button {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          font-weight: 950;
          padding: 13px 22px;
        }

        .previewOnlyBody {
          padding: 0 28px 28px;
        }

        .saveStatus {
          margin-top: 16px;
          color: var(--accent);
          font-weight: 950;
        }

        @media (max-width: 1100px) {
          .onePageGrid {
            grid-template-columns: 1fr;
          }

          .profileStylePanel,
          .selectedPreviewPanel,
          .detailsPanel {
            grid-row: auto;
          }
        }

        @media (max-width: 980px) {
          .hero,
          .quickSummary {
            grid-template-columns: 1fr;
          }

          .summaryGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .page {
            padding: 18px;
          }

          .nav {
            align-items: flex-start;
            flex-direction: column;
          }

          nav {
            flex-wrap: wrap;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .summaryGrid,
          .compactDesignGrid,
          .compactFormGrid,
          .compactFontGrid {
            grid-template-columns: 1fr;
          }

          .compactLogoGrid {
            grid-template-columns: repeat(3, 1fr);
          }

          .modal {
            border-radius: 24px;
          }

          .onePageGrid {
            padding: 18px;
          }
        }
      `}</style>
    </main>
  );
}



function TemplatePreview({
  selectedDesign,
  selectedLogo,
  selectedFont,
  selectedFontColor,
  photoPlacement,
  photoPreview,
  profile,
  large,
}) {
  const commonProps = {
    selectedLogo,
    selectedFont,
    selectedFontColor,
    photoPlacement,
    photoPreview,
    profile,
    large,
  };

  if (selectedDesign === "Dark Profile") {
    return <DarkTemplate {...commonProps} />;
  }

  if (selectedDesign === "Editorial Template") {
    return <EditorialTemplate {...commonProps} />;
  }

  if (selectedDesign === "Portfolio Template") {
    return <PortfolioTemplate {...commonProps} />;
  }

  return <LightTemplate {...commonProps} />;
}

function LightTemplate({
  selectedLogo,
  selectedFont,
  selectedFontColor,
  photoPlacement,
  photoPreview,
  profile,
  large,
}) {
  return (
    <article
      className={`templateCard lightTemplate ${large ? "largeTemplate" : ""}`}
      style={{ "--font-color": selectedFontColor }}
    >
      <div className={`lightHero ${photoPlacement} ${selectedFont}`}>
        <div className="softGlow" />
        <div className="lightProfileGroup">
          <ProfilePhoto photoPreview={photoPreview} />
          <img className="miniBadge" src={selectedLogo.image} alt="" />
          <div className="templateName">
            <strong>{profile.displayName || "Your Name"}</strong>
            <span>{profile.tagline || "Food. Travel. Lifestyle."}</span>
          </div>
        </div>
      </div>

      <div className="templateBody">
        <p className="templateEyebrow">Bright creator profile</p>
        <h3>{profile.creatorType || "Lifestyle Creator"}</h3>
        <p>
          {profile.shortBio ||
            "A clean, polished starter profile for lifestyle, wellness, food, travel, and personal brands."}
        </p>
      </div>

      <style jsx>{templateStyles}</style>
    </article>
  );
}

function DarkTemplate({
  selectedLogo,
  selectedFont,
  selectedFontColor,
  photoPlacement,
  photoPreview,
  profile,
  large,
}) {
  return (
    <article
      className={`templateCard darkTemplate ${large ? "largeTemplate" : ""}`}
      style={{ "--font-color": selectedFontColor }}
    >
      <div className={`darkHero ${photoPlacement} ${selectedFont}`}>
        <div className="neonLine" />
        <img className="darkLogo" src={selectedLogo.image} alt="" />

        <div className="darkContent">
          <ProfilePhoto photoPreview={photoPreview} />
          <p>High-impact creator</p>
          <strong>{profile.displayName || "Your Name"}</strong>
          <span>{profile.tagline || "Sound. Style. Story."}</span>
        </div>
      </div>

      <div className="darkStats">
        <span>Featured link</span>
        <strong>{profile.featuredLink || "Instagram · TikTok · YouTube"}</strong>
      </div>

      <style jsx>{templateStyles}</style>
    </article>
  );
}

function EditorialTemplate({
  selectedLogo,
  selectedFont,
  selectedFontColor,
  photoPlacement,
  photoPreview,
  profile,
  large,
}) {
  return (
    <article
      className={`templateCard editorialTemplate ${large ? "largeTemplate" : ""}`}
      style={{ "--font-color": selectedFontColor }}
    >
      <div className={`editorialGrid ${selectedFont}`}>
        <div className="editorialCopy">
          <p>Editorial profile</p>
          <h3>{profile.tagline || "A creator story rooted in culture, style, and place."}</h3>
          <span>
            {profile.shortBio ||
              "Use this format when the creator story matters as much as the work."}
          </span>
        </div>

        <div className="editorialPhotoWrap">
          <ProfilePhoto photoPreview={photoPreview} />
          <img className="miniBadge" src={selectedLogo.image} alt="" />
        </div>
      </div>

      <div className="storyStrip">
        <span>Featured story</span>
        <strong>{profile.displayName || "Your Name"}</strong>
      </div>

      <style jsx>{templateStyles}</style>
    </article>
  );
}

function PortfolioTemplate({
  selectedLogo,
  selectedFont,
  selectedFontColor,
  photoPlacement,
  photoPreview,
  profile,
  large,
}) {
  return (
    <article
      className={`templateCard portfolioTemplate ${large ? "largeTemplate" : ""}`}
      style={{ "--font-color": selectedFontColor }}
    >
      <div className={`portfolioHeader ${selectedFont}`}>
        <ProfilePhoto photoPreview={photoPreview} />
        <div>
          <p>Portfolio-first profile</p>
          <strong>{profile.displayName || "Your Name"}</strong>
          <span>{profile.creatorType || "Creator · Strategist · Brand Partner"}</span>
        </div>
        <img className="portfolioLogo" src={selectedLogo.image} alt="" />
      </div>

      <div className="portfolioCards">
        <div>
          <span>Services</span>
          <strong>UGC · Reviews · Events</strong>
        </div>
        <div>
          <span>Featured work</span>
          <strong>{profile.featuredLink || "Portfolio link"}</strong>
        </div>
        <div>
          <span>Collab note</span>
          <strong>Open to brand partnerships</strong>
        </div>
      </div>

      <style jsx>{templateStyles}</style>
    </article>
  );
}

function ProfilePhoto({ photoPreview }) {
  return (
    <div className="profilePhoto">
      {photoPreview ? (
        <img src={photoPreview} alt="Creator profile preview" />
      ) : (
        <span>Photo</span>
      )}

      <style jsx>{templateStyles}</style>
    </div>
  );
}

const templateStyles = `
  .templateCard {
    min-height: 460px;
    border-radius: 30px;
    overflow: hidden;
    background: #ffffff;
    color: #10172f;
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.28);
  }

  .largeTemplate {
    min-height: 620px;
  }

  .profilePhoto {
    width: 180px;
    height: 180px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 7px solid #ffffff;
    border-radius: 50%;
    background: #10172f;
    color: rgba(255, 255, 255, 0.76);
    font-weight: 950;
    box-shadow: 0 18px 40px rgba(16, 23, 47, 0.2);
  }

  .largeTemplate .profilePhoto {
    width: 240px;
    height: 240px;
  }

  .profilePhoto img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .lightHero {
    min-height: 360px;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at 80% 20%, rgba(255, 106, 97, 0.18), transparent 24%),
      linear-gradient(135deg, #fff7f4, #ffe1d8);
  }

  .largeTemplate .lightHero {
    min-height: 470px;
  }

  .softGlow {
    position: absolute;
    right: -80px;
    bottom: -90px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: rgba(0, 232, 240, 0.16);
    filter: blur(10px);
  }

  .lightProfileGroup {
    position: absolute;
    top: 34px;
    width: min(350px, calc(100% - 60px));
    display: grid;
    justify-items: center;
    gap: 12px;
  }

  .lightHero.topLeft .lightProfileGroup {
    left: 30px;
  }

  .lightHero.middle .lightProfileGroup {
    left: 50%;
    transform: translateX(-50%);
  }

  .lightHero.topRight .lightProfileGroup {
    right: 30px;
  }

  .miniBadge {
    position: absolute;
    top: 135px;
    left: calc(50% + 42px);
    width: 58px;
    height: 58px;
    border: 5px solid #ffffff;
    border-radius: 50%;
    background: #000000;
    object-fit: cover;
  }

  .largeTemplate .miniBadge {
    top: 185px;
    left: calc(50% + 62px);
    width: 72px;
    height: 72px;
  }

  .templateName {
    display: grid;
    gap: 6px;
    text-align: center;
  }

  .templateName strong,
  .darkContent strong,
  .portfolioHeader strong {
    color: var(--font-color);
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2rem, 4vw, 3rem);
    letter-spacing: -0.05em;
    line-height: 1;
  }

  .friendlyScript .templateName strong,
  .friendlyScript .darkContent strong,
  .friendlyScript .portfolioHeader strong {
    font-family: "Brush Script MT", "Segoe Script", cursive;
    font-size: clamp(3.2rem, 7vw, 5.4rem);
    font-weight: 400;
    letter-spacing: 0;
    line-height: 0.82;
  }

  .modernSans .templateName strong,
  .modernSans .darkContent strong,
  .modernSans .portfolioHeader strong {
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }

  .templateName span {
    color: #ff6a61;
    font-weight: 950;
  }

  .templateBody {
    padding: 22px;
  }

  .templateEyebrow,
  .darkContent p,
  .editorialCopy p,
  .portfolioHeader p {
    margin: 0 0 8px;
    color: var(--accent);
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .templateBody h3 {
    margin: 0 0 8px;
    font-size: 1.35rem;
  }

  .templateBody p {
    margin: 0;
    color: #596273;
    line-height: 1.6;
  }

  .darkTemplate {
    background:
      radial-gradient(circle at 82% 14%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 24%),
      linear-gradient(135deg, #020617, #071014 55%, #111827);
    color: #ffffff;
  }

  .darkHero {
    min-height: 360px;
    position: relative;
    display: grid;
    place-items: center;
    padding: 34px;
  }

  .largeTemplate .darkHero {
    min-height: 520px;
  }

  .neonLine {
    position: absolute;
    inset: 24px;
    border: 1px solid color-mix(in srgb, var(--accent) 44%, transparent);
    border-radius: 26px;
    box-shadow: inset 0 0 40px color-mix(in srgb, var(--accent) 10%, transparent);
  }

  .darkLogo {
    position: absolute;
    top: 28px;
    right: 28px;
    width: 68px;
    height: 68px;
    border-radius: 18px;
    background: #000000;
    object-fit: cover;
    box-shadow: 0 0 30px color-mix(in srgb, var(--accent) 26%, transparent);
  }

  .darkContent {
    position: relative;
    z-index: 2;
    display: grid;
    justify-items: center;
    gap: 12px;
    text-align: center;
  }

  .darkContent span {
    color: var(--accent);
    font-weight: 950;
  }

  .darkStats {
    margin: 0 24px 24px;
    padding: 18px;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.06);
  }

  .darkStats span {
    color: rgba(255, 255, 255, 0.56);
    font-size: 0.72rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .darkStats strong {
    display: block;
    margin-top: 6px;
    color: #ffffff;
  }

  .editorialTemplate {
    background: linear-gradient(135deg, #fffaf5, #f1e7d8);
    color: #10172f;
  }

  .editorialGrid {
    min-height: 380px;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 20px;
    align-items: center;
    padding: 34px;
  }

  .largeTemplate .editorialGrid {
    min-height: 520px;
    padding: 48px;
  }

  .editorialCopy h3 {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.4rem, 5vw, 4.6rem);
    letter-spacing: -0.06em;
    line-height: 0.95;
  }

  .editorialCopy span {
    display: block;
    margin-top: 18px;
    color: #596273;
    line-height: 1.7;
  }

  .editorialPhotoWrap {
    position: relative;
    display: grid;
    place-items: center;
  }

  .storyStrip {
    margin: 0 24px 24px;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 18px;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 16px 40px rgba(16, 23, 47, 0.12);
  }

  .storyStrip span {
    color: #596273;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .portfolioTemplate {
    background:
      radial-gradient(circle at 80% 16%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 24%),
      linear-gradient(135deg, #0d2430, #071014);
    color: #ffffff;
  }

  .portfolioHeader {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 18px;
    align-items: center;
    padding: 28px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .largeTemplate .portfolioHeader {
    padding: 44px;
  }

  .portfolioHeader .profilePhoto {
    width: 120px;
    height: 120px;
  }

  .largeTemplate .portfolioHeader .profilePhoto {
    width: 180px;
    height: 180px;
  }

  .portfolioHeader span {
    display: block;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.66);
    font-weight: 850;
  }

  .portfolioLogo {
    width: 70px;
    height: 70px;
    border-radius: 18px;
    background: #000000;
    object-fit: cover;
    box-shadow: 0 0 30px color-mix(in srgb, var(--accent) 24%, transparent);
  }

  .portfolioCards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    padding: 24px;
  }

  .largeTemplate .portfolioCards {
    padding: 40px;
  }

  .portfolioCards div {
    min-height: 150px;
    padding: 18px;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.07);
  }

  .portfolioCards span {
    color: var(--accent);
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .portfolioCards strong {
    display: block;
    margin-top: 12px;
    color: #ffffff;
    line-height: 1.35;
  }

  @media (max-width: 760px) {
    .editorialGrid,
    .portfolioHeader,
    .portfolioCards {
      grid-template-columns: 1fr;
    }
  }
`;