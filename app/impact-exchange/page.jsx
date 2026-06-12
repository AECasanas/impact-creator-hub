"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import {
  Bell,
  Bookmark,
  CircleUserRound,
  Globe2,
  Handshake,
  Heart,
  House,
  ImagePlus,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  PenLine,
  Pencil,
  Search,
  Share2,
  Trash2,
} from "lucide-react";

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
  const [followedCreators, setFollowedCreators] = useState({});
  const [followedBrands, setFollowedBrands] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [activeFilter, setActiveFilter] = useState("All");
  const [feedTheme, setFeedTheme] = useState("dark");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editDraft, setEditDraft] = useState({
    title: "",
    body: "",
    post_type: "Collaboration",
    link_url: "",
    is_published: true,
  });
  const [editSaving, setEditSaving] = useState(false);

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
    await loadFollowedProfiles(user || null);

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
  async function loadFollowedProfiles(currentUser) {
    if (!currentUser) {
      setFollowedCreators({});
      setFollowedBrands({});
      return;
    }

    const { data, error } = await supabase
      .from("follow_relationships")
      .select("id, followed_creator_profile_id, followed_brand_profile_id")
      .eq("follower_user_id", currentUser.id);

    if (error) {
      console.warn("LOAD FOLLOWED PROFILES ERROR:", error);
      setFollowedCreators({});
      setFollowedBrands({});
      return;
    }

    const nextCreators = {};
    const nextBrands = {};

    (data || []).forEach((follow) => {
      if (follow.followed_creator_profile_id) {
        nextCreators[follow.followed_creator_profile_id] = true;
      }

      if (follow.followed_brand_profile_id) {
        nextBrands[follow.followed_brand_profile_id] = true;
      }
    });

    setFollowedCreators(nextCreators);
    setFollowedBrands(nextBrands);
  }

  async function toggleFollowProfile(type, profileId) {
    if (!user) {
      window.location.assign("/login?redirect=/impact-exchange");
      return;
    }

    const isCreator = type === "creator";
    const alreadyFollowing = isCreator
      ? followedCreators[profileId]
      : followedBrands[profileId];

    if (alreadyFollowing) {
      let query = supabase
        .from("follow_relationships")
        .delete()
        .eq("follower_user_id", user.id);

      query = isCreator
        ? query.eq("followed_creator_profile_id", profileId)
        : query.eq("followed_brand_profile_id", profileId);

      const { error } = await query;

      if (error) {
        alert(error.message);
        return;
      }

      if (isCreator) {
        setFollowedCreators((current) => ({
          ...current,
          [profileId]: false,
        }));
      } else {
        setFollowedBrands((current) => ({
          ...current,
          [profileId]: false,
        }));
      }

      return;
    }

    const payload = {
      follower_user_id: user.id,
      followed_creator_profile_id: isCreator ? profileId : null,
      followed_brand_profile_id: isCreator ? null : profileId,
    };

    const { error } = await supabase
      .from("follow_relationships")
      .insert(payload);

    if (error) {
      alert(error.message);
      return;
    }

    if (isCreator) {
      setFollowedCreators((current) => ({
        ...current,
        [profileId]: true,
      }));
    } else {
      setFollowedBrands((current) => ({
        ...current,
        [profileId]: true,
      }));
    }
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
  async function deletePost(postId) {
    if (!user) {
      window.location.assign("/login?redirect=/impact-exchange");
      return;
    }

    const shouldDelete = window.confirm(
      "Delete this post? This cannot be undone."
    );

    if (!shouldDelete) {
      return;
    }

    const { error } = await supabase
      .from("impact_exchange_posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    setPosts((current) => current.filter((post) => post.id !== postId));
  }
    function startEditPost(post) {
    if (!user) {
      window.location.assign("/login?redirect=/impact-exchange");
      return;
    }

    if (post.user_id !== user.id) {
      alert("You can only edit your own posts.");
      return;
    }

    setEditingPost(post);
    setEditDraft({
      title: post.title || "",
      body: post.body || "",
      post_type: post.post_type || "Collaboration",
      link_url: post.link_url || post.post_url || "",
      is_published: post.is_published !== false,
    });
  }

  function cancelEditPost() {
    setEditingPost(null);
    setEditDraft({
      title: "",
      body: "",
      post_type: "Collaboration",
      link_url: "",
      is_published: true,
    });
  }

  async function saveEditedPost() {
    if (!user || !editingPost) {
      return;
    }

    if (editingPost.user_id !== user.id) {
      alert("You can only edit your own posts.");
      return;
    }

    setEditSaving(true);

    const { data, error } = await supabase
      .from("impact_exchange_posts")
      .update({
        title: editDraft.title.trim(),
        body: editDraft.body.trim(),
        post_type: editDraft.post_type,
        link_url: editDraft.link_url.trim(),
        is_published: editDraft.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingPost.id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    setEditSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setPosts((current) =>
      current.map((post) => (post.id === editingPost.id ? data : post))
    );

    cancelEditPost();
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
    <main className={`exchangePage ${feedTheme === "dark" ? "darkFeed" : "lightFeed"}`}>
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
            <Search size={17} strokeWidth={2.4} />
          </button>

          <button
            type="button"
            className="topIconButton"
            aria-label="Notifications"
          >
            <Bell size={17} strokeWidth={2.4} />
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
            <span><House size={20} strokeWidth={2.4} /></span>
            Dashboard
          </a>

          <a href={dashboardPath} className="leftMenuItem">
            <span><CircleUserRound size={18} strokeWidth={2.4} /></span>
            Profile
          </a>

          <a href="/dashboard/post" className="leftMenuItem">
            <span><PenLine size={18} strokeWidth={2.4} /></span>
            Create Post
          </a>

          <a href="/create-postcard" className="leftMenuItem">
            <span><Mail size={18} strokeWidth={2.4} /></span>
            Postcard
          </a>

          <a href="/dashboard/saved" className="leftMenuItem">
            <span><Bookmark size={18} strokeWidth={2.4} /></span>
            Saved
          </a>

          <a href="/dashboard/inquiries" className="leftMenuItem">
            <span><MessageCircle size={18} strokeWidth={2.4} /></span>
            Inquiries
          </a>

          <a href="/impact-exchange" className="leftMenuItem activeLeftMenu">
            <span><Globe2 size={18} strokeWidth={2.4} /></span>
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
                <ImagePlus size={18} strokeWidth={2.4} />
                <span>Photo/video</span>
              </a>

              <a href={user ? "/create-postcard" : "/login?redirect=/create-postcard"}>
                <Mail size={18} strokeWidth={2.4} />
                <span>Postcard</span>
              </a>

              <a href={user ? "/dashboard/post" : "/login?redirect=/dashboard/post"}>
                <Handshake size={18} strokeWidth={2.4} />
                <span>Collaboration</span>
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
  currentUserId={user?.id || ""}
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
  onCommentDraftChange={(value) =>
    setCommentDrafts((current) => ({
      ...current,
      [post.id]: value,
    }))
  }
  onSubmitComment={() => submitComment(post.id)}
  onDeletePost={() => deletePost(post.id)}
  onStartEditPost={() => startEditPost(post)}
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

  <button
    type="button"
    className={feedTheme === "dark" ? "activeFilter" : ""}
    onClick={() => setFeedTheme(feedTheme === "dark" ? "light" : "dark")}
  >
    {feedTheme === "dark" ? "Light feed" : "Dark feed"}
  </button>
</div>
          {(activeFilter === "All" || activeFilter === "Creators") && (
            <SidebarCard title="Published creators">
              {featuredCreators.length > 0 ? (
                featuredCreators.map((creator) => (
                                   <SidebarProfile
                    key={creator.id}
                    type="creator"
                    profile={creator}
                    isFollowing={followedCreators[creator.id] || false}
                    onToggleFollow={() => toggleFollowProfile("creator", creator.id)}
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
                                   <SidebarProfile
                    key={brand.id}
                    type="brand"
                    profile={brand}
                    isFollowing={followedBrands[brand.id] || false}
                    onToggleFollow={() => toggleFollowProfile("brand", brand.id)}
                  />
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

      {editingPost && (
        <div className="editModalOverlay">
          <div className="editModalCard">
            <div className="editModalHeader">
              <div>
                <p>Edit post</p>
                <h2>Update your Impact Exchange post.</h2>
              </div>
                          <div className="editPostPreview">
              {editingPost.image_url ? (
                <img src={editingPost.image_url} alt={editingPost.title || "Post preview"} />
              ) : (
                <div className="editPostPreviewFallback">
                  No image attached to this post
                </div>
              )}

              <div>
                <span>You are editing</span>
                <strong>{editingPost.title || "Untitled post"}</strong>
              </div>
            </div>

              <button type="button" onClick={cancelEditPost}>
                ×
              </button>
            </div>

            <div className="editModalGrid">
              <label>
                Post title
                <input
                  value={editDraft.title}
                  onChange={(event) =>
                    setEditDraft((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Post type
                <select
                  value={editDraft.post_type}
                  onChange={(event) =>
                    setEditDraft((current) => ({
                      ...current,
                      post_type: event.target.value,
                    }))
                  }
                >
                  <option value="Collaboration">Collaboration</option>
                  <option value="Project update">Project update</option>
                  <option value="Availability">Availability</option>
                  <option value="Creator call">Creator call</option>
                  <option value="Campaign idea">Campaign idea</option>
                  <option value="Announcement">Announcement</option>
                </select>
              </label>
            </div>

            <label className="editModalFull">
              Post details
              <textarea
                value={editDraft.body}
                onChange={(event) =>
                  setEditDraft((current) => ({
                    ...current,
                    body: event.target.value,
                  }))
                }
              />
            </label>

            <label className="editModalFull">
              Link URL
              <input
                value={editDraft.link_url}
                onChange={(event) =>
                  setEditDraft((current) => ({
                    ...current,
                    link_url: event.target.value,
                  }))
                }
              />
            </label>

            <label className="editPublishRow">
              <input
                type="checkbox"
                checked={editDraft.is_published}
                onChange={(event) =>
                  setEditDraft((current) => ({
                    ...current,
                    is_published: event.target.checked,
                  }))
                }
              />
              Published on Impact Exchange
            </label>

            <div className="editModalActions">
              <button type="button" onClick={cancelEditPost}>
                Cancel
              </button>

              <button type="button" onClick={saveEditedPost} disabled={editSaving}>
                {editSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{exchangeStyles}</style>
    </main>
  );
}

function ExchangePostCard({
  post,
  profile,
  brand,
  currentUserId,
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
  onCommentDraftChange,
  onSubmitComment,
  onDeletePost,
  onStartEditPost,
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
  const isOwner = currentUserId && post.user_id === currentUserId;

   const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

    const postShareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/impact-exchange/post/${post.id}`
      : `/impact-exchange/post/${post.id}`;

  const postImageUrl = post.image_url || bannerUrl || "";
  const shareTitle = post.title || "Impact Creator Hub post";
  const shareText = `Check out this post on Impact Creator Hub: ${shareTitle}`;
  const shareBody = `${shareText}\n\n${postShareUrl}`;

  const encodedUrl = encodeURIComponent(postShareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedText = encodeURIComponent(shareText);
  const encodedBody = encodeURIComponent(shareBody);
  const encodedImage = encodeURIComponent(postImageUrl);

  const pinterestShareUrl = postImageUrl
    ? `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedText}`
    : `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;

  async function copyPostLink() {
    try {
      await navigator.clipboard.writeText(postShareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      window.prompt("Copy this post link:", postShareUrl);
    }
  }

  async function copyShareBody() {
    try {
      await navigator.clipboard.writeText(shareBody);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      window.prompt("Copy this post text:", shareBody);
    }
  }

  async function openNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: postShareUrl,
        });

        setShareMenuOpen(false);
        return;
      } catch {
        return;
      }
    }

    await copyPostLink();
  }

  function openShareWindow(url) {
    window.open(url, "_blank", "noopener,noreferrer");
    setShareMenuOpen(false);
  }

  async function shareToInstagram() {
    await copyShareBody();
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    setShareMenuOpen(false);
  }

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
            <Heart
              size={16}
              strokeWidth={2.4}
              fill={likedByUser ? "currentColor" : "none"}
            />{" "}
            {likeCount}
          </button>

          <button type="button" onClick={onToggleComments}>
            <MessageCircle size={16} strokeWidth={2.4} /> {commentCount}
          </button>

 <div className="shareMenuWrap">
  <button
    type="button"
    className="shareMainButton"
    onClick={() => setShareMenuOpen((current) => !current)}
  >
    <Share2 size={16} strokeWidth={2.4} />{" "}
    {shareCopied ? "Copied!" : "Share"}
  </button>

  {shareMenuOpen && (
    <div className="shareMenu">
      <button type="button" onClick={copyPostLink}>
        <LinkIcon size={17} strokeWidth={2.1} className="shareSvgIcon copyIcon" />
        Copy link
      </button>

      <button
        type="button"
        onClick={() =>
          openShareWindow(
            `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
          )
        }
      >
        <svg className="shareSvgIcon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
        X
      </button>

      <button
        type="button"
        onClick={() =>
          openShareWindow(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
          )
        }
      >
        <svg className="shareSvgIcon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z"
          />
        </svg>
        Facebook
      </button>

      <button
        type="button"
        onClick={() =>
          openShareWindow(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
          )
        }
      >
        <svg className="shareSvgIcon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29zM5.32 7.42a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.1 20.45H3.54V8.98H7.1v11.47zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"
          />
        </svg>
        LinkedIn
      </button>

      <button
        type="button"
        onClick={() => openShareWindow(pinterestShareUrl)}
      >
        <svg className="shareSvgIcon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.04 0C5.4 0 2 4.78 2 8.76c0 2.4.91 4.54 2.86 5.34.32.13.61 0 .7-.35.06-.24.22-.86.29-1.12.09-.35.05-.48-.2-.78-.56-.66-.91-1.52-.91-2.74 0-3.53 2.64-6.69 6.88-6.69 3.75 0 5.81 2.29 5.81 5.35 0 4.03-1.78 7.44-4.43 7.44-1.46 0-2.56-1.21-2.21-2.7.42-1.78 1.24-3.7 1.24-4.99 0-1.15-.62-2.11-1.9-2.11-1.5 0-2.71 1.55-2.71 3.64 0 1.33.45 2.23.45 2.23s-1.54 6.52-1.81 7.66c-.54 2.28-.08 5.08-.04 5.36.02.17.24.21.34.08.14-.18 1.97-2.45 2.59-4.71.18-.64 1.01-3.96 1.01-3.96.5.95 1.96 1.79 3.51 1.79 4.62 0 7.75-4.21 7.75-9.84C21.2 3.7 17.59 0 12.04 0z"
          />
        </svg>
        Pinterest
      </button>

      <button type="button" onClick={shareToInstagram}>
        <svg className="shareSvgIcon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.36-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.36-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.84a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"
          />
        </svg>
        Instagram
      </button>

      <button
        type="button"
        onClick={() =>
          openShareWindow(
            `mailto:?subject=${encodedTitle}&body=${encodedBody}`
          )
        }
      >
        <Mail size={17} strokeWidth={2.1} className="shareSvgIcon" />
        Email
      </button>
    </div>
  )}
</div>

          <button
            type="button"
            className={savedByUser ? "savedButton pushAction" : "pushAction"}
            onClick={onToggleSave}
          >
            <Bookmark
              size={16}
              strokeWidth={2.4}
              fill={savedByUser ? "currentColor" : "none"}
            />{" "}
            {savedByUser ? "Saved" : "Save"}
          </button>
        </div>

                 {isOwner && (
          <div className="ownerActions">
            <span className="ownerActionsLabel">Owner tools</span>

            <div className="ownerActionButtons">
              <button type="button" onClick={onStartEditPost}>
                <Pencil size={14} strokeWidth={2.4} /> Edit this post
              </button>

              <button type="button" onClick={onDeletePost}>
                <Trash2 size={14} strokeWidth={2.4} /> Delete
              </button>
            </div>
          </div>
        )}


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

function SidebarProfile({ type, profile, isFollowing, onToggleFollow }) {
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

      <div className="sidebarPersonInfo">
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

      <button
        type="button"
        className={isFollowing ? "followButton followingButton" : "followButton"}
        onClick={onToggleFollow}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
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

.exchangePage.darkFeed {
  background:
    radial-gradient(circle at top left, rgba(0, 232, 240, 0.08), transparent 32%),
    radial-gradient(circle at top right, rgba(255, 140, 130, 0.07), transparent 30%),
    linear-gradient(135deg, #15171d 0%, #20232b 42%, #14171d 100%);
  color: #eef3f7;
}

.exchangePage.darkFeed .exchangeHeader {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.exchangePage.darkFeed .brandHeader,
.exchangePage.darkFeed .topMenu a,
.exchangePage.darkFeed .leftMenuItem,
.exchangePage.darkFeed .postBody h2,
.exchangePage.darkFeed .authorNameLine a,
.exchangePage.darkFeed .authorNameLine strong,
.exchangePage.darkFeed .sidebarCardHeader h2,
.exchangePage.darkFeed .sidebarPerson strong,
.exchangePage.darkFeed .sidebarNameLink,
.exchangePage.darkFeed .statusCard p {
  color: #eef3f7;
}

.exchangePage.darkFeed .brandHeader span,
.exchangePage.darkFeed .leftMenuItem,
.exchangePage.darkFeed .postAuthor p,
.exchangePage.darkFeed .postBody p,
.exchangePage.darkFeed .sidebarPerson p,
.exchangePage.darkFeed .emptySidebarMessage,
.exchangePage.darkFeed .statusCard span {
  color: rgba(238, 243, 247, 0.64);
}

.exchangePage.darkFeed .quickPostCard,
.exchangePage.darkFeed .postCard,
.exchangePage.darkFeed .sidebarCard,
.exchangePage.darkFeed .signInCard,
.exchangePage.darkFeed .statusCard,
.exchangePage.darkFeed .errorCard,
.exchangePage.darkFeed .filterRow button,
.exchangePage.darkFeed .topIconButton,
.exchangePage.darkFeed .topProfileButton,
.exchangePage.darkFeed .quickPostInput,
.exchangePage.darkFeed .commentItem,
.exchangePage.darkFeed .commentForm input {
  border-color: rgba(255, 255, 255, 0.13);
  background: rgba(7, 10, 16, 0.46);
  color: #eef3f7;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.34);
}

.exchangePage.darkFeed .quickPostInput {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(238, 243, 247, 0.62);
}

.exchangePage.darkFeed .quickPostActions {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.exchangePage.darkFeed .quickPostActions a,
.exchangePage.darkFeed .postActions button {
  color: rgba(238, 243, 247, 0.72);
}

.exchangePage.darkFeed .quickPostActions a:hover,
.exchangePage.darkFeed .leftMenuItem:hover,
.exchangePage.darkFeed .leftMenuItem.activeLeftMenu,
.exchangePage.darkFeed .topMenu a:hover,
.exchangePage.darkFeed .topMenu .activeTopMenu {
  background: rgba(255, 255, 255, 0.08);
  color: #00e8f0;
}

.exchangePage.darkFeed .postActions,
.exchangePage.darkFeed .commentsPanel {
  border-color: rgba(255, 255, 255, 0.08);
}

.exchangePage.darkFeed .postActions {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.exchangePage.darkFeed .filterRow .activeFilter {
  border-color: #00e8f0;
  background: #00e8f0;
  color: #020617;
}

.exchangePage.darkFeed .exchangeStats div {
  background: rgba(255, 255, 255, 0.06);
}

.exchangePage.darkFeed .exchangeStats span {
  color: rgba(238, 243, 247, 0.62);
}

.exchangePage.darkFeed .postLinkPreview {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: #00e8f0;
}

  .exchangeHeader {
    width: min(1540px, 100%);
    min-height: 78px;
    margin: 0 auto;
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
  grid-template-columns: 220px 170px 650px 36px 360px;
  gap: 0;
  align-items: start;
  justify-content: start;
  padding: 18px 28px 80px;
}

 .leftMenu {
  position: sticky;
  top: 18px;
  display: grid;
  gap: 8px;
  grid-column: 1;
  padding-left: 18px;
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
  min-width: 0;
  grid-column: 3;
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
    margin-bottom: 12px;
    border: 1px solid #e6e8ef;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 14px 36px rgba(16, 23, 47, 0.08);
    padding: 14px 16px;
  }

  .quickPostTop {
    display: grid;
    grid-template-columns: 46px 1fr;
    align-items: center;
    gap: 12px;
  }

  .quickPostAvatar {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: #020617;
    color: #ffffff;
    font-weight: 950;
  }

  .quickPostInput {
    min-height: 46px;
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
    margin-top: 12px;
    border-top: 1px solid #eef0f5;
    padding-top: 10px;
  }

  .quickPostActions a {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
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
    position: relative;
    z-index: 1;
    overflow: visible;
    border: 1px solid #e6e8ef;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 14px 36px rgba(16, 23, 47, 0.08);
  }

  .postCard:focus-within {
    z-index: 40;
  }

  .postBanner {
    width: 650px;
    height: 500px;
    border-radius: 18px 18px 0 0;
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
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

    .postActions .pushAction {
    margin-left: auto;
  }
    .shareMenuWrap {
    position: relative;
    z-index: 500;
    display: inline-flex;
  }

  .shareMainButton {
    position: relative;
    z-index: 2;
  }

  .shareMenu {
    position: absolute;
    left: 0;
    top: calc(100% + 10px);
    z-index: 900;
    width: 174px;
    display: grid;
    gap: 1px;
    border: 1px solid rgba(0, 232, 240, 0.14);
    border-radius: 16px;
    background: rgba(13, 17, 24, 0.98);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.46);
    backdrop-filter: blur(18px);
    padding: 8px;
  }

  .shareMenu button {
    width: 100%;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 11px;
    border-radius: 10px;
    color: rgba(238, 243, 247, 0.78);
    font-size: 0.74rem;
    font-weight: 400;
    letter-spacing: 0;
    padding: 0 9px;
  }

  .shareMenu button:hover {
    background: rgba(0, 232, 240, 0.1);
    color: #ffffff;
  }

  .shareSvgIcon {
    width: 17px;
    height: 17px;
    flex: 0 0 auto;
    color: rgba(238, 243, 247, 0.82);
  }

  .shareMenu button:hover .shareSvgIcon {
    color: #00e8f0;
  }

  .shareMenu .copyIcon {
    color: #00e8f0;
  }

  .exchangePage.darkFeed .shareMenu {
    border-color: rgba(0, 232, 240, 0.14);
    background: rgba(13, 17, 24, 0.98);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
  }

  .exchangePage.darkFeed .shareMenu button {
    color: rgba(238, 243, 247, 0.78);
    font-weight: 400;
  }

  .exchangePage.darkFeed .shareMenu button:hover {
    background: rgba(0, 232, 240, 0.1);
    color: #ffffff;
  }
    .ownerActions {
    display: grid;
    gap: 8px;
    margin: 10px -18px -10px;
    border-top: 1px solid #eef0f5;
    background: rgba(0, 232, 240, 0.035);
    padding: 10px 18px 12px;
  }

  .ownerActionsLabel {
    color: rgba(16,23,47,0.46);
    font-size: 0.62rem;
    font-weight: 950;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .ownerActionButtons {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ownerActions button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: transparent;
    color: rgba(16,23,47,0.68);
    cursor: pointer;
    font: inherit;
    font-size: 0.8rem;
    font-weight: 900;
    padding: 0;
  }

  .ownerActions button:last-child {
    color: #ff8c82;
  }

  .exchangePage.darkFeed .ownerActions {
    border-top-color: rgba(255, 255, 255, 0.08);
    background: rgba(0, 232, 240, 0.045);
  }

  .exchangePage.darkFeed .ownerActionsLabel {
    color: rgba(238, 243, 247, 0.46);
  }

  .exchangePage.darkFeed .ownerActions button {
    color: rgba(238, 243, 247, 0.76);
  }

  .exchangePage.darkFeed .ownerActions button:last-child {
    color: #ff8c82;
  }

    .editModalOverlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    background: rgba(2, 6, 23, 0.74);
    padding: 24px;
  }

  .editModalCard {
    width: min(640px, 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 22px;
    background: #151a22;
    color: #eef3f7;
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.45);
    padding: 22px;
  }

  .editModalHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 18px;
  }

  .editModalHeader p {
    margin: 0 0 8px;
    color: #00e8f0;
    font-size: 0.68rem;
    font-weight: 950;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .editModalHeader h2 {
    margin: 0;
    font-size: 1.45rem;
    line-height: 1.1;
    letter-spacing: -0.04em;
  }

  .editModalHeader button {
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    cursor: pointer;
    font-size: 1.4rem;
    line-height: 1;
  }

    .editPostPreview {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.055);
    padding: 10px;
  }

  .editPostPreview img,
  .editPostPreviewFallback {
    width: 96px;
    height: 72px;
    border-radius: 12px;
    object-fit: cover;
    background: rgba(255, 255, 255, 0.08);
  }

  .editPostPreviewFallback {
    display: grid;
    place-items: center;
    color: rgba(238, 243, 247, 0.56);
    font-size: 0.68rem;
    font-weight: 850;
    line-height: 1.2;
    padding: 8px;
    text-align: center;
  }

  .editPostPreview span {
    display: block;
    color: #00e8f0;
    font-size: 0.62rem;
    font-weight: 950;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .editPostPreview strong {
    display: block;
    margin-top: 5px;
    color: #eef3f7;
    font-size: 0.95rem;
    font-weight: 950;
    line-height: 1.2;
  }

  .editModalGrid {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 12px;
  }

  .editModalGrid label,
  .editModalFull {
    display: grid;
    gap: 8px;
    color: rgba(238, 243, 247, 0.74);
    font-size: 0.76rem;
    font-weight: 900;
  }

  .editModalFull {
    margin-top: 12px;
  }

  .editModalGrid input,
  .editModalGrid select,
  .editModalFull input,
  .editModalFull textarea {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.07);
    color: #eef3f7;
    font: inherit;
    outline: none;
    padding: 12px 13px;
  }

  .editModalGrid select option {
    color: #10172f;
  }

  .editModalFull textarea {
    min-height: 140px;
    resize: vertical;
  }

  .editPublishRow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
    color: rgba(238, 243, 247, 0.74);
    font-size: 0.82rem;
    font-weight: 850;
  }

  .editModalActions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 18px;
  }

  .editModalActions button {
    min-height: 40px;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    font: inherit;
    font-size: 0.84rem;
    font-weight: 950;
    padding: 0 18px;
  }

  .editModalActions button:first-child {
    background: rgba(255, 255, 255, 0.08);
    color: #eef3f7;
  }

  .editModalActions button:last-child {
    background: #00e8f0;
    color: #020617;
  }

  .editModalActions button:disabled {
    cursor: not-allowed;
    opacity: 0.58;
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
    grid-template-columns: 48px minmax(0, 1fr) auto;
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

  .sidebarPersonInfo {
    min-width: 0;
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

   .followButton {
    min-height: 34px;
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 999px;
    background: transparent;
    color: #ffffff;
    cursor: pointer;
    font: inherit;
    font-size: 0.74rem;
    font-weight: 800;
    padding: 0 13px;
    white-space: nowrap;
  }

  .followButton:hover {
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
  }

  .followingButton {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  .followingButton:hover {
    border-color: #ff8c82;
    background: rgba(255, 140, 130, 0.12);
    color: #ff8c82;
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

  @media (max-width: 1200px) {
    .exchangeLayout {
      grid-template-columns: 650px 360px;
      justify-content: center;
    }

    .leftMenu {
      display: none;
    }
  }

  @media (max-width: 960px) {
    .exchangeLayout {
      grid-template-columns: 1fr;
    }

    .rightColumn {
      position: static;
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