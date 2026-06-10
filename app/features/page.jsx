"use client";

const heroSlides = [
  {
    label: "Featured Creator Project",
    title: "Creator projects in motion",
    text: "A visual showcase for creator work, project updates, and collaboration-ready stories.",
    image: "/impact-hero-background.png",
  },
  {
    label: "Featured Postcard",
    title: "Postcards for ideas and opportunities",
    text: "Postcard-style updates give creators and brands a simple way to share what they are building.",
    image: "/impact-hero-background.png",
  },
  {
    label: "Featured Brand",
    title: "Brands looking for the right fit",
    text: "A place for featured businesses, campaigns, and aligned creator partnerships.",
    image: "/impact-hero-background.png",
  },
];

const featureCards = [
  {
    label: "Creator Project",
    title: "Coral Notes",
    text: "A visual project documenting restoration, local storytelling, and creator-led awareness.",
  },
  {
    label: "Impact Postcard",
    title: "Field Update",
    text: "A postcard-style update designed to share progress, ideas, and project momentum.",
  },
  {
    label: "Brand Match",
    title: "Purpose-Led Campaign",
    text: "A collaboration concept built around shared values, creator fit, and visual storytelling.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="featuresPage">
      <section className="shell">
        <header className="topBar">
          <a className="brand" href="/">
            <img src="/logo-ripple.png" alt="Impact Creator Hub logo" />
            <div>
              <strong>Impact Creator Hub</strong>
              <p>
                <span>Build your brand. </span>
                <span>Grow your impact.</span>
              </p>
            </div>
          </a>
        </header>

        <section className="intro">
          <p className="eyebrow">Features</p>
          <h1>Featured creators, projects, postcards, and brands.</h1>
          <p>
            A simple showcase page for the work, opportunities, and visual
            stories moving through Impact Creator Hub.
          </p>
        </section>

        <section className="photoCarousel" aria-label="Featured image carousel">
          <div className="photoTrack">
            {heroSlides.map((slide) => (
              <article
                className="photoSlide"
                key={slide.title}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="photoShade">
                  <p className="eyebrow">{slide.label}</p>
                  <h2>{slide.title}</h2>
                  <p>{slide.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cardCarousel" aria-label="Featured moving cards">
          <div className="cardTrack">
            {[...featureCards, ...featureCards, ...featureCards].map(
              (card, index) => (
                <article className="glassCard" key={`${card.title}-${index}`}>
                  <span>
                    {String((index % featureCards.length) + 1).padStart(2, "0")}
                  </span>
                  <p>{card.label}</p>
                  <h3>{card.title}</h3>
                  <small>{card.text}</small>
                </article>
              )
            )}
          </div>
        </section>

        <section className="typewriterCopy">
          <p>// feature page placeholder</p>
          <p>
            This page will eventually feature selected creator projects, visual
            postcards, brand profiles, and collaboration opportunities.
          </p>
          <p>
            For now, this page works as a clean presentation space. The image
            carousel across the top gives visitors a visual preview of what the
            hub will showcase once live data is connected.
          </p>
        </section>
      </section>

      <style jsx>{`
        .featuresPage {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 18%, rgba(103, 232, 249, 0.14), transparent 28%),
            radial-gradient(circle at 88% 12%, rgba(242, 140, 130, 0.12), transparent 26%),
            linear-gradient(135deg, #05090b 0%, #08131a 52%, #05090b 100%);
          color: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 30px;
        }

        .shell {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .topBar {
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: #ffffff;
          text-decoration: none;
        }

        .brand img {
          width: 58px;
          height: 58px;
          object-fit: contain;
        }

        .brand strong {
          display: block;
          font-size: 1.2rem;
          letter-spacing: -0.03em;
        }

        .brand p {
          margin: 4px 0 0;
          color: #f28c82;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .brand p span:first-child {
          color: rgba(255, 255, 255, 0.66);
        }

        .intro {
          max-width: 860px;
          padding: 40px 0 24px;
        }

        .eyebrow {
          margin: 0;
          color: #67e8f9;
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h1,
        h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        h1 {
          margin-top: 10px;
          font-size: clamp(2.5rem, 5.5vw, 5rem);
        }

        .intro p:not(.eyebrow) {
          max-width: 720px;
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 1rem;
          line-height: 1.75;
        }

        .photoCarousel {
          width: 100%;
          height: 430px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
        }

        .photoTrack {
          display: flex;
          width: 300%;
          height: 100%;
          animation: photoStep 18s steps(3, end) infinite;
        }

        .photoTrack:hover {
          animation-play-state: paused;
        }

        .photoSlide {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }

        .photoShade {
          height: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 44px;
          background: linear-gradient(
            90deg,
            rgba(5, 9, 11, 0.82),
            rgba(5, 9, 11, 0.22),
            rgba(5, 9, 11, 0)
          );
        }

        .photoShade h2 {
          margin-top: 12px;
          color: #ffffff;
          font-size: clamp(2.2rem, 4.5vw, 4.2rem);
        }

        .photoShade p:not(.eyebrow) {
          max-width: 560px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 1rem;
          line-height: 1.7;
        }

        @keyframes photoStep {
          0% {
            transform: translateX(0);
          }

          33% {
            transform: translateX(-33.3333%);
          }

          66% {
            transform: translateX(-66.6666%);
          }

          100% {
            transform: translateX(0);
          }
        }

        .cardCarousel {
          margin-top: 22px;
          overflow: hidden;
          padding: 0;
        }

        .cardTrack {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: cardStep 24s steps(3, end) infinite;
        }

        .cardTrack:hover {
          animation-play-state: paused;
        }

        .glassCard {
          width: 330px;
          min-height: 230px;
          border-radius: 20px;
          padding: 24px;
          background:
            radial-gradient(circle at 82% 18%, rgba(103, 232, 249, 0.14), transparent 30%),
            rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(18px);
        }

        .glassCard span {
          color: #f28c82;
          font-weight: 900;
        }

        .glassCard p {
          margin: 34px 0 10px;
          color: #67e8f9;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .glassCard h3 {
          margin: 0;
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .glassCard small {
          display: block;
          margin-top: 12px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        @keyframes cardStep {
          0% {
            transform: translateX(0);
          }

          33% {
            transform: translateX(calc(-346px * 3));
          }

          66% {
            transform: translateX(calc(-346px * 6));
          }

          100% {
            transform: translateX(0);
          }
        }

        .typewriterCopy {
          margin-top: 24px;
          background: rgba(255, 255, 255, 0.92);
          color: #10172f;
          padding: 26px;
          font-family: "Courier New", Courier, monospace;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
        }

        .typewriterCopy p {
          max-width: 920px;
          margin: 0 0 16px;
          line-height: 1.75;
        }

        .typewriterCopy p:first-child {
          color: #007585;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .typewriterCopy p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 900px) {
          .photoCarousel {
            height: 360px;
          }

          .photoShade {
            padding: 30px;
          }

          .cardTrack {
            animation: none;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr;
          }

          .glassCard {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}