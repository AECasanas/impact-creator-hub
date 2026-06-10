"use client";

import { useState } from "react";

export default function CreatePostcardPage() {
  const [imagePreview, setImagePreview] = useState("");
  const [postcardTitle, setPostcardTitle] = useState("Postcard");
  const [greeting, setGreeting] = useState("Dear...");
  const [message, setMessage] = useState(
    "Write a short update, idea, project note, or collaboration opportunity."
  );
  const [signature, setSignature] = useState("From, Impact Creator Hub");
  const [stampText, setStampText] = useState("ICH");

  function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  }

  return (
    <main className="postcardPage">
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
          <p className="eyebrow">Impact Exchange</p>
          <h1>Create a postcard post</h1>
          <p>
            Draft a visual postcard for a social update, project idea, creative call,
            or collaboration opportunity.
          </p>
        </section>

        <section className="workspace">
          <div className="postcardPreview">
            <div className="frontSide">
              <div className="frontImage">
                {imagePreview ? (
                  <img src={imagePreview} alt="Uploaded postcard visual" />
                ) : (
                  <div className="defaultArtwork">
                    <div className="sunsetLines">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <h2>{postcardTitle || "Postcard"}</h2>
                    <div className="sun"></div>
<div className="bird birdOne"></div>
<div className="bird birdTwo"></div>
<div className="bird birdThree"></div>
<div className="bird birdFour smallBird"></div>
<div className="water"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="dividerLine"></div>

            <div className="backSide">
              <div className="stamp">
                <div className="miniImage">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Mini postcard stamp" />
                  ) : (
                    <span>{stampText || "ICH"}</span>
                  )}
                </div>
              </div>

              <div className="messageArea">
                <h3>{greeting || "Dear..."}</h3>

                <p>{message}</p>

                <div className="writeLines">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <p className="signature">{signature || "From, Impact Creator Hub"}</p>
              </div>
            </div>
          </div>

          <aside className="editorPanel">
            <p className="eyebrow">Postcard details</p>
            <h2>Edit the postcard</h2>

            <label>
              Replace image
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>

            <label>
              Front title
              <input
                value={postcardTitle}
                onChange={(event) => setPostcardTitle(event.target.value)}
                placeholder="Postcard"
              />
            </label>

            <label>
              Greeting
              <input
                value={greeting}
                onChange={(event) => setGreeting(event.target.value)}
                placeholder="Dear..."
              />
            </label>

            <label>
              Message
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your update..."
              />
            </label>

            <label>
              Signature
              <input
                value={signature}
                onChange={(event) => setSignature(event.target.value)}
                placeholder="From..."
              />
            </label>

            <label>
              Stamp text
              <input
                value={stampText}
                onChange={(event) => setStampText(event.target.value)}
                placeholder="ICH"
              />
            </label>

            <p className="note">
              This is a live draft only. Saving to Impact Exchange comes next.
            </p>
          </aside>
        </section>
      </section>

      <style jsx>{`
        .postcardPage {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 18%, rgba(103, 232, 249, 0.12), transparent 28%),
            radial-gradient(circle at 90% 10%, rgba(242, 140, 130, 0.12), transparent 24%),
            linear-gradient(135deg, #05090b 0%, #08131a 52%, #05090b 100%);
          color: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 28px;
        }

        .shell {
          width: min(1240px, 100%);
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
          color: white;
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
          max-width: 760px;
          padding: 36px 0 22px;
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
        h2,
        h3 {
          margin: 0;
          line-height: 1.05;
        }

        h1 {
          margin-top: 10px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.4rem, 5vw, 4.4rem);
          letter-spacing: -0.05em;
        }

        .intro p:not(.eyebrow) {
          max-width: 680px;
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 1rem;
          line-height: 1.7;
        }

        .workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.5fr);
          gap: 22px;
          align-items: start;
        }

        .postcardPreview {
          display: grid;
          grid-template-columns: 1fr 2px 1.08fr;
          min-height: 520px;
          overflow: hidden;
          border-radius: 22px;
          background: #fffdf9;
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.3);
        }

        .frontSide {
          padding: 0;
          background: #ff9f73;
        }

        .frontImage {
          width: 100%;
          height: 100%;
          min-height: 520px;
        }

        .frontImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .defaultArtwork {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 520px;
          overflow: hidden;
          background:
            linear-gradient(180deg, #ff6b6b 0%, #ff9d72 40%, #ffdca3 100%);
          color: #25375f;
        }

        .defaultArtwork h2 {
          position: relative;
          z-index: 3;
          margin: 105px auto 0;
          padding: 0 26px;
          text-align: center;
          color: #25375f;
          font-family: "Brush Script MT", "Segoe Script", cursive;
          font-size: clamp(3.2rem, 8vw, 6.4rem);
          font-weight: 400;
          letter-spacing: 0;
        }

        .sunsetLines {
          position: absolute;
          inset: 34px 0 auto;
          display: grid;
          gap: 13px;
        }

        .sunsetLines span {
          height: 15px;
          background: rgba(255, 202, 118, 0.7);
          border-radius: 999px;
          transform: skewX(-18deg);
        }

        .sunsetLines span:nth-child(1) {
          margin-left: 46%;
        }

        .sunsetLines span:nth-child(2) {
          margin-right: 24%;
        }

        .sunsetLines span:nth-child(3) {
          margin-left: 12%;
          margin-right: 38%;
        }

        .sun {
          position: absolute;
          left: 50%;
          bottom: 95px;
          width: 240px;
          height: 240px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: #ffe176;
          z-index: 1;
        }

     .bird {
  position: absolute;
  z-index: 4;
  width: 54px;
  height: 20px;
}

.bird::before,
.bird::after {
  content: "";
  position: absolute;
  top: 0;
  width: 26px;
  height: 14px;
  border-top: 4px solid #25375f;
  border-radius: 50px 50px 0 0;
}

.bird::before {
  left: 0;
  transform: rotate(-12deg);
}

.bird::after {
  right: 0;
  transform: rotate(12deg);
}

.smallBird {
  width: 36px;
  height: 14px;
}

.smallBird::before,
.smallBird::after {
  width: 17px;
  height: 10px;
  border-top: 3px solid #25375f;
}

.birdOne {
  top: 65px;
  left: 45px;
}

.birdTwo {
  top: 38px;
  left: 65px;
}

.birdThree {
  top: 65px;
  right: 90px;
}

.birdFour {
  top: 70px;
  right: 65px;
}

        .water {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 64px;
          background:
            linear-gradient(180deg, #77d4c8 0%, #4bb8b2 100%);
        }

        .water::before {
          content: "";
          position: absolute;
          left: 0;
          right: 24%;
          top: 18px;
          height: 10px;
          border-radius: 999px;
          background: rgba(17, 128, 129, 0.65);
        }

        .dividerLine {
          background: #289c9a;
        }

        .backSide {
          position: relative;
          padding: 50px 54px;
          background: #fffdf9;
          color: #25375f;
        }

        .stamp {
          display: flex;
          justify-content: flex-end;
        }

        .miniImage {
          width: 110px;
          height: 140px;
          display: grid;
          place-items: center;
          border: 4px solid #289c9a;
          background: #ff9f73;
          color: #25375f;
          font-size: 1.6rem;
          font-weight: 900;
          overflow: hidden;
        }

        .miniImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .messageArea {
          margin-top: 54px;
        }

        .messageArea h3 {
          color: #25375f;
          font-size: 1.8rem;
          font-weight: 500;
          letter-spacing: -0.03em;
        }

        .messageArea p {
          max-width: 460px;
          color: rgba(37, 55, 95, 0.86);
          font-size: 1rem;
          line-height: 1.65;
        }

        .writeLines {
          display: grid;
          gap: 24px;
          margin: 18px 0 22px;
        }

        .writeLines span {
          height: 3px;
          border-radius: 999px;
          background-image: linear-gradient(
            to right,
            #38aaa5 0 6px,
            transparent 6px 14px
          );
          background-size: 14px 3px;
        }

        .signature {
          font-weight: 800;
        }

        .editorPanel {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.94);
          color: #10172f;
          padding: 24px;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.26);
        }

        .editorPanel h2 {
          margin: 10px 0 20px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 2rem;
          letter-spacing: -0.04em;
          color: #10172f;
        }

        label {
          display: grid;
          gap: 7px;
          margin-bottom: 14px;
          color: #1f2937;
          font-size: 0.88rem;
          font-weight: 900;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #d9dee8;
          border-radius: 12px;
          background: #ffffff;
          color: #10172f;
          font: inherit;
          outline: none;
          padding: 12px 14px;
        }

        input {
          min-height: 46px;
        }

        input[type="file"] {
          padding: 10px;
          min-height: auto;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.5;
        }

        input:focus,
        textarea:focus {
          border-color: #17c9d5;
          box-shadow: 0 0 0 4px rgba(23, 201, 213, 0.14);
        }

        .note {
          margin: 16px 0 0;
          color: #667085;
          font-size: 0.86rem;
          line-height: 1.5;
        }

        @media (max-width: 980px) {
          .workspace,
          .postcardPreview {
            grid-template-columns: 1fr;
          }

          .dividerLine {
            height: 2px;
          }

          .frontImage,
          .defaultArtwork {
            min-height: 420px;
          }

          .backSide {
            padding: 36px;
          }
        }
      `}</style>
    </main>
  );
}