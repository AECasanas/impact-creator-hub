export default function ImpactHeaderBrand({
  href = "/",
  subtitle = "BUILD YOUR BRAND. GROW YOUR IMPACT.",
  logoSize = 88,
  textColor = "#ffffff",
  compact = false,
}) {
  return (
    <a
      href={href}
      className={`impactHeaderBrand ${compact ? "compact" : ""}`}
      style={{
        "--logo-size": `${logoSize}px`,
        "--text-color": textColor,
      }}
    >
      <img src="/logo-ripple.png" alt="Impact Creator Hub logo" />

      <div>
        <strong>Impact Creator Hub</strong>
        <span>{subtitle}</span>
      </div>

      <style jsx>{`
        .impactHeaderBrand {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          color: var(--text-color);
          text-decoration: none;
        }

        .impactHeaderBrand img {
          width: var(--logo-size);
          height: var(--logo-size);
          object-fit: contain;
          background: #000000;
          flex: 0 0 auto;
        }

        .impactHeaderBrand strong {
          display: block;
          color: var(--text-color);
          font-size: 2rem;
          font-weight: 950;
          letter-spacing: -0.04em;
          line-height: 1;
          white-space: nowrap;
        }

        .impactHeaderBrand span {
          display: block;
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 0.86rem;
          font-weight: 950;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .impactHeaderBrand.compact {
          gap: 12px;
        }

        .impactHeaderBrand.compact strong {
          font-size: 1rem !important;
          letter-spacing: -0.02em;
        }

        .impactHeaderBrand.compact span {
          margin-top: 6px;
          font-size: 0.48rem !important;
          letter-spacing: 0.24em;
        }

        @media (max-width: 640px) {
          .impactHeaderBrand {
            gap: 12px;
          }

          .impactHeaderBrand strong {
            font-size: 1rem !important;
          }

          .impactHeaderBrand span {
            margin-top: 6px;
            font-size: 0.48rem !important;
            letter-spacing: 0.2em;
          }
        }
      `}</style>
    </a>
  );
}