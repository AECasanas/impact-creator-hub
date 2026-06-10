"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BrandProfileCard from "@/components/BrandProfileCard";

const socialPlatforms = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "LinkedIn",
  "X / Twitter",
  "Website",
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

export default function BrandDashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [bannerFileName, setBannerFileName] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    brand_type: "",
    industry: "",
    location: "",
    short_description: "",
    long_description: "",
    mission: "",
    website_url: "",
    contact_email: "",
    social_platform: "Instagram",
    social_url: "",
    looking_for: "",
    collaboration_types: "",
    budget_range: "",
    accent_name: "Electric Cyan",
    accent_color: "#00e8f0",
    profile_style: "professional",
    logo_url: "",
    banner_url: "",
    is_published: true,
  });

  const activeAccent = useMemo(() => {
    return (
      accentColors.find((accent) => accent.name === form.accent_name) ||
      accentColors[0]
    );
  }, [form.accent_name]);

  const socialHref = useMemo(() => {
    return formatExternalUrl(form.social_url);
  }, [form.social_url]);

  const socialUrlLooksValid = useMemo(() => {
    const value = form.social_url.trim();

    if (!value) {
      return false;
    }

    return value.includes(".") || value.startsWith("http");
  }, [form.social_url]);

  useEffect(() => {
    async function loadBrandProfile() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          setLoading(false);
          router.push("/login");
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);

        const { data, error: profileError } = await supabase
          .from("brand_profiles")
          .select("*")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!data) {
          setLoading(false);
          router.push("/create-brand");
          return;
        }

        setProfile(data);

        setForm({
          company_name: data.company_name || "",
          brand_type: data.brand_type || "",
          industry: data.industry || "",
          location: data.location || "",
          short_description: data.short_description || "",
          long_description: data.long_description || "",
          mission: data.mission || "",
          website_url: data.website_url || "",
          contact_email: data.contact_email || "",
          social_platform: data.social_platform || "Instagram",
          social_url: data.social_url || "",
          looking_for: data.looking_for || "",
          collaboration_types: data.collaboration_types || "",
          budget_range: data.budget_range || "",
          accent_name: data.accent_name || "Electric Cyan",
          accent_color: data.accent_color || "#00e8f0",
          profile_style: data.profile_style || "professional",
          logo_url: data.logo_url || "",
          banner_url: data.banner_url || "",
          is_published: data.is_published ?? true,
        });

        setLoading(false);
      } catch (error) {
        console.warn("LOAD BRAND PROFILE ERROR:", error);
        setError(error?.message || "Could not load brand profile.");
        setLoading(false);
      }
    }

    loadBrandProfile();
  }, [router]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleAccentChange(accent) {
    setForm((current) => ({
      ...current,
      accent_name: accent.name,
      accent_color: accent.color,
    }));
  }

  function handleLogoUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setLogoFileName(file.name);
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

  async function uploadBrandAsset(file, slug, type) {
    if (!file) {
      return "";
    }

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");

    const filePath = `brands/${slug}/${type}-${Date.now()}-${safeName}`;

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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user || !profile) {
      setError("Brand profile could not be loaded.");
      return;
    }

    if (!form.company_name.trim()) {
      setError("Company name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let logoUrl = form.logo_url || "";
      let bannerUrl = form.banner_url || "";

      if (logoFile) {
        setSuccess("Uploading brand photo...");
        logoUrl = await uploadBrandAsset(logoFile, profile.slug, "logo");
      }

      if (bannerFile) {
        setSuccess("Uploading banner photo...");
        bannerUrl = await uploadBrandAsset(bannerFile, profile.slug, "banner");
      }

      const cleanedSocialUrl =
        form.social_url.trim() && socialUrlLooksValid ? socialHref : "";

      setSuccess("Saving brand profile...");

      const { error: updateError } = await supabase
        .from("brand_profiles")
        .update({
          company_name: form.company_name.trim(),
          brand_type: form.brand_type.trim(),
          industry: form.industry.trim(),
          location: form.location.trim(),
          short_description: form.short_description.trim(),
          long_description: form.long_description.trim(),
          mission: form.mission.trim(),
          website_url: form.website_url.trim(),
          contact_email: form.contact_email.trim(),
          social_platform: form.social_platform,
          social_url: cleanedSocialUrl,
          looking_for: form.looking_for.trim(),
          collaboration_types: form.collaboration_types.trim(),
          budget_range: form.budget_range.trim(),
          accent_name: activeAccent.name,
          accent_color: activeAccent.color,
          profile_style: form.profile_style,
          logo_url: logoUrl,
          banner_url: bannerUrl,
          is_published: form.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)
        .eq("user_id", user.id);

      if (updateError) {
        throw updateError;
      }

      setForm((current) => ({
        ...current,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        social_url: cleanedSocialUrl,
        accent_name: activeAccent.name,
        accent_color: activeAccent.color,
      }));

      setProfile((current) => ({
        ...current,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        social_url: cleanedSocialUrl,
        accent_name: activeAccent.name,
        accent_color: activeAccent.color,
      }));

      setLogoFile(null);
      setBannerFile(null);
      setLogoFileName("");
      setBannerFileName("");

      setSuccess("Brand profile updated.");
    } catch (error) {
      console.warn("SAVE BRAND PROFILE ERROR:", error);

      const message =
        error?.message ||
        error?.error_description ||
        error?.details ||
        error?.hint ||
        "Something went wrong while saving.";

      setError(message);
      setSuccess("");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="brandBuilderPage">
        <div className="debugLoadingBox">
          <p>Loading brand dashboard...</p>
          <p className="debugText">
            Checking your login and brand profile.
          </p>
        </div>
        <style jsx global>{styles}</style>
      </main>
    );
  }

  const publicProfileUrl = profile?.slug ? `/brand/${profile.slug}` : null;

  return (
    <main
      className="brandBuilderPage"
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

        <nav>
          {publicProfileUrl && <a href={publicProfileUrl}>View Public Profile</a>}
          <a className="headerButton" href="/for-brands">
            For Brands
          </a>
        </nav>
      </header>

      <section className="heroSection">
        <div>
          <p className="eyebrow">Brand Profile Builder</p>
          <h1>Build a polished brand profile.</h1>
          <p>
            Add your brand details, upload your square brand photo or logo,
            upload your banner photo, choose your Impact Creator Hub logo color,
            and connect your main social or website link.
          </p>
        </div>

        <BrandProfileCard
          profile={form}
          activeAccent={activeAccent}
          logoPreview={logoPreview}
          bannerPreview={bannerPreview}
          compact
        />
      </section>

      <form id="brand-builder" onSubmit={handleSubmit}>
        <section className="builderSection">
          <section className="panel">
            <p className="panelLabel">1. Brand details</p>

            <div className="formGrid">
              <label>
                Company name
                <input
                  name="company_name"
                  value={form.company_name}
                  placeholder="Ocean Impact Co."
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Brand type
                <input
                  name="brand_type"
                  value={form.brand_type}
                  placeholder="Company, nonprofit, agency"
                  onChange={handleChange}
                />
              </label>

              <label>
                Industry
                <input
                  name="industry"
                  value={form.industry}
                  placeholder="Sustainability, wellness, education"
                  onChange={handleChange}
                />
              </label>

              <label>
                Location
                <input
                  name="location"
                  value={form.location}
                  placeholder="Miami, Florida"
                  onChange={handleChange}
                />
              </label>

              <label className="wide">
                Short description
                <input
                  name="short_description"
                  value={form.short_description}
                  placeholder="A short one-line summary of your brand."
                  onChange={handleChange}
                />
              </label>

              <label className="wide">
                Mission
                <textarea
                  name="mission"
                  value={form.mission}
                  placeholder="What does your brand stand for?"
                  onChange={handleChange}
                />
              </label>

              <label className="wide">
                Long description
                <textarea
                  name="long_description"
                  value={form.long_description}
                  placeholder="Tell creators and partners more about your brand."
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          <section className="panel">
            <p className="panelLabel">2. Photo, banner and color</p>

            <div className="uploadGroup">
              <div className="uploadBox">
                <div>
                  <span>Upload square brand photo / logo</span>
                  <strong>
                    {logoFileName ||
                      (form.logo_url
                        ? "Current brand photo saved"
                        : "No brand photo selected")}
                  </strong>
                </div>

                <input
                  id="brandLogo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoUpload}
                />

                <label htmlFor="brandLogo">Choose Photo</label>
              </div>

              <div className="uploadBox">
                <div>
                  <span>Upload banner photo</span>
                  <strong>
                    {bannerFileName ||
                      (form.banner_url
                        ? "Current banner saved"
                        : "No banner selected")}
                  </strong>
                </div>

                <input
                  id="brandBanner"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleBannerUpload}
                />

                <label htmlFor="brandBanner">Choose Banner</label>
              </div>
            </div>

            <div className="accentGrid">
              {accentColors.map((accent) => (
                <button
                  type="button"
                  key={accent.name}
                  className={`accentChoice ${
                    form.accent_name === accent.name ? "selectedAccent" : ""
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

          <section className="panel">
            <p className="panelLabel">3. Brand links</p>

            <div className="formGrid">
              <label>
                Website URL
                <input
                  name="website_url"
                  value={form.website_url}
                  placeholder="https://yourbrand.com"
                  onChange={handleChange}
                />
              </label>

              <label>
                Contact email
                <input
                  name="contact_email"
                  type="email"
                  value={form.contact_email}
                  placeholder="partnerships@yourbrand.com"
                  onChange={handleChange}
                />
              </label>

              <label>
                Main social platform
                <select
                  name="social_platform"
                  value={form.social_platform}
                  onChange={handleChange}
                >
                  {socialPlatforms.map((platform) => (
                    <option key={platform}>{platform}</option>
                  ))}
                </select>
              </label>

              <label>
                Social / profile URL
                <input
                  name="social_url"
                  value={form.social_url}
                  placeholder="https://instagram.com/yourbrand"
                  onChange={handleChange}
                />
              </label>
            </div>

            {form.social_url && (
              <div
                className={`linkConfirmation ${
                  socialUrlLooksValid ? "valid" : "invalid"
                }`}
              >
                <div>
                  <strong>
                    {socialUrlLooksValid
                      ? `${form.social_platform} link added`
                      : "Check this link"}
                  </strong>
                  <span>{form.social_url}</span>
                </div>

                {socialUrlLooksValid && (
                  <a href={socialHref} target="_blank" rel="noopener noreferrer">
                    Open profile ↗
                  </a>
                )}
              </div>
            )}
          </section>

          <section className="panel">
            <p className="panelLabel">4. Partnership details</p>

            <div className="formGrid">
              <label className="wide">
                Looking for
                <textarea
                  name="looking_for"
                  value={form.looking_for}
                  placeholder="What types of creators, partners, or collaborations are you looking for?"
                  onChange={handleChange}
                />
              </label>

              <label>
                Collaboration types
                <input
                  name="collaboration_types"
                  value={form.collaboration_types}
                  placeholder="Campaigns, events, content"
                  onChange={handleChange}
                />
              </label>

              <label>
                Budget range
                <input
                  name="budget_range"
                  value={form.budget_range}
                  placeholder="$500-$2,500, open, in-kind"
                  onChange={handleChange}
                />
              </label>

              <label className="publishToggle">
                <input
                  name="is_published"
                  type="checkbox"
                  checked={form.is_published}
                  onChange={handleChange}
                />
                Publish this brand profile
              </label>
            </div>
          </section>
        </section>

        <section className="stickySaveBar">
          <div>
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
          </div>

          <div className="saveButtons">
            {publicProfileUrl && <a href={publicProfileUrl}>View Profile</a>}
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Brand Profile"}
            </button>
          </div>
        </section>
      </form>

      <style jsx global>{styles}</style>
    </main>
  );
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
  .brandBuilderPage {
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

  .debugLoadingBox {
    max-width: 720px;
    margin: 80px auto;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.06);
    padding: 24px;
  }

  .debugText {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.65);
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
    max-width: 720px;
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

  .publishToggle {
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: end;
    min-height: 50px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.06);
    padding: 13px 14px;
  }

  .publishToggle input {
    width: auto;
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
    .saveButtons {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 640px) {
    .brandBuilderPage {
      padding: 18px 18px 140px;
    }

    .formGrid,
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