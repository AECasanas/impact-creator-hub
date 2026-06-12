"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05090b] text-white">
      <section className="relative min-h-screen overflow-hidden">
        {/* Background image */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[128px] bg-[url('/impact-hero-background.png')] bg-cover bg-center" />

        {/* Dark overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[128px] bg-black/25" />

        {/* Page content */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-8 py-8">
          {/* Header */}
          <header className="relative z-20 flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <img
                src="/logo-ripple.png"
                alt="Impact Creator Hub logo"
                className="h-16 w-16 object-contain"
              />

              <div>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  Impact Creator Hub
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.42em]">
                  <span className="text-white/65">Build your brand. </span>
                  <span className="text-[#f28c82]">Grow your impact.</span>
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-10 text-base font-medium text-white/85 md:flex">
              <NavLink href="/features">Features</NavLink>
              <NavLink href="/for-creators">For Creators</NavLink>
              <NavLink href="/for-brands">For Brands</NavLink>
              <NavLink href="/about-us">About Us</NavLink>
              <NavLink href="/login">Login</NavLink>

              <a
                href="/signup"
                className="rounded-md bg-cyan-300 px-8 py-4 font-semibold text-black shadow-[0_0_24px_rgba(103,232,249,0.20)] transition hover:bg-cyan-200"
              >
                Get Started
              </a>
            </nav>
          </header>

          {/* Hero */}
          <div className="flex flex-1 items-center">
            <div className="max-w-3xl">
              <h1 className="text-6xl font-bold leading-[1.12] tracking-tight md:text-7xl">
                Build your
                <br />
                <span className="text-cyan-300">creator brand</span>
                <br />
                in{" "}
                <span className="relative inline-block">
                  one
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[#f28c82]" />
                </span>{" "}
                place.
              </h1>

              <p className="mt-10 max-w-2xl text-xl leading-9 text-white/82">
                Impact Creator Hub helps influencers create a polished profile,
                share an Impact Kit, receive brand inquiries, and grow their
                personal brand beyond social media.
              </p>

              <div className="mt-10 flex flex-col gap-5 sm:flex-row">
                <a
                  href="/impact-exchange"
                  className="rounded-md border border-cyan-300 px-10 py-5 text-center text-lg font-semibold text-white transition hover:border-[#f28c82]"
                >
                  Explore the Hub
                </a>

                <a
                  href="/creator-profile"
                  className="rounded-md border border-cyan-300 px-10 py-5 text-center text-lg font-semibold text-white transition hover:border-[#f28c82]"
                >
                  View Example Profile
                </a>
              </div>

              <div className="mt-12 flex items-center gap-4 text-lg text-white/65">
                <span className="text-[#f28c82]">
                  <ShieldIcon />
                </span>
                <p>Start building your creator brand today.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group relative inline-flex pb-4 transition hover:text-white"
    >
      {children}
      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#f28c82] transition-all duration-200 group-hover:w-full" />
    </a>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        {/* Main grid: statement left, brand + links right */}
        <div className="footerMain">
          {/* LEFT: statement + CTAs */}
          <div className="footerStatement">
            <h2>
              Your brand.
              <br />
              Your <span>impact.</span>
              <br />
              Your community.
            </h2>

            <p>
              The social marketplace built for creators, brands, and the people
              who connect them.
            </p>

            <div className="footerCtaRow">
              <a href="/signup/creator" className="btnPrimary">
                Join as a Creator
              </a>

              <a href="/signup/brand" className="btnSecondary">
                Join as a Brand
              </a>
            </div>

            <div className="footerTrend">
              <span className="footerTrendDot" />
              <span>New creators joining every day</span>
            </div>
          </div>

          {/* RIGHT: brand block + 3 link columns */}
          <div className="footerRight">
            <div className="footerBrand">
              <div className="footerBrandMark">
                <div className="footerLogo">I</div>
                <strong>Impact Creator Hub</strong>
              </div>

              <p>
                Where creators and brands find each other — through real work,
                real niches, and real people.
              </p>

              <div className="socialRow">
                <a href="#" className="socialIcon" aria-label="Instagram">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>

                <a href="#" className="socialIcon" aria-label="TikTok">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>

                <a href="#" className="socialIcon" aria-label="X / Twitter">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 4l16 16M4 20L20 4" />
                  </svg>
                </a>

                <a href="#" className="socialIcon" aria-label="LinkedIn">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="linkCol">
              <h4>Creators</h4>
              <a href="/signup/creator">Join Free</a>
              <a href="/features">Impact Kit</a>
              <a href="/impact-exchange">Impact Exchange</a>
              <a href="/for-creators">How It Works</a>
              <a href="/pricing">
                Pro Plan <span className="footerBadge">New</span>
              </a>
            </div>

            <div className="linkCol">
              <h4>Brands</h4>
              <a href="/signup/brand">Join Free</a>
              <a href="/for-brands">For Brands</a>
              <a href="/impact-exchange">Browse Creators</a>
              <a href="/pricing">Brand Pro</a>
            </div>

            <div className="linkCol">
              <h4>Company</h4>
              <a href="/about-us">About Us</a>
              <a href="/features">Features</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footerBottom">
          <p>
            © {new Date().getFullYear()} Impact Creator Hub. All rights
            reserved.
          </p>

          <div className="footerLegal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .siteFooter {
          background: #05090b;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 64px 48px 36px;
          position: relative;
          overflow: hidden;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #ffffff;
        }

        .siteFooter::before {
          content: "";
          position: absolute;
          left: -100px;
          top: -100px;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(103, 232, 249, 0.07),
            transparent 70%
          );
          pointer-events: none;
        }

        .siteFooter::after {
          content: "";
          position: absolute;
          right: -80px;
          bottom: -80px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(242, 140, 130, 0.06),
            transparent 70%
          );
          pointer-events: none;
        }

        .footerInner {
          max-width: 1180px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .footerMain {
          display: grid;
          grid-template-columns: 1.1fr 1.9fr;
          gap: 64px;
          align-items: start;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footerStatement h2 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.2rem, 4vw, 3.6rem);
          font-weight: 400;
          letter-spacing: -0.05em;
          line-height: 1.05;
          color: #ffffff;
        }

        .footerStatement h2 span {
          color: #67e8f9;
        }

        .footerStatement > p {
          margin-top: 20px;
          color: rgba(255, 255, 255, 0.52);
          font-size: 0.88rem;
          line-height: 1.7;
          max-width: 280px;
        }

        .footerCtaRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .btnPrimary {
          display: inline-flex;
          align-items: center;
          background: #67e8f9;
          color: #020617;
          font-weight: 700;
          font-size: 0.84rem;
          padding: 11px 20px;
          border-radius: 999px;
          text-decoration: none;
        }

        .btnSecondary {
          display: inline-flex;
          align-items: center;
          background: transparent;
          color: rgba(255, 255, 255, 0.72);
          font-weight: 700;
          font-size: 0.84rem;
          padding: 11px 20px;
          border-radius: 999px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .btnPrimary:hover {
          background: #a5f3fc;
        }

        .btnSecondary:hover {
          border-color: rgba(255, 255, 255, 0.38);
          color: #ffffff;
        }

        .footerTrend {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: rgba(103, 232, 249, 0.06);
          border: 1px solid rgba(103, 232, 249, 0.16);
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.62);
          margin-top: 18px;
        }

        .footerTrendDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #67e8f9;
          flex-shrink: 0;
          animation: footerPulse 2s ease-in-out infinite;
        }

        @keyframes footerPulse {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.25;
          }
        }

        .footerRight {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        .footerBrand {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footerBrandMark {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footerLogo {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #000;
          border: 1px solid rgba(103, 232, 249, 0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #67e8f9;
          font-weight: 900;
          font-family: Georgia, serif;
          flex-shrink: 0;
        }

        .footerBrandMark strong {
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .footerBrand > p {
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.78rem;
          line-height: 1.6;
        }

        .socialRow {
          display: flex;
          gap: 8px;
          margin-top: 2px;
        }

        .socialIcon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.13);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: border-color 0.15s ease, color 0.15s ease;
        }

        .socialIcon:hover {
          border-color: #67e8f9;
          color: #67e8f9;
        }

        .linkCol h4 {
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.36);
          margin-bottom: 16px;
        }

        .linkCol a {
          display: block;
          color: rgba(255, 255, 255, 0.66);
          font-size: 0.84rem;
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 11px;
          transition: color 0.15s ease;
        }

        .linkCol a:hover {
          color: #67e8f9;
        }

        .footerBadge {
          display: inline-block;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(242, 140, 130, 0.16);
          color: #f28c82;
          margin-left: 5px;
          vertical-align: middle;
        }

        .footerBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-top: 24px;
          flex-wrap: wrap;
        }

        .footerBottom p {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.28);
        }

        .footerLegal {
          display: flex;
          gap: 20px;
        }

        .footerLegal a {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.28);
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .footerLegal a:hover {
          color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 1024px) {
          .footerMain {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .footerStatement > p {
            max-width: 100%;
          }

          .footerStatement h2 {
            font-size: clamp(2rem, 8vw, 3rem);
          }
        }

        @media (max-width: 768px) {
          .siteFooter {
            padding: 48px 24px 28px;
          }

          .footerRight {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }

          .footerBrand {
            grid-column: span 2;
          }
        }

        @media (max-width: 480px) {
          .footerRight {
            grid-template-columns: 1fr;
          }

          .footerBrand {
            grid-column: span 1;
          }

          .footerCtaRow {
            flex-direction: column;
          }

          .btnPrimary,
          .btnSecondary {
            justify-content: center;
          }

          .footerBottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </footer>
  );
}