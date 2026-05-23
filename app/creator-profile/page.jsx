import Link from "next/link";

const avatarSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'%3E%3Crect width='320' height='320' fill='%23fff1ea'/%3E%3Ccircle cx='160' cy='128' r='72' fill='%23ef7d6f'/%3E%3Cpath d='M68 286c17-63 62-100 92-100s75 37 92 100' fill='%230c3554'/%3E%3Ccircle cx='132' cy='122' r='8' fill='%230c3554'/%3E%3Ccircle cx='188' cy='122' r='8' fill='%230c3554'/%3E%3Cpath d='M132 158c18 18 38 18 56 0' stroke='%230c3554' stroke-width='8' stroke-linecap='round' fill='none'/%3E%3Ctext x='160' y='55' text-anchor='middle' font-family='Georgia, serif' font-size='28' fill='%230c3554'%3EMR%3C/text%3E%3C/svg%3E";

const stats = [
  ["Instagram", "25K-50K Followers"],
  ["TikTok", "50K-100K Followers"],
  ["YouTube", "5K-10K Subscribers"],
  ["Blog / Website", "10K+ Monthly Views"],
];

const featuredWork = [
  {
    brand: "Fresh Market Miami",
    project: "Instagram Reel + Stories",
    category: "Food & Grocery",
  },
  {
    brand: "Visit Florida",
    project: "Travel Guide Series",
    category: "Travel & Tourism",
  },
  {
    brand: "Sunrise Coffee Co.",
    project: "TikTok Video Campaign",
    category: "Beverage",
  },
];

const collaborationOptions = [
  ["Sponsored Content", "Reels, Stories, Posts"],
  ["Product Features", "Unboxing, Reviews, Demonstrations"],
  ["Brand Collaborations", "Creative Campaigns"],
];

const socialLinks = ["Instagram", "TikTok", "YouTube", "My Blog"];

export default function CreatorProfilePage() {
  return (
    <main className="profile-page">
      <nav className="profile-nav" aria-label="Main navigation">
        <Link href="/" className="brand-mark">
          Impact Creator Hub
        </Link>
        <div className="nav-links">
          <a href="#featured">Featured Work</a>
          <a href="#about">About</a>
          <a href="#connect">Connect</a>
        </div>
      </nav>

      <section className="creator-hero">
        <div className="hero-copy">
          <p className="profile-badge">Free Creator Profile</p>
          <img
            className="profile-photo"
            src={avatarSrc}
            alt="Placeholder portrait of Maya Rivera"
          />
          <p className="profile-kicker">Food. Travel. Lifestyle.</p>
          <h1>Maya Rivera</h1>
          <p className="profile-location">Miami, Florida</p>
          <p className="profile-bio">
            I&apos;m a Miami-based content creator and foodie who loves sharing
            local eats, travel spots, and everyday moments that make life
            beautiful.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="mailto:hello@mayarivera.co">
              Work With Me
            </a>
            <a className="button button-secondary" href="#connect">
              View Links
            </a>
          </div>
        </div>

        <aside className="stats-card" aria-label="Creator audience statistics">
          <p className="stats-title">Audience Snapshot</p>
          {stats.map(([platform, reach]) => (
            <div className="stat-row" key={platform}>
              <span>{platform}</span>
              <strong>{reach}</strong>
            </div>
          ))}
        </aside>
      </section>

      <section className="profile-section postcard-section" aria-labelledby="postcard-heading">
        <div className="section-heading">
          <p className="eyebrow">Postcard From the Creator</p>
          <h2 id="postcard-heading">A note from Maya</h2>
        </div>
        <article className="postcard" aria-label="Postcard from Maya Rivera">
          <div className="postcard-topline">
            <div className="postcard-location">
              <span>MIAMI CREATOR SERIES</span>
              <span>Food, Travel &amp; Lifestyle</span>
            </div>
            <div className="postcard-title">POST CARD</div>
            <div className="postcard-mail">
              <div className="stamp-box" aria-hidden="true">
                <span>STAMP</span>
              </div>
              <div className="postmark" aria-hidden="true">
                <span>MAY 23</span>
              </div>
            </div>
          </div>

          <div className="postcard-body">
            <div className="postcard-message">
              <p>Hi there!</p>
              <p>
                I&apos;m Maya, a Miami-based creator sharing local eats, travel
                moments, and everyday beauty.
              </p>
              <p>
                My work is about helping people discover places, flavors, and
                experiences that feel warm, real, and memorable.
              </p>
              <p>
                Lately, I&apos;m inspired by neighborhood restaurants, coastal
                colors, and the little details that make a day feel special.
              </p>
              <p>&mdash; Maya</p>
            </div>
            <div className="postcard-divider" aria-hidden="true" />
            <address className="postcard-contact">
              <strong>Maya Rivera</strong>
              <span>Content Creator</span>
              <span>Food, Travel &amp; Lifestyle</span>
              <span>Miami, Florida</span>
              <span>hello@mayarivera.co</span>
              <span>@mayarivera</span>
            </address>
          </div>
        </article>
      </section>

      <section className="profile-section" id="featured" aria-labelledby="featured-heading">
        <div className="section-heading">
          <p className="eyebrow">Featured Work</p>
          <h2 id="featured-heading">Recent collaborations</h2>
        </div>
        <div className="work-grid">
          {featuredWork.map((work) => (
            <article className="work-card" key={work.brand}>
              <p>{work.category}</p>
              <h3>{work.brand}</h3>
              <span>{work.project}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-grid">
        <article className="profile-section" id="about" aria-labelledby="about-heading">
          <div className="section-heading">
            <p className="eyebrow">About Me</p>
            <h2 id="about-heading">Life through a Miami lens</h2>
          </div>
          <p>
            I love exploring new places, trying local restaurants, and capturing
            the little moments that make life special. My content is all about
            inspiration, authenticity, and making every day a beautiful
            adventure.
          </p>
          <div className="detail-list">
            <span>Miami, Florida</span>
            <span>Dog Mom &amp; Coffee Lover</span>
          </div>
        </article>

        <article className="profile-section" aria-labelledby="work-together-heading">
          <div className="section-heading">
            <p className="eyebrow">Ways to Work Together</p>
            <h2 id="work-together-heading">Collaboration options</h2>
          </div>
          <div className="collab-list">
            {collaborationOptions.map(([title, description]) => (
              <div key={title}>
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
            ))}
          </div>
          <p className="profile-note">
            This is a free creator profile with limited collaboration details.
          </p>
        </article>
      </section>

      <section className="profile-section connect-section" id="connect" aria-labelledby="connect-heading">
        <div className="section-heading">
          <p className="eyebrow">Let&apos;s Connect</p>
          <h2 id="connect-heading">Follow Maya&apos;s latest stories</h2>
        </div>
        <div className="social-links">
          {socialLinks.map((label) => (
            <a href="#" key={label} aria-label={`${label} profile link`}>
              {label}
            </a>
          ))}
        </div>
      </section>

      <section className="upgrade-banner" aria-label="Upgrade profile">
        <div>
          <p>You&apos;re viewing a Free Creator Profile</p>
          <span>
            Upgrade to unlock advanced features, insights, and more ways to
            collaborate.
          </span>
        </div>
        <a className="button button-primary" href="#">
          Learn More
        </a>
      </section>
    </main>
  );
}
