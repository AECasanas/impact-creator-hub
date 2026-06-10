"use client";

import { useEffect, useState } from "react";

const newsItems = [
  "Creators need one simple place to show their work.",
  "Profiles should feel personal, useful, and easy to share.",
  "Creative discovery should feel warmer, simpler, and more human.",
  "Impact Creator Hub helps creators and brands find each other with less noise.",
];

const slides = [
  {
    image: "/images/retro_art_landing_nyc_small_bw.jpg",
    caption: "A visual space for creative discovery.",
  },
  {
    image: "/images/banner_art_nyc_softlab_nova.jpg",
    caption: "Built for creators who want to be seen clearly.",
  },
  {
    image: "/images/banner_art_nyc_lisa_project_statue_liberty.jpg",
    caption: "Helping brands discover people, stories, and work that fit.",
  },
];

export default function AboutUsPage() {
  const [newsIndex, setNewsIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const newsTimer = setInterval(() => {
      setNewsIndex((current) => (current + 1) % newsItems.length);
    }, 3500);

    const slideTimer = setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => {
      clearInterval(newsTimer);
      clearInterval(slideTimer);
    };
  }, []);

  const currentSlide = slides[slideIndex];

  return (
    <main className="page">
      <header className="siteHeader">
        <a href="/" className="brandBlock" aria-label="Impact Creator Hub home">
          <div className="logoMark">
            <div className="ring ringOne"></div>
            <div className="ring ringTwo"></div>
            <div className="ring ringThree"></div>
          </div>

          <div>
            <div className="brandName">Impact Creator Hub</div>
            <div className="tagline">
              BUILD YOUR BRAND. <span>GROW YOUR IMPACT.</span>
            </div>
          </div>
        </a>

        <nav className="topNav">
          <a href="/features">Features</a>
          <a href="/for-creators">For Creators</a>
          <a href="/for-brands">For Brands</a>
          <a href="/about-us" className="active">
            About Us
          </a>
          <a href="/login">Login</a>
          <a href="/signup/creator" className="getStarted">
            Get Started
          </a>
        </nav>
      </header>

      <section className="aboutHero">
        <div className="aboutText">
          <p className="eyebrow">About Impact Creator Hub</p>

          <h1>
            A simpler way for creators to be seen, understood, and found.
          </h1>

          <p>
            Impact Creator Hub is a place for creators to show who they are,
            what they make, and how brands can work with them.
          </p>

          <p>
            We believe a creator profile should feel more personal than a
            resume, more organized than social media, and easier to share than
            scattered links.
          </p>

          <p>
            Our goal is simple: make creative discovery feel clear, human, and
            useful.
          </p>
        </div>

        <div className="sliderPanel">
          <img src={currentSlide.image} alt="" />

          <div className="slideCaption">{currentSlide.caption}</div>

          <div className="slideDots">
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                className={index === slideIndex ? "active" : ""}
                onClick={() => setSlideIndex(index)}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="newsStrip">
        <div className="newsLabel">Impact Note</div>
        <div className="newsText">{newsItems[newsIndex]}</div>
      </section>

      <section className="simpleStory">
        <p>
          We are building Impact Creator Hub for people who want their work to
          be easier to understand at a glance — creators, small businesses,
          brands, collaborators, and communities looking for meaningful
          connection.
        </p>
      </section>

      <footer className="footer">© 2026 Impact Creator Hub. Grow your impact.</footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 82% 34%,
              rgba(49, 230, 242, 0.16),
              transparent 28%
            ),
            radial-gradient(
              circle at 12% 88%,
              rgba(255, 127, 110, 0.12),
              transparent 26%
            ),
            #020607;
          color: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
          padding: 34px 60px 70px;
        }

        .siteHeader {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 36px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .brandBlock {
          display: flex;
          align-items: center;
          gap: 16px;
          text-decoration: none;
          color: #ffffff;
        }

        .logoMark {
          width: 58px;
          height: 58px;
          background: #000;
          position: relative;
          overflow: hidden;
          flex: 0 0 auto;
        }

        .ring {
          position: absolute;
          border: 3px solid #31e6f2;
          border-right-color: transparent;
          border-radius: 50%;
        }

        .ringOne {
          width: 34px;
          height: 34px;
          left: 10px;
          top: 10px;
        }

        .ringTwo {
          width: 24px;
          height: 24px;
          left: 15px;
          top: 15px;
          opacity: 0.85;
        }

        .ringThree {
          width: 12px;
          height: 12px;
          left: 21px;
          top: 21px;
          opacity: 0.7;
        }

        .brandName {
          font-size: 22px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.4px;
        }

        .tagline {
          margin-top: 10px;
          font-size: 10px;
          letter-spacing: 5px;
          color: #b8c4c6;
          font-weight: 800;
        }

        .tagline span {
          color: #ff7f6e;
        }

        .topNav {
          display: flex;
          align-items: center;
          gap: 30px;
          font-size: 15px;
        }

        .topNav a {
          color: #d8d8d8;
          text-decoration: none;
        }

        .topNav a:hover,
        .topNav a.active {
          color: #31e6f2;
        }

        .getStarted {
          background: #31e6f2;
          color: #020607 !important;
          padding: 16px 28px;
          border-radius: 6px;
          font-weight: 800;
          box-shadow: 0 18px 40px rgba(49, 230, 242, 0.18);
        }

        .getStarted:hover {
          background: #ff7f6e;
        }

        .aboutHero {
          max-width: 1180px;
          margin: 92px auto 0;
          display: grid;
          grid-template-columns: minmax(320px, 560px) minmax(320px, 520px);
          align-items: center;
          gap: 88px;
        }

        .eyebrow {
          color: #ff7f6e;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
          font-weight: 900;
          margin: 0 0 18px;
        }

        .aboutText h1 {
          font-size: clamp(42px, 5.5vw, 68px);
          line-height: 1.02;
          letter-spacing: -2px;
          margin: 0 0 28px;
        }

        .aboutText p:not(.eyebrow) {
          color: #d4dddf;
          font-size: 18px;
          line-height: 1.7;
          font-weight: 650;
          margin: 0 0 20px;
        }

        .sliderPanel {
          position: relative;
          min-height: 360px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(49, 230, 242, 0.18);
          overflow: hidden;
        }

        .sliderPanel img {
          display: block;
          width: 100%;
          height: 360px;
          object-fit: cover;
        }

        .slideCaption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 22px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.88));
          color: #ffffff;
          font-size: 18px;
          line-height: 1.35;
          font-weight: 800;
        }

        .slideDots {
          position: absolute;
          top: 18px;
          right: 18px;
          display: flex;
          gap: 8px;
        }

        .slideDots button {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          border: 0;
          background: rgba(255, 255, 255, 0.38);
          cursor: pointer;
        }

        .slideDots button.active {
          background: #31e6f2;
        }

        .newsStrip {
          max-width: 1180px;
          margin: 74px auto 0;
          border-left: 3px solid #ff7f6e;
          padding: 18px 0 18px 22px;
          background: rgba(255, 127, 110, 0.055);
        }

        .newsLabel {
          color: #ff7f6e;
          text-transform: uppercase;
          letter-spacing: 1.6px;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .newsText {
          color: #ffffff;
          font-size: 22px;
          line-height: 1.45;
          font-weight: 850;
        }

        .simpleStory {
          max-width: 840px;
          margin: 64px auto 0;
        }

        .simpleStory p {
          color: #c9d2d4;
          font-size: 22px;
          line-height: 1.65;
          font-weight: 650;
          margin: 0;
        }

        .footer {
          max-width: 1180px;
          margin: 70px auto 0;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #777;
          font-size: 13px;
        }

        @media only screen and (max-width: 900px) {
          .page {
            padding: 26px 22px 56px;
          }

          .siteHeader {
            align-items: flex-start;
            flex-direction: column;
            gap: 24px;
          }

          .topNav {
            flex-wrap: wrap;
            gap: 16px;
            font-size: 14px;
          }

          .getStarted {
            padding: 13px 18px;
          }

          .aboutHero {
            display: block;
            margin-top: 56px;
          }

          .aboutText h1 {
            font-size: 42px;
            letter-spacing: -1px;
          }

          .aboutText p:not(.eyebrow) {
            font-size: 16px;
          }

          .sliderPanel {
            margin-top: 42px;
            min-height: 260px;
          }

          .sliderPanel img {
            height: 260px;
          }

          .slideCaption {
            font-size: 15px;
            padding: 18px;
          }

          .newsStrip {
            margin-top: 48px;
          }

          .newsText {
            font-size: 18px;
          }

          .simpleStory {
            margin-top: 48px;
          }

          .simpleStory p {
            font-size: 18px;
          }
        }
      `}</style>
    </main>
  );
}