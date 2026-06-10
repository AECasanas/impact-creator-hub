"use client";

export default function ForCreatorsPage() {
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
          <p className="eyebrow">For Creators</p>
          <h1>A creator profile is no longer just a bio. It is your business front door.</h1>
          <p className="heroText">
            Impact Creator Hub gives creators a polished space to organize their identity,
            present their work, and make it easier for brands, projects, and partners to
            understand their value.
          </p>
        </section>

        <section className="statementPanel">
          <p className="eyebrow">The problem</p>
          <h2>Creators are building real influence, but their business presence is often scattered.</h2>
          <p>
            A creator may have strong content on one platform, links on another, campaign examples in
            a deck, and partnership details buried in messages. That makes it harder for serious
            opportunities to move quickly.
          </p>
        </section>

        <section className="cards">
          <article>
            <span>1</span>
            <h2>Identity</h2>
            <p>
              A clear creator profile gives brands a fast understanding of who the creator is,
              what they make, and what audience or niche they serve.
            </p>
          </article>

          <article>
            <span>2</span>
            <h2>Credibility</h2>
            <p>
              Featured work, platform links, profile details, and creator positioning help turn casual
              visibility into a more professional business presence.
            </p>
          </article>

          <article>
            <span>3</span>
            <h2>Opportunity</h2>
            <p>
              When creators present their value clearly, brands and collaborators can evaluate fit,
              start better conversations, and move toward meaningful projects.
            </p>
          </article>
        </section>

        <section className="splitPanel">
          <div>
            <p className="eyebrow">What the hub creates</p>
            <h2>One place for the creator’s public value.</h2>
          </div>

          <div className="pointList">
            <p>
              <strong>Profile:</strong> A polished public page that introduces the creator.
            </p>
            <p>
              <strong>Positioning:</strong> A clearer way to explain niche, voice, and creative direction.
            </p>
            <p>
              <strong>Proof:</strong> A place to highlight links, work, projects, and collaboration signals.
            </p>
            <p>
              <strong>Pathway:</strong> A smoother bridge between social visibility and business opportunity.
            </p>
          </div>
        </section>

        <section className="closingPanel">
          <p className="eyebrow">Why it matters</p>
          <h2>Creators need more than a link-in-bio. They need a place that reflects their value.</h2>
          <p>
            Impact Creator Hub is designed to help creators look organized, credible, and ready for
            the right opportunities — without forcing them to build a full website from scratch.
          </p>
        </section>
      </section>

      <style jsx>{`
        .presentationPage {
          min-height: 100vh;
          background:
            radial-gradient(circle at 14% 18%, rgba(103, 232, 249, 0.18), transparent 28%),
            radial-gradient(circle at 88% 12%, rgba(242, 140, 130, 0.14), transparent 26%),
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
          letter-spacing: -0.055em;
          line-height: 1;
        }

        h1 {
          margin-top: 18px;
          font-size: clamp(3.1rem, 7.5vw, 6.7rem);
        }

        .heroText {
          max-width: 820px;
          margin: 28px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: clamp(1.05rem, 2vw, 1.28rem);
          line-height: 1.8;
        }

        .statementPanel,
        .splitPanel,
        .closingPanel,
        .cards article {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(18px);
        }

        .statementPanel,
        .closingPanel {
          padding: clamp(28px, 4vw, 42px);
        }

        .statementPanel h2,
        .closingPanel h2 {
          margin-top: 14px;
          max-width: 960px;
          font-size: clamp(1rem, 3vw, 3rem);
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
          min-height: 260px;
          padding: 28px;
        }

        .cards span {
          color: #f28c82;
          font-weight: 900;
        }

        .cards h2 {
          margin-top: 18px;
          font-size: 2.3rem;
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
          font-size: clamp(2.2rem, 5vw, 4.2rem);
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
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.65;
        }

        .pointList strong {
          color: #ffffff;
        }

        .closingPanel {
          margin-top: 22px;
          background:
            radial-gradient(circle at 88% 18%, rgba(103, 232, 249, 0.13), transparent 28%),
            rgba(255, 255, 255, 0.07);
        }

        @media (max-width: 850px) {
          .cards,
          .splitPanel {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}