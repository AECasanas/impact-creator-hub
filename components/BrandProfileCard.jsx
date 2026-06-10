"use client";

export default function BrandProfileCard({
  profile = {},
  activeAccent = {
    name: "Electric Cyan",
    color: "#00e8f0",
    image: "/logo-colors/impact-logo-electric-cyan.png",
  },
  logoPreview = "",
  bannerPreview = "",
  compact = false,
  showDescription = true,
}) {
  const companyName =
    profile.company_name || profile.companyName || "Your Brand";

  const brandType = profile.brand_type || profile.brandType || "Company";

  const industry = profile.industry || "Industry / Category";

  const location = profile.location || "Location";

  const shortDescription =
    profile.short_description ||
    profile.shortDescription ||
    "A polished brand profile for creators and partners to understand your mission, opportunities, and how to work with you.";

  const brandPhoto = logoPreview || profile.logo_url || profile.logoUrl || "";

  const bannerPhoto =
    bannerPreview || profile.banner_url || profile.bannerUrl || "";

  const accentImage =
    activeAccent?.image || "/logo-colors/impact-logo-electric-cyan.png";

  return (
    <article
      className={`brandProfileCard ${compact ? "compact" : ""}`}
      style={{
        "--accent": activeAccent?.color || "#00e8f0",
      }}
    >
      <div
        className="brandProfileBanner"
        style={
          bannerPhoto
            ? {
                backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.10), rgba(2, 6, 23, 0.20)), url(${bannerPhoto})`,
              }
            : undefined
        }
      >
        <div className="brandPhotoWrap">
          <div className="brandPhoto">
            {brandPhoto ? (
              <img src={brandPhoto} alt={`${companyName} brand photo`} />
            ) : (
              <span>{companyName?.charAt(0) || "B"}</span>
            )}
          </div>

          <img className="brandLogoBadge" src={accentImage} alt="" />
        </div>
      </div>

      <div className="brandProfileBody">
        <p className="brandType">{brandType}</p>

        <h2>{companyName}</h2>

        {industry && <p className="brandIndustry">{industry}</p>}

        {location && <p className="brandLocation">{location}</p>}

        {showDescription && shortDescription && (
          <p className="brandDescription">{shortDescription}</p>
        )}
      </div>

      <style jsx>{`
        .brandProfileCard {
          overflow: hidden;
          border-radius: 34px;
          background: #fff7f4;
          color: #10172f;
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.28);
        }

        .brandProfileBanner {
          min-height: 280px;
          position: relative;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle at 80% 20%,
              color-mix(in srgb, var(--accent) 18%, transparent),
              transparent 24%
            ),
            linear-gradient(135deg, var(--accent), #ffe1d8);
          background-size: cover;
          background-position: center;
        }

        .brandPhotoWrap {
          position: relative;
          width: 210px;
          height: 210px;
        }

        .brandPhoto {
          width: 210px;
          height: 210px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 8px solid #ffffff;
          border-radius: 34px;
          background: #10172f;
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 5rem;
          font-weight: 950;
          box-shadow:
            0 18px 44px rgba(16, 23, 47, 0.22),
            0 24px 70px rgba(0, 0, 0, 0.18);
        }

        .brandPhoto img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .brandLogoBadge {
          position: absolute;
          right: 8px;
          bottom: 8px;
          width: 56px;
          height: 56px;
          border: 5px solid #ffffff;
          border-radius: 50%;
          background: #000000;
          object-fit: cover;
          z-index: 10;
          transform: translate(28%, 18%);
          box-shadow: 0 12px 26px rgba(0, 0, 0, 0.22);
        }

        .brandProfileBody {
          padding: 32px;
        }

        .brandType {
          margin: 0;
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h2 {
          margin: 12px 0 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.2rem, 4vw, 3.8rem);
          letter-spacing: -0.06em;
          line-height: 0.96;
        }

        .brandIndustry {
          margin: 16px 0 0;
          color: #596273;
          font-weight: 950;
        }

        .brandLocation {
          margin: 14px 0 0;
          color: #596273;
          font-weight: 800;
        }

        .brandDescription {
          margin: 18px 0 0;
          color: #596273;
          line-height: 1.65;
        }

        .brandProfileCard.compact {
          border-radius: 30px;
        }

        .brandProfileCard.compact .brandProfileBanner {
          min-height: 230px;
        }

        .brandProfileCard.compact .brandPhotoWrap,
        .brandProfileCard.compact .brandPhoto {
          width: 150px;
          height: 150px;
        }

        .brandProfileCard.compact .brandPhoto {
          border-radius: 28px;
          font-size: 4rem;
        }

        .brandProfileCard.compact .brandLogoBadge {
          right: 8px;
          bottom: 8px;
          width: 46px;
          height: 46px;
          border-width: 4px;
          transform: translate(25%, 18%);
        }

        .brandProfileCard.compact .brandProfileBody {
          padding: 24px;
        }

        .brandProfileCard.compact h2 {
          font-size: clamp(2rem, 4vw, 3.2rem);
        }

        @media (max-width: 700px) {
          .brandProfileBanner {
            min-height: 230px;
          }

          .brandPhotoWrap,
          .brandPhoto {
            width: 165px;
            height: 165px;
          }

          .brandPhoto {
            border-radius: 30px;
            font-size: 4rem;
          }

          .brandLogoBadge {
            right: 8px;
            bottom: 8px;
            width: 46px;
            height: 46px;
            border-width: 4px;
            transform: translate(25%, 18%);
          }

          .brandProfileBody {
            padding: 24px;
          }
        }
      `}</style>
    </article>
  );
}