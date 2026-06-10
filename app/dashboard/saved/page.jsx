"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const accentLogoImages = {
  "Electric Cyan": "/logo-colors/impact-logo-electric-cyan.png",
  Orange: "/logo-colors/impact-logo-orange.png",
  Pink: "/logo-colors/impact-logo-pink.png",
  Purple: "/logo-colors/impact-logo-purple.png",
  "Emerald Green": "/logo-colors/impact-logo-emerald-green.png",
  White: "/logo-colors/impact-logo-white.png",
};

export default function SavedDashboardPage() {
  const [user, setUser] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [profileMap, setProfileMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadSavedPosts();
  }, []);

  async function loadSavedPosts() {
    setLoading(true);
    setStatus("");
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setErrorMessage(userError.message);
      setLoading(false);
      return;
    }

    if (!user) {
      window.location.assign("/login");
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("impact_exchange_saved_posts")
      .select(
        `
          id,
          created_at,
          post_id,
          impact_exchange_posts (
            id,
            user_id,
            creator_profile_id,
            creator_slug,
            brand_profile_id,
            brand_slug,
            author_type,
            author_name,
            title,
            body,
            post_type,
            post_url,
            link_url,
            category,
            image_url,
            is_published,
            created_at,
            updated_at
          )
        `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    const cleanSavedPosts = (data || [])
      .map((saved) => ({
        ...saved,
        post: saved.impact_exchange_posts,
      }))
      .filter((saved) => saved.post);

    setSavedPosts(cleanSavedPosts);

    await loadProfilesForPosts(cleanSavedPosts.map((item) => item.post));

    setLoading(false);
  }

  async function loadProfilesForPosts(posts) {
    const creatorIds = [
      ...new Set(
        posts
          .filter((post) => post.creator_profile_id)
          .map((post) => post.creator_profile_id)
      ),
    ];

    const brandIds = [
      ...new Set(
        posts
          .filter((post) => post.brand_profile_id)
          .map((post) => post.brand_profile_id)
      ),
    ];

    if (creatorIds.length > 0) {
      const { data: creators } = await supabase
        .from("creator_profiles")
        .select(
          "id, slug, display_name, creator_type, location, profile_photo_url, banner_photo_url, accent_name, accent_color"
        )
        .in("id", creatorIds);

      const creatorLookup = {};

      (creators || []).forEach((creator) => {
        creatorLookup[creator.id] = creator;
      });

      setProfileMap(creatorLookup);
    } else {
      setProfileMap({});
    }

    if (brandIds.length > 0) {
      const { data: brands } = await supabase
        .from("brand_profiles")
        .select(
          "id, slug, company_name, brand_type, industry, location, logo_url, banner_url, accent_name, accent_color"
        )
        .in("id", brandIds);

      const brandLookup = {};

      (brands || []).forEach((brand) => {
        brandLookup[brand.id] = brand;
      });

      setBrandMap(brandLookup);
    } else {
      setBrandMap({});
    }
  }

  async function removeSavedPost(savedId) {
    setStatus("");
    setErrorMessage("");

    const { error } = await supabase
      .from("impact_exchange_saved_posts")
      .delete()
      .eq("id", savedId);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSavedPosts((current) => current.filter((item) => item.id !== savedId));
    setStatus("Removed from saved posts.");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.assign("/login");
  }

  return (
    <main className="savedPage">
      <header className="savedHeader">
        <a href="/" className="brandHeader">
          <img src="/logo-ripple.png" alt="Impact Creator Hub logo" />

          <div>
            <strong>Impact Creator Hub</strong>
            <span>
              BUILD YOUR BRAND. <em>GROW YOUR IMPACT.</em>
            </span>
          </div>
        </a>

        <nav>
          <a href="/impact-exchange">Impact Exchange</a>
          <a href="/dashboard/profile">Profile Dashboard</a>
          <button type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </nav>
      </header>

      <section className="savedHero">
        <p>Saved Dashboard</p>
        <h1></h1>
        <span>
         
        </span>
      </section>

      <section className="savedContent">
        {loading && (
          <div className="statusCard">
            <strong>Loading saved posts...</strong>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="errorCard">
            <strong>{errorMessage}</strong>
          </div>
        )}

        {!loading && status && (
          <div className="successCard">
            <strong>{status}</strong>
          </div>
        )}

        {!loading && !errorMessage && savedPosts.length === 0 && (
          <div className="emptyCard">
            <strong>No saved posts yet.</strong>
            <p>
              When you save posts from the Impact Exchange, they will appear
              here.
            </p>

            <a href="/impact-exchange">Go to Impact Exchange</a>
          </div>
        )}

        {!loading && savedPosts.length > 0 && (
          <div className="savedGrid">
            {savedPosts.map((savedItem) => (
              <SavedPostCard
                key={savedItem.id}
                savedItem={savedItem}
                profile={profileMap[savedItem.post.creator_profile_id]}
                brand={brandMap[savedItem.post.brand_profile_id]}
                onRemove={() => removeSavedPost(savedItem.id)}
              />
            ))}
          </div>
        )}
      </section>

      <style jsx global>{savedStyles}</style>
    </main>
  );
}

function SavedPostCard({ savedItem, profile, brand, onRemove }) {
  const post = savedItem.post;
  const isBrand = post.author_type?.toLowerCase() === "brand";

  const authorName =
    post.author_name ||
    (isBrand
      ? brand?.company_name || post.brand_slug
      : profile?.display_name || post.creator_slug) ||
    "Impact Creator Hub Member";

  const authorType = isBrand
    ? brand?.brand_type || brand?.industry || "Brand"
    : profile?.creator_type || "Creator";

  const profileUrl = isBrand
    ? post.brand_slug
      ? `/brand/${post.brand_slug}`
      : brand?.slug
        ? `/brand/${brand.slug}`
        : ""
    : post.creator_slug
      ? `/creator/${post.creator_slug}`
      : profile?.slug
        ? `/creator/${profile.slug}`
        : "";

  const avatarUrl = isBrand ? brand?.logo_url : profile?.profile_photo_url;
  const imageUrl =
    post.image_url || (isBrand ? brand?.banner_url : profile?.banner_photo_url);

  const accentName = isBrand ? brand?.accent_name : profile?.accent_name;
  const accentColor =
    (isBrand ? brand?.accent_color : profile?.accent_color) || "#00e8f0";

  const accentImage =
    accentLogoImages[accentName] ||
    "/logo-colors/impact-logo-electric-cyan.png";

  const externalUrl = formatExternalUrl(post.link_url || post.post_url || "");

  return (
    <article
      className="savedPostCard"
      style={{
        "--post-accent": accentColor,
      }}
    >
      {imageUrl ? (
        <div
          className="savedImage"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(5, 9, 20, 0.08), rgba(5, 9, 20, 0.22)), url(${imageUrl})`,
          }}
        />
      ) : (
        <div className="savedImage emptySavedImage" />
      )}

      <div className="savedPostBody">
        <div className="savedPostAuthor">
          <div className="avatarWrap">
            {avatarUrl ? (
              <img src={avatarUrl} alt={authorName} className="postAvatar" />
            ) : (
              <div className="postAvatar">{authorName?.charAt(0) || "I"}</div>
            )}

            <img src={accentImage} alt="" className="accentBadge" />
          </div>

          <div>
            <strong>{authorName}</strong>
            <p>
              {isBrand ? "Brand" : "Creator"} · {authorType}
            </p>
          </div>
        </div>

        <h2>{post.title || "Untitled post"}</h2>

        {post.body && <p className="postText">{post.body}</p>}

        <div className="savedActions">
          {profileUrl && (
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              View Profile
            </a>
          )}

          {externalUrl && (
            <a href={externalUrl} target="_blank" rel="noopener noreferrer">
              Open Link
            </a>
          )}

          <button type="button" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

function formatExternalUrl(value) {
  const trimmed = value?.trim?.() || "";

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

const savedStyles = `
  .savedPage {
    min-height: 100vh;
    background:
      radial-gradient(circle at 12% 8%, rgba(0, 232, 240, 0.09), transparent 28%),
      linear-gradient(135deg, #05090b 0%, #08131a 52%, #05090b 100%);
    color: #ffffff;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 28px;
  }

  .savedHeader {
    width: min(1240px, 100%);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 22px;
  }

  .brandHeader {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    color: #ffffff;
    text-decoration: none;
  }

  .brandHeader img {
    width: 62px;
    height: 62px;
    background: #000000;
    object-fit: contain;
  }

  .brandHeader strong {
    display: block;
    font-size: 1.35rem;
    font-weight: 950;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .brandHeader span {
    display: block;
    margin-top: 8px;
    color: rgba(255,255,255,0.68);
    font-size: 0.56rem;
    font-weight: 950;
    letter-spacing: 0.27em;
    text-transform: uppercase;
  }

  .brandHeader em {
    color: #ff8c82;
    font-style: normal;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  nav a,
  nav button {
    min-height: 42px;
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    background: rgba(255,255,255,0.07);
    color: #ffffff;
    cursor: pointer;
    font: inherit;
    font-weight: 900;
    padding: 0 16px;
    text-decoration: none;
  }

  .savedHero {
    width: min(1240px, 100%);
    margin: 44px auto 0;
  }

  .savedHero p {
    margin: 0;
    color: #00e8f0;
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .savedHero h1 {
    max-width: 760px;
    margin: 14px 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.6rem, 7vw, 5rem);
    letter-spacing: -0.06em;
    line-height: 0.96;
  }

  .savedHero span {
    display: block;
    max-width: 700px;
    margin-top: 18px;
    color: rgba(255,255,255,0.68);
    font-size: 1.02rem;
    line-height: 1.65;
  }

  .savedContent {
    width: min(1240px, 100%);
    margin: 34px auto 90px;
  }

  .savedGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .savedPostCard,
  .emptyCard,
  .statusCard,
  .errorCard,
  .successCard {
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    background: rgba(255,255,255,0.06);
    box-shadow: 0 20px 60px rgba(0,0,0,0.24);
  }

  .savedImage {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: rgba(255,255,255,0.05);
    background-size: cover;
    background-position: center;
  }

  .emptySavedImage {
    background:
      radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--post-accent, #00e8f0) 24%, transparent), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  }

  .savedPostBody {
    padding: 18px;
  }

  .savedPostAuthor {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatarWrap {
    position: relative;
    width: 52px;
    height: 52px;
    flex: 0 0 auto;
  }

  .postAvatar {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 2px solid var(--post-accent, #00e8f0);
    border-radius: 999px;
    background: #020617;
    color: #ffffff;
    object-fit: cover;
    font-weight: 950;
  }

  .accentBadge {
    position: absolute;
    right: -7px;
    bottom: -5px;
    width: 24px;
    height: 24px;
    border: 3px solid #05090b;
    border-radius: 999px;
    background: #000000;
    object-fit: cover;
  }

  .savedPostAuthor strong {
    display: block;
    color: #ffffff;
    font-weight: 950;
  }

  .savedPostAuthor p {
    margin: 4px 0 0;
    color: rgba(255,255,255,0.58);
    font-size: 0.84rem;
    font-weight: 800;
  }

  .savedPostBody h2 {
    margin: 18px 0 0;
    color: #ffffff;
    font-size: 1.24rem;
    letter-spacing: -0.03em;
  }

  .postText {
    margin: 10px 0 0;
    color: rgba(255,255,255,0.72);
    font-size: 0.95rem;
    line-height: 1.55;
  }

  .savedActions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 16px;
  }

  .savedActions a,
  .savedActions button,
  .emptyCard a {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 950;
    padding: 0 14px;
    text-decoration: none;
  }

  .savedActions a,
  .emptyCard a {
    border: 1px solid #00e8f0;
    color: #00e8f0;
  }

  .savedActions button {
    border: 1px solid rgba(255,255,255,0.16);
    background: transparent;
    color: rgba(255,255,255,0.72);
    cursor: pointer;
  }

  .emptyCard,
  .statusCard,
  .errorCard,
  .successCard {
    padding: 28px;
  }

  .emptyCard strong,
  .statusCard strong,
  .errorCard strong,
  .successCard strong {
    display: block;
    font-size: 1.15rem;
  }

  .emptyCard p {
    margin: 10px 0 18px;
    color: rgba(255,255,255,0.68);
  }

  .errorCard {
    border-color: rgba(255,107,97,0.35);
    background: rgba(255,107,97,0.12);
    color: #ffc8c3;
  }

  .successCard {
    border-color: rgba(0,232,240,0.32);
    background: rgba(0,232,240,0.1);
    color: #00e8f0;
    margin-bottom: 18px;
  }

  @media (max-width: 900px) {
    .savedHeader {
      align-items: flex-start;
      flex-direction: column;
    }

    nav {
      flex-wrap: wrap;
    }

    .savedGrid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .savedPage {
      padding: 18px;
    }

    .brandHeader img {
      width: 52px;
      height: 52px;
    }

    .brandHeader strong {
      font-size: 1.1rem;
    }

    .brandHeader span {
      font-size: 0.46rem;
      letter-spacing: 0.2em;
    }
  }
`;