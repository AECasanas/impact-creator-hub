"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ImpactHeaderBrand from "@/components/ImpactHeaderBrand";
import { slugify } from "@/lib/slugify";

const exchangePostTypes = [
  "Collaboration",
  "Availability",
  "Project Update",
  "Creator Call",
  "Event",
  "Announcement",
];

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];

const maxImageFiles = 4;
const maxImageSizeMb = 10;
const maxVideoFiles = 1;
const maxVideoSizeMb = 100;

const maxImageSizeBytes = maxImageSizeMb * 1024 * 1024;
const maxVideoSizeBytes = maxVideoSizeMb * 1024 * 1024;

export default function DashboardPostPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  const [post, setPost] = useState({
    title: "",
    body: "",
    postType: "Collaboration",
    postUrl: "",
    category: "Creator Opportunity",
    isPublished: true,
  });

  useEffect(() => {
    loadProfile();

    return () => {
      mediaPreviews.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updatePost(field, value) {
    setPost((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function loadProfile() {
    setLoading(true);
    setStatus("");
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        window.location.assign("/login");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        window.location.assign("/create-profile/free");
        return;
      }

      if (!data.slug) {
        setErrorMessage(
          "Please save your creator profile first so your Impact Exchange posts can link back to your public profile."
        );
      }

      setProfile(data);
    } catch (error) {
      console.warn("LOAD POST PROFILE ERROR:", error);
      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Could not load your creator profile."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleMediaUpload(event) {
    const files = Array.from(event.target.files || []);

    setStatus("");
    setErrorMessage("");

    if (!files.length) {
      return;
    }

    const images = files.filter((file) => allowedImageTypes.includes(file.type));
    const videos = files.filter((file) => allowedVideoTypes.includes(file.type));
    const unsupported = files.filter(
      (file) =>
        !allowedImageTypes.includes(file.type) &&
        !allowedVideoTypes.includes(file.type)
    );

    if (unsupported.length) {
      setErrorMessage(
        "Only JPEG, PNG, WEBP, MP4, WEBM, and MOV files are allowed."
      );
      event.target.value = "";
      return;
    }

    if (images.some((file) => file.size > maxImageSizeBytes)) {
      setErrorMessage(`Images must be ${maxImageSizeMb} MB or smaller each.`);
      event.target.value = "";
      return;
    }

    if (videos.some((file) => file.size > maxVideoSizeBytes)) {
      setErrorMessage(`Videos must be ${maxVideoSizeMb} MB or smaller.`);
      event.target.value = "";
      return;
    }

    if (videos.length > maxVideoFiles) {
      setErrorMessage("Only one video is allowed per post.");
      event.target.value = "";
      return;
    }

    if (videos.length === 1 && images.length > 0) {
      setErrorMessage("Choose either one video or up to four images, not both.");
      event.target.value = "";
      return;
    }

    if (images.length > maxImageFiles) {
      setErrorMessage("You can upload up to four images per post.");
      event.target.value = "";
      return;
    }

    mediaPreviews.forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });

    const previews = files.map((file) => ({
      name: file.name,
      type: allowedVideoTypes.includes(file.type) ? "video" : "image",
      previewUrl: URL.createObjectURL(file),
    }));

    setMediaFiles(files);
    setMediaPreviews(previews);
  }

  function removeMedia(indexToRemove) {
    const removed = mediaPreviews[indexToRemove];

    if (removed?.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }

    setMediaFiles((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );

    setMediaPreviews((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );
  }

  async function uploadPostAsset(file, type, safeSlug) {
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");

    const filePath = `${safeSlug}/${type}-${Date.now()}-${safeName}`;

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

  async function uploadMediaFiles(postId, safeSlug) {
    if (!mediaFiles.length) {
      return [];
    }

    const uploadedMedia = [];

    for (let index = 0; index < mediaFiles.length; index++) {
      const file = mediaFiles[index];
      const mediaType = allowedVideoTypes.includes(file.type)
        ? "video"
        : "image";

      const mediaUrl = await uploadPostAsset(
        file,
        `exchange-media-${index}`,
        safeSlug
      );

      uploadedMedia.push({
        post_id: postId,
        user_id: user.id,
        media_type: mediaType,
        media_url: mediaUrl,
        media_order: index,
      });
    }

    if (uploadedMedia.length) {
      const { error } = await supabase
        .from("impact_exchange_post_media")
        .insert(uploadedMedia);

      if (error) {
        throw error;
      }
    }

    return uploadedMedia;
  }

  async function handleCreatePost(event) {
    event.preventDefault();

    setPosting(true);
    setStatus("");
    setErrorMessage("");

    try {
      if (!user) {
        window.location.assign("/login");
        return;
      }

      if (!profile) {
        setErrorMessage("Your creator profile could not be loaded.");
        return;
      }

      if (!profile.slug) {
        setErrorMessage("Please save your creator profile first before posting.");
        return;
      }

      if (!post.title.trim()) {
        setErrorMessage("Post title is required.");
        return;
      }

      const cleanSlug = slugify(profile.slug || profile.display_name);

      const payload = {
        user_id: user.id,
        creator_profile_id: profile.id,
        creator_slug: cleanSlug,

        author_type: "creator",
        author_name: profile.display_name || cleanSlug,
        author_role: profile.creator_type || "Creator",
        author_avatar_url: profile.profile_photo_url || "",
        author_accent_name: profile.accent_name || "Electric Cyan",
        author_accent_color: profile.accent_color || "#00e8f0",
        author_profile_url: `/creator/${cleanSlug}`,

        title: post.title.trim(),
        body: post.body.trim(),
        post_type: post.postType,
        category: post.category,
        post_url: formatExternalUrl(post.postUrl),
        link_url: formatExternalUrl(post.postUrl),
        image_url: "",
        is_published: post.isPublished,
        updated_at: new Date().toISOString(),
      };

      const { data: insertedPost, error } = await supabase
        .from("impact_exchange_posts")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      const uploadedMedia = await uploadMediaFiles(insertedPost.id, cleanSlug);

      if (uploadedMedia[0]?.media_type === "image") {
        await supabase
          .from("impact_exchange_posts")
          .update({
            image_url: uploadedMedia[0].media_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", insertedPost.id)
          .eq("user_id", user.id);
      }

      setPost({
        title: "",
        body: "",
        postType: "Collaboration",
        postUrl: "",
        category: "Creator Opportunity",
        isPublished: true,
      });

      mediaPreviews.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });

      setMediaFiles([]);
      setMediaPreviews([]);

      setStatus("Posted to Impact Exchange.");
    } catch (error) {
      console.warn("CREATE IMPACT EXCHANGE POST ERROR:", error);
      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Something went wrong while posting to Impact Exchange."
      );
    } finally {
      setPosting(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.assign("/login");
  }

  if (loading) {
    return (
      <main className="postDashboardPage">
        <section className="loadingCard">Loading post composer...</section>
        <style jsx global>{postStyles}</style>
      </main>
    );
  }

  return (
    <main className="postDashboardPage">
      <header className="dashboardHeader">
        <div className="dashboardHeaderLogo">
          <ImpactHeaderBrand
            logoSize={52}
            compact
            subtitle="POST. CONNECT. GROW YOUR IMPACT."
          />
        </div>

        <nav>
          <a href="/dashboard/profile">Profile</a>
          <a href="/dashboard/inquiries">Inquiries</a>
          <a href="/dashboard/saved">Saved Posts</a>
          <a href="/impact-exchange">Impact Exchange</a>
          <button type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </nav>
      </header>

      <section className="postHero">
        <div>
          <p className="eyebrow">Impact Exchange</p>
          <h1>Create a post for the network.</h1>
          <p>
            Share a collaboration opportunity, project update, availability post,
            creator call, campaign idea, or announcement with the Impact Creator
            Hub community.
          </p>

        <div className="postHeroActions">
  <a className="primaryHeroButton" href="/create-postcard">
    Create Postcard Post
  </a>

  <a className="secondaryHeroButton" href="/impact-exchange">
    View Impact Exchange
  </a>
</div>

{profile?.slug && (
  <div className="profileMiniCard">
    <span>Posting as</span>
    <strong>{profile.display_name || profile.slug}</strong>
    <a
      href={`/creator/${profile.slug}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View public profile
    </a>
  </div>
)}
        </div>

        <aside className="postTips">
          <p className="panelLabel">Good posts include</p>
          <ul>
            <li>What you are offering or looking for</li>
            <li>Who should respond</li>
            <li>Timeline, deliverables, or next steps</li>
            <li>Clear visuals when helpful</li>
          </ul>
        </aside>
      </section>

      <section className="statusRow">
        {status && <p className="success">{status}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </section>

      <form className="postComposer" onSubmit={handleCreatePost}>
        <section className="panel">
          <p className="panelLabel">Post details</p>

          <div className="formGrid">
            <label>
              Post title
              <input
                value={post.title}
                placeholder="Looking for brand collaborations"
                onChange={(event) => updatePost("title", event.target.value)}
              />
            </label>

            <label>
              Post type
              <select
                value={post.postType}
                onChange={(event) => updatePost("postType", event.target.value)}
              >
                {exchangePostTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="wide">
              Post details
              <textarea
                value={post.body}
                placeholder="Tell brands or collaborators what you are sharing, what you are looking for, or what project you want people to know about."
                onChange={(event) => updatePost("body", event.target.value)}
              />
            </label>

            <label>
              Link URL
              <input
                value={post.postUrl}
                placeholder="https://yourlink.com"
                onChange={(event) => updatePost("postUrl", event.target.value)}
              />
            </label>

            <label>
              Published
              <select
                value={post.isPublished ? "yes" : "no"}
                onChange={(event) =>
                  updatePost("isPublished", event.target.value === "yes")
                }
              >
                <option value="yes">Publish now</option>
                <option value="no">Save hidden</option>
              </select>
            </label>
          </div>
        </section>

        <section className="panel mediaPanel">
          <p className="panelLabel">Photos or video</p>
          <p className="panelIntro">
            Upload up to 4 images for a collage, or 1 video. You will see your
            files here before posting.
          </p>

          <div className="uploadBox">
            <div>
              <span>Post media</span>
              <strong>
                {mediaFiles.length
                  ? `${mediaFiles.length} file${
                      mediaFiles.length === 1 ? "" : "s"
                    } selected`
                  : "Choose images or video"}
              </strong>
              <small>
                Images: JPEG, PNG, WEBP up to {maxImageSizeMb} MB each. Video:
                MP4, WEBM, MOV up to {maxVideoSizeMb} MB.
              </small>
            </div>

            <input
              id="exchangePostMediaUpload"
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime"
              multiple
              onChange={handleMediaUpload}
            />

            <label className="uploadButton" htmlFor="exchangePostMediaUpload">
              Choose Media
            </label>
          </div>

          {mediaPreviews.length > 0 && (
            <div
              className={`mediaPreviewGrid ${
                mediaPreviews.length === 1 ? "singlePreview" : ""
              }`}
            >
              {mediaPreviews.map((item, index) => (
                <article
                  className="mediaPreviewCard"
                  key={`${item.name}-${index}`}
                >
                  {item.type === "image" ? (
                    <img src={item.previewUrl} alt={item.name} />
                  ) : (
                    <video src={item.previewUrl} controls />
                  )}

                  <div>
                    <span>{item.type}</span>
                    <strong>{item.name}</strong>
                  </div>

                  <button type="button" onClick={() => removeMedia(index)}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="postActions">
          <div>
            {status && <p className="success">{status}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
          </div>

          <div className="postActionButtons">
            <a href="/impact-exchange">View Impact Exchange</a>

            <button type="submit" disabled={posting}>
              {posting ? "Posting..." : "Post to Impact Exchange"}
            </button>
          </div>
        </section>
      </form>

      <style jsx global>{postStyles}</style>
    </main>
  );
}

function formatExternalUrl(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

const postStyles = `
  .postDashboardPage {
    min-height: 100vh;
    background:
      radial-gradient(circle at 12% 12%, rgba(0, 232, 240, 0.14), transparent 30%),
      linear-gradient(135deg, #05090b 0%, #08131a 52%, #05090b 100%);
    color: #ffffff;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 28px;
  }

  .loadingCard {
    width: min(620px, 100%);
    margin: 18vh auto 0;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 28px;
    background: rgba(255,255,255,0.07);
    padding: 34px;
    font-weight: 950;
  }

  .dashboardHeader {
    width: min(1240px, 100%);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    padding-bottom: 22px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }

  .dashboardHeaderLogo .impactHeaderBrand {
    gap: 12px !important;
  }

  .dashboardHeaderLogo .impactHeaderBrand img {
    width: 52px !important;
    height: 52px !important;
  }

  .dashboardHeaderLogo .impactHeaderBrand strong {
    font-size: 1.15rem !important;
    line-height: 1 !important;
    letter-spacing: -0.02em !important;
  }

  .dashboardHeaderLogo .impactHeaderBrand span {
    margin-top: 6px !important;
    font-size: 0.5rem !important;
    letter-spacing: 0.24em !important;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 14px;
    font-weight: 900;
  }

  nav a,
  nav button {
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    color: #ffffff;
    cursor: pointer;
    font: inherit;
    padding: 11px 16px;
    text-decoration: none;
  }

  .postHero {
    width: min(1240px, 100%);
    margin: 42px auto 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
    gap: 26px;
    align-items: start;
  }

  .eyebrow,
  .panelLabel {
    margin: 0;
    color: #00e8f0;
    font-size: 0.74rem;
    font-weight: 950;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 760px;
    margin: 14px 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(3rem, 7vw, 5.8rem);
    letter-spacing: -0.06em;
    line-height: 0.94;
  }

  .postHero p:not(.eyebrow):not(.panelLabel) {
    max-width: 720px;
    margin: 20px 0 0;
    color: rgba(255,255,255,0.7);
    font-size: 1.05rem;
    line-height: 1.7;
  }

  .profileMiniCard,
  .postTips,
  .panel,
  .postActions {
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 26px;
    background: rgba(255,255,255,0.07);
  }

  .profileMiniCard {
    display: inline-grid;
    gap: 6px;
    margin-top: 24px;
    padding: 14px 16px;
  }

  .profileMiniCard span {
    color: rgba(255,255,255,0.58);
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .profileMiniCard strong {
    font-weight: 950;
  }

  .profileMiniCard a {
    color: #00e8f0;
    font-weight: 950;
    text-decoration: none;
  }

.postHeroActions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.postHeroActions a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 950;
  padding: 0 18px;
  text-decoration: none;
}

.primaryHeroButton {
  background: #00e8f0;
  color: #020617;
}

.secondaryHeroButton {
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.08);
  color: #ffffff;
}

  .postTips {
    padding: 22px;
    background:
      radial-gradient(circle at 92% 10%, rgba(0,232,240,0.16), transparent 28%),
      rgba(255,255,255,0.07);
  }

  .postTips ul {
    margin: 16px 0 0;
    padding-left: 20px;
    color: rgba(255,255,255,0.7);
    line-height: 1.7;
    font-weight: 750;
  }

  .statusRow {
    width: min(1240px, 100%);
    margin: 18px auto 0;
  }

  .success,
  .error {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 900;
    line-height: 1.5;
  }

  .success {
    color: #00e8f0;
  }

  .error {
    color: #ff6a61;
  }

  .postComposer {
    width: min(1240px, 100%);
    margin: 28px auto 110px;
    display: grid;
    gap: 18px;
  }

  .panel {
    padding: 22px;
  }

  .panelIntro {
    margin: 12px 0 0;
    color: rgba(255,255,255,0.68);
    line-height: 1.6;
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
    color: rgba(255,255,255,0.92);
    font-size: 0.84rem;
    font-weight: 900;
  }

  label.wide {
    grid-column: span 2;
  }

  input,
  select,
  textarea {
    width: 100%;
    min-height: 46px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 13px;
    background: rgba(255,255,255,0.1);
    color: #ffffff;
    font: inherit;
    font-weight: 800;
    outline: none;
    padding: 0 13px;
  }

  textarea {
    min-height: 170px;
    padding: 14px;
    resize: vertical;
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(255,255,255,0.45);
  }

  select option {
    background: #101820;
    color: #ffffff;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: #00e8f0;
    box-shadow: 0 0 0 4px rgba(0,232,240,0.16);
  }

  .mediaPanel {
    background:
      radial-gradient(circle at 92% 10%, rgba(0,232,240,0.14), transparent 28%),
      rgba(255,255,255,0.07);
  }

  .uploadBox {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 14px;
    align-items: center;
    margin-top: 18px;
    border: 1px dashed rgba(0,232,240,0.45);
    border-radius: 20px;
    background: rgba(255,255,255,0.06);
    padding: 18px;
  }

  .uploadBox span {
    display: block;
    font-weight: 950;
  }

  .uploadBox strong,
  .uploadBox small {
    display: block;
    margin-top: 5px;
    color: rgba(255,255,255,0.62);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .uploadBox input {
    display: none;
  }

  .uploadButton,
  .postActions button,
  .postActionButtons a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 999px;
    background: #00e8f0;
    color: #020617;
    cursor: pointer;
    font: inherit;
    font-size: 0.88rem;
    font-weight: 950;
    padding: 0 20px;
    text-decoration: none;
  }

  .mediaPreviewGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 18px;
  }

  .mediaPreviewGrid.singlePreview {
    grid-template-columns: minmax(0, 420px);
  }

  .mediaPreviewCard {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
    background: rgba(255,255,255,0.08);
  }

  .mediaPreviewCard img,
  .mediaPreviewCard video {
    width: 100%;
    aspect-ratio: 1 / 1;
    display: block;
    object-fit: cover;
    background: #020617;
  }

  .mediaPreviewCard div {
    padding: 10px;
  }

  .mediaPreviewCard span {
    display: block;
    color: #00e8f0;
    font-size: 0.62rem;
    font-weight: 950;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .mediaPreviewCard strong {
    display: block;
    margin-top: 4px;
    color: rgba(255,255,255,0.78);
    font-size: 0.78rem;
    line-height: 1.3;
    word-break: break-word;
  }

  .mediaPreviewCard button {
    position: absolute;
    top: 8px;
    right: 8px;
    min-height: 30px;
    border: 0;
    border-radius: 999px;
    background: rgba(2,6,23,0.72);
    color: #ffffff;
    cursor: pointer;
    font-size: 0.72rem;
    font-weight: 950;
    padding: 0 10px;
  }

  .postActions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 18px;
    background: rgba(2, 6, 23, 0.92);
  }

  .postActionButtons {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .postActionButtons a {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.16);
    color: #ffffff;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }

  @media (max-width: 900px) {
    .postDashboardPage {
      padding: 18px;
    }

    .dashboardHeader,
    .postHero,
    .statusRow,
    .postComposer {
      width: 100%;
    }

    .dashboardHeader {
      align-items: flex-start;
      flex-direction: column;
    }

    nav {
      flex-wrap: wrap;
    }

    .postHero {
      grid-template-columns: 1fr;
    }

    .formGrid {
      grid-template-columns: 1fr;
    }

    label.wide {
      grid-column: span 1;
    }

    .mediaPreviewGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .postActions {
      align-items: stretch;
      flex-direction: column;
    }

    .postActionButtons {
      width: 100%;
    }

    .postActionButtons a,
    .postActions button {
      width: 100%;
    }
  }

  @media (max-width: 560px) {
    .uploadBox {
      grid-template-columns: 1fr;
    }

    .mediaPreviewGrid {
      grid-template-columns: 1fr;
    }

    h1 {
      font-size: 3.2rem;
    }
  }
`;