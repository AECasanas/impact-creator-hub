"use client";

export default function CreatorProfileCard({
  profile = {},
  activeAccent = {
    name: "Electric Cyan",
    color: "#00e8f0",
    image: "/logo-colors/impact-logo-electric-cyan.png",
  },
  photoPreview = "",
  bannerPreview = "",
  compact = false,
  showBio = true,
  showStory = false,
}) {
  const isDark =
    profile.profileStyle === "Simple Dark" ||
    profile.profile_style === "Simple Dark";

  const displayName = profile.displayName || profile.display_name || "Your Name";

  const creatorType = profile.creatorType || profile.creator_type || "Creator";

  const tagline = profile.tagline || "";

  const location = profile.location || "";

  const shortBio = profile.shortBio || profile.short_bio || "";

  const longBio = profile.longBio || profile.long_bio || "";

  const writingIntro = profile.writingIntro || profile.writing_intro || "";

  const profilePhoto =
    photoPreview || profile.profilePhotoUrl || profile.profile_photo_url || "";

  const bannerPhoto =
    bannerPreview || profile.bannerPhotoUrl || profile.banner_photo_url || "";

  const accentImage =
    activeAccent?.image || "/logo-colors/impact-logo-electric-cyan.png";

  return (
    <article
      className={`creatorProfileCard ${isDark ? "dark" : "light"} ${
        compact ? "compact" : ""
      }`}
      style={{
        "--accent": activeAccent?.color || "#00e8f0",
      }}
    >
      <div
        className="creatorProfileBanner"
        style={
          bannerPhoto
            ? {
                backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.10), rgba(2, 6, 23, 0.20)), url(${bannerPhoto})`,
              }
            : undefined
        }
      >
        <div className="creatorPhotoWrap">
          <div className="creatorPhoto">
            {profilePhoto ? (
              <img src={profilePhoto} alt={`${displayName} profile photo`} />
            ) : (
              <span>Photo</span>
            )}
          </div>

          <img className="creatorLogoBadge" src={accentImage} alt="" />
        </div>
      </div>

      <div className="creatorProfileBody">
        <p className="creatorType">{creatorType}</p>

        <h2>{displayName}</h2>

        {tagline && <p className="creatorTagline">{tagline}</p>}

        {location && <p className="creatorLocation">{location}</p>}

        {showBio && shortBio && <p className="creatorBio">{shortBio}</p>}

        {showStory && longBio && (
          <div className="creatorStoryBox">
            <span>Creator Story</span>
            <p>{longBio}</p>
          </div>
        )}

        {showStory && writingIntro && (
          <div className="creatorStoryBox">
            <span>Writing</span>
            <p>{writingIntro}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .creatorProfileCard {
          overflow: hidden;
          border-radius: 34px;
          background: #fff7f4;
          color: #10172f;
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.28);
        }

        .creatorProfileCard.light {
          background: #fff7f4;
          color: #10172f;
        }

        .creatorProfileCard.dark {
          background:
            radial-gradient(
              circle at 80% 18%,
              color-mix(in srgb, var(--accent) 16%, transparent),
              transparent 26%
            ),
            linear-gradient(135deg, #020617, #071014 60%, #111827);
          color: #ffffff;
        }

        .creatorProfileBanner {
          min-height: 280px;
          position: relative;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(255, 106, 97, 0.15),
              transparent 24%
            ),
            linear-gradient(135deg, #fff7f4, #ffe1d8);
          background-size: cover;
          background-position: center;
        }

        .creatorProfileCard.dark .creatorProfileBanner {
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

        .creatorPhotoWrap {
          position: relative;
          width: 210px;
          height: 210px;
        }

        .creatorPhoto {
          width: 210px;
          height: 210px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 8px solid #ffffff;
          border-radius: 50%;
          background: #10172f;
          color: rgba(255, 255, 255, 0.72);
          font-weight: 950;
          box-shadow:
            0 18px 44px rgba(16, 23, 47, 0.22),
            0 24px 70px rgba(0, 0, 0, 0.18);
        }

        .creatorPhoto img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

        .creatorLogoBadge {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 56px;
          height: 56px;
          border: 5px solid #ffffff;
          border-radius: 50%;
          background: #000000;
          object-fit: cover;
          z-index: 10;
          transform: translate(28%, 18%);
        }

        .creatorProfileBody {
          padding: 28px;
        }

        .creatorProfileCard.light .creatorProfileBody {
          color: #10172f;
        }

        .creatorType {
          margin: 0;
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .creatorProfileCard.light .creatorType {
          color: var(--accent) !important;
        }

        h2 {
          margin: 12px 0 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          letter-spacing: -0.06em;
          line-height: 0.96;
        }

        .creatorProfileCard.light h2 {
          color: #10172f !important;
        }

        .creatorProfileCard.dark h2 {
          color: #ffffff;
        }

        .creatorTagline {
          margin: 0;
          color: #ff6a61;
          font-weight: 950;
          font-size: 1.1rem;
        }

        .creatorProfileCard.light .creatorTagline {
          color: #ff6a61 !important;
        }

        .creatorProfileCard.dark .creatorTagline {
          color: var(--accent);
        }

        .creatorLocation {
          margin: 14px 0 0;
          color: rgba(16, 23, 47, 0.72);
          font-weight: 900;
        }

        .creatorProfileCard.light .creatorLocation {
          color: rgba(16, 23, 47, 0.72) !important;
        }

        .creatorProfileCard.dark .creatorLocation {
          color: rgba(255, 255, 255, 0.74);
        }

        .creatorBio {
          margin: 18px 0 0;
          color: #596273;
          line-height: 1.65;
        }

        .creatorProfileCard.light .creatorBio {
          color: #596273 !important;
        }

        .creatorProfileCard.dark .creatorBio {
          color: rgba(255, 255, 255, 0.68);
        }

        .creatorStoryBox {
          margin-top: 18px;
          border: 1px solid rgba(16, 23, 47, 0.1);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.65);
          padding: 16px;
        }

        .creatorProfileCard.dark .creatorStoryBox {
          border-color: rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.08);
        }

        .creatorStoryBox span {
          display: block;
          color: var(--accent);
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .creatorStoryBox p {
          margin: 10px 0 0;
          color: #596273;
          line-height: 1.65;
          white-space: pre-wrap;
        }

        .creatorProfileCard.light .creatorStoryBox p {
          color: #596273 !important;
        }

        .creatorProfileCard.dark .creatorStoryBox p {
          color: rgba(255, 255, 255, 0.68);
        }

        .creatorProfileCard.compact {
          border-radius: 30px;
        }

        .creatorProfileCard.compact .creatorProfileBanner {
          min-height: 230px;
        }

        .creatorProfileCard.compact .creatorPhotoWrap,
        .creatorProfileCard.compact .creatorPhoto {
          width: 150px;
          height: 150px;
        }

        .creatorProfileCard.compact .creatorLogoBadge {
          right: 8px;
          bottom: 8px;
          width: 46px;
          height: 46px;
          border-width: 4px;
          transform: translate(25%, 18%);
        }

        .creatorProfileCard.compact .creatorProfileBody {
          padding: 24px;
        }

        .creatorProfileCard.compact h2 {
          font-size: clamp(2rem, 4vw, 3.2rem);
        }

        @media (max-width: 700px) {
          .creatorProfileBanner {
            min-height: 230px;
          }

          .creatorPhotoWrap,
          .creatorPhoto {
            width: 165px;
            height: 165px;
          }

          .creatorLogoBadge {
            right: 8px;
            bottom: 8px;
            width: 46px;
            height: 46px;
            border-width: 4px;
            transform: translate(25%, 18%);
          }

          .creatorProfileBody {
            padding: 24px;
          }
        }
      `}</style>
    </article>
  );
}