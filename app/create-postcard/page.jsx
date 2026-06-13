"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { slugify } from "@/lib/slugify";

const stampOptions = [
  {
    id: "cafe",
    name: "Cafe / Lifestyle",
    src: "/stamps/stamp-cafe.png",
  },
  {
    id: "mountain-adventure",
    name: "Mountain Adventure",
    src: "/stamps/stamp-mountain-adventure.png",
  },
  {
    id: "pacific-travel",
    name: "Pacific Travel",
    src: "/stamps/stamp-pacific-travel.png",
  },
  {
    id: "beach-travel",
    name: "Beach Travel",
    src: "/stamps/stamp-beach-travel.png",
  },
  {
    id: "city-travel",
    name: "City Travel",
    src: "/stamps/stamp-city-travel.png",
  },
  {
    id: "waves-sky",
    name: "Waves / Sky",
    src: "/stamps/stamp-waves-sky.png",
  },
  {
    id: "yoga",
    name: "Wellness / Yoga",
    src: "/stamps/stamp-yoga.png",
  },
  {
    id: "gym",
    name: "Gym / Fitness",
    src: "/stamps/stamp-gym.png",
  },
  {
    id: "beats-deck",
    name: "DJ / Beats",
    src: "/stamps/stamp-beats-deck.png",
  },
  {
    id: "microphone",
    name: "Artist / Performer",
    src: "/stamps/stamp-microphone.png",
  },
  {
    id: "designer",
    name: "Designer / Artist",
    src: "/stamps/stamp-designer.png",
  },
  {
    id: "writer",
    name: "Writer",
    src: "/stamps/stamp-writer.png",
  },
  {
    id: "handy",
    name: "Handy / Maker",
    src: "/stamps/stamp-handy.png",
  },
  {
    id: "beauty",
    name: "Beauty / Hair",
    src: "/stamps/stamp-beauty.png",
  },
];

export default function CreatePostcardPage() {
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [recipientUserId, setRecipientUserId] = useState("");
  const [recipientSearch, setRecipientSearch] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [stampModalOpen, setStampModalOpen] = useState(false);
  const [selectedStampId, setSelectedStampId] = useState("");

  const [postcardTitle, setPostcardTitle] = useState("Postcard");
  const [greeting, setGreeting] = useState("Dear...");
  const [message, setMessage] = useState(
    "Write a short note, idea, thank-you, or collaboration message."
  );
  const [signature, setSignature] = useState("From, Impact Creator Hub");
  const [stampText, setStampText] = useState("ICH");

  const selectedStamp =
    stampOptions.find((stamp) => stamp.id === selectedStampId) || null;

  useEffect(() => {
    loadProfile();

    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile() {
    setLoadingProfile(true);
    setStatus("");
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setErrorMessage(
          "Please log in before posting a postcard to Impact Exchange."
        );
        setLoadingProfile(false);
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        setErrorMessage("Please create your creator profile before posting.");
        setLoadingProfile(false);
        return;
      }

      setProfile(data);
            setSignature(`From, ${data.display_name || "Impact Creator Hub"}`);
            await loadRecipients(user.id);
    } catch (error) {
      console.warn("LOAD POSTCARD PROFILE ERROR:", error);

      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Could not load your creator profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  }
    async function loadRecipients(currentUserId) {
    const { data: creators, error: creatorError } = await supabase
      .from("creator_profiles")
      .select("id, user_id, display_name, creator_type, slug")
      .eq("is_published", true)
      .neq("user_id", currentUserId);

    const { data: brands, error: brandError } = await supabase
      .from("brand_profiles")
      .select("id, user_id, company_name, brand_type, slug")
      .eq("is_published", true)
      .neq("user_id", currentUserId);

    if (creatorError || brandError) {
      console.warn("LOAD POSTCARD RECIPIENTS ERROR:", creatorError || brandError);
      setRecipients([]);
      return;
    }

    const creatorRecipients = (creators || [])
      .filter((creator) => creator.user_id)
      .map((creator) => ({
        type: "Creator",
        profile_id: creator.id,
        user_id: creator.user_id,
        name: creator.display_name || "Creator",
        label: creator.creator_type || "Creator",
        slug: creator.slug || "",
      }));

    const brandRecipients = (brands || [])
      .filter((brand) => brand.user_id)
      .map((brand) => ({
        type: "Brand",
        profile_id: brand.id,
        user_id: brand.user_id,
        name: brand.company_name || "Brand",
        label: brand.brand_type || "Brand",
        slug: brand.slug || "",
      }));

    setRecipients([...creatorRecipients, ...brandRecipients]);
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const imageUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(imageUrl);
  }

  async function uploadPostcardImage(file, safeSlug) {
    if (!file) {
      return "";
    }

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");

    const filePath = `${safeSlug}/postcard-${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("creator-profile-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("creator-profile-assets")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSendPostcard() {
    setStatus("");
    setErrorMessage("");
    setPosting(true);

    try {
      if (!user) {
        setErrorMessage("Please log in before sending a postcard.");
        return;
      }

      if (!profile) {
        setErrorMessage("Please create your creator profile before sending.");
        return;
      }

      if (!recipientUserId) {
        setErrorMessage("Choose someone to send this postcard to.");
        return;
      }

      const cleanSlug = slugify(
        profile.slug || profile.display_name || "creator"
      );

      const postcardBody = [greeting, "", message, "", signature].join("\n");

      const payload = {
        sender_user_id: user.id,
        recipient_user_id: recipientUserId,
        message_type: "postcard",
        subject: postcardTitle.trim() || "Postcard",
        body: postcardBody,
        postcard_payload: {
          postcard_title: postcardTitle.trim() || "Postcard",
          greeting: greeting.trim(),
          message: message.trim(),
          signature: signature.trim(),
          creator_profile_id: profile.id,
          creator_slug: cleanSlug,
          author_name: profile.display_name || cleanSlug,
          author_role: profile.creator_type || "Creator",
          author_avatar_url: profile.profile_photo_url || "",
          author_accent_name: profile.accent_name || "Electric Cyan",
          author_accent_color: profile.accent_color || "#00e8f0",
          author_profile_url: `/creator/${cleanSlug}`,
        },
      };

      const { error } = await supabase.from("impact_messages").insert(payload);

      if (error) {
        throw error;
      }

      setStatus("Postcard sent.");
    } catch (error) {
      console.warn("POSTCARD SEND ERROR:", error);

      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Something went wrong while sending your postcard."
      );
    } finally {
      setPosting(false);
    }
  }
    const filteredRecipients =
    recipientSearch.trim() && !recipientUserId
      ? recipients
          .filter((recipient) => {
            const searchValue = `${recipient.name} ${recipient.type} ${recipient.label}`
              .toLowerCase();

            return searchValue.includes(recipientSearch.trim().toLowerCase());
          })
          .slice(0, 6)
      : [];
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
          <p className="eyebrow">Impact Messages</p>

          <h1>Send a postcard</h1>

          <p>
            Send a short, visual note to another creator or brand inside Impact
            Creator Hub. Use it for a warm introduction, thank-you, project idea,
            or collaboration message.
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
                              <div className="miniImage watermarkStamp">
                  <img src="/logo-ripple.png" alt="Impact Creator Hub watermark" />
                </div>
              </div>

              <div className="messageArea">
                <h3>{greeting || "Dear..."}</h3>

             <p className="postcardMessageText">{message}</p>

                <div className="writeLines">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <p className="signature">
                  {signature || "From, Impact Creator Hub"}
                </p>
              </div>
            </div>
          </div>

          <aside className="editorPanel">
            <p className="eyebrow">Postcard details</p>

            <h2>Edit the postcard</h2>

                        <label>
              Send to
              <input
                value={recipientSearch}
                onChange={(event) => {
                  setRecipientSearch(event.target.value);
                  setRecipientUserId("");
                }}
                placeholder="Search by creator name or brand name"
              />
            </label>

            <p className="recipientHelpText">
              Start typing a creator or brand name, then select a match.
            </p>

            {recipientSearch && !recipientUserId && (
              <div className="recipientResults">
                {filteredRecipients.length > 0 ? (
                  filteredRecipients.map((recipient) => (
                    <button
                      type="button"
                      key={`${recipient.type}-${recipient.profile_id}`}
                      className="recipientOption"
                      onClick={() => {
                        setRecipientUserId(recipient.user_id);
                        setRecipientSearch(`${recipient.name} · ${recipient.type}`);
                      }}
                    >
                      <strong>{recipient.name}</strong>
                      <span>
                        {recipient.type}
                        {recipient.label ? ` · ${recipient.label}` : ""}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="noRecipientResults">No matching users found.</p>
                )}
              </div>
            )}

            <label>
              Edit front title
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
              Message 300 characters max
              <textarea
                value={message}
                maxLength={300}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message..."
              />
            </label>

            <p className="messageCounter">{message.length}/300 characters</p>
            <label>
              Signature
              <input
                value={signature}
                onChange={(event) => setSignature(event.target.value)}
                placeholder="From..."
              />
            </label>

            {profile?.display_name && (
              <div className="postingAs">
                <span>Postcard from</span>
                <strong>{profile.display_name}</strong>
              </div>
            )}

            {status && <p className="successNote">{status}</p>}
            {errorMessage && <p className="errorNote">{errorMessage}</p>}

                    <div className="postcardActions">
              <button
                type="button"
                onClick={handleSendPostcard}
                disabled={posting || loadingProfile}
              >
                {posting ? "Sending..." : "Send"}
              </button>
            </div>
          </aside>
        </section>
      </section>

      <style jsx>{`
        .postcardPage {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 12% 18%,
              rgba(103, 232, 249, 0.12),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 10%,
              rgba(242, 140, 130, 0.12),
              transparent 24%
            ),
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
          background: linear-gradient(
            180deg,
            #ff6b6b 0%,
            #ff9d72 40%,
            #ffdca3 100%
          );
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
          background: linear-gradient(180deg, #77d4c8 0%, #4bb8b2 100%);
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
          position: relative;
          width: 112px;
          height: 142px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 2px solid rgba(40, 156, 154, 0.38);
          background:
            radial-gradient(circle, transparent 5px, #fffdf9 5.5px) -8px -8px / 18px 18px,
            rgba(40, 156, 154, 0.045);
          box-shadow: inset 0 0 0 8px rgba(255, 255, 255, 0.55);
        }

        .miniImage::before {
          content: "";
          position: absolute;
          inset: 8px;
          border: 1px solid rgba(40, 156, 154, 0.22);
        }

        .watermarkStamp img {
          width: 92px;
          height: 92px;
          object-fit: contain;
          opacity: 0.22;
          filter: grayscale(1);
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
          line-height: 1.45;
        }

        .postcardMessageText {
          min-height: 116px;
          max-height: 116px;
          overflow: hidden;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          word-break: break-word;
          line-height: 1.45;
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

        textarea {
          min-height: 150px;
          resize: vertical;
          line-height: 1.5;
        }

        .messageCounter {
          margin-top: -8px;
          margin-bottom: 14px;
          color: #667085;
          font-size: 0.76rem;
          font-weight: 800;
          text-align: right;
        }

        input:focus,
        textarea:focus {
          border-color: #17c9d5;
          box-shadow: 0 0 0 4px rgba(23, 201, 213, 0.14);
        }
               .recipientHelpText {
          margin: -8px 0 12px;
          color: #667085;
          font-size: 0.76rem;
          font-weight: 800;
          line-height: 1.35;
        }

        .recipientResults {
          display: grid;
          gap: 8px;
          margin: -6px 0 14px;
        }

        .recipientOption {
          width: 100%;
          display: grid;
          gap: 4px;
          border: 1px solid #d9dee8;
          border-radius: 14px;
          background: #ffffff;
          color: #10172f;
          cursor: pointer;
          font: inherit;
          padding: 11px 12px;
          text-align: left;
        }

        .recipientOption:hover,
        .selectedRecipient {
          border-color: #17c9d5;
          background: rgba(23, 201, 213, 0.1);
        }

        .recipientOption strong {
          font-size: 0.88rem;
          font-weight: 950;
        }

        .recipientOption span,
        .noRecipientResults {
          color: #667085;
          font-size: 0.78rem;
          font-weight: 800;
        }

                .noRecipientResults {
          margin: 0;
          border: 1px dashed #d9dee8;
          border-radius: 14px;
          padding: 12px;
        }

        .postingAs {
          display: grid;
          gap: 5px;
          margin-top: 16px;
          border: 1px solid rgba(16, 23, 47, 0.08);
          border-radius: 16px;
          background: rgba(23, 201, 213, 0.08);
          padding: 12px 14px;
        }

        .postingAs span {
          color: #667085;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .postingAs strong {
          color: #10172f;
          font-weight: 950;
        }

        .postcardActions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .postcardActions button,
        .postcardActions a {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 999px;
          background: #17c9d5;
          color: #020617;
          cursor: pointer;
          font: inherit;
          font-size: 0.88rem;
          font-weight: 950;
          padding: 0 18px;
          text-decoration: none;
        }

        .postcardActions a {
          background: #10172f;
          color: #ffffff;
        }

        .postcardActions button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .successNote,
        .errorNote {
          margin: 14px 0 0;
          font-size: 0.88rem;
          font-weight: 900;
          line-height: 1.45;
        }

        .successNote {
          color: #00a854;
        }

        .errorNote {
          color: #c0392b;
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

        @media (max-width: 560px) {
          .postcardPage {
            padding: 18px;
          }

          .brand img {
            width: 48px;
            height: 48px;
          }

          .brand strong {
            font-size: 1rem;
          }

          .brand p {
            font-size: 0.46rem;
            letter-spacing: 0.2em;
          }

          .postcardActions button,
          .postcardActions a {
            width: 100%;
          }

          .stampChoiceBox {
            align-items: stretch;
            flex-direction: column;
          }

          .stampGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}