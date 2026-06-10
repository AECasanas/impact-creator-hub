"use client";

export default function ForBrandsPage() {
  return (
    <main className="presentationPage">
      <section className="shell">
        <header className="nav">
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

        <section className="hero">
          <p className="eyebrow">For Brands</p>

          <h1>Find creators who fit your brand, audience, and goals.</h1>

          <p className="heroText">
            Impact Creator Hub helps brands, businesses, agencies, nonprofits,
            and projects discover creators through clearer profiles, stronger
            positioning, and more useful collaboration signals.
          </p>
        </section>

        <section className="statementPanel">
          <p className="eyebrow">The problem</p>

          <h2>
            Creator discovery is powerful, but it can be hard to evaluate quickly.
          </h2>

          <p>
            Brands often have to search across social platforms, scattered links,
            incomplete bios, and informal messages to understand whether a creator
            is the right fit. That slows down decisions and makes collaboration
            harder than it needs to be.
          </p>
        </section>

        <section className="cards">
          <article>
            <span>1</span>
            <h2>Fit</h2>
            <p>
              Review creator profiles with clearer information about niche, voice,
              audience, work style, and collaboration interest.
            </p>
          </article>

          <article>
            <span>2</span>
            <h2>Clarity</h2>
            <p>
              See more than a social bio. Profiles help brands understand a
              creator’s positioning, presence, and public value in one place.
            </p>
          </article>

          <article>
            <span>3</span>
            <h2>Action</h2>
            <p>
              Move from discovery to outreach with better context, better signals,
              and a clearer starting point for partnership conversations.
            </p>
          </article>
        </section>

        <section className="splitPanel">
          <div>
            <p className="eyebrow">What brands need</p>
            <h2>A cleaner way to evaluate creator partnerships.</h2>
          </div>

          <div className="pointList">
            <p>
              <strong>Discovery:</strong> Find creators who align with a brand,
              campaign, community, or audience.
            </p>

            <p>
              <strong>Context:</strong> Understand who the creator is, what they
              make, and how they present their work.
            </p>

            <p>
              <strong>Signals:</strong> Review profile details, links, featured
              work, and collaboration readiness.
            </p>

            <p>
              <strong>Connection:</strong> Start better conversations with
              creators who already feel like a potential fit.
            </p>
          </div>
        </section>

        <section className="closingPanel">
          <p className="eyebrow">Why it matters</p>

          <h2>
            Better creator discovery leads to better partnerships.
          </h2>

          <p>
            Impact Creator Hub is designed to help brands spend less time guessing
            and more time identifying creators who are relevant, organized, and
            ready for meaningful opportunities.
          </p>
        </section>
      </section>

      <style jsx>{`
        .presentationPage {
          min-height: 100vh;
          background:
            radial-gradient(circle at 14% 18%, rgba(103, 232, 249, 0.12), transparent 28%),
            radial-gradient(circle at 88% 12%, rgba(242, 140, 130, 0.09), transparent 26%),
            linear-gradient(135deg, #040708 0%, #071014 52%, #040708 100%);
          color: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 30px;
        }

        .shell {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 24px;
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
          width: 62px;
          height: 62px;
          object-fit: contain;
        }

        .brand strong {
          display: block;
          font-size: 1.3rem;
          letter-spacing: -0.03em;
        }

        .brand p {
          margin: 4px 0 0;
          color: #f28c82;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .brand p span:first-child {
          color: rgba(255, 255, 255, 0.66);
        }

        .hero {
          max-width: 980px;
          padding: clamp(58px, 8vw, 108px) 0 38px;
        }

        .eyebrow {
          margin: 0;
          color: #67e8f9;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h1,
        h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.045em;
          line-height: 1.04;
        }

        h1 {
          margin-top: 18px;
          max-width: 900px;
          font-size: clamp(2.4rem, 4.8vw, 4.4rem);
        }

        .heroText {
          max-width: 820px;
          margin: 28px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: clamp(1.05rem, 2vw, 1.22rem);
          line-height: 1.8;
        }

        .statementPanel,
        .splitPanel,
        .closingPanel,
        .cards article {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.055);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(18px);
        }

        .statementPanel,
        .closingPanel {
          padding: clamp(28px, 4vw, 42px);
        }

        .statementPanel h2,
        .closingPanel h2 {
          margin-top: 14px;
          max-width: 820px;
          font-size: clamp(1.9rem, 3.8vw, 3.3rem);
          line-height: 1.08;
        }

        .statementPanel p:not(.eyebrow),
        .closingPanel p:not(.eyebrow) {
          max-width: 820px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 1.05rem;
          line-height: 1.8;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 22px;
        }

        .cards article {
          min-height: 250px;
          padding: 28px;
        }

        .cards span {
          color: #f28c82;
          font-weight: 900;
        }

        .cards h2 {
          margin-top: 18px;
          font-size: 2.05rem;
        }

        .cards p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        .splitPanel {
          margin-top: 22px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 32px;
          padding: clamp(28px, 4vw, 42px);
        }

        .splitPanel h2 {
          margin-top: 14px;
          font-size: clamp(1.9rem, 3.6vw, 3.1rem);
          line-height: 1.08;
        }

        .pointList {
          display: grid;
          gap: 14px;
        }

        .pointList p {
          margin: 0;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.045);
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.65;
        }

        .pointList strong {
          color: #ffffff;
        }

        .closingPanel {
          margin-top: 22px;
          background:
            radial-gradient(circle at 88% 18%, rgba(103, 232, 249, 0.1), transparent 28%),
            rgba(255, 255, 255, 0.055);
        }

        @media (max-width: 850px) {
          .presentationPage {
            padding: 24px;
          }

          .cards,
          .splitPanel {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: clamp(2.2rem, 12vw, 3.4rem);
          }

          .brand img {
            width: 54px;
            height: 54px;
          }

          .brand strong {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </main>
  );
}