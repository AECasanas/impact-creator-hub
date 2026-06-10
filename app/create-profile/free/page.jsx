"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CreatorProfileCard from "@/components/CreatorProfileCard";

const profileStyles = [
  {
    title: "Simple Light",
    label: "Clean creator card",
    description: "A bright, simple profile for any creator.",
    theme: "light",
  },
  {
    title: "Simple Dark",
    label: "Bold creator card",
    description: "A darker profile with stronger contrast.",
    theme: "dark",
  },
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

const socialPlatforms = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "LinkedIn",
  "X / Twitter",
];

const accentColors = [
  {
    name: "Electric Cyan",
    color: "#00e8f0",
    image: "/logo-colors/impact-logo-electric-cyan.png",
  },
  {
    name: "Orange",
    color: "#ff6a00",
    image: "/logo-colors/impact-logo-orange.png",
  },
  {
    name: "Pink",
    color: "#ff2f95",
    image: "/logo-colors/impact-logo-pink.png",
  },
  {
    name: "Purple",
    color: "#8a3ffc",
    image: "/logo-colors/impact-logo-purple.png",
  },
  {
    name: "Emerald Green",
    color: "#00e95d",
    image: "/logo-colors/impact-logo-emerald-green.png",
  },
  {
    name: "White",
    color: "#ffffff",
    image: "/logo-colors/impact-logo-white.png",
  },
];

export default function FreeCreatorProfilePage() {
  const [selectedStyle, setSelectedStyle] = useState("Simple Light");
  const [selectedAccent, setSelectedAccent] = useState("Electric Cyan");

  const [profile, setProfile] = useState({
    displayName: "",
    creatorType: "",
    tagline: "",
    location: "",
    shortBio: "",
    socialPlatform: "Instagram",
    socialUrl: "",
    profileStyle: "Simple Light",
    accentName: "Electric Cyan",
    accentColor: "#00e8f0",
    profilePhotoUrl: "",
    bannerPhotoUrl: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const [bannerFileName, setBannerFileName] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");

  const activeAccent = useMemo(() => {
    return (
      accentColors.find((accent) => accent.name === selectedAccent) ||
      accentColors[0]
    );
  }, [selectedAccent]);

  const socialHref = useMemo(() => {
    return formatExternalUrl(profile.socialUrl);
  }, [profile.socialUrl]);

  const socialUrlLooksValid = useMemo(() => {
    const value = profile.socialUrl.trim();

    if (!value) {
      return false;
    }

    return value.includes(".") || value.startsWith("http");
  }, [profile.socialUrl]);

  function updateProfile(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleStyleChange(styleTitle) {
    setSelectedStyle(styleTitle);
    updateProfile("profileStyle", styleTitle);
  }

  function handleAccentChange(accent) {
    setSelectedAccent(accent.name);

    setProfile((current) => ({
      ...current,
      accentName: accent.name,
      accentColor: accent.color,
    }));
  }

  function handlePhotoUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFileName(file.name);
  }

  function handleBannerUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    setBannerFileName(file.name);
  }

  async function uploadProfileAsset(file, slug, type) {
    if (!file) {
      return "";
    }

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");

    const filePath = `${slug}/${type}-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("creator-profile-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("creator-profile-assets")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function getAvailableSlug(baseSlug) {
    let candidate = baseSlug;
    let counter = 2;

    while (true) {
      const { data, error } = await supabase
        .from("creator_profiles")
        .select("id")
        .eq("slug", candidate)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return candidate;
      }

      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }
  }

  async function handleSaveProfile() {
    setSaveError("");
    setSaveStatus("");

    const displayName = profile.displayName.trim();

    if (!displayName) {
      setSaveError("Please enter a display name before saving.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus("Checking your account...");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setSaveStatus("Please sign in to save your profile.");
        window.location.assign("/login");
        return;
      }

      setSaveStatus("Checking your creator profile...");

      const { data: existingProfile, error: existingError } = await supabase
        .from("creator_profiles")
        .select("id, slug, profile_photo_url, banner_photo_url")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      const baseSlug = createSlug(displayName);
      const slug = existingProfile?.slug || (await getAvailableSlug(baseSlug));

      const cleanedSocialUrl =
        profile.socialUrl.trim() && socialUrlLooksValid ? socialHref : "";

      let profilePhotoUrl = existingProfile?.profile_photo_url || "";
      let bannerPhotoUrl = existingProfile?.banner_photo_url || "";

      if (photoFile) {
        setSaveStatus("Uploading profile photo...");
        profilePhotoUrl = await uploadProfileAsset(photoFile, slug, "profile");
      }

      if (bannerFile) {
        setSaveStatus("Uploading banner photo...");
        bannerPhotoUrl = await uploadProfileAsset(bannerFile, slug, "banner");
      }

      setSaveStatus("Saving profile to Supabase...");

      const payload = {
        user_id: user.id,
        plan: "free",
        slug,
        display_name: displayName,
        creator_type: profile.creatorType,
        tagline: profile.tagline,
        location: profile.location,
        short_bio: profile.shortBio,
        profile_style: selectedStyle,
        accent_color: activeAccent.color,
        accent_name: activeAccent.name,
        profile_photo_url: profilePhotoUrl,
        banner_photo_url: bannerPhotoUrl,
        social_platform: profile.socialPlatform,
        social_url: cleanedSocialUrl,
        is_published: true,
        updated_at: new Date().toISOString(),
      };

      if (existingProfile?.id) {
        const { error: updateError } = await supabase
          .from("creator_profiles")
          .update(payload)
          .eq("id", existingProfile.id)
          .eq("user_id", user.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("creator_profiles")
          .insert(payload);

        if (insertError) {
          throw insertError;
        }
      }

      setSaveStatus("Success! Your profile was saved. Opening your dashboard...");

      setTimeout(() => {
        window.location.assign("/dashboard/profile");
      }, 900);
    } catch (error) {
      console.warn("SAVE PROFILE ERROR:", error);

      const message =
        error?.message ||
        error?.error_description ||
        error?.details ||
        error?.hint ||
        JSON.stringify(error, null, 2) ||
        "Something went wrong while saving.";

      setSaveError(message);
      setSaveStatus("");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main
      className="freeProfilePage"
      style={{
        "--accent": activeAccent.color,
      }}
    >
      <header className="siteHeader">
        <a className="brand" href="/">
          <img src="/logo-ripple.png" alt="Impact Creator Hub logo" />
          <div>
            <strong>Impact Creator Hub</strong>
            <span>Build your brand. Grow your impact.</span>
          </div>
        </a>

      
      </header>

      <section className="heroSection">
        <div>
          <p className="eyebrow">Free Creator Profile</p>
          <h1>Create a polished profile in minutes.</h1>
          <p>
            Start simple: choose a style, add your creator details, upload your
            profile photo and banner photo, pick one accent color, and add one
            social media link.
          </p>

         
        </div>

        <CreatorProfileCard
          profile={{
            ...profile,
            displayName: profile.displayName || "Your Name",
            creatorType: profile.creatorType || "Simple Light",
            tagline: profile.tagline || "Food. Travel. Lifestyle.",
            location: profile.location || "Miami, Florida",
            shortBio:
              profile.shortBio ||
              "A polished free creator profile for brands to understand who you are, what you create, and how to work with you.",
            profileStyle: selectedStyle,
          }}
          activeAccent={activeAccent}
          photoPreview={photoPreview}
          bannerPreview={bannerPreview}
          compact
          showBio
        />
      </section>

      <section id="builder" className="builderSection">
        <section className="panel">
          <p className="panelLabel">1. Pick a free style</p>

          <div className="styleGrid">
            {profileStyles.map((style) => (
              <button
                key={style.title}
                type="button"
                className={`styleCard ${
                  selectedStyle === style.title ? "selectedStyle" : ""
                }`}
                onClick={() => handleStyleChange(style.title)}
              >
                <span>{style.label}</span>
                <strong>{style.title}</strong>
                <p>{style.description}</p>
              </button>
            ))}
          </div>

          <p className="upgradeNote">
            Unlock Editorial, Portfolio, custom fonts, photo placement,
            expanded colors, and custom sections with Impact Kit.
          </p>
        </section>

        <section className="panel">
          <p className="panelLabel">2. Add your details</p>

          <div className="formGrid">
            <label>
              Display name
              <input
                value={profile.displayName}
                placeholder="Maya Rivera"
                onChange={(event) =>
                  updateProfile("displayName", event.target.value)
                }
              />
            </label>

            <label>
              Creator type
              <select
                value={profile.creatorType}
                onChange={(event) =>
                  updateProfile("creatorType", event.target.value)
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
                  updateProfile("tagline", event.target.value)
                }
              />
            </label>

            <label>
              Location
              <input
                value={profile.location}
                placeholder="Miami, Florida"
                onChange={(event) =>
                  updateProfile("location", event.target.value)
                }
              />
            </label>

            <label className="wide">
              Short bio
              <textarea
                value={profile.shortBio}
                placeholder="Tell brands who you are, what you create, and why your work matters."
                onChange={(event) =>
                  updateProfile("shortBio", event.target.value)
                }
              />
            </label>
          </div>
        </section>

        <section className="panel">
          <p className="panelLabel">3. One free social link</p>

          <div className="formGrid">
            <label>
              Social platform
              <select
                value={profile.socialPlatform}
                onChange={(event) =>
                  updateProfile("socialPlatform", event.target.value)
                }
              >
                {socialPlatforms.map((platform) => (
                  <option key={platform}>{platform}</option>
                ))}
              </select>
            </label>

            <label>
              Profile URL
              <input
                value={profile.socialUrl}
                placeholder="https://instagram.com/yourname"
                onChange={(event) =>
                  updateProfile("socialUrl", event.target.value)
                }
              />
            </label>
          </div>

          {profile.socialUrl && (
            <div
              className={`linkConfirmation ${
                socialUrlLooksValid ? "valid" : "invalid"
              }`}
            >
              <div>
                <strong>
                  {socialUrlLooksValid
                    ? `${profile.socialPlatform} link added`
                    : "Check this link"}
                </strong>
                <span>{profile.socialUrl}</span>
              </div>

              {socialUrlLooksValid && (
                <a href={socialHref} target="_blank" rel="noopener noreferrer">
                  Open profile ↗
                </a>
              )}
            </div>
          )}

          <p className="helperText">
            Free profiles include one social media link. Impact Kit includes
            unlimited social links plus a website link.
          </p>
        </section>

        <section className="panel">
          <p className="panelLabel">4. Photos and accent</p>

          <div className="uploadGroup">
            <div className="uploadBox">
              <div>
                <span>Upload profile photo</span>
                <strong>{photoFileName || "No profile photo selected"}</strong>
              </div>

              <input
                id="profilePhoto"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoUpload}
              />

              <label htmlFor="profilePhoto">Choose Photo</label>
            </div>

            <div className="uploadBox">
              <div>
                <span>Upload banner photo</span>
                <strong>{bannerFileName || "No banner photo selected"}</strong>
              </div>

              <input
                id="bannerPhoto"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleBannerUpload}
              />

              <label htmlFor="bannerPhoto">Choose Banner</label>
            </div>
          </div>

          <div className="accentGrid">
            {accentColors.map((accent) => (
              <button
                type="button"
                key={accent.name}
                className={`accentChoice ${
                  selectedAccent === accent.name ? "selectedAccent" : ""
                }`}
                style={{ "--swatch": accent.color }}
                onClick={() => handleAccentChange(accent)}
              >
                <span>
                  <img src={accent.image} alt={`${accent.name} logo`} />
                </span>
                <strong>{accent.name}</strong>
              </button>
            ))}
          </div>
        </section>
      </section>

      <section className="stickySaveBar">
        <div>
          {saveStatus && <p className="success">{saveStatus}</p>}
          {saveError && <p className="error">{saveError}</p>}
        </div>

        <div className="saveButtons">
         
          <button type="button" onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Free Profile"}
          </button>
        </div>
      </section>

      <style jsx global>{styles}</style>
    </main>
  );
}

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatExternalUrl(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

const styles = `
  .freeProfilePage {
    min-height: 100vh;
    background:
      radial-gradient(
        circle at 12% 12%,
        color-mix(in srgb, var(--accent, #00e8f0) 18%, transparent),
        transparent 30%
      ),
      linear-gradient(135deg, #05090b 0%, #08131a 52%, #05090b 100%);
    color: #ffffff;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 28px 28px 130px;
  }

  .siteHeader {
    width: min(1240px, 100%);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 22px;
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
    font-size: 1.22rem;
  }

  .brand span {
    display: block;
    margin-top: 3px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 14px;
    font-weight: 900;
  }

  nav a {
    color: #ffffff;
    text-decoration: none;
  }

  .headerButton {
    min-height: 46px;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    background: var(--accent, #00e8f0);
    color: #020617 !important;
    padding: 0 18px;
  }

  .heroSection {
    width: min(1240px, 100%);
    margin: 46px auto 0;
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(360px, 0.62fr);
    gap: 32px;
    align-items: center;
  }

  .eyebrow,
  .panelLabel {
    margin: 0;
    color: var(--accent, #00e8f0);
    font-size: 0.74rem;
    font-weight: 950;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 680px;
    margin: 14px 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(3rem, 7vw, 5.6rem);
    letter-spacing: -0.06em;
    line-height: 0.96;
  }

  .heroSection p:not(.eyebrow) {
    max-width: 720px;
    margin: 22px 0 0;
    color: rgba(255, 255, 255, 0.72);
    font-size: 1.08rem;
    line-height: 1.7;
  }

  .heroActions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 28px;
  }

  .heroActions a {
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    font-weight: 950;
    padding: 0 18px;
    text-decoration: none;
  }

  .heroActions a:first-child {
    background: var(--accent, #00e8f0);
    color: #020617;
  }

  .heroActions a:last-child {
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #ffffff;
  }

  .builderSection {
    width: min(1240px, 100%);
    margin: 34px auto 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .panel {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.07);
    padding: 22px;
  }

  .styleGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-top: 18px;
  }

  .styleCard {
    min-height: 150px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    cursor: pointer;
    padding: 18px;
    text-align: left;
  }

  .styleCard span {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .styleCard strong {
    display: block;
    margin-top: 12px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.55rem;
  }

  .styleCard p {
    margin: 10px 0 0;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.45;
  }

  .selectedStyle {
    border-color: var(--accent, #00e8f0);
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--accent, #00e8f0) 24%, transparent),
      0 18px 48px color-mix(in srgb, var(--accent, #00e8f0) 18%, transparent);
  }

  .upgradeNote,
  .helperText {
    margin: 18px 0 0;
    color: rgba(255, 255, 255, 0.68);
    font-weight: 800;
    line-height: 1.55;
  }

  .formGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-top: 18px;
  }

  label {
    display: grid;
    gap: 8px;
    color: #ffffff;
    font-size: 0.88rem;
    font-weight: 900;
  }

  .wide {
    grid-column: 1 / -1;
  }

  input,
  select,
  textarea {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    font: inherit;
    padding: 13px 14px;
    outline: none;
  }

  select option {
    color: #10172f;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(255, 255, 255, 0.48);
  }

  .linkConfirmation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-top: 18px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.07);
    padding: 16px;
  }

  .linkConfirmation.valid {
    border-color: color-mix(in srgb, var(--accent, #00e8f0) 55%, transparent);
  }

  .linkConfirmation.invalid {
    border-color: rgba(255, 106, 97, 0.75);
  }

  .linkConfirmation strong {
    display: block;
    color: var(--accent, #00e8f0);
  }

  .linkConfirmation span {
    display: block;
    margin-top: 5px;
    color: rgba(255, 255, 255, 0.64);
    font-size: 0.86rem;
  }

  .linkConfirmation a {
    color: #ffffff;
    font-weight: 950;
    white-space: nowrap;
  }

  .uploadGroup {
    display: grid;
    gap: 12px;
    margin-top: 18px;
  }

  .uploadBox {
    min-height: 86px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    border: 1px dashed color-mix(in srgb, var(--accent, #00e8f0) 50%, transparent);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.06);
    padding: 15px;
  }

  .uploadBox span {
    display: block;
    font-weight: 950;
  }

  .uploadBox strong {
    display: block;
    margin-top: 5px;
    max-width: 280px;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.62);
    font-size: 0.8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .uploadBox input {
    position: absolute;
    left: -9999px;
  }

  .uploadBox label {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    background: var(--accent, #00e8f0);
    color: #020617;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 950;
    padding: 0 14px;
    white-space: nowrap;
  }

  .accentGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 18px;
  }

  .accentChoice {
    display: grid;
    justify-items: center;
    gap: 8px;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.07);
    color: var(--swatch);
    cursor: pointer;
    padding: 12px;
  }

  .accentChoice span {
    width: 52px;
    height: 44px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border-radius: 12px;
    background: #000000;
  }

  .accentChoice img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .accentChoice strong {
    max-width: 90px;
    color: var(--swatch);
    font-size: 0.72rem;
    line-height: 1.15;
    text-align: center;
  }

  .selectedAccent {
    border-color: var(--swatch);
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--swatch) 24%, transparent),
      0 18px 48px color-mix(in srgb, var(--swatch) 18%, transparent);
  }

  .stickySaveBar {
    position: fixed;
    left: 50%;
    bottom: 22px;
    z-index: 20;
    width: min(1240px, calc(100% - 44px));
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 24px;
    background: rgba(5, 9, 11, 0.9);
    backdrop-filter: blur(18px);
    padding: 16px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
  }

  .success,
  .error {
    margin: 0;
    font-weight: 950;
  }

  .success {
    color: var(--accent, #00e8f0);
  }

  .error {
    color: #ff6a61;
  }

  .saveButtons {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .saveButtons a,
  .saveButtons button {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    font: inherit;
    font-weight: 950;
    padding: 0 18px;
    text-decoration: none;
  }

  .saveButtons a {
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #ffffff;
  }

  .saveButtons button {
    border: none;
    background: var(--accent, #00e8f0);
    color: #020617;
    cursor: pointer;
  }

  .saveButtons button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  @media (max-width: 900px) {
    .siteHeader,
    nav,
    .stickySaveBar {
      align-items: flex-start;
      flex-direction: column;
    }

    .heroSection,
    .builderSection {
      grid-template-columns: 1fr;
    }

    nav,
    .heroActions,
    .saveButtons {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 640px) {
    .freeProfilePage {
      padding: 18px 18px 140px;
    }

    .formGrid,
    .styleGrid,
    .accentGrid {
      grid-template-columns: 1fr;
    }

    .uploadBox,
    .linkConfirmation {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;