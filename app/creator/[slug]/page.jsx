import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

const accentLogoMap = {
  "Electric Cyan": "/logo-colors/impact-logo-electric-cyan.png",
  Orange: "/logo-colors/impact-logo-orange.png",
  Pink: "/logo-colors/impact-logo-pink.png",
  Purple: "/logo-colors/impact-logo-purple.png",
  "Emerald Green": "/logo-colors/impact-logo-emerald-green.png",
  White: "/logo-colors/impact-logo-white.png",
};

const boardLabels = {
  project: {
    eyebrow: "Projects",
    title: "Creator boards",
    emptyTitle: "No projects added yet.",
    empty:
      "Projects added from the creator dashboard will appear here automatically.",
  },
  collaboration: {
    eyebrow: "Collaborations",
    title: "Collaboration boards",
    emptyTitle: "No collaborations added yet.",
    empty:
      "Collaborations added from the creator dashboard will appear here automatically.",
  },
  highlight: {
    eyebrow: "Highlights",
    title: "Highlight boards",
    emptyTitle: "No highlights added yet.",
    empty:
      "Highlights, press, wins, features, or important moments will appear here.",
  },
  writing: {
    eyebrow: "Writing",
    title: "Writing boards",
    emptyTitle: "No writing added yet.",
    empty:
      "Writing, essays, creator notes, reflections, or thought leadership will appear here.",
  },
};

export default async function CreatorPublicProfilePage({ params }) {
  const { slug } = await params;

  const { data: profile, error } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !profile) {
    notFound();
  }

  const { data: boardItemsData } = await supabase
    .from("creator_board_items")
    .select("*")
    .eq("creator_slug", slug)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const { data: legacyProjectsData } = await supabase
    .from("creator_projects")
    .select("*")
    .eq("creator_slug", slug)
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: exchangePostsData } = await supabase
    .from("impact_exchange_posts")
    .select("*")
    .eq("creator_slug", slug)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const boardItems = boardItemsData || [];
  const legacyProjects = legacyProjectsData || [];
  const exchangePosts = exchangePostsData || [];

  const projects = [
    ...boardItems.filter((item) => item.board_type === "project"),
    ...legacyProjects.map((project) => ({
      id: project.id,
      board_type: "project",
      title: project.title,
      body: project.description,
      image_url: project.image_url,
      external_url: project.project_url,
      created_at: project.created_at,
    })),
  ];

  const collaborations = boardItems.filter(
    (item) => item.board_type === "collaboration"
  );

  const highlights = boardItems.filter(
    (item) => item.board_type === "highlight"
  );

  const writing = boardItems.filter((item) => item.board_type === "writing");

  const isDark = profile.profile_style === "Simple Dark";
  const accent = profile.accent_color || "#00e8f0";

  const accentLogo =
    accentLogoMap[profile.accent_name] || accentLogoMap["Electric Cyan"];

  const contactHref = profile.contact_email
    ? `mailto:${profile.contact_email}`
    : "";

  const featuredHref = formatExternalUrl(profile.featured_link_url || "");
  const socialHref = formatExternalUrl(profile.social_url || "");

  return (
    <main
      className={`publicPage ${isDark ? "dark" : "light"}`}
      style={{ "--accent": accent }}
    >
      <header className="miniHeader">
        <a className="miniBrand" href="/">
          <img src="/logo-ripple.png" alt="Impact Creator Hub logo" />
          <div>
            <strong>Impact Creator Hub</strong>
            <span>Creator Profile</span>
          </div>
        </a>

        <a className="manageButton" href="/dashboard/profile">
          Manage Profile
        </a>
      </header>

      <section className="heroWrap">
        <section
          className="heroBanner"
          style={
            profile.banner_photo_url
              ? {
                  backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.02), rgba(2, 6, 23, 0.1)), url(${profile.banner_photo_url})`,
                }
              : undefined
          }
        >
          <div className="heroGlow one" />
          <div className="heroGlow two" />

          <div className="avatarDock">
            <div className="profilePhoto">
              {profile.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt={profile.display_name || "Creator profile photo"}
                />
              ) : (
                <span>Photo</span>
              )}
            </div>

            <img className="logoBadge" src={accentLogo} alt="" />
          </div>
        </section>
      </section>

      <section className="identityBand">
        <div className="identityInner">
          <div className="identitySpacer" />

          <div className="identityCopy">
            <p className="creatorType">
              {profile.creator_type || profile.profile_style || "Creator"}
            </p>

            <h1>{profile.display_name}</h1>

            <div className="identityLine">
              {profile.tagline && <p className="tagline">{profile.tagline}</p>}
              {profile.location && (
                <p className="location">{profile.location}</p>
              )}
            </div>

            <div className="profileActions">
              {profile.contact_email ? (
                <a className="primaryAction" href={contactHref}>
                  Work With Me
                </a>
              ) : (
                <span className="primaryAction">Work With Me</span>
              )}

              {profile.social_url && (
                <a href={socialHref} target="_blank" rel="noopener noreferrer">
                  {profile.social_platform || "Social"}
                </a>
              )}

              {profile.featured_link_url && (
                <a
                  href={featuredHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.featured_link_title || "Featured Link"} ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="publicShell">
        <section className="joyGrid">
          <article className="bioFeature">
            <p className="eyebrow">Creator Snapshot</p>
            <h2>What this creator is about</h2>

            {profile.short_bio ? (
              <p className="bio">{profile.short_bio}</p>
            ) : (
              <p className="bio">
                This creator is still building their story. Check back soon for
                more details, projects, and collaboration ideas.
              </p>
            )}
          </article>

          <aside className="quickFacts">
            {profile.primary_niche && (
              <div className="pillCard">
                <span>Primary niche</span>
                <strong>{profile.primary_niche}</strong>
              </div>
            )}

            {profile.available_for && (
              <div className="pillCard">
                <span>Available for</span>
                <strong>{profile.available_for}</strong>
              </div>
            )}

            <div className="pillCard accentCard">
              <span>Profile style</span>
              <strong>{profile.profile_style || "Creator Card"}</strong>
            </div>
          </aside>
        </section>

        {(profile.long_bio || profile.writing_intro) && (
          <section className="storyMosaic">
            {profile.long_bio && (
              <article className="storyCard big">
                <p className="eyebrow">Creator Story</p>
                <h2>About</h2>
                <p className="longText">{profile.long_bio}</p>
              </article>
            )}

            {profile.writing_intro && (
              <article className="storyCard small">
                <p className="eyebrow">Writing</p>
                <h2>Notes</h2>
                <p className="longText">{profile.writing_intro}</p>
              </article>
            )}
          </section>
        )}

        <BoardSection type="project" items={projects} />
        <BoardSection type="collaboration" items={collaborations} />
        <BoardSection type="highlight" items={highlights} />
        <BoardSection type="writing" items={writing} />

        <section className="sectionBlock exchangeBlock">
          <div className="sectionHeader">
            <div>
              <p>Recent Posts</p>
              <h2>Impact Exchange activity</h2>
            </div>
          </div>

          {exchangePosts.length > 0 ? (
            <div className="postGrid">
              {exchangePosts.map((post, index) => {
                const postHref = formatExternalUrl(post.post_url || "");

                return (
                  <article
                    className={`postCard ${index === 0 ? "featuredPost" : ""}`}
                    key={post.id}
                  >
                    <span>{post.post_type || "Update"}</span>
                    <h3>{post.title}</h3>

                    {post.body && <p>{post.body}</p>}

                    {post.post_url && (
                      <a
                        href={postHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View post ↗
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="emptyState lively">
              <strong>No recent posts yet.</strong>
              <p>
                Posts created in Impact Exchange will appear here automatically.
              </p>
            </div>
          )}
        </section>
      </section>

      <style>{`
        .publicPage {
          min-height: 100vh;
          color: #10172f;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .publicPage.light {
          background:
            radial-gradient(
              circle at 16% 8%,
              color-mix(in srgb, var(--accent) 12%, transparent),
              transparent 26%
            ),
            linear-gradient(135deg, #fff7f4 0%, #fff1eb 44%, #f7fbff 100%);
        }

        .publicPage.dark {
          background:
            radial-gradient(
              circle at 12% 8%,
              color-mix(in srgb, var(--accent) 16%, transparent),
              transparent 30%
            ),
            linear-gradient(135deg, #05090b, #08131a 55%, #05090b);
          color: #ffffff;
        }

        .miniHeader {
          position: sticky;
          top: 0;
          z-index: 40;
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 10px clamp(18px, 6vw, 96px);
          background: color-mix(in srgb, #fff7f4 82%, transparent);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(16, 23, 47, 0.08);
        }

        .dark .miniHeader {
          background: rgba(5, 9, 11, 0.76);
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .miniBrand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: inherit;
          text-decoration: none;
        }

        .miniBrand img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .miniBrand strong {
          display: block;
          font-size: 0.95rem;
          line-height: 1;
        }

        .miniBrand span {
          display: block;
          margin-top: 5px;
          color: rgba(16, 23, 47, 0.55);
          font-size: 0.54rem;
          font-weight: 950;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .dark .miniBrand span {
          color: rgba(255, 255, 255, 0.58);
        }

        .manageButton {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: var(--accent);
          border: 1px solid var(--accent);
          color: #020617;
          font-size: 0.82rem;
          font-weight: 950;
          padding: 0 16px;
          text-decoration: none;
          box-shadow: 0 16px 34px color-mix(in srgb, var(--accent) 26%, transparent);
        }

        .heroWrap {
          position: relative;
          padding: 0;
        }

        .heroBanner {
          position: relative;
          width: 100%;
          height: clamp(360px, 43vw, 620px);
          background:
            radial-gradient(
              circle at 78% 18%,
              rgba(255, 106, 97, 0.16),
              transparent 25%
            ),
            linear-gradient(135deg, #fff7f4, #ffe1d8);
          background-size: cover;
          background-position: center;
          overflow: visible;
        }

        .dark .heroBanner {
          background:
            radial-gradient(
              circle at 80% 20%,
              color-mix(in srgb, var(--accent) 18%, transparent),
              transparent 24%
            ),
            linear-gradient(135deg, #020617, #071014 60%, #111827);
          background-size: cover;
          background-position: center;
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }

        .heroGlow.one {
          width: 150px;
          height: 150px;
          right: 26%;
          top: -58px;
          background: color-mix(in srgb, var(--accent) 42%, transparent);
          opacity: 0.55;
        }

        .heroGlow.two {
          width: 190px;
          height: 190px;
          left: 27%;
          bottom: -74px;
          background: color-mix(in srgb, var(--accent) 18%, #ffffff);
          opacity: 0.72;
        }

       .avatarDock {
  position: absolute;
  left: clamp(38px, 9vw, 150px);
  bottom: -70px;
  width: clamp(360px, 30vw, 500px);
  height: clamp(360px, 30vw, 500px);
  z-index: 10;
}

        .profilePhoto {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 9px solid #ffffff;
          border-radius: 50%;
          background: #10172f;
          color: rgba(255, 255, 255, 0.72);
          font-weight: 950;
          box-shadow:
            0 22px 54px rgba(16, 23, 47, 0.18),
            0 36px 90px rgba(0, 0, 0, 0.18);
        }

        .profilePhoto img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

       .logoBadge {
  position: absolute;
  right: 18px;
  bottom: 76px;
  width: 66px;
  height: 66px;
  border: 6px solid #ffffff;
  border-radius: 50%;
  background: #000000;
  object-fit: cover;
  z-index: 12;
  box-shadow:
    0 0 0 1px rgba(16, 23, 47, 0.12),
    0 10px 22px rgba(0, 0, 0, 0.16),
    0 0 24px color-mix(in srgb, var(--accent) 24%, transparent);
}

        .identityBand {
          position: relative;
          background:
            linear-gradient(
              90deg,
              color-mix(in srgb, var(--accent) 10%, #ffffff),
              rgba(255, 247, 244, 0.86)
            );
        }

        .dark .identityBand {
          background:
            linear-gradient(
              90deg,
              color-mix(in srgb, var(--accent) 12%, #020617),
              rgba(255, 255, 255, 0.04)
            );
        }

      .identityInner {
  width: min(1180px, calc(100% - 44px));
  display: grid;
  grid-template-columns: minmax(380px, 500px) minmax(0, 1fr);
  gap: 42px;
  align-items: start;
  margin: 0 auto;
  padding: 90px 0 46px;
}

        .identitySpacer {
          min-height: 36px;
        }

        .identityCopy {
          padding-top: 2px;
        }

        .creatorType,
        .eyebrow,
        .sectionHeader p,
        .pillCard span,
        .miniCard span,
        .postCard span {
          margin: 0;
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1 {
          margin: 12px 0 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(3.6rem, 8vw, 7.2rem);
          letter-spacing: -0.07em;
          line-height: 0.9;
        }

        h2 {
          margin: 8px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.1rem, 5vw, 3.7rem);
          letter-spacing: -0.055em;
          line-height: 0.98;
        }

        h3 {
          margin: 8px 0 0;
          font-size: 1.2rem;
          line-height: 1.2;
        }

        .identityLine {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px 20px;
          margin-top: 16px;
        }

        .tagline {
          margin: 0;
          color: #ff6a61;
          font-weight: 950;
          font-size: 1.2rem;
        }

        .dark .tagline {
          color: var(--accent);
        }

        .location {
          margin: 0;
          font-weight: 900;
        }

        .profileActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .profileActions span,
        .profileActions a,
        .miniCard a,
        .postCard a {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 18px;
          font-weight: 950;
          text-decoration: none;
        }

        .primaryAction {
          background: var(--accent);
          color: #020617;
          box-shadow: 0 16px 30px color-mix(in srgb, var(--accent) 22%, transparent);
        }

        .profileActions a:not(.primaryAction),
        .miniCard a,
        .postCard a {
          border: 1px solid currentColor;
          color: inherit;
        }

        .publicShell {
          width: min(1180px, calc(100% - 44px));
          margin: 0 auto;
          padding: 36px 0 90px;
        }

        .joyGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.6fr);
          gap: 20px;
          align-items: stretch;
        }

        .bioFeature,
        .quickFacts,
        .storyCard,
        .sectionBlock {
          border: 1px solid rgba(16, 23, 47, 0.08);
          border-radius: 36px;
          background: rgba(255, 247, 244, 0.88);
          color: #10172f;
          box-shadow: 0 36px 120px rgba(16, 23, 47, 0.1);
        }

        .dark .bioFeature,
        .dark .quickFacts,
        .dark .storyCard,
        .dark .sectionBlock {
          border-color: rgba(255, 255, 255, 0.12);
          background:
            radial-gradient(
              circle at 88% 12%,
              color-mix(in srgb, var(--accent) 14%, transparent),
              transparent 28%
            ),
            linear-gradient(135deg, #020617, #071014 62%, #111827);
          color: #ffffff;
          box-shadow: 0 36px 120px rgba(0, 0, 0, 0.28);
        }

        .bioFeature {
          min-height: 320px;
          padding: clamp(30px, 5vw, 56px);
          position: relative;
          overflow: hidden;
        }

        .bioFeature::after {
          content: "";
          position: absolute;
          right: -44px;
          bottom: -52px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--accent) 18%, transparent);
        }

        .bio,
        .longText {
          max-width: 820px;
          color: #596273;
          font-size: 1.05rem;
          line-height: 1.75;
          white-space: pre-wrap;
        }

        .bio {
          margin: 24px 0 0;
          font-size: 1.12rem;
        }

        .longText {
          margin: 22px 0 0;
        }

        .dark .bio,
        .dark .longText,
        .dark .miniCard p,
        .dark .emptyState p,
        .dark .postCard p {
          color: rgba(255, 255, 255, 0.68);
        }

        .quickFacts {
          display: grid;
          gap: 14px;
          padding: 18px;
        }

        .pillCard {
          min-height: 112px;
          border-radius: 26px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.82),
              color-mix(in srgb, var(--accent) 10%, #ffffff)
            );
          padding: 18px;
        }

        .dark .pillCard {
          background: rgba(255, 255, 255, 0.08);
        }

        .pillCard strong {
          display: block;
          margin-top: 10px;
          font-size: 1.05rem;
          line-height: 1.38;
        }

        .accentCard {
          background: var(--accent);
          color: #020617;
        }

        .accentCard span {
          color: rgba(2, 6, 23, 0.66);
        }

        .storyMosaic {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 20px;
          margin-top: 26px;
        }

        .storyCard {
          padding: clamp(30px, 4vw, 48px);
        }

        .storyCard.small {
          align-self: start;
          transform: rotate(1deg);
        }

        .sectionBlock {
          margin-top: 26px;
          padding: clamp(30px, 4vw, 48px);
        }

        .sectionHeader {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 22px;
        }

        .cardGrid {
          column-count: 3;
          column-gap: 20px;
          margin-top: 28px;
        }

        .postGrid {
          display: grid;
          grid-template-columns: 1.2fr 0.9fr 0.9fr;
          gap: 18px;
          margin-top: 26px;
        }

        .miniCard,
        .postCard,
        .emptyState {
          border: 1px solid rgba(16, 23, 47, 0.1);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.72);
          padding: 18px;
          overflow: hidden;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .miniCard {
          display: inline-block;
          width: 100%;
          margin: 0 0 20px;
          break-inside: avoid;
          box-shadow: 0 18px 44px rgba(16, 23, 47, 0.08);
        }

        .miniCard:nth-child(4n + 1) {
          background:
            radial-gradient(
              circle at 90% 12%,
              color-mix(in srgb, var(--accent) 16%, transparent),
              transparent 26%
            ),
            rgba(255, 255, 255, 0.76);
        }

        .miniCard:nth-child(4n + 2) {
          border-radius: 38px;
        }

        .miniCard:nth-child(4n + 3) {
          padding: 14px;
        }

        .miniCard:nth-child(4n + 4) {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.86),
              color-mix(in srgb, var(--accent) 10%, #ffffff)
            );
        }

        .miniCard:hover,
        .postCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 60px rgba(16, 23, 47, 0.14);
        }

        .dark .miniCard,
        .dark .postCard,
        .dark .emptyState {
          border-color: rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.08);
        }

        .miniCard img {
          width: 100%;
          min-height: 180px;
          max-height: 360px;
          object-fit: cover;
          border-radius: 22px;
          margin-bottom: 16px;
        }

        .miniCard:nth-child(3n + 1) img {
          height: 320px;
        }

        .miniCard:nth-child(3n + 2) img {
          height: 230px;
        }

        .miniCard:nth-child(3n) img {
          height: 270px;
        }

        .miniCard p,
        .postCard p {
          margin: 12px 0 0;
          color: #596273;
          line-height: 1.55;
          white-space: pre-wrap;
        }

        .miniCard a,
        .postCard a {
          margin-top: 16px;
        }

        .exchangeBlock {
          background:
            radial-gradient(
              circle at 90% 18%,
              color-mix(in srgb, var(--accent) 14%, transparent),
              transparent 25%
            ),
            rgba(255, 247, 244, 0.88);
        }

        .postCard {
          min-height: 220px;
        }

        .featuredPost {
          grid-row: span 2;
          min-height: 360px;
          background:
            linear-gradient(
              135deg,
              color-mix(in srgb, var(--accent) 18%, #ffffff),
              rgba(255, 255, 255, 0.74)
            );
        }

        .dark .featuredPost {
          background:
            linear-gradient(
              135deg,
              color-mix(in srgb, var(--accent) 18%, #020617),
              rgba(255, 255, 255, 0.07)
            );
        }

        .emptyState {
          margin-top: 24px;
        }

        .emptyState.lively {
          min-height: 180px;
          display: grid;
          align-content: center;
          background:
            radial-gradient(
              circle at 86% 20%,
              color-mix(in srgb, var(--accent) 22%, transparent),
              transparent 26%
            ),
            rgba(255, 255, 255, 0.72);
        }

        .emptyState strong {
          display: block;
          font-size: 1.05rem;
        }

        .emptyState p {
          margin: 8px 0 0;
          color: #596273;
          line-height: 1.55;
        }

        @media (max-width: 1050px) {
          .cardGrid {
            column-count: 2;
          }
        }

        @media (max-width: 900px) {
          .heroBanner {
            height: 330px;
          }

          .avatarDock {
            left: 28px;
            bottom: -18px;
            width: 195px;
            height: 195px;
          }

          .logoBadge {
            width: 44px;
            height: 44px;
            bottom: 34px;
            right: 4px;
          }

          .identityInner {
            width: min(100% - 28px, 1180px);
            grid-template-columns: 1fr;
            gap: 0;
            padding-top: 38px;
          }

          .identitySpacer {
            display: none;
          }

          .publicShell {
            width: min(100% - 28px, 1180px);
            padding-top: 24px;
          }

          .joyGrid,
          .storyMosaic,
          .postGrid {
            grid-template-columns: 1fr;
          }

          .cardGrid {
            column-count: 1;
          }

          .storyCard.small {
            transform: none;
          }

          h1 {
            font-size: clamp(3rem, 15vw, 4.6rem);
          }
        }

        @media (max-width: 560px) {
          .miniHeader {
            padding: 9px 14px;
          }

          .miniBrand img {
            width: 36px;
            height: 36px;
          }

          .miniBrand strong {
            font-size: 0.82rem;
          }

          .miniBrand span {
            font-size: 0.46rem;
          }

          .manageButton {
            min-height: 34px;
            font-size: 0.72rem;
            padding: 0 12px;
          }

          .heroBanner {
            height: 280px;
          }

          .avatarDock {
            width: 170px;
            height: 170px;
            bottom: -14px;
          }

          .profilePhoto {
            border-width: 7px;
          }

          .logoBadge {
            bottom: 28px;
          }

          .identityInner {
            padding-top: 34px;
          }

          .bioFeature,
          .sectionBlock,
          .storyCard {
            border-radius: 28px;
            padding: 26px;
          }
        }
      `}</style>
    </main>
  );
}

function BoardSection({ type, items }) {
  const label = boardLabels[type];

  return (
    <section className="sectionBlock boardBlock">
      <div className="sectionHeader">
        <div>
          <p>{label.eyebrow}</p>
          <h2>{label.title}</h2>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="cardGrid">
          {items.map((item) => {
            const itemHref = formatExternalUrl(item.external_url || "");

            return (
              <article className="miniCard" key={`${type}-${item.id}`}>
                {item.image_url && <img src={item.image_url} alt={item.title} />}

                <div>
                  <span>{label.eyebrow}</span>
                  <h3>{item.title}</h3>

                  {item.body && <p>{item.body}</p>}

                  {item.external_url && (
                    <a
                      href={itemHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="emptyState lively">
          <strong>{label.emptyTitle}</strong>
          <p>{label.empty}</p>
        </div>
      )}
    </section>
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