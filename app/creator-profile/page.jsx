"use client";

export default function CreatorProfilePage() {
  return (
    <main className="creatorPage">
      <nav className="nav">
        <div className="brand">
          <img
            src="/logo-ripple.png"
            alt="Impact Creator Hub logo"
            className="brandLogo"
          />

          <div>
            <strong>Impact Creator Hub</strong>
            <p className="brandTagline">
              <span>Build your brand. </span>
              <span>Grow your impact.</span>
            </p>
          </div>
        </div>

        <div className="navLinks">
          <a>Discover Creators</a>
          <a>For Brands</a>
          <a>Resources</a>
          <a>About</a>
        </div>

        <div className="navActions">
          <button className="loginBtn">Log In</button>
          <button className="joinBtn">Join the Hub</button>
        </div>
      </nav>

      <section className="hero">
        <div className="photoWrap">
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
            alt="Maya Rivera"
            className="profilePhoto"
          />
          <div className="socialBadge" aria-label="Impact Creator Hub profile badge">
            <span className="neonLogoMark"></span>
          </div>
        </div>

        <div className="heroText">
          <div className="freeBadge">
            <span>✦</span> FREE CREATOR PROFILE
          </div>

          <h1>Maya Rivera</h1>
          <p className="niche">Food. Travel. Lifestyle.</p>
          <p className="location">● Miami, Florida</p>

          <p className="intro">
            I’m a Miami-based content creator and foodie who loves sharing local
            eats, travel spots, and everyday moments that make life beautiful.
          </p>

          <div className="heroButtons">
            <button className="primaryBtn">Work With Me →</button>
            <button className="secondaryBtn">View Links</button>
          </div>
        </div>

        <div className="plantArea">
          <div className="plantStem"></div>
          <div className="leaf leafOne"></div>
          <div className="leaf leafTwo"></div>
          <div className="leaf leafThree"></div>
          <div className="leaf leafFour"></div>
          <div className="vase"></div>
        </div>
      </section>

      <section className="mainCard statsCard">
        <div className="stat">
          <div className="statIcon instagram">◎</div>
          <div>
            <span>Instagram</span>
            <strong>25K – 50K</strong>
            <small>Followers</small>
          </div>
        </div>

        <div className="stat">
          <div className="statIcon tiktok">♪</div>
          <div>
            <span>TikTok</span>
            <strong>50K – 100K</strong>
            <small>Followers</small>
          </div>
        </div>

        <div className="stat">
          <div className="statIcon youtube">▶</div>
          <div>
            <span>YouTube</span>
            <strong>5K – 10K</strong>
            <small>Subscribers</small>
          </div>
        </div>

        <div className="stat last">
          <div className="statIcon web">◎</div>
          <div>
            <span>Blog / Website</span>
            <strong>10K+</strong>
            <small>Monthly Views</small>
          </div>
        </div>
      </section>

      <section className="mainCard featuredCard">
        <div className="sectionHeader">
          <h2>Featured Work</h2>
          <a>View All →</a>
        </div>

        <div className="workGrid">
          <article className="workItem">
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
              alt="Fresh Market Miami"
            />
            <div>
              <h3>Fresh Market Miami</h3>
              <p>Instagram Reel + Stories</p>
              <span>Food & Grocery</span>
            </div>
          </article>

          <article className="workItem">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"
              alt="Visit Florida"
            />
            <div>
              <h3>Visit Florida</h3>
              <p>Travel Guide Series</p>
              <span>Travel & Tourism</span>
            </div>
          </article>

          <article className="workItem">
            <img
              src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
              alt="Sunrise Coffee Co."
            />
            <div>
              <h3>Sunrise Coffee Co.</h3>
              <p>TikTok Video Campaign</p>
              <span>Beverage</span>
            </div>
          </article>
        </div>
      </section>

      <section className="mainCard infoCard">
        <div className="infoCol">
          <h2>About Me</h2>
          <div className="underline"></div>
          <p>
            I love exploring new places, trying local restaurants, and capturing
            the little moments that make life special. My content is all about
            inspiration, authenticity, and making every day a beautiful
            adventure.
          </p>

          <div className="miniLine">♡ Miami, Florida</div>
          <div className="miniLine">♡ Dog Mom & Coffee Lover</div>
        </div>

        <div className="infoCol middle">
          <h2>Ways to Work Together</h2>
          <div className="underline"></div>

          <div className="service">
            <span>✦</span>
            <div>
              <strong>Sponsored Content</strong>
              <p>Reels, Stories, Posts</p>
            </div>
          </div>

          <div className="service">
            <span>▢</span>
            <div>
              <strong>Product Features</strong>
              <p>Unboxing, Reviews, Demonstrations</p>
            </div>
          </div>

          <div className="service">
            <span>♢</span>
            <div>
              <strong>Brand Collaborations</strong>
              <p>Creative Campaigns</p>
            </div>
          </div>

          <div className="freeNote">
            This is a free creator profile with limited collaboration details.
          </div>
        </div>

        <div className="infoCol">
          <h2>Let’s Connect</h2>
          <div className="underline"></div>
          <p>
            Find me on my favorite platforms and let’s create something amazing!
          </p>

          <button className="connectBtn">◎ Instagram</button>
          <button className="connectBtn">♪ TikTok</button>
          <button className="connectBtn">▶ YouTube</button>
          <button className="connectBtn">◎ My Blog</button>
        </div>
      </section>

      <section className="upgradeBanner">
        <div>
          <span>✦</span>
          <div>
            <strong>You’re viewing a Free Creator Profile</strong>
            <p>
              Upgrade to unlock advanced features, insights, and more ways to
              collaborate.
            </p>
          </div>
        </div>

        <button>Learn More</button>
      </section>

      <style jsx>{`
        .creatorPage {
          min-height: 100vh;
          background: #ffffff;
          color: #11172f;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 0 42px 70px;
        }

        .nav {
          max-width: 1240px;
          margin: 0 auto;
          height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
        }

        .brandLogo {
          width: 56px;
          height: 56px;
          object-fit: contain;
        }

        .brandTagline {
          margin: 2px 0 0;
          color: #f28c82;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.2em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .navLinks {
          display: flex;
          gap: 44px;
          font-size: 14px;
          font-weight: 700;
        }

        .navActions {
          display: flex;
          gap: 14px;
        }

        button {
          font-family: inherit;
          cursor: pointer;
        }

        .loginBtn,
        .joinBtn {
          border-radius: 999px;
          padding: 12px 24px;
          font-weight: 700;
          font-size: 14px;
        }

        .loginBtn {
          background: white;
          border: 1px solid #9ca3af;
          color: #10172f;
        }

        .joinBtn {
          background: #006b78;
          border: 1px solid #006b78;
          color: white;
        }

        .hero {
          max-width: 1240px;
          margin: 0 auto;
          min-height: 480px;
          border-radius: 34px;
          background:
            linear-gradient(
              90deg,
              rgba(255, 246, 242, 0.98),
              rgba(255, 232, 224, 0.88)
            ),
            radial-gradient(circle at 85% 10%, #ffd2c2 0%, transparent 42%);
          display: grid;
          grid-template-columns: 340px 1fr 240px;
          align-items: center;
          padding: 58px 76px;
          position: relative;
          overflow: hidden;
        }

        .photoWrap {
          width: 286px;
          height: 286px;
          border-radius: 50%;
          background: white;
          padding: 8px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
          position: relative;
        }

        .profilePhoto {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        .socialBadge {
          position: absolute;
          right: -6px;
          bottom: 30px;
          width: 64px;
          height: 64px;
          background: #050505;
          border-radius: 50%;
          border: 6px solid white;
          display: grid;
          place-items: center;
          box-shadow:
            0 12px 26px rgba(16, 23, 47, 0.22),
            0 0 22px rgba(0, 232, 240, 0.35);
          overflow: hidden;
        }

        .neonLogoMark,
        .neonLogoMark::before,
        .neonLogoMark::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          border-style: solid;
          border-color: #00e8f0;
          border-right-color: transparent;
          filter: drop-shadow(0 0 6px rgba(0, 232, 240, 0.9));
        }

        .neonLogoMark {
          width: 44px;
          height: 44px;
          border-width: 6px;
        }

        .neonLogoMark::before {
          inset: 9px;
          border-width: 5px;
        }

        .neonLogoMark::after {
          inset: 19px;
          border-width: 5px;
          border-right-color: #00e8f0;
        }

        .freeBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff0e9;
          padding: 11px 18px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 22px;
        }

        .freeBadge span {
          color: #ff9b63;
          font-size: 18px;
        }

        h1 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 58px;
          line-height: 1;
          margin: 0 0 10px;
          color: #10172f;
          letter-spacing: -0.02em;
        }

        .niche {
          font-family: "Brush Script MT", "Segoe Script", cursive;
          font-size: 35px;
          color: #ff6a61;
          margin: 0 0 12px;
        }

        .location {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 18px;
        }

        .intro {
          max-width: 590px;
          font-size: 16px;
          line-height: 1.7;
          margin: 0 0 24px;
          color: #293044;
        }

        .heroButtons {
          display: flex;
          gap: 14px;
        }

        .primaryBtn,
        .secondaryBtn {
          border-radius: 18px;
          height: 50px;
          padding: 0 28px;
          font-weight: 800;
          font-size: 15px;
        }

        .primaryBtn {
          background: #ff6a61;
          border: 1px solid #ff6a61;
          color: white;
          box-shadow: 0 14px 25px rgba(255, 106, 97, 0.28);
        }

        .secondaryBtn {
          background: white;
          border: 1px solid #ff6a61;
          color: #10172f;
        }

        .plantArea {
          position: relative;
          height: 360px;
        }

        .plantStem {
          position: absolute;
          right: 78px;
          top: 42px;
          width: 3px;
          height: 190px;
          background: #a1ad72;
          transform: rotate(-15deg);
        }

        .leaf {
          position: absolute;
          width: 76px;
          height: 18px;
          border-radius: 100%;
          border: 2px solid #a1ad72;
          border-left: none;
          border-bottom: none;
          opacity: 0.8;
        }

        .leafOne {
          right: 54px;
          top: 76px;
          transform: rotate(18deg);
        }

        .leafTwo {
          right: 100px;
          top: 112px;
          transform: rotate(162deg);
        }

        .leafThree {
          right: 44px;
          top: 148px;
          transform: rotate(20deg);
        }

        .leafFour {
          right: 108px;
          top: 188px;
          transform: rotate(158deg);
        }

        .vase {
          position: absolute;
          bottom: -20px;
          right: 38px;
          width: 115px;
          height: 165px;
          border-radius: 58px 58px 28px 28px;
          background:
            linear-gradient(90deg, #fff, #f9e9df),
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.03),
              rgba(0, 0, 0, 0.03) 1px,
              transparent 2px,
              transparent 8px
            );
        }

        .mainCard {
          max-width: 1060px;
          margin-left: auto;
          margin-right: auto;
          background: white;
          border-radius: 28px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(17, 24, 39, 0.05);
        }

        .statsCard {
          margin-top: -62px;
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 30px 28px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 0 28px;
          border-right: 1px solid #ece7e4;
        }

        .stat.last {
          border-right: none;
        }

        .statIcon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 28px;
          font-weight: 900;
          background: #f8fafc;
        }

        .instagram {
          color: #e647b0;
        }

        .tiktok {
          color: #111827;
        }

        .youtube {
          color: #ff4f5c;
        }

        .web {
          color: #11c5c8;
        }

        .stat span,
        .stat small {
          display: block;
          color: #4b5563;
          font-size: 13px;
        }

        .stat strong {
          display: block;
          font-size: 18px;
          color: #111827;
          margin: 4px 0;
        }

        .featuredCard {
          padding: 34px 40px 38px;
          border-radius: 0 0 28px 28px;
        }

        .sectionHeader {
          border-top: 1px solid #ece7e4;
          padding-top: 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .sectionHeader h2,
        .infoCol h2,
        .postcardIntro h2 {
          font-family: Georgia, "Times New Roman", serif;
          color: #10172f;
          font-size: 26px;
          margin: 0;
        }

        .sectionHeader a {
          color: #ff6a61;
          font-weight: 800;
          font-size: 14px;
        }

        .workGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
        }

        .workItem {
          border: 1px solid #ece7e4;
          border-radius: 12px;
          overflow: hidden;
          background: white;
        }

        .workItem img {
          width: 100%;
          height: 170px;
          object-fit: cover;
          display: block;
        }

        .workItem div {
          padding: 16px;
        }

        .workItem h3 {
          margin: 0 0 5px;
          font-size: 19px;
          color: #10172f;
        }

        .workItem p {
          margin: 0 0 14px;
          color: #4b5563;
          font-size: 14px;
        }

        .workItem span {
          background: #f6ebe8;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12px;
          color: #3f4655;
          font-weight: 700;
        }

        .infoCard {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          overflow: hidden;
        }

        .infoCol {
          padding: 36px 40px;
        }

        .infoCol.middle {
          border-left: 1px solid #ece7e4;
          border-right: 1px solid #ece7e4;
        }

        .underline {
          width: 35px;
          height: 3px;
          background: #ff6a61;
          margin: 14px 0 24px;
        }

        .infoCol p {
          color: #344054;
          font-size: 15px;
          line-height: 1.7;
        }

        .miniLine {
          color: #344054;
          font-size: 14px;
          margin-top: 14px;
        }

        .service {
          display: flex;
          gap: 16px;
          margin-bottom: 22px;
        }

        .service span {
          color: #ff6a61;
          font-size: 24px;
          width: 26px;
        }

        .service strong {
          display: block;
          font-size: 15px;
          margin-bottom: 2px;
        }

        .service p {
          margin: 0;
          font-size: 13px;
          color: #4b5563;
        }

        .freeNote {
          background: #fff0ed;
          border-radius: 14px;
          padding: 18px;
          font-size: 15px;
          color: #344054;
          margin-top: 18px;
        }

        .connectBtn {
          width: 100%;
          height: 42px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 999px;
          text-align: left;
          padding: 0 18px;
          margin-bottom: 12px;
          font-weight: 800;
          color: #111827;
        }

        .upgradeBanner {
          max-width: 1060px;
          margin: 28px auto 0;
          background: #fff0ed;
          border-radius: 22px;
          padding: 26px 38px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .upgradeBanner > div {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .upgradeBanner span {
          font-size: 34px;
          color: #ff9b63;
        }

        .upgradeBanner strong {
          display: block;
          font-size: 17px;
          margin-bottom: 4px;
        }

        .upgradeBanner p {
          margin: 0;
          color: #4b5563;
          font-size: 14px;
        }

        .upgradeBanner button {
          background: white;
          color: #ff6a61;
          border: 1px solid #ff6a61;
          border-radius: 999px;
          height: 46px;
          padding: 0 44px;
          font-weight: 800;
        }

        @media (max-width: 1000px) {
          .creatorPage {
            padding: 0 20px 50px;
          }

          .navLinks {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 42px 24px 90px;
          }

          .photoWrap {
            margin: 0 auto 30px;
          }

          .heroButtons {
            justify-content: center;
          }

          .plantArea {
            display: none;
          }

          .statsCard {
            grid-template-columns: repeat(2, 1fr);
          }

          .stat {
            border-right: none;
            padding: 18px;
          }

          .workGrid,
          .infoCard {
            grid-template-columns: 1fr;
          }

          .infoCol.middle {
            border-left: none;
            border-right: none;
            border-top: 1px solid #ece7e4;
            border-bottom: 1px solid #ece7e4;
          }

          .upgradeBanner {
            flex-direction: column;
            gap: 22px;
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .navActions {
            display: none;
          }

          .hero h1 {
            font-size: 42px;
          }

          .statsCard {
            grid-template-columns: 1fr;
          }

          .featuredCard,
          .infoCol {
            padding: 28px 22px;
          }
        }
      `}</style>
    </main>
  );
}
