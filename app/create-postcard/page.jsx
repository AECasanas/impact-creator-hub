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
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedStampId, setSelectedStampId] = useState("cafe");
  const [postcardTitle, setPostcardTitle] = useState("Postcard");
  const [greeting, setGreeting] = useState("Dear...");
  const [message, setMessage] = useState(
    "Write a short update, idea, project note, or collaboration opportunity."
  );
  const [signature, setSignature] = useState("From, Impact Creator Hub");

  const selectedStamp =
    stampOptions.find((stamp) => stamp.id === selectedStampId) ||
    stampOptions[0];

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

  function clearCustomImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
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

  async function handlePostToImpactExchange() {
    setStatus("");
    setErrorMessage("");
    setPosting(true);

    try {
      if (!user) {
        setErrorMessage("Please log in before posting to Impact Exchange.");
        return;
      }

      if (!profile) {
        setErrorMessage("Please create your creator profile before posting.");
        return;
      }

      if (!profile.slug) {
        setErrorMessage(
          "Please save your creator profile first so your postcard can link to your public profile."
        );
        return;
      }

      const cleanSlug = slugify(
        profile.slug || profile.display_name || "creator"
      );

      let customImageUrl = "";

      if (imageFile) {
        setStatus("Uploading postcard image...");
        customImageUrl = await uploadPostcardImage(imageFile, cleanSlug);
      }

      const postcardBody = [
        greeting,
        "",
        message,
        "",
        signature,
        "",
        `Stamp: ${selectedStamp.name}`,
      ]
        .filter((line) => line !== null && line !== undefined)
        .join("\n");

      const payload = {
        user_id: user.id,
        creator_profile_id: profile.id,
        creator_slug: cleanSlug,

        author_type: "creator",
        author_name: profile.display_name || cleanSlug,
        author_role: profile.creator_type || "Creator",
        author_avatar_url: profile.profile_photo_url || "",
        author_accent_name: profile.accent_name || "Electric Cyan",
        author_accent_color: profile.accent_color || "#00e8f0",
        author_profile_url: `/creator/${cleanSlug}`,

        title: postcardTitle.trim() || selectedStamp.name || "Postcard",
        body: postcardBody,
        post_type: "Postcard",
        category: "Postcard",
        post_url: "",
        link_url: "",
        image_url: customImageUrl || selectedStamp.src,
        is_published: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("impact_exchange_posts")
        .insert(payload);

      if (error) {
        throw error;
      }

      setStatus("Postcard posted to Impact Exchange.");
    } catch (error) {
      console.warn("POSTCARD POST ERROR:", error);

      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Something went wrong while posting your postcard."
      );
    } finally {
      setPosting(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.assign("/login");
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

          <nav className="dashboardNav">
            <a href="/dashboard/profile">Profile</a>
            <a href="/dashboard/post">Post</a>
            <a href="/dashboard/inquiries">Inquiries</a>
            <a href="/dashboard/saved">Saved</a>
            <a href="/impact-exchange">Exchange</a>

            <button type="button" onClick={handleSignOut}>
              Sign Out
            </button>
          </nav>
        </header>

        <section className="intro">
          <p className="eyebrow">Impact Exchange</p>

          <h1>Create a postcard post</h1>

          <p>
            Choose a stamp style, write your message, and post it to Impact
            Exchange.
          </p>
        </section>

        <section className="workspace">
          <div className="postcardPreview">
            <div className="frontSide">
              <div className="frontImage">
                {imagePreview ? (
                  <img src={imagePreview} alt="Uploaded postcard visual" />
                ) : (
                  <img src={selectedStamp.src} alt={selectedStamp.name} />
                )}
              </div>
            </div>

            <div className="dividerLine"></div>

            <div className="backSide">
              <div className="stamp">
                <div className="miniImage">
                  <img src={selectedStamp.src} alt={selectedStamp.name} />
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
              Stamp style
              <select
                value={selectedStampId}
                onChange={(event) => setSelectedStampId(event.target.value)}
              >
                {stampOptions.map((stamp) => (
                  <option key={stamp.id} value={stamp.id}>
                    {stamp.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="stampPicker">
              {stampOptions.map((stamp) => (
                <button
                  key={stamp.id}
                  type="button"
                  className={selectedStampId === stamp.id ? "activeStamp" : ""}
                  onClick={() => setSelectedStampId(stamp.id)}
                >
                  <img src={stamp.src} alt={stamp.name} />
                  <span>{stamp.name}</span>
                </button>
              ))}
            </div>

            <label>
              Optional custom front image
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>

            {imagePreview && (
              <button
                className="clearImageButton"
                type="button"
                onClick={clearCustomImage}
              >
                Use selected stamp as front image
              </button>
            )}

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

            {profile?.display_name && (
              <div className="postingAs">
                <span>Posting as</span>
                <strong>{profile.display_name}</strong>
              </div>
            )}

            {status && <p className="successNote">{status}</p>}
            {errorMessage && <p className="errorNote">{errorMessage}</p>}

            <div className="postcardActions">
              <button
                type="button"
                onClick={handlePostToImpactExchange}
                disabled={posting || loadingProfile}
              >
                {posting ? "Posting..." : "Post to Exchange"}
              </button>

              <a href="/impact-exchange">View Exchange</a>
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
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

        .dashboardNav {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          font-weight: 900;
        }

        .dashboardNav a,
        .dashboardNav button {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          font: inherit;
          font-size: 0.84rem;
          font-weight: 900;
          padding: 0 15px;
          text-decoration: none;
        }

        .dashboardNav button {
          color: #f28c82;
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
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.2),
              transparent 55%
            ),
            #ff9f73;
        }

        .frontImage img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
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
          width: 140px;
          height: 140px;
          display: grid;
          place-items: center;
          background: transparent;
          overflow: visible;
        }

        .miniImage img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
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
        select,
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

        input,
        select {
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
        select:focus,
        textarea:focus {
          border-color: #17c9d5;
          box-shadow: 0 0 0 4px rgba(23, 201, 213, 0.14);
        }

        .clearImageButton {
          width: 100%;
          min-height: 42px;
          border: 1px solid rgba(16, 23, 47, 0.14);
          border-radius: 999px;
          background: rgba(16, 23, 47, 0.06);
          color: #10172f;
          cursor: pointer;
          font: inherit;
          font-size: 0.82rem;
          font-weight: 950;
          margin: -4px 0 14px;
          padding: 0 14px;
        }

        .stampPicker {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          max-height: 430px;
          overflow: auto;
          margin: 8px 0 18px;
          padding-right: 4px;
        }

        .stampPicker button {
          border: 1px solid #d9dee8;
          border-radius: 14px;
          background: #ffffff;
          cursor: pointer;
          padding: 8px;
          text-align: left;
        }

        .stampPicker button.activeStamp {
          border-color: #17c9d5;
          box-shadow: 0 0 0 4px rgba(23, 201, 213, 0.14);
        }

        .stampPicker img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: contain;
          display: block;
        }

        .stampPicker span {
          display: block;
          margin-top: 6px;
          color: #10172f;
          font-size: 0.72rem;
          font-weight: 900;
          line-height: 1.25;
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
          .topBar {
            align-items: flex-start;
            flex-direction: column;
          }

          .workspace,
          .postcardPreview {
            grid-template-columns: 1fr;
          }

          .dividerLine {
            height: 2px;
          }

          .frontImage {
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

          .stampPicker {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}