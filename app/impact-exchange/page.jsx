"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const filters = ["All", "Creators", "Brands"];

const accentLogoImages = {
  "Electric Cyan": "/logo-colors/impact-logo-electric-cyan.png",
  Orange: "/logo-colors/impact-logo-orange.png",
  Pink: "/logo-colors/impact-logo-pink.png",
  Purple: "/logo-colors/impact-logo-purple.png",
  "Emerald Green": "/logo-colors/impact-logo-emerald-green.png",
  White: "/logo-colors/impact-logo-white.png",
};

export default function ImpactExchangePage() {
  const [user, setUser] = useState(null);
  const [dashboardPath, setDashboardPath] = useState("/dashboard/profile");
  const [posts, setPosts] = useState([]);
  const [profileMap, setProfileMap] = useState({});
  const [brandMap, setBrandMap] = useState({});
  const [sidebarCreators, setSidebarCreators] = useState([]);
  const [sidebarBrands, setSidebarBrands] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user || null);

    if (user) {
      await resolveDashboardPath(user.id);
    }

    const { data, error } = await supabase
      .from("impact_exchange_posts")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const loadedPosts = data || [];
    setPosts(loadedPosts);

    await loadProfilesForPosts(loadedPosts);
    await loadSidebarProfiles();
    await loadInteractionCounts(loadedPosts, user || null);
    await loadSavedPosts(loadedPosts, user || null);

    setLoading(false);
  }

  async function resolveDashboardPath(userId) {
    const { data: brandProfile } = await supabase
      .from("brand_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (brandProfile) {
      setDashboardPath("/dashboard/brand");
      return;
    }

    const { data: creatorProfile } = await supabase
      .from("creator_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (creatorProfile) {
      setDashboardPath("/dashboard/profile");
      return;
    }

    setDashboardPath("/create-profile/free");
  }

  async function loadProfilesForPosts(loadedPosts) {
    const creatorIds = [
      ...new Set(
        loadedPosts
          .filter((post) => post.creator_profile_id)
          .map((post) => post.creator_profile_id)
      ),
    ];

    const brandIds = [
      ...new Set(
        loadedPosts
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

  async function loadSidebarProfiles() {
    const { data: creators, error: creatorError } = await supabase
      .from("creator_profiles")
      .select(
        "id, slug, display_name, creator_type, location, profile_photo_url, accent_name, accent_color, updated_at"
      )
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .limit(6);

    if (creatorError) {
      console.warn("LOAD SIDEBAR CREATORS ERROR:", creatorError);
      setSidebarCreators([]);
    } else {
      setSidebarCreators(creators || []);
    }

    const { data: brands, error: brandError } = await supabase
      .from("brand_profiles")
      .select(
        "id, slug, company_name, brand_type, industry, location, logo_url, accent_name, accent_color, updated_at"
      )
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .limit(6);

    if (brandError) {
      console.warn("LOAD SIDEBAR BRANDS ERROR:", brandError);
      setSidebarBrands([]);
    } else {
      setSidebarBrands(brands || []);
    }
  }

  async function loadInteractionCounts(loadedPosts, currentUser) {
    const postIds = loadedPosts.map((post) => post.id);

    if (postIds.length === 0) {
      setLikeCounts({});
      setCommentCounts({});
      setUserLikes({});
      return;
    }

    const { data: likes } = await supabase
      .from("impact_exchange_likes")
      .select("id, post_id, user_id")
      .in("post_id", postIds);

    const { data: comments } = await supabase
      .from("impact_exchange_comments")
      .select("id, post_id")
      .in("post_id", postIds);

    const nextLikeCounts = {};
    const nextCommentCounts = {};
    const nextUserLikes = {};

    postIds.forEach((postId) => {
      nextLikeCounts[postId] = 0;
      nextCommentCounts[postId] = 0;
      nextUserLikes[postId] = false;
    });

    (likes || []).forEach((like) => {
      nextLikeCounts[like.post_id] = (nextLikeCounts[like.post_id] || 0) + 1;

      if (currentUser && like.user_id === currentUser.id) {
        nextUserLikes[like.post_id] = true;
      }
    });

    (comments || []).forEach((comment) => {
      nextCommentCounts[comment.post_id] =
        (nextCommentCounts[comment.post_id] || 0) + 1;
    });

    setLikeCounts(nextLikeCounts);
    setCommentCounts(nextCommentCounts);
    setUserLikes(nextUserLikes);
  }

  async function loadSavedPosts(loadedPosts, currentUser) {
    const postIds = loadedPosts.map((post) => post.id);

    if (!currentUser || postIds.length === 0) {
      setSavedPosts({});
      return;
    }

    const { data, error } = await supabase
      .from("impact_exchange_saved_posts")
      .select("id, post_id")
      .eq("user_id", currentUser.id)
      .in("post_id", postIds);

    if (error) {
      console.warn("LOAD SAVED POSTS ERROR:", error);
      setSavedPosts({});
      return;
    }

    const nextSavedPosts = {};

    (data || []).forEach((savedPost) => {
      nextSavedPosts[savedPost.post_id] = true;
    });

    setSavedPosts(nextSavedPosts);
  }

  async function toggleLike(postId) {
    if (!user) {
      window.location.assign("/login?redirect=/impact-exchange");
      return;
    }

    const alreadyLiked = userLikes[postId];

    if (alreadyLiked) {
      const { error } = await supabase
        .from("impact_exchange_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) {
        alert(error.message);
        return;
      }

      setUserLikes((current) => ({
        ...current,
        [postId]: false,
      }));

      setLikeCounts((current) => ({
        ...current,
        [postId]: Math.max((current[postId] || 1) - 1, 0),
      }));

      return;
    }

    const { error } = await supabase.from("impact_exchange_likes").insert({
      post_id: postId,
      user_id: user.id,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setUserLikes((current) => ({
      ...current,
      [postId]: true,
    }));

    setLikeCounts((current) => ({
      ...current,
      [postId]: (current[postId] || 0) + 1,
    }));
  }

  async function sharePost(post) {
    const postUrl = `${window.location.origin}/impact-exchange`;
    const shareTitle = post.title || "Impact Exchange post";
    const shareText = post.body || "Check out this post on Impact Creator Hub.";

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: postUrl,
        });
        return;
      } catch (error) {
        console.warn("Share cancelled or failed:", error);
      }
    }

    try {
      await navigator.clipboard.writeText(postUrl);
      alert("Post link copied.");
    } catch (error) {
      alert("Could not copy the link.");
    }
  }

  async function toggleSave(postId) {
    if (!user) {
      window.location.assign("/login?redirect=/impact-exchange");
      return;
    }

    const alreadySaved = savedPosts[postId];

    if (alreadySaved) {
      const { error } = await supabase
        .from("impact_exchange_saved_posts")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) {
        alert(error.message);
        return;
      }

      setSavedPosts((current) => ({
        ...current,
        [postId]: false,
      }));

      return;
    }

    const { error } = await supabase.from("impact_exchange_saved_posts").insert({
      post_id: postId,
      user_id: user.id,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSavedPosts((current) => ({
      ...current,
      [postId]: true,
    }));
  }

  async function toggleComments(postId) {
    const willOpen = !openComments[postId];

    setOpenComments((current) => ({
      ...current,
      [postId]: willOpen,
    }));

    if (willOpen && !commentsByPost[postId]) {
      await loadComments(postId);
    }
  }

  async function loadComments(postId) {
    const { data, error } = await supabase
      .from("impact_exchange_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setCommentsByPost((current) => ({
      ...current,
      [postId]: data || [],
    }));
  }

  async function submitComment(postId) {
    if (!user) {
      window.location.assign("/login?redirect=/impact-exchange");
      return;
    }

    const body = (commentDrafts[postId] || "").trim();

    if (!body) {
      return;
    }

    const post = posts.find((item) => item.id === postId);

    const { error } = await supabase.from("impact_exchange_comments").insert({
      post_id: postId,
      user_id: user.id,
      author_name: user.user_metadata?.full_name || user.email || "Member",
      author_type: post?.author_type || "member",
      body,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      alert(error.message);
      return;
    }

    setCommentDrafts((current) => ({
      ...current,
      [postId]: "",
    }));

    setCommentCounts((current) => ({
      ...current,
      [postId]: (current[postId] || 0) + 1,
    }));

    await loadComments(postId);

    setOpenComments((current) => ({
      ...current,
      [postId]: false,
    }));
  }

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") {
      return posts;
    }

    if (activeFilter === "Creators") {
      return posts.filter(
        (post) => post.author_type?.toLowerCase() === "creator"
      );
    }

    if (activeFilter === "Brands") {
      return posts.filter(
        (post) => post.author_type?.toLowerCase() === "brand"
      );
    }

    return posts;
  }, [posts, activeFilter]);

  const featuredCreators = sidebarCreators.slice(0, 3);
  const featuredBrands = sidebarBrands.slice(0, 3);

  return (
    <main className="exchangePage">
      <header className="exchangeHeader">
        <a href="/" className="brandHeader">
          <img src="/logo-ripple.png" alt="Impact Creator Hub logo" />

          <div>
            <strong>Impact Creator Hub</strong>
            <span>
              BUILD YOUR BRAND. <em>GROW YOUR IMPACT.</em>
            </span>
          </div>
        </a>

        <nav className="topMenu">
          <a href="/impact-exchange" className="activeTopMenu">
            Exchange
          </a>
          <a href={dashboardPath}>Dashboard</a>
          <a href="/dashboard/post">Post</a>
          <a href="/dashboard/saved">Saved</a>
        </nav>

        <div className="topIconGroup">
          <button type="button" className="topIconButton" aria-label="Search">
            ⌕
          </button>

          <button
            type="button"
            className="topIconButton"
            aria-label="Notifications"
          >
            🔔
            <span className="notificationDot"></span>
          </button>

          {user ? (
            <a href={dashboardPath} className="topProfileButton">
              {user.email?.charAt(0)?.toUpperCase() || "I"}
            </a>
          ) : (
            <a href="/login?redirect=/impact-exchange" className="loginButton">
              Log In
            </a>
          )}
        </div>
      </header>

      <section className="exchangeLayout">
        <aside className="leftMenu">
          <a href={dashboardPath} className="leftMenuItem">
            <span>🏠</span>
            Dashboard
          </a>

          <a href={dashboardPath} className="leftMenuItem">
            <span>👤</span>
            Profile
          </a>

          <a href="/dashboard/post" className="leftMenuItem">
            <span>✍️</span>
            Create Post
          </a>

          <a href="/create-postcard" className="leftMenuItem">
            <span>💌</span>
            Postcard
          </a>

          <a href="/dashboard/saved" className="leftMenuItem">
            <span>🔖</span>
            Saved
          </a>

          <a href="/dashboard/inquiries" className="leftMenuItem">
            <span>💬</span>
            Inquiries
          </a>

          <a href="/impact-exchange" className="leftMenuItem activeLeftMenu">
            <span>🌐</span>
            Exchange
          </a>
        </aside>

        <section className="feedColumn">
          <div className="feedTitleRow">
            <p className="feedKicker">Impact Exchange</p>
          </div>

          <div className="quickPostCard">
            <div className="quickPostTop">
              <div className="quickPostAvatar">
                {user ? user.email?.charAt(0)?.toUpperCase() || "I" : "I"}
              </div>

              <a
                href={user ? "/dashboard/post" : "/login?redirect=/dashboard/post"}
                className="quickPostInput"
              >
                What do you want to share today?
              </a>
            </div>

            <div className="quickPostActions">
              <a href={user ? "/dashboard/post" : "/login?redirect=/dashboard/post"}>
                🖼 Photo/video
              </a>

              <a href={user ? "/create-postcard" : "/login?redirect=/create-postcard"}>
                💌 Postcard
              </a>

              <a href={user ? "/dashboard/post" : "/login?redirect=/dashboard/post"}>
                ✨ Collaboration
              </a>
            </div>
          </div>

          {loading && (
            <div className="statusCard">
              <p>Loading Impact Exchange posts...</p>
            </div>
          )}

          {error && (
            <div className="errorCard">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredPosts.length === 0 && (
            <div className="statusCard">
              <p>
                No{" "}
                {activeFilter === "All"
                  ? ""
                  : activeFilter.toLowerCase().slice(0, -1) + " "}
                posts yet.
              </p>

              <span>
                {activeFilter === "All"
                  ? "Brand and creator posts will appear here once they are published."
                  : `${activeFilter} posts will appear here once they are published.`}
              </span>
            </div>
          )}

          {!loading && !error && filteredPosts.length > 0 && (
            <div className="postFeed">
              {filteredPosts.map((post) => (
                <ExchangePostCard
                  key={post.id}
                  post={post}
                  profile={profileMap[post.creator_profile_id]}
                  brand={brandMap[post.brand_profile_id]}
                  likeCount={likeCounts[post.id] || 0}
                  commentCount={commentCounts[post.id] || 0}
                  likedByUser={userLikes[post.id] || false}
                  savedByUser={savedPosts[post.id] || false}
                  comments={commentsByPost[post.id] || []}
                  commentDraft={commentDrafts[post.id] || ""}
                  commentsOpen={openComments[post.id] || false}
                  onToggleLike={() => toggleLike(post.id)}
                  onToggleSave={() => toggleSave(post.id)}
                  onToggleComments={() => toggleComments(post.id)}
                  onShare={() => sharePost(post)}
                  onCommentDraftChange={(value) =>
                    setCommentDrafts((current) => ({
                      ...current,
                      [post.id]: value,
                    }))
                  }
                  onSubmitComment={() => submitComment(post.id)}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="rightColumn">
          <div className="filterRow">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={activeFilter === filter ? "activeFilter" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {(activeFilter === "All" || activeFilter === "Creators") && (
            <SidebarCard title="Published creators">
              {featuredCreators.length > 0 ? (
                featuredCreators.map((creator) => (
                  <SidebarProfile
                    key={creator.id}
                    type="creator"
                    profile={creator}
                  />
                ))
              ) : (
                <EmptySidebarMessage text="No published creators yet." />
              )}
            </SidebarCard>
          )}

          {(activeFilter === "All" || activeFilter === "Brands") && (
            <SidebarCard title="Published brands">
              {featuredBrands.length > 0 ? (
                featuredBrands.map((brand) => (
                  <SidebarProfile key={brand.id} type="brand" profile={brand} />
                ))
              ) : (
                <EmptySidebarMessage text="No published brands yet." />
              )}
            </SidebarCard>
          )}

          <SidebarCard title="Exchange status">
            <div className="exchangeStats">
              <div>
                <strong>{posts.length}</strong>
                <span>Total posts</span>
              </div>

              <div>
                <strong>
                  {
                    posts.filter(
                      (post) => post.author_type?.toLowerCase() === "creator"
                    ).length
                  }
                </strong>
                <span>Creator posts</span>
              </div>

              <div>
                <strong>
                  {
                    posts.filter(
                      (post) => post.author_type?.toLowerCase() === "brand"
                    ).length
                  }
                </strong>
                <span>Brand posts</span>
              </div>
            </div>
          </SidebarCard>

          {!user && (
            <div className="signInCard">
              <div className="lockCircle">+</div>

              <div>
                <h3>Sign in to post</h3>
                <p>
                  Join Impact Creator Hub to connect, collaborate, and grow your
                  impact.
                </p>
              </div>

              <a href="/login?redirect=/impact-exchange">Log In</a>
            </div>
          )}
        </aside>
      </section>

      <style jsx global>{exchangeStyles}</style>
    </main>
  );
}

function ExchangePostCard({
  post,
  profile,
  brand,
  likeCount,
  commentCount,
  likedByUser,
  savedByUser,
  comments,
  commentDraft,
  commentsOpen,
  onToggleLike,
  onToggleSave,
  onToggleComments,
  onShare,
  onCommentDraftChange,
  onSubmitComment,
}) {
  const isBrand = post.author_type?.toLowerCase() === "brand";

  const authorName = isBrand
    ? brand?.company_name || post.author_name || post.brand_slug || "Brand"
    : profile?.display_name ||
      post.author_name ||
      post.creator_slug ||
      "Impact Creator Hub Member";

  const authorType = isBrand
    ? brand?.brand_type || brand?.industry || "Brand"
    : profile?.creator_type || "Creator";

  const location = isBrand ? brand?.location : profile?.location;

  const profileUrl = isBrand
    ? brand?.slug
      ? `/brand/${brand.slug}`
      : post.brand_slug
        ? `/brand/${post.brand_slug}`
        : ""
    : profile?.slug
      ? `/creator/${profile.slug}`
      : post.creator_slug
        ? `/creator/${post.creator_slug}`
        : "";

  const avatarUrl = isBrand ? brand?.logo_url : profile?.profile_photo_url;

  const bannerUrl =
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
      className="postCard"
      style={{
        "--post-accent": accentColor,
      }}
    >
      {bannerUrl ? (
        <div
          className="postBanner"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(5, 9, 20, 0.04), rgba(5, 9, 20, 0.18)), url(${bannerUrl})`,
          }}
        />
      ) : (
        <div className="postBanner emptyBanner" />
      )}

      <div className="postInner">
        <div className="postHeader">
          <div className="avatarWrap">
            {avatarUrl ? (
              <img src={avatarUrl} alt={authorName} className="postAvatar" />
            ) : (
              <div className="postAvatar avatarFallback">
                {authorName?.charAt(0) || "I"}
              </div>
            )}

            <img src={accentImage} alt="" className="accentBadge" />
          </div>

          <div className="postAuthor">
            <div className="authorNameLine">
              {profileUrl ? (
                <a href={profileUrl}>{authorName}</a>
              ) : (
                <strong>{authorName}</strong>
              )}

              <span className={isBrand ? "brandBadge" : "creatorBadge"}>
                {isBrand ? "Brand" : "Creator"}
              </span>
            </div>

            <p>
              {authorType}
              {location ? ` · ${location}` : ""}
            </p>
          </div>
        </div>

        <div className="postBody">
          <h2>{post.title || "Untitled post"}</h2>

          {post.body && <p>{post.body}</p>}
        </div>

        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="postLinkPreview"
          >
            Open link
          </a>
        )}

        <div className="postActions">
          <button
            type="button"
            className={likedByUser ? "likedButton" : ""}
            onClick={onToggleLike}
          >
            {likedByUser ? "♥" : "♡"} {likeCount}
          </button>

          <button type="button" onClick={onToggleComments}>
            □ {commentCount}
          </button>

          <button type="button" onClick={onShare}>
            Share
          </button>

          <button
            type="button"
            className={savedByUser ? "savedButton" : ""}
            onClick={onToggleSave}
          >
            {savedByUser ? "Saved" : "Save"}
          </button>
        </div>

        {commentsOpen && (
          <div className="commentsPanel">
            {comments.length > 0 && (
              <div className="commentList">
                {comments.map((comment) => (
                  <div className="commentItem" key={comment.id}>
                    <strong>{comment.author_name || "Member"}</strong>
                    <p>{comment.body}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="commentForm">
              <input
                value={commentDraft}
                placeholder="Write a comment..."
                onChange={(event) => onCommentDraftChange(event.target.value)}
              />

              <button type="button" onClick={onSubmitComment}>
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function SidebarCard({ title, children }) {
  return (
    <section className="sidebarCard">
      <div className="sidebarCardHeader">
        <h2>{title}</h2>
      </div>

      <div className="sidebarList">{children}</div>
    </section>
  );
}

function SidebarProfile({ type, profile }) {
  const isBrand = type === "brand";

  const name = isBrand
    ? profile.company_name || "Brand"
    : profile.display_name || "Creator";

  const label = isBrand
    ? profile.brand_type || profile.industry || "Brand"
    : profile.creator_type || "Creator";

  const location = profile.location || "";

  const avatarUrl = isBrand ? profile.logo_url : profile.profile_photo_url;

  const profileUrl = isBrand
    ? profile.slug
      ? `/brand/${profile.slug}`
      : ""
    : profile.slug
      ? `/creator/${profile.slug}`
      : "";

  const accentImage =
    accentLogoImages[profile.accent_name] ||
    "/logo-colors/impact-logo-electric-cyan.png";

  return (
    <div className="sidebarPerson">
      <div className="sidebarAvatarGroup">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="sidebarAvatar" />
        ) : (
          <div className="sidebarAvatar">{name?.charAt(0) || "I"}</div>
        )}

        <img src={accentImage} alt="" className="sidebarAccent" />
      </div>

      <div>
        {profileUrl ? (
          <a href={profileUrl} className="sidebarNameLink">
            {name}
          </a>
        ) : (
          <strong>{name}</strong>
        )}

        <p>{isBrand ? "Brand" : "Creator"}</p>

        <p>
          {label}
          {location ? ` · ${location}` : ""}
        </p>
      </div>
    </div>
  );
}

function EmptySidebarMessage({ text }) {
  return <p className="emptySidebarMessage">{text}</p>;
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

const exchangeStyles = `
  .exchangePage {
    min-height: 100vh;
    background: #f7f8fb;
    color: #10172f;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .exchangeHeader {
    width: 100%;
    min-height: 78px;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    border-bottom: 1px solid rgba(16, 23, 47, 0.1);
    padding: 16px 32px;
  }

  .brandHeader {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #10172f;
    text-decoration: none;
  }

  .brandHeader img {
    width: 52px;
    height: 52px;
    background: #000000;
    object-fit: contain;
  }

  .brandHeader strong {
    display: block;
    font-size: 1.1rem;
    font-weight: 950;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .brandHeader span {
    display: block;
    margin-top: 7px;
    color: rgba(16,23,47,0.62);
    font-size: 0.48rem;
    font-weight: 950;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .brandHeader em {
    color: #ff8c82;
    font-style: normal;
  }

  .topMenu {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .topMenu a {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    color: rgba(16,23,47,0.68);
    font-size: 0.86rem;
    font-weight: 900;
    padding: 0 14px;
    text-decoration: none;
  }

  .topMenu a:hover,
  .topMenu .activeTopMenu {
    background: #ffffff;
    color: #008b94;
    box-shadow: 0 8px 22px rgba(16,23,47,0.06);
  }

  .topIconGroup {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .topIconButton,
  .topProfileButton {
    position: relative;
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border: 1px solid #e6e8ef;
    border-radius: 999px;
    background: #ffffff;
    color: #10172f;
    box-shadow: 0 8px 22px rgba(16,23,47,0.06);
    cursor: pointer;
    font: inherit;
    font-weight: 950;
    text-decoration: none;
  }

  .notificationDot {
    position: absolute;
    top: 7px;
    right: 8px;
    width: 8px;
    height: 8px;
    border: 2px solid #ffffff;
    border-radius: 999px;
    background: #ff6b61;
  }

  .loginButton {
    min-height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #00aeb8;
    border-radius: 14px;
    color: #008b94;
    background: #ffffff;
    font-weight: 950;
    padding: 0 22px;
    text-decoration: none;
    box-shadow: 0 8px 22px rgba(16,23,47,0.06);
  }

  .exchangeLayout {
    width: 100%;
    margin: 0;
    display: grid;
    grid-template-columns: 250px 50px 650px minmax(80px, 1fr) 380px;
    column-gap: 0;
    row-gap: 24px;
    align-items: start;
    justify-content: stretch;
    padding: 24px 20px 80px;
  }

  .leftMenu {
    position: sticky;
    top: 18px;
    display: grid;
    gap: 8px;
    grid-column: 1;
    justify-self: start;
    width: 250px;
  }

  .leftMenuItem {
    min-height: 46px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 14px;
    color: rgba(16,23,47,0.76);
    font-size: 0.92rem;
    font-weight: 900;
    padding: 0 12px;
    text-decoration: none;
  }

  .leftMenuItem span {
    width: 26px;
    display: inline-flex;
    justify-content: center;
  }

  .leftMenuItem:hover,
  .leftMenuItem.activeLeftMenu {
    background: #ffffff;
    color: #008b94;
    box-shadow: 0 8px 22px rgba(16,23,47,0.06);
  }

  .feedColumn {
    grid-column: 3;
    min-width: 0;
    width: 650px;
  }

  .feedTitleRow {
    margin-bottom: 12px;
  }

  .feedKicker {
    margin: 0;
    color: #00aeb8;
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .quickPostCard {
    width: 650px;
    margin-bottom: 14px;
    border: 1px solid #e6e8ef;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 14px 36px rgba(16, 23, 47, 0.08);
    padding: 10px 16px;
  }

  .quickPostTop {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    gap: 12px;
  }

  .quickPostAvatar {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: #020617;
    color: #ffffff;
    font-weight: 950;
  }

  .quickPostInput {
    min-height: 40px;
    display: flex;
    align-items: center;
    border-radius: 999px;
    background: #f7f8fb;
    color: rgba(16,23,47,0.56);
    font-size: 0.95rem;
    font-weight: 800;
    padding: 0 18px;
    text-decoration: none;
  }

  .quickPostInput:hover {
    background: #eef2f7;
  }

  .quickPostActions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 8px;
    border-top: 1px solid #eef0f5;
    padding-top: 6px;
  }

  .quickPostActions a {
    min-height: 30px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    color: rgba(16,23,47,0.7);
    font-size: 0.84rem;
    font-weight: 900;
    text-decoration: none;
  }

  .quickPostActions a:hover {
    background: #f7f8fb;
    color: #008b94;
  }

  .postFeed {
    display: grid;
    gap: 10px;
  }

  .postCard {
    width: 650px;
    overflow: hidden;
    border: 1px solid #e6e8ef;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 14px 36px rgba(16, 23, 47, 0.08);
  }

  .postBanner {
    width: 650px;
    height: 500px;
    background-color: #eef2f7;
    background-size: cover;
    background-position: center;
  }

  .emptyBanner {
    background:
      radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--post-accent, #00e8f0) 22%, transparent), transparent 30%),
      linear-gradient(135deg, #f4f7fb, #eef2f7);
  }

  .postInner {
    padding: 16px 18px 10px;
  }

  .postHeader {
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
    border: 3px solid #ffffff;
    border-radius: 999px;
    background: #000000;
    object-fit: cover;
  }

  .postAuthor {
    min-width: 0;
    flex: 1;
  }

  .authorNameLine {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .authorNameLine a,
  .authorNameLine strong {
    color: #10172f;
    font-size: 1rem;
    font-weight: 950;
    text-decoration: none;
  }

  .postAuthor p {
    margin: 4px 0 0;
    color: rgba(16,23,47,0.56);
    font-size: 0.82rem;
    font-weight: 750;
  }

  .brandBadge,
  .creatorBadge {
    min-height: 24px;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 950;
    padding: 0 9px;
  }

  .creatorBadge {
    background: rgba(0,174,184,0.12);
    color: #008b94;
  }

  .brandBadge {
    background: color-mix(in srgb, var(--post-accent, #00e8f0) 14%, white);
    color: #10172f;
  }

  .postBody {
    margin-top: 14px;
  }

  .postBody h2 {
    margin: 0;
    color: #10172f;
    font-size: 1.08rem;
    line-height: 1.25;
    letter-spacing: -0.025em;
  }

  .postBody p {
    margin: 8px 0 0;
    color: rgba(16,23,47,0.72);
    font-size: 0.96rem;
    line-height: 1.55;
  }

  .postLinkPreview {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    margin-top: 12px;
    border: 1px solid #e6e8ef;
    border-radius: 999px;
    color: #008b94;
    background: #f7f8fb;
    font-size: 0.82rem;
    font-weight: 950;
    padding: 0 13px;
    text-decoration: none;
  }

  .postActions {
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 14px -18px -10px;
    border-top: 1px solid #eef0f5;
    padding: 10px 18px;
  }

  .postActions button {
    border: 0;
    background: transparent;
    color: rgba(16,23,47,0.62);
    cursor: pointer;
    font: inherit;
    font-size: 0.86rem;
    font-weight: 850;
    padding: 0;
  }

  .postActions .likedButton,
  .postActions .savedButton {
    color: #008b94;
  }

  .postActions button:last-child {
    margin-left: auto;
  }

  .commentsPanel {
    margin-top: 14px;
    border-top: 1px solid #eef0f5;
    padding-top: 14px;
  }

  .commentList {
    display: grid;
    gap: 10px;
    margin-bottom: 12px;
  }

  .commentItem {
    border-radius: 14px;
    background: #f7f8fb;
    padding: 10px 12px;
  }

  .commentItem strong {
    display: block;
    color: #10172f;
    font-size: 0.82rem;
  }

  .commentItem p {
    margin: 4px 0 0;
    color: rgba(16,23,47,0.72);
    font-size: 0.86rem;
    line-height: 1.4;
  }

  .commentForm {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
  }

  .commentForm input {
    width: 100%;
    border: 1px solid #e6e8ef;
    border-radius: 999px;
    background: #f7f8fb;
    color: #10172f;
    font: inherit;
    outline: none;
    padding: 11px 14px;
  }

  .commentForm input::placeholder {
    color: rgba(16,23,47,0.42);
  }

  .commentForm button {
    border: 0;
    border-radius: 999px;
    background: #00e8f0;
    color: #020617;
    cursor: pointer;
    font: inherit;
    font-weight: 950;
    padding: 0 16px;
  }

  .rightColumn {
    position: sticky;
    top: 18px;
    display: grid;
    gap: 10px;
    grid-column: 5;
    justify-self: end;
    width: 380px;
  }

  .filterRow {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .filterRow button {
    min-height: 36px;
    border: 1px solid #e6e8ef;
    border-radius: 999px;
    background: #ffffff;
    color: #10172f;
    cursor: pointer;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 900;
    padding: 0 15px;
    box-shadow: 0 8px 22px rgba(16,23,47,0.05);
  }

  .filterRow .activeFilter {
    border-color: #00e8f0;
    background: #00e8f0;
    color: #020617;
  }

  .sidebarCard,
  .signInCard,
  .statusCard,
  .errorCard {
    border: 1px solid #e6e8ef;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 14px 36px rgba(16, 23, 47, 0.08);
  }

  .sidebarCard {
    padding: 18px;
  }

  .sidebarCardHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;
  }

  .sidebarCardHeader h2 {
    margin: 0;
    color: #10172f;
    font-size: 1rem;
    letter-spacing: -0.02em;
  }

  .sidebarList {
    display: grid;
    gap: 14px;
  }

  .sidebarPerson {
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
  }

  .sidebarAvatarGroup {
    position: relative;
    width: 44px;
    height: 44px;
  }

  .sidebarAvatar {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border-radius: 999px;
    background: #16202a;
    color: #ffffff;
    object-fit: cover;
    font-weight: 950;
  }

  .sidebarAccent {
    position: absolute;
    right: -5px;
    bottom: -4px;
    width: 20px;
    height: 20px;
    border: 3px solid #ffffff;
    border-radius: 999px;
    background: #000000;
    object-fit: cover;
  }

  .sidebarPerson strong,
  .sidebarNameLink {
    display: block;
    color: #10172f;
    font-size: 0.9rem;
    font-weight: 950;
    text-decoration: none;
  }

  .sidebarPerson p {
    margin: 2px 0 0;
    color: rgba(16,23,47,0.56);
    font-size: 0.78rem;
    line-height: 1.25;
  }

  .emptySidebarMessage {
    margin: 0;
    color: rgba(16,23,47,0.58);
    font-size: 0.86rem;
    line-height: 1.45;
  }

  .exchangeStats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .exchangeStats div {
    min-height: 78px;
    display: grid;
    align-content: center;
    border-radius: 14px;
    background: #f7f8fb;
    padding: 12px;
  }

  .exchangeStats strong {
    color: #00aeb8;
    font-size: 1.35rem;
    line-height: 1;
  }

  .exchangeStats span {
    margin-top: 6px;
    color: rgba(16,23,47,0.58);
    font-size: 0.72rem;
    font-weight: 800;
    line-height: 1.25;
  }

  .signInCard {
    min-height: 92px;
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    padding: 18px;
  }

  .lockCircle {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: #00e8f0;
    color: #020617;
    font-weight: 950;
  }

  .signInCard h3 {
    margin: 0;
    color: #10172f;
    font-size: 1rem;
  }

  .signInCard p {
    margin: 4px 0 0;
    color: rgba(16,23,47,0.62);
    font-size: 0.82rem;
    line-height: 1.4;
  }

  .signInCard a {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    border-radius: 12px;
    background: #00e8f0;
    color: #020617;
    font-size: 0.82rem;
    font-weight: 950;
    padding: 0 18px;
    text-decoration: none;
  }

  .statusCard,
  .errorCard {
    width: 650px;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 18px;
    padding: 28px;
  }

  .statusCard p,
  .errorCard p {
    margin: 0;
    color: #10172f;
    font-weight: 950;
  }

  .statusCard span {
    display: block;
    margin-top: 12px;
    color: rgba(16,23,47,0.62);
    font-size: 1rem;
    line-height: 1.5;
  }

  .errorCard {
    border-color: rgba(255,107,97,0.4);
    background: rgba(255,107,97,0.12);
    color: #9b1c1c;
  }

  .errorCard p {
    color: #9b1c1c;
  }

  @media (max-width: 1450px) {
    .exchangeLayout {
      grid-template-columns: 650px 360px;
      column-gap: 48px;
      justify-content: center;
      padding: 24px 32px 80px;
    }

    .leftMenu {
      display: none;
    }

    .feedColumn {
      grid-column: 1;
      width: 650px;
    }

    .rightColumn {
      grid-column: 2;
      width: 360px;
      justify-self: start;
    }
  }

  @media (max-width: 960px) {
    .exchangeLayout {
      grid-template-columns: 1fr;
      justify-content: center;
      padding: 24px 18px 80px;
    }

    .feedColumn {
      grid-column: 1;
      width: min(650px, 100%);
    }

    .rightColumn {
      grid-column: 1;
      position: static;
      width: min(650px, 100%);
      justify-self: center;
    }

    .filterRow {
      justify-content: flex-start;
      order: -1;
    }

    .topMenu {
      display: none;
    }

    .quickPostCard {
      width: min(650px, 100%);
    }

    .postCard,
    .statusCard,
    .errorCard {
      width: min(650px, 100%);
    }
  }

  @media (max-width: 720px) {
    .exchangeHeader {
      align-items: flex-start;
      flex-direction: column;
      padding: 18px;
    }

    .topIconGroup {
      align-self: stretch;
    }

    .exchangeLayout {
      padding: 16px;
    }

    .feedColumn {
      width: 100%;
    }

    .quickPostActions {
      grid-template-columns: 1fr;
    }

    .postBanner {
      width: 100%;
      height: min(500px, 100vw);
    }

    .statusCard,
    .errorCard {
      min-height: min(500px, 100vw);
    }

    .commentForm {
      grid-template-columns: 1fr;
    }

    .commentForm button {
      min-height: 40px;
    }

    .signInCard {
      grid-template-columns: 44px minmax(0, 1fr);
    }

    .signInCard a {
      grid-column: 2;
      justify-self: start;
    }

    .exchangeStats {
      grid-template-columns: 1fr;
    }
  }
`;