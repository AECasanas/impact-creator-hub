"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CreatorProfileCard from "@/components/CreatorProfileCard";
import ImpactHeaderBrand from "@/components/ImpactHeaderBrand";
import { slugify } from "@/lib/slugify";

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

const nicheOptions = [
  "Food",
  "Travel",
  "Lifestyle",
  "Fitness",
  "Wellness",
  "Beauty",
  "Fashion",
  "Parenting",
  "Home",
  "Design",
  "Art",
  "Music",
  "Gaming",
  "Tech",
  "Business",
  "Education",
  "Books",
  "Comedy",
  "Sports",
  "Outdoors",
];

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const exchangePostTypes = [
  "Collaboration",
  "Availability",
  "Project Update",
  "Creator Call",
  "Event",
  "Announcement",
];

const boardTypes = [
  {
    value: "project",
    title: "Project Board",
    description:
      "Current work, portfolio pieces, campaigns, recipes, shoots, videos, launches, or creative projects.",
  },
  {
    value: "collaboration",
    title: "Collaboration Board",
    description:
      "Brand partnership ideas, UGC offers, sponsorship concepts, collaboration notes, or creator calls.",
  },
  {
    value: "highlight",
    title: "Highlight Board",
    description:
      "Press, wins, milestones, media mentions, moodboards, testimonials, or featured moments.",
  },
  {
    value: "writing",
    title: "Writing Board",
    description:
      "Essays, posts, reflections, creator notes, storytelling, thought leadership, or written work.",
  },
];

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];

const maxImageFiles = 4;
const maxImageSizeMb = 10;
const maxVideoFiles = 1;
const maxVideoSizeMb = 100;

const maxImageSizeBytes = maxImageSizeMb * 1024 * 1024;
const maxVideoSizeBytes = maxVideoSizeMb * 1024 * 1024;

export default function DashboardProfilePage() {
  const [user, setUser] = useState(null);
  const [profileId, setProfileId] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingBoard, setSavingBoard] = useState(false);
  const [postingExchange, setPostingExchange] = useState(false);

  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [boardStatus, setBoardStatus] = useState("");
  const [boardError, setBoardError] = useState("");

  const [exchangeStatus, setExchangeStatus] = useState("");
  const [exchangeError, setExchangeError] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [boardImageFile, setBoardImageFile] = useState(null);
  const [exchangeMediaFiles, setExchangeMediaFiles] = useState([]);

  const [photoPreview, setPhotoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [photoFileName, setPhotoFileName] = useState("");
  const [bannerFileName, setBannerFileName] = useState("");
  const [boardImageFileName, setBoardImageFileName] = useState("");
  const [exchangeMediaFileNames, setExchangeMediaFileNames] = useState("");

const [profile, setProfile] = useState({
  displayName: "",
  creatorType: "",
  tagline: "",
  location: "",
  shortBio: "",
  longBio: "",
  writingIntro: "",
  contactEmail: "",

  // New profile highlight fields
  nicheTags: [],
  followerCount: "",
  engagementRate: "",
  minRate: "",
  maxRate: "",
  availableForCollabs: false,
  availableFromMonth: "",

  // Keep these old fields for now so nothing breaks
  primaryNiche: "",
  availableFor: "",

  featuredLinkTitle: "",
  featuredLinkUrl: "",
  profileStyle: "Simple Light",
  accentName: "Electric Cyan",
  accentColor: "#00e8f0",
  profilePhotoUrl: "",
  bannerPhotoUrl: "",
  socialPlatform: "Instagram",
  socialUrl: "",
  isPublished: true,
});



  const [boardDraft, setBoardDraft] = useState({
    title: "",
    boardType: "project",
    description: "",
    linkUrl: "",
  });

  const [exchangePost, setExchangePost] = useState({
    title: "",
    body: "",
    postType: "Collaboration",
    postUrl: "",
    category: "Creator Opportunity",
    isPublished: true,
  });

  const activeAccent = useMemo(() => {
    return (
      accentColors.find((accent) => accent.name === profile.accentName) ||
      accentColors[0]
    );
  }, [profile.accentName]);

  const publicProfileUrl = slug ? `/creator/${slug}` : "";

  useEffect(() => {
    loadProfile();
  }, []);

  function updateProfile(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleNicheTag(tag) {
    setProfile((current) => {
      const currentTags = current.nicheTags || [];

      if (currentTags.includes(tag)) {
        return {
          ...current,
          nicheTags: currentTags.filter((item) => item !== tag),
        };
      }

      return {
        ...current,
        nicheTags: [...currentTags, tag],
      };
    });
  }

  function updateBoardDraft(field, value) {
    setBoardDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateExchangePost(field, value) {
    setExchangePost((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function loadProfile() {
    setLoading(true);
    setErrorMessage("");
    setStatus("");

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

      setProfileId(data.id);
      setSlug(data.slug || "");

      setProfile({
        displayName: data.display_name || "",
        creatorType: data.creator_type || "",
        tagline: data.tagline || "",
        location: data.location || "",
        shortBio: data.short_bio || "",
        longBio: data.long_bio || "",
        writingIntro: data.writing_intro || "",
        contactEmail: data.contact_email || "",

        // New profile highlight fields
        nicheTags: data.niche_tags || [],
        followerCount: data.follower_count || "",
        engagementRate: data.engagement_rate || "",
        minRate: data.min_rate || "",
        maxRate: data.max_rate || "",
        availableForCollabs: data.available_for_collabs || false,
        availableFromMonth: data.available_from_month || "",

        // Keep old fields for now so nothing breaks
        primaryNiche: data.primary_niche || "",
        availableFor: data.available_for || "",

        featuredLinkTitle: data.featured_link_title || "",
        featuredLinkUrl: data.featured_link_url || "",
        profileStyle: data.profile_style || "Simple Light",
        accentName: data.accent_name || "Electric Cyan",
        accentColor: data.accent_color || "#00e8f0",
        profilePhotoUrl: data.profile_photo_url || "",
        bannerPhotoUrl: data.banner_photo_url || "",
        socialPlatform: data.social_platform || "Instagram",
        socialUrl: data.social_url || "",
        isPublished: data.is_published ?? true,
      });

      setPhotoPreview(data.profile_photo_url || "");
      setBannerPreview(data.banner_photo_url || "");
    } catch (error) {
      console.warn("LOAD PROFILE ERROR:", error);

      setErrorMessage(
        error?.message ||
          "Could not load your creator profile. Please create a profile first."
      );
    } finally {
      setLoading(false);
    }
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

  function handleBoardImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setBoardImageFile(file);
    setBoardImageFileName(file.name);
  }

  function handleExchangeMediaUpload(event) {
    const files = Array.from(event.target.files || []);

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
      setExchangeError(
        "Only JPEG, PNG, WEBP, MP4, WEBM, and MOV files are allowed."
      );
      event.target.value = "";
      return;
    }

    const oversizedImages = images.filter(
      (file) => file.size > maxImageSizeBytes
    );

    const oversizedVideos = videos.filter(
      (file) => file.size > maxVideoSizeBytes
    );

    if (oversizedImages.length) {
      setExchangeError(`Images must be ${maxImageSizeMb} MB or smaller each.`);
      event.target.value = "";
      return;
    }

    if (oversizedVideos.length) {
      setExchangeError(`Videos must be ${maxVideoSizeMb} MB or smaller.`);
      event.target.value = "";
      return;
    }

    if (videos.length > maxVideoFiles) {
      setExchangeError("Only one video is allowed per post.");
      event.target.value = "";
      return;
    }

    if (videos.length === 1 && images.length > 0) {
      setExchangeError("Choose either one video or up to four images, not both.");
      event.target.value = "";
      return;
    }

    if (images.length > maxImageFiles) {
      setExchangeError("You can upload up to four images per post.");
      event.target.value = "";
      return;
    }

    setExchangeError("");
    setExchangeMediaFiles(files);
    setExchangeMediaFileNames(files.map((file) => file.name).join(", "));
  }

  async function uploadProfileAsset(file, type, slugOverride = "") {
    if (!file) {
      return "";
    }

    const safeSlug = slugify(slugOverride || slug || profile.displayName);

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

  async function uploadExchangeMediaFiles(postId, safeSlug) {
    if (!exchangeMediaFiles.length) {
      return [];
    }

    const uploadedMedia = [];

    for (let index = 0; index < exchangeMediaFiles.length; index += 1) {
      const file = exchangeMediaFiles[index];
      const mediaType = allowedVideoTypes.includes(file.type) ? "video" : "image";

      const mediaUrl = await uploadProfileAsset(
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

  async function handleSaveProfile() {
    setSaving(true);
    setStatus("");
    setErrorMessage("");

    try {
      if (!user) {
        window.location.assign("/login");
        return;
      }

      if (!profile.displayName.trim()) {
        setErrorMessage("Display name is required.");
        return;
      }

      const cleanSlug = slugify(slug || profile.displayName);

      if (!cleanSlug) {
        setErrorMessage("Profile URL is required.");
        return;
      }

      setStatus("Saving your profile...");

      let profilePhotoUrl = profile.profilePhotoUrl;
      let bannerPhotoUrl = profile.bannerPhotoUrl;

      if (photoFile) {
        setStatus("Uploading profile photo...");
        profilePhotoUrl = await uploadProfileAsset(
          photoFile,
          "profile",
          cleanSlug
        );
      }

      if (bannerFile) {
        setStatus("Uploading banner photo...");
        bannerPhotoUrl = await uploadProfileAsset(
          bannerFile,
          "banner",
          cleanSlug
        );
      }

      const payload = {
        display_name: profile.displayName.trim(),
        slug: cleanSlug,
        creator_type: profile.creatorType,
        tagline: profile.tagline,
        location: profile.location,
        short_bio: profile.shortBio,
        long_bio: profile.longBio,
        writing_intro: profile.writingIntro,
        contact_email: profile.contactEmail,

        // New profile highlight fields
        niche_tags: profile.nicheTags || [],
        follower_count: profile.followerCount,
        engagement_rate: profile.engagementRate,
        min_rate: profile.minRate ? Number(profile.minRate) : null,
        max_rate: profile.maxRate ? Number(profile.maxRate) : null,
        available_for_collabs: profile.availableForCollabs,
        available_from_month: profile.availableFromMonth,

        // Keep old fields for now so nothing breaks
        primary_niche: profile.primaryNiche,
        available_for: profile.availableFor,

        featured_link_title: profile.featuredLinkTitle,
        featured_link_url: formatExternalUrl(profile.featuredLinkUrl),
        profile_style: profile.profileStyle,
        accent_name: activeAccent.name,
        accent_color: activeAccent.color,
        profile_photo_url: profilePhotoUrl,
        banner_photo_url: bannerPhotoUrl,
        social_platform: profile.socialPlatform,
        social_url: formatExternalUrl(profile.socialUrl),
        is_published: profile.isPublished,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("creator_profiles")
        .update(payload)
        .eq("id", profileId)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setSlug(cleanSlug);

      setProfile((current) => ({
        ...current,
        accentName: activeAccent.name,
        accentColor: activeAccent.color,
        profilePhotoUrl,
        bannerPhotoUrl,
      }));

      setPhotoFile(null);
      setBannerFile(null);
      setPhotoFileName("");
      setBannerFileName("");

      setStatus("Saved. Your public profile has been updated.");
    } catch (error) {
      console.warn("SAVE PROFILE ERROR:", error);

      if (error?.code === "23505") {
        setErrorMessage(
          "That profile URL is already taken. Please choose another one."
        );
      } else {
        setErrorMessage(
          error?.message ||
            error?.details ||
            error?.hint ||
            "Something went wrong while saving your profile."
        );
      }

      setStatus("");
    } finally {
      setSaving(false);
    }
  }

async function handleSaveBoardItem() {
  setSavingBoard(true);
  setBoardStatus("");
  setBoardError("");

  try {
    if (!user) {
      window.location.assign("/login");
      return;
    }

    if (!profileId || !slug) {
      setBoardError(
        "Save or reload your creator profile before saving a board item."
      );
      return;
    }

    if (!boardDraft.title.trim()) {
      setBoardError("Board card title is required.");
      return;
    }

    let imageUrl = "";

    if (boardImageFile) {
      imageUrl = await uploadProfileAsset(boardImageFile, "board", slug);
    }

    const payload = {
      user_id: user.id,
      creator_profile_id: profileId,
      creator_slug: slug,
      title: boardDraft.title.trim(),
      board_type: boardDraft.boardType,
      body: boardDraft.description.trim(),
      image_url: imageUrl,
      external_url: formatExternalUrl(boardDraft.linkUrl),
      is_published: true,
      sort_order: 0,
    };

    const { error } = await supabase
      .from("creator_board_items")
      .insert(payload);

    if (error) {
      throw error;
    }

    setBoardDraft({
      title: "",
      boardType: "project",
      description: "",
      linkUrl: "",
    });

    setBoardImageFile(null);
    setBoardImageFileName("");

    setBoardStatus(
      "Board card saved. Open your public profile to see it on your boards."
    );
  } catch (error) {
    console.warn("SAVE BOARD ITEM ERROR:", error);

    setBoardError(
      error?.message ||
        error?.details ||
        error?.hint ||
        "Something went wrong while saving this board card."
    );
  } finally {
    setSavingBoard(false);
  }
}

  async function handleCreateExchangePost() {
    setPostingExchange(true);
    setExchangeStatus("");
    setExchangeError("");

    try {
      if (!user) {
        window.location.assign("/login");
        return;
      }

      if (!profileId || !slug) {
        setExchangeError("Save or reload your creator profile before posting.");
        return;
      }

      if (!exchangePost.title.trim()) {
        setExchangeError("Post title is required.");
        return;
      }

      const cleanSlug = slugify(slug || profile.displayName);

      const payload = {
        user_id: user.id,
        creator_profile_id: profileId,
        creator_slug: cleanSlug,
        author_type: "creator",
        author_name: profile.displayName || cleanSlug,
        author_role: profile.creatorType || "Creator",
        author_avatar_url: profile.profilePhotoUrl || photoPreview || "",
        author_accent_name: activeAccent.name,
        author_accent_color: activeAccent.color,
        author_profile_url: `/creator/${cleanSlug}`,
        title: exchangePost.title.trim(),
        body: exchangePost.body.trim(),
        post_type: exchangePost.postType,
        category: exchangePost.category,
        post_url: formatExternalUrl(exchangePost.postUrl),
        link_url: formatExternalUrl(exchangePost.postUrl),
        image_url: "",
        is_published: exchangePost.isPublished,
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

      const uploadedMedia = await uploadExchangeMediaFiles(
        insertedPost.id,
        cleanSlug
      );

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

      setExchangePost({
        title: "",
        body: "",
        postType: "Collaboration",
        postUrl: "",
        category: "Creator Opportunity",
        isPublished: true,
      });

      setExchangeMediaFiles([]);
      setExchangeMediaFileNames("");
      setExchangeStatus("Posted to Impact Exchange.");
    } catch (error) {
      console.warn("CREATE EXCHANGE POST ERROR:", error);

      setExchangeError(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Something went wrong while posting to Impact Exchange."
      );
    } finally {
      setPostingExchange(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.assign("/login");
  }

  if (loading) {
    return (
      <main className="dashboardPage">
        <section className="loadingCard">Loading your dashboard...</section>
        <style jsx global>{dashboardStyles}</style>
      </main>
    );
  }

  return (
    <main
      className="dashboardPage"
      style={{
        "--accent": activeAccent.color,
      }}
    >
      <header className="dashboardHeader">
        <div className="dashboardHeaderLogo">
          <ImpactHeaderBrand
            logoSize={52}
            compact
            subtitle="BUILD YOUR BRAND. GROW YOUR IMPACT."
          />
        </div>

        <nav>
          <a href="/impact-exchange">Impact Exchange</a>
          <a href="/dashboard/saved">Saved Posts</a>

          <button type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </nav>
      </header>

      <section className="dashboardHero">
        <div>
          <p className="eyebrow">Profile Dashboard</p>
          <h1>Edit your creator profile.</h1>
          <p>
            Update the information that appears on your public creator profile.
            Your public profile is linked to your logged-in account.
          </p>

          {slug && (
            <div className="profileUrlBox">
              <span>Your public profile</span>
              <a
                href={`/creator/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                /creator/{slug}
              </a>
            </div>
          )}
        </div>

        <CreatorProfileCard
          profile={profile}
          activeAccent={activeAccent}
          photoPreview={photoPreview}
          bannerPreview={bannerPreview}
          compact
          showBio
          showStory
        />
      </section>

      <section className="dashboardGrid">
        <section className="panel">
          <p className="panelLabel">Basic profile</p>

          <div className="formGrid">
            <label>
              Display name
              <input
                value={profile.displayName}
                onChange={(event) =>
                  updateProfile("displayName", event.target.value)
                }
              />
            </label>

            <label>
              Profile URL
              <div className="slugInputRow">
                <strong>/creator/</strong>

                <input
                  value={slug}
                  placeholder="peggy-lipton"
                  onChange={(event) => setSlug(slugify(event.target.value))}
                />
              </div>
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
          <p className="panelLabel">Long bio and writing</p>

          <div className="formGrid">
            <label className="wide">
              Long bio / creator story
              <textarea
                className="largeTextarea"
                value={profile.longBio}
                placeholder="Share a longer story about who you are, your work, your background, your mission, or your creative journey."
                onChange={(event) =>
                  updateProfile("longBio", event.target.value)
                }
              />
            </label>

            <label className="wide">
              Writing intro
              <textarea
                className="largeTextarea"
                value={profile.writingIntro}
                placeholder="Introduce your writing, essays, posts, reflections, creator notes, or thought leadership."
                onChange={(event) =>
                  updateProfile("writingIntro", event.target.value)
                }
              />
            </label>
          </div>
        </section>

        <section className="panel">
          <p className="panelLabel">Contact and links</p>

          <div className="formGrid">
            <label>
              Contact email
              <input
                type="email"
                value={profile.contactEmail}
                placeholder="hello@yourbrand.com"
                onChange={(event) =>
                  updateProfile("contactEmail", event.target.value)
                }
              />
            </label>

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

            <label className="wide">
              Social URL
              <input
                value={profile.socialUrl}
                placeholder="https://instagram.com/yourname"
                onChange={(event) =>
                  updateProfile("socialUrl", event.target.value)
                }
              />
            </label>

            <label>
              Featured link title
              <input
                value={profile.featuredLinkTitle}
                placeholder="Portfolio, Media Kit, Latest Work..."
                onChange={(event) =>
                  updateProfile("featuredLinkTitle", event.target.value)
                }
              />
            </label>

            <label>
              Featured link URL
              <input
                value={profile.featuredLinkUrl}
                placeholder="https://yourlink.com"
                onChange={(event) =>
                  updateProfile("featuredLinkUrl", event.target.value)
                }
              />
            </label>
          </div>
        </section>

        <section className="panel">
          <p className="panelLabel">Profile highlights</p>

          <div className="formGrid">
            <label>
              Follower count
              <input
                value={profile.followerCount}
                placeholder="25K, 125K, 1.2M..."
                onChange={(event) =>
                  updateProfile("followerCount", event.target.value)
                }
              />
            </label>

            <label>
              Engagement rate
              <input
                value={profile.engagementRate}
                placeholder="3.5%, 6%, 8.2%..."
                onChange={(event) =>
                  updateProfile("engagementRate", event.target.value)
                }
              />
            </label>

            <label>
              Min rate
              <input
                type="number"
                min="0"
                value={profile.minRate}
                placeholder="500"
                onChange={(event) => updateProfile("minRate", event.target.value)}
              />
            </label>

            <label>
              Max rate
              <input
                type="number"
                min="0"
                value={profile.maxRate}
                placeholder="2000"
                onChange={(event) => updateProfile("maxRate", event.target.value)}
              />
            </label>

            <label>
              Available for collabs
              <select
                value={profile.availableForCollabs ? "yes" : "no"}
                onChange={(event) =>
                  updateProfile("availableForCollabs", event.target.value === "yes")
                }
              >
                <option value="yes">Yes</option>
                <option value="no">Not right now</option>
              </select>
            </label>

            <label>
              Available from
              <select
                value={profile.availableFromMonth}
                onChange={(event) =>
                  updateProfile("availableFromMonth", event.target.value)
                }
              >
                <option value="">Select month</option>
                {monthOptions.map((month) => (
                  <option key={month}>{month}</option>
                ))}
              </select>
            </label>

            <label className="wide">
              Niche tags
              <div className="nicheTagGrid">
                {nicheOptions.map((tag) => {
                  const selected = profile.nicheTags?.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`nicheTag ${selected ? "selectedNicheTag" : ""}`}
                      onClick={() => toggleNicheTag(tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </label>

            <label>
              Profile style
              <select
                value={profile.profileStyle}
                onChange={(event) =>
                  updateProfile("profileStyle", event.target.value)
                }
              >
                <option>Simple Light</option>
                <option>Simple Dark</option>
              </select>
            </label>

            <label>
              Published
              <select
                value={profile.isPublished ? "yes" : "no"}
                onChange={(event) =>
                  updateProfile("isPublished", event.target.value === "yes")
                }
              >
                <option value="yes">Published</option>
                <option value="no">Hidden</option>
              </select>
            </label>
          </div>
        </section>

        <section className="panel">
          <p className="panelLabel">Photos and accent</p>

          <div className="uploadGroup">
            <div className="uploadBox">
              <div>
                <span>Profile photo</span>
                <strong>{photoFileName || "Choose a new profile photo"}</strong>
              </div>

              <input
                id="dashboardProfilePhoto"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoUpload}
              />

              <label className="uploadButton" htmlFor="dashboardProfilePhoto">
                Choose Photo
              </label>
            </div>

            <div className="uploadBox">
              <div>
                <span>Banner photo</span>
                <strong>{bannerFileName || "Choose a new banner photo"}</strong>
              </div>

              <input
                id="dashboardBannerPhoto"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleBannerUpload}
              />

              <label className="uploadButton" htmlFor="dashboardBannerPhoto">
                Choose Banner
              </label>
            </div>
          </div>

          <div className="accentGrid">
            {accentColors.map((accent) => (
              <button
                type="button"
                key={accent.name}
                className={`accentChoice ${
                  profile.accentName === accent.name ? "selectedAccent" : ""
                }`}
                style={{ "--swatch": accent.color }}
                onClick={() => {
                  updateProfile("accentName", accent.name);
                  updateProfile("accentColor", accent.color);
                }}
              >
                <span>
                  <img src={accent.image} alt={`${accent.name} logo`} />
                </span>
                <strong>{accent.name}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="panel boardCreatorPanel">
          <p className="panelLabel">Profile boards</p>

          <p className="panelIntro">
            Add style board cards to your public profile. Use these
            for current work, projects, campaign ideas, press, writing,
            resources, moodboards, or collaboration offers.
          </p>

          <div className="boardTypeGrid">
            {boardTypes.map((type) => (
              <button
                type="button"
                key={type.value}
                className={`boardTypeChoice ${
                  boardDraft.boardType === type.value ? "selectedBoardType" : ""
                }`}
                onClick={() => updateBoardDraft("boardType", type.value)}
              >
                <strong>{type.title}</strong>
                <span>{type.description}</span>
              </button>
            ))}
          </div>

          <div className="formGrid boardFormGrid">
            <label>
              Board card title
              <input
                value={boardDraft.title}
                placeholder="Summer recipe campaign, travel creator kit, media kit..."
                onChange={(event) =>
                  updateBoardDraft("title", event.target.value)
                }
              />
            </label>

            <label>
              Board category
              <select
                value={boardDraft.boardType}
                onChange={(event) =>
                  updateBoardDraft("boardType", event.target.value)
                }
              >
                <option value="project">Project Board</option>
                <option value="collaboration">Collaboration Board</option>
                <option value="highlight">Highlight Board</option>
                <option value="writing">Writing Board</option>
              </select>
            </label>

            <label className="wide">
              Board card description
              <textarea
                className="largeTextarea"
                value={boardDraft.description}
                placeholder="Describe this project, campaign, visual idea, collaboration offer, portfolio piece, or creator story. This appears on your public board card."
                onChange={(event) =>
                  updateBoardDraft("description", event.target.value)
                }
              />
            </label>

            <label>
              Board link
              <input
                value={boardDraft.linkUrl}
                placeholder="https://instagram.com/your-post"
                onChange={(event) =>
                  updateBoardDraft("linkUrl", event.target.value)
                }
              />
            </label>

            <div className="uploadBox compactUpload fieldUpload boardImageUpload">
              <div>
                <span>Board image</span>
                <strong>{boardImageFileName || "Choose a board image"}</strong>
                <small>
                  Best for style cards: vertical images, project
                  photos, campaign graphics, moodboards, or screenshots.
                </small>
              </div>

              <input
                id="boardImageUpload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleBoardImageUpload}
              />

              <label className="uploadButton" htmlFor="boardImageUpload">
                Choose Image
              </label>
            </div>
          </div>

          <div className="panelActions boardActions">
            <div>
              {boardStatus && <p className="success">{boardStatus}</p>}
              {boardError && <p className="error">{boardError}</p>}
            </div>

            <button
              type="button"
              onClick={handleSaveBoardItem}
              disabled={savingBoard}
            >
              {savingBoard ? "Saving..." : "Add to Public Boards"}
            </button>
          </div>
        </section>

        <section className="panel exchangePanel">
          <p className="panelLabel">Post to Impact Exchange</p>

          <p className="panelIntro">
            Share a creator opportunity, collaboration update, project, or
            availability post to the shared Impact Exchange feed.
          </p>

          <div className="formGrid">
            <label>
              Post title
              <input
                value={exchangePost.title}
                placeholder="Looking for brand collaborations"
                onChange={(event) =>
                  updateExchangePost("title", event.target.value)
                }
              />
            </label>

            <label>
              Post type
              <select
                value={exchangePost.postType}
                onChange={(event) =>
                  updateExchangePost("postType", event.target.value)
                }
              >
                {exchangePostTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="wide">
              Post details
              <textarea
                className="largeTextarea"
                value={exchangePost.body}
                placeholder="Tell brands or collaborators what you are sharing, what you are looking for, or what project you want people to know about."
                onChange={(event) =>
                  updateExchangePost("body", event.target.value)
                }
              />
            </label>

            <label>
              Link URL
              <input
                value={exchangePost.postUrl}
                placeholder="https://yourlink.com"
                onChange={(event) =>
                  updateExchangePost("postUrl", event.target.value)
                }
              />
            </label>

            <label>
              Published
              <select
                value={exchangePost.isPublished ? "yes" : "no"}
                onChange={(event) =>
                  updateExchangePost(
                    "isPublished",
                    event.target.value === "yes"
                  )
                }
              >
                <option value="yes">Publish now</option>
                <option value="no">Save hidden</option>
              </select>
            </label>

            <div className="uploadBox compactUpload fieldUpload">
              <div>
                <span>Post photos or video</span>

                <strong>
                  {exchangeMediaFileNames || "4 images max or 1 video"}
                </strong>

                <small>
                  Images: JPEG, PNG, WEBP up to {maxImageSizeMb} MB each.
                  Video: MP4, WEBM, MOV up to {maxVideoSizeMb} MB.
                </small>
              </div>

              <input
                id="exchangePostMediaUpload"
                type="file"
                accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime"
                multiple
                onChange={handleExchangeMediaUpload}
              />

              <label className="uploadButton" htmlFor="exchangePostMediaUpload">
                Choose Media
              </label>
            </div>
          </div>

          <div className="exchangeActions">
            <div>
              {exchangeStatus && <p className="success">{exchangeStatus}</p>}
              {exchangeError && <p className="error">{exchangeError}</p>}
            </div>

            <button
              type="button"
              onClick={handleCreateExchangePost}
              disabled={postingExchange}
            >
              {postingExchange ? "Posting..." : "Post to Impact Exchange"}
            </button>
          </div>
        </section>
      </section>

      <section className="saveBar">
        <div>
          {status && <p className="success">{status}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>

        <div className="saveActions">
          {publicProfileUrl && (
            <a href={publicProfileUrl} target="_blank" rel="noopener noreferrer">
              View Public Profile
            </a>
          )}

          <button type="button" onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </section>

      <style jsx global>{dashboardStyles}</style>
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

const dashboardStyles = `
  .dashboardPage {
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

  .dashboardHero {
    width: min(1240px, 100%);
    margin: 42px auto 0;
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(360px, 0.62fr);
    gap: 28px;
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
    max-width: 620px;
    margin: 14px 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.7rem, 7vw, 5.4rem);
    letter-spacing: -0.06em;
    line-height: 0.96;
  }

  .dashboardHero p:not(.eyebrow) {
    max-width: 680px;
    margin: 22px 0 0;
    color: rgba(255,255,255,0.7);
    font-size: 1.05rem;
    line-height: 1.7;
  }

  .profileUrlBox {
    display: inline-grid;
    gap: 6px;
    margin-top: 24px;
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 18px;
    background: rgba(255,255,255,0.07);
    padding: 14px 16px;
  }

  .profileUrlBox span {
    color: rgba(255,255,255,0.58);
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .profileUrlBox a {
    color: var(--accent, #00e8f0);
    font-weight: 950;
    text-decoration: none;
  }

  .dashboardGrid {
    width: min(1240px, 100%);
    margin: 32px auto 120px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .panel {
    min-width: 0;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 26px;
    background: rgba(255,255,255,0.07);
    padding: 20px;
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
    min-height: 116px;
    padding: 14px;
    resize: vertical;
  }

  .largeTextarea {
    min-height: 160px;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: var(--accent, #00e8f0);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent, #00e8f0) 18%, transparent);
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(255,255,255,0.45);
  }

  select option {
    background: #101820;
    color: #ffffff;
  }

  .nicheTagGrid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 2px;
  }

  .nicheTag {
    min-height: 36px;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.82);
    cursor: pointer;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 950;
    padding: 0 13px;
  }

  .selectedNicheTag {
    border-color: var(--accent, #00e8f0);
    background: color-mix(in srgb, var(--accent, #00e8f0) 18%, rgba(255,255,255,0.08));
    color: #ffffff;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #00e8f0) 16%, transparent);
  }

  .slugInputRow {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 13px;
    background: rgba(255,255,255,0.1);
    overflow: hidden;
  }

  .slugInputRow strong {
    padding: 0 12px;
    color: rgba(255,255,255,0.62);
  }

  .slugInputRow input {
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .uploadGroup {
    display: grid;
    gap: 14px;
    margin-top: 18px;
  }

  .uploadBox {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 14px;
    align-items: center;
    border: 1px dashed color-mix(in srgb, var(--accent, #00e8f0) 45%, rgba(255,255,255,0.18));
    border-radius: 18px;
    background: rgba(255,255,255,0.06);
    padding: 16px;
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
    font-size: 0.78rem;
    line-height: 1.4;
  }

  .uploadBox input {
    display: none;
  }

  .uploadButton,
  .panelActions button,
  .exchangeActions button,
  .saveActions button,
  .saveActions a {
    min-height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 999px;
    background: var(--accent, #00e8f0);
    color: #020617;
    cursor: pointer;
    font: inherit;
    font-size: 0.86rem;
    font-weight: 950;
    padding: 0 18px;
    text-decoration: none;
  }

  .saveActions a {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.16);
    color: #ffffff;
  }

  .accentGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 18px;
  }

  .accentChoice {
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 18px;
    background: rgba(255,255,255,0.07);
    color: #ffffff;
    cursor: pointer;
    display: grid;
    gap: 8px;
    justify-items: center;
    padding: 14px 10px;
  }

  .accentChoice span {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: #000000;
  }

  .accentChoice img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  .accentChoice strong {
    color: var(--swatch);
    font-size: 0.76rem;
    font-weight: 950;
  }

  .selectedAccent {
    border-color: var(--accent, #00e8f0);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #00e8f0) 22%, transparent);
  }

  .boardCreatorPanel {
    grid-column: span 2;
    border-color: color-mix(
      in srgb,
      var(--accent, #00e8f0) 34%,
      rgba(255,255,255,0.12)
    );
    background:
      radial-gradient(
        circle at 92% 10%,
        color-mix(in srgb, var(--accent, #00e8f0) 18%, transparent),
        transparent 28%
      ),
      rgba(255,255,255,0.07);
  }

  .boardTypeGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-top: 18px;
  }

  .boardTypeChoice {
    min-height: 142px;
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 22px;
    background: rgba(255,255,255,0.07);
    color: #ffffff;
    cursor: pointer;
    padding: 16px;
    text-align: left;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      background 180ms ease;
  }

  .boardTypeChoice:hover {
    transform: translateY(-3px);
    border-color: color-mix(
      in srgb,
      var(--accent, #00e8f0) 54%,
      rgba(255,255,255,0.13)
    );
  }

  .selectedBoardType {
    border-color: var(--accent, #00e8f0);
    background:
      radial-gradient(
        circle at 86% 12%,
        color-mix(in srgb, var(--accent, #00e8f0) 26%, transparent),
        transparent 32%
      ),
      rgba(255,255,255,0.12);
    box-shadow: 0 18px 46px
      color-mix(in srgb, var(--accent, #00e8f0) 18%, transparent);
  }

  .boardTypeChoice strong {
    display: block;
    color: var(--accent, #00e8f0);
    font-size: 0.88rem;
    font-weight: 950;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .boardTypeChoice span {
    display: block;
    margin-top: 10px;
    color: rgba(255,255,255,0.7);
    font-size: 0.82rem;
    font-weight: 700;
    line-height: 1.45;
  }

  .boardFormGrid {
    margin-top: 18px;
  }

  .boardImageUpload {
    border-color: color-mix(
      in srgb,
      var(--accent, #00e8f0) 34%,
      rgba(255,255,255,0.16)
    );
    background:
      radial-gradient(
        circle at 92% 16%,
        color-mix(in srgb, var(--accent, #00e8f0) 16%, transparent),
        transparent 28%
      ),
      rgba(255,255,255,0.06);
  }

  .exchangePanel {
    grid-column: span 2;
    border-color: color-mix(in srgb, var(--accent, #00e8f0) 34%, rgba(255,255,255,0.12));
    background:
      radial-gradient(
        circle at 85% 12%,
        color-mix(in srgb, var(--accent, #00e8f0) 16%, transparent),
        transparent 28%
      ),
      rgba(255,255,255,0.07);
  }

  .panelActions,
  .exchangeActions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 18px;
  }

  .success,
  .error {
    margin: 0;
    font-size: 0.88rem;
    font-weight: 900;
    line-height: 1.45;
  }

  .success {
    color: var(--accent, #00e8f0);
  }

  .error {
    color: #ff6a61;
  }

  .saveBar {
    position: fixed;
    left: 50%;
    bottom: 22px;
    z-index: 50;
    width: min(1240px, calc(100% - 56px));
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    background: rgba(2, 6, 23, 0.92);
    backdrop-filter: blur(18px);
    padding: 16px;
    box-shadow: 0 24px 70px rgba(0,0,0,0.32);
  }

  .saveActions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  @media (max-width: 980px) {
    .dashboardPage {
      padding: 18px;
    }

    .dashboardHeader,
    .dashboardHero,
    .dashboardGrid {
      width: 100%;
    }

    .dashboardHeader,
    .saveBar {
      align-items: flex-start;
      flex-direction: column;
    }

    nav,
    .saveActions {
      flex-wrap: wrap;
    }

    .dashboardHero {
      grid-template-columns: 1fr;
    }

    .dashboardGrid {
      grid-template-columns: 1fr;
    }

    .boardCreatorPanel,
    .exchangePanel {
      grid-column: span 1;
    }

    .boardTypeGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .formGrid {
      grid-template-columns: 1fr;
    }

    label.wide {
      grid-column: span 1;
    }

    .accentGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .saveBar {
      left: 18px;
      right: 18px;
      width: auto;
      transform: none;
    }
  }

  @media (max-width: 620px) {
    .boardTypeGrid {
      grid-template-columns: 1fr;
    }

    .uploadBox {
      grid-template-columns: 1fr;
    }

    h1 {
      font-size: 3rem;
    }
  }
`;