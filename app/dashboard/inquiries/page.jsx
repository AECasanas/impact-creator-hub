"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Bell,
  LogOut,
  Search,
} from "lucide-react";

export default function InquiriesPage() {
  const [user, setUser] = useState(null);
  const [dashboardPath, setDashboardPath] = useState("/dashboard/profile");
  const [currentUserAvatarUrl, setCurrentUserAvatarUrl] = useState("");
  const [currentUserInitial, setCurrentUserInitial] = useState("I");
  const [unreadMessages, setUnreadMessages] = useState(0); 
  const [messages, setMessages] = useState([]);
  const [senderMap, setSenderMap] = useState({});
  const [activeMessage, setActiveMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("Inbox");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageTheme, setPageTheme] = useState("dark");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
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
        setErrorMessage("Please log in to view your messages.");
        setLoading(false);
        return;
      }

      setUser(user);
            await resolveDashboardPath(user.id);
      await loadUnreadMessages(user.id);

      const { data, error } = await supabase
        .from("impact_messages")
        .select("*")
        .or(`recipient_user_id.eq.${user.id},sender_user_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const loadedMessages = data || [];
      setMessages(loadedMessages);

      await loadSenderProfiles(loadedMessages);
    } catch (error) {
      console.warn("LOAD INQUIRIES ERROR:", error);
      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Could not load your messages."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadSenderProfiles(loadedMessages) {
    const senderIds = [
      ...new Set(
        loadedMessages
          .map((message) => message.sender_user_id)
          .filter(Boolean)
      ),
    ];

    if (senderIds.length === 0) {
      setSenderMap({});
      return;
    }

    const { data: creators } = await supabase
      .from("creator_profiles")
      .select("id, user_id, slug, display_name, creator_type, profile_photo_url")
      .in("user_id", senderIds);

    const { data: brands } = await supabase
      .from("brand_profiles")
      .select("id, user_id, slug, company_name, brand_type, logo_url")
      .in("user_id", senderIds);

    const nextSenderMap = {};

    (creators || []).forEach((creator) => {
      nextSenderMap[creator.user_id] = {
        type: "Creator",
        name: creator.display_name || "Creator",
        label: creator.creator_type || "Creator",
        avatar: creator.profile_photo_url || "",
        profileUrl: creator.slug ? `/creator/${creator.slug}` : "",
      };
    });

    (brands || []).forEach((brand) => {
      nextSenderMap[brand.user_id] = {
        type: "Brand",
        name: brand.company_name || "Brand",
        label: brand.brand_type || "Brand",
        avatar: brand.logo_url || "",
        profileUrl: brand.slug ? `/brand/${brand.slug}` : "",
      };
    });

    setSenderMap(nextSenderMap);
  }

  async function openMessage(message) {
    setActiveMessage(message);

    if (
      user &&
      message.recipient_user_id === user.id &&
      message.is_read === false
    ) {
      const { error } = await supabase
        .from("impact_messages")
        .update({ is_read: true })
        .eq("id", message.id)
        .eq("recipient_user_id", user.id);

      if (error) {
        console.warn("MARK MESSAGE READ ERROR:", error);
        return;
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, is_read: true } : item
        )
      );

      setActiveMessage({ ...message, is_read: true });
    }
  }

  const inboxMessages = useMemo(() => {
    if (!user) return [];
    return messages.filter((message) => message.recipient_user_id === user.id);
  }, [messages, user]);

  const sentMessages = useMemo(() => {
    if (!user) return [];
    return messages.filter((message) => message.sender_user_id === user.id);
  }, [messages, user]);

  const visibleMessages = activeTab === "Sent" ? sentMessages : inboxMessages;

  const unreadCount = inboxMessages.filter((message) => !message.is_read).length;

  function getSender(message) {
    if (message.sender_user_id === user?.id) {
      return {
        type: "You",
        name: "You",
        label: "Sent message",
        avatar: "",
        profileUrl: "",
      };
    }

    return (
      senderMap[message.sender_user_id] || {
        type: "Member",
        name: "Impact Creator Hub Member",
        label: "Member",
        avatar: "",
        profileUrl: "",
      }
    );
  }

  function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  async function resolveDashboardPath(userId) {
    const { data: brandProfile } = await supabase
      .from("brand_profiles")
      .select("id, company_name, logo_url")
      .eq("user_id", userId)
      .maybeSingle();

    if (brandProfile) {
      setDashboardPath("/dashboard/brand");
      setCurrentUserAvatarUrl(brandProfile.logo_url || "");
      setCurrentUserInitial(
        (brandProfile.company_name || "B").charAt(0).toUpperCase()
      );
      return;
    }

    const { data: creatorProfile } = await supabase
      .from("creator_profiles")
      .select("id, display_name, profile_photo_url")
      .eq("user_id", userId)
      .maybeSingle();

    if (creatorProfile) {
      setDashboardPath("/dashboard/profile");
      setCurrentUserAvatarUrl(creatorProfile.profile_photo_url || "");
      setCurrentUserInitial(
        (creatorProfile.display_name || "I").charAt(0).toUpperCase()
      );
      return;
    }

    setCurrentUserAvatarUrl("");
    setCurrentUserInitial("I");
    setDashboardPath("/create-profile/free");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();

    setUser(null);
    setCurrentUserAvatarUrl("");
    setCurrentUserInitial("I");
    setDashboardPath("/dashboard/profile");
    setUnreadMessages(0);

    window.location.href = "/login";
  }

  async function loadUnreadMessages(userId) {
    const { count, error } = await supabase
      .from("impact_messages")
      .select("id", { count: "exact", head: true })
      .eq("recipient_user_id", userId)
      .eq("is_read", false);

    if (error) {
      console.warn("LOAD UNREAD MESSAGES ERROR:", error);
      setUnreadMessages(0);
      return;
    }

    setUnreadMessages(count || 0);
  }
  return (
        <main className={`inquiriesPage ${pageTheme === "light" ? "lightMode" : "darkMode"}`}>
      <section className="inquiriesShell">
              <header className="exchangeHeader">
          <a href="/" className="brandHeader">
            <img src="/logo-ripple.png" alt="Impact Creator Hub logo" />

            <div>
              <strong>Impact Creator Hub</strong>
              <span>
                BUILD YOUR BRAND. <em>GROW YOUR IMPACT.</em>
              </span>
            </div>
          </a>

          <nav className="topMenu">
            <a href="/impact-exchange" className="activeTopMenu">
              Exchange
            </a>
            <a href={dashboardPath}>Dashboard</a>
          </nav>

          <div className="topIconGroup">
            <button type="button" className="topIconButton" aria-label="Search">
              <Search size={17} strokeWidth={2.4} />
            </button>

            <button
              type="button"
              className="topIconButton"
              aria-label={
                unreadMessages > 0
                  ? `${unreadMessages} unread postcard notification${unreadMessages === 1 ? "" : "s"}`
                  : "Notifications"
              }
              title={
                unreadMessages > 0
                  ? `${unreadMessages} unread postcard notification${unreadMessages === 1 ? "" : "s"}`
                  : "Notifications"
              }
              onClick={() => {
                window.location.href = user
                  ? "/dashboard/inquiries"
                  : "/login?redirect=/dashboard/inquiries";
              }}
            >
              <Bell size={17} strokeWidth={2.4} />
              {unreadMessages > 0 && <span className="notificationDot"></span>}
            </button>

            {user ? (
              <>
                <a href={dashboardPath} className="topProfileButton">
                  {currentUserAvatarUrl ? (
                    <img
                      src={currentUserAvatarUrl}
                      alt="Your profile"
                      className="topProfileImage"
                    />
                  ) : (
                    currentUserInitial
                  )}
                </a>

                <button
                  type="button"
                  className="topIconButton"
                  aria-label="Sign out"
                  title="Sign out"
                  onClick={handleSignOut}
                >
                  <LogOut size={17} strokeWidth={2.4} />
                </button>
              </>
            ) : (
              <a href="/login?redirect=/dashboard/inquiries" className="loginButton">
                Log In
              </a>
            )}
          </div>
        </header>

        <section className="hero">
          <p>Impact Messages</p>
          <h1>Inquiries</h1>
          <span>
            Read postcards, collaboration notes, and messages sent through
            Impact Creator Hub.
          </span>
        </section>
        <div className="inboxControls">
          <button
            type="button"
            className="themeToggle"
            onClick={() =>
              setPageTheme(pageTheme === "dark" ? "light" : "dark")
            }
          >
            {pageTheme === "dark" ? "Light inbox" : "Dark inbox"}
          </button>
        </div>
        <section className="inquiriesLayout">
          <aside className="messageListCard">
            <div className="tabs">
              <button
                type="button"
                className={activeTab === "Inbox" ? "activeTab" : ""}
                onClick={() => {
                  setActiveTab("Inbox");
                  setActiveMessage(null);
                }}
              >
                Inbox {unreadCount > 0 ? `(${unreadCount})` : ""}
              </button>

              <button
                type="button"
                className={activeTab === "Sent" ? "activeTab" : ""}
                onClick={() => {
                  setActiveTab("Sent");
                  setActiveMessage(null);
                }}
              >
                Sent
              </button>
            </div>

            {loading && <p className="emptyState">Loading messages...</p>}

            {errorMessage && <p className="errorState">{errorMessage}</p>}

            {!loading && !errorMessage && visibleMessages.length === 0 && (
              <p className="emptyState">
                {activeTab === "Inbox"
                  ? "No messages yet."
                  : "No sent messages yet."}
              </p>
            )}

            <div className="messageList">
              {visibleMessages.map((message) => {
                const sender = getSender(message);
                const payload = message.postcard_payload || {};
                const isUnread =
                  user &&
                  message.recipient_user_id === user.id &&
                  message.is_read === false;

                return (
                  <button
                    type="button"
                    key={message.id}
                    className={
                      activeMessage?.id === message.id
                        ? "messageRow activeMessageRow"
                        : isUnread
                          ? "messageRow unreadMessageRow"
                          : "messageRow"
                    }
                    onClick={() => openMessage(message)}
                  >
                    <div className="senderAvatar">
                      {sender.avatar ? (
                        <img src={sender.avatar} alt={sender.name} />
                      ) : (
                        sender.name.charAt(0)
                      )}
                    </div>

                    <div>
                      <strong>{sender.name}</strong>
                      <span>
                        {message.message_type === "postcard"
                          ? "Postcard"
                          : "Message"}{" "}
                        · {formatDate(message.created_at)}
                      </span>
                      <p>
                        {message.subject ||
                          payload.postcard_title ||
                          "Untitled message"}
                      </p>
                    </div>

                    {isUnread && <em>New</em>}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="messageDetailCard">
            {!activeMessage ? (
              <div className="messagePlaceholder">
                <h2>Select a message</h2>
                <p>
                  Choose a postcard or message from the list to read it here.
                </p>
              </div>
            ) : (
              <MessageDetail
                message={activeMessage}
                sender={getSender(activeMessage)}
                formatDate={formatDate}
              />
            )}
          </section>
        </section>
      </section>

      <style jsx>{`
        .inquiriesPage {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 12%, rgba(0, 232, 240, 0.1), transparent 30%),
            linear-gradient(135deg, #05090b 0%, #09131a 52%, #05090b 100%);
          color: #eef3f7;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 28px;
        }

        .inquiriesShell {
          width: min(1220px, 100%);
          margin: 0 auto;
        }

        .inquiriesHeader {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 18px;
        }

        .brandLink {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: #ffffff;
          text-decoration: none;
        }

        .brandLink img {
          width: 54px;
          height: 54px;
          object-fit: contain;
          background: #000000;
        }

        .brandLink strong {
          display: block;
          font-size: 1.05rem;
          font-weight: 950;
        }

        .brandLink span {
          display: block;
          margin-top: 4px;
          color: #ff8c82;
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .inquiriesHeader nav {
          display: flex;
          gap: 10px;
        }

        .inquiriesHeader nav a {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          color: rgba(238, 243, 247, 0.72);
          font-size: 0.86rem;
          font-weight: 900;
          padding: 0 14px;
          text-decoration: none;
        }

        .inquiriesHeader nav a:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #00e8f0;
        }

        .hero {
          padding: 34px 0 22px;
        }

        .hero p {
          margin: 0;
          color: #67e8f9;
          font-size: 0.76rem;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .hero h1 {
          margin: 8px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.6rem, 5vw, 4.8rem);
          font-weight: 500;
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .hero span {
          display: block;
          max-width: 650px;
          margin-top: 14px;
          color: rgba(238, 243, 247, 0.68);
          font-size: 1rem;
          line-height: 1.65;
        }

        .inquiriesLayout {
          display: grid;
          grid-template-columns: minmax(320px, 0.46fr) minmax(0, 1fr);
          gap: 22px;
          align-items: start;
        }

        .messageListCard,
        .messageDetailCard {
          min-height: 560px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background: rgba(7, 10, 16, 0.58);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
          overflow: hidden;
        }

        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px;
        }

        .tabs button {
          min-height: 38px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          background: transparent;
          color: rgba(238, 243, 247, 0.72);
          cursor: pointer;
          font: inherit;
          font-size: 0.84rem;
          font-weight: 900;
          padding: 0 14px;
        }

        .tabs .activeTab {
          border-color: #00e8f0;
          background: #00e8f0;
          color: #020617;
        }

        .messageList {
          display: grid;
        }

        .messageRow {
          width: 100%;
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: 12px;
          align-items: center;
          border: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent;
          color: #eef3f7;
          cursor: pointer;
          font: inherit;
          padding: 14px;
          text-align: left;
        }

        .messageRow:hover,
        .activeMessageRow {
          background: rgba(255, 255, 255, 0.07);
        }

        .unreadMessageRow {
          background: rgba(0, 232, 240, 0.06);
        }

        .senderAvatar {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #00e8f0;
          color: #020617;
          font-weight: 950;
          overflow: hidden;
        }

        .senderAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .messageRow strong {
          display: block;
          font-size: 0.9rem;
          font-weight: 950;
        }

        .messageRow span {
          display: block;
          margin-top: 3px;
          color: rgba(238, 243, 247, 0.54);
          font-size: 0.74rem;
          font-weight: 850;
        }

        .messageRow p {
          margin: 5px 0 0;
          color: rgba(238, 243, 247, 0.74);
          font-size: 0.82rem;
          font-weight: 800;
          line-height: 1.35;
        }

        .messageRow em {
          border-radius: 999px;
          background: #ff8c82;
          color: #020617;
          font-size: 0.68rem;
          font-style: normal;
          font-weight: 950;
          padding: 4px 8px;
        }

        .emptyState,
        .errorState {
          margin: 0;
          color: rgba(238, 243, 247, 0.64);
          font-size: 0.92rem;
          font-weight: 850;
          padding: 18px;
          line-height: 1.45;
        }

        .errorState {
          color: #ff8c82;
        }

        .messagePlaceholder {
          min-height: 560px;
          display: grid;
          place-content: center;
          text-align: center;
          padding: 30px;
        }

        .messagePlaceholder h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 2.2rem;
          letter-spacing: -0.04em;
        }

        .messagePlaceholder p {
          max-width: 390px;
          margin: 12px auto 0;
          color: rgba(238, 243, 247, 0.64);
          line-height: 1.6;
        }
        .inboxControls {
          display: flex;
          justify-content: flex-end;
          margin: 0 0 14px;
        }

        .themeToggle {
          min-height: 42px;
          border: 1px solid #00e8f0;
          border-radius: 999px;
          background: #00e8f0;
          color: #020617;
          cursor: pointer;
          font: inherit;
          font-size: 0.84rem;
          font-weight: 950;
          padding: 0 18px;
        }

        .inquiriesPage.lightMode {
          background: #f7f8fb;
          color: #10172f;
        }

        .inquiriesPage.lightMode .inquiriesHeader {
          border-bottom-color: rgba(16, 23, 47, 0.12);
        }

        .inquiriesPage.lightMode .brandLink,
        .inquiriesPage.lightMode .inquiriesHeader nav a,
        .inquiriesPage.lightMode .hero h1,
        .inquiriesPage.lightMode .messagePlaceholder h2,
        .inquiriesPage.lightMode .messageRow,
        .inquiriesPage.lightMode .detailSender a,
        .inquiriesPage.lightMode .detailSender strong,
        .inquiriesPage.lightMode .plainMessageView h2 {
          color: #10172f;
        }

        .inquiriesPage.lightMode .hero span,
        .inquiriesPage.lightMode .messagePlaceholder p,
        .inquiriesPage.lightMode .messageRow span,
        .inquiriesPage.lightMode .messageRow p,
        .inquiriesPage.lightMode .detailSender span,
        .inquiriesPage.lightMode .plainMessageView p {
          color: rgba(16, 23, 47, 0.62);
        }

        .inquiriesPage.lightMode .messageListCard,
        .inquiriesPage.lightMode .messageDetailCard {
          border-color: rgba(16, 23, 47, 0.12);
          background: #fffdf9;
          box-shadow: 0 24px 70px rgba(16, 23, 47, 0.12);
        }

        .inquiriesPage.lightMode .tabs,
        .inquiriesPage.lightMode .messageRow {
          border-bottom-color: rgba(16, 23, 47, 0.08);
        }

        .inquiriesPage.lightMode .messageRow:hover,
        .inquiriesPage.lightMode .activeMessageRow {
          background: rgba(0, 232, 240, 0.08);
        }

        .inquiriesPage.lightMode .plainMessageView {
          background: rgba(16, 23, 47, 0.06);
        }
                .exchangeHeader {
          width: min(1540px, 100%);
          min-height: 78px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 14px;
        }

        .brandHeader {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: #eef3f7;
          text-decoration: none;
        }

        .brandHeader img {
          width: 58px;
          height: 58px;
          object-fit: contain;
          background: #000000;
        }

        .brandHeader strong {
          display: block;
          font-size: 1.08rem;
          font-weight: 950;
        }

        .brandHeader span {
          display: block;
          margin-top: 4px;
          color: rgba(238, 243, 247, 0.72);
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .brandHeader em {
          color: #ff8c82;
          font-style: normal;
        }

        .topMenu {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }

        .topMenu a {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          color: rgba(238, 243, 247, 0.78);
          font-size: 0.95rem;
          font-weight: 950;
          padding: 0 18px;
          text-decoration: none;
        }

        .topMenu a:hover,
        .topMenu .activeTopMenu {
          background: rgba(255, 255, 255, 0.08);
          color: #00e8f0;
        }

        .topIconGroup {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .topIconButton {
          position: relative;
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 999px;
          background: rgba(7, 10, 16, 0.46);
          color: #eef3f7;
          cursor: pointer;
        }

        .topProfileButton {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 999px;
          background: rgba(7, 10, 16, 0.46);
          color: #eef3f7;
          font-weight: 950;
          overflow: hidden;
          text-decoration: none;
        }

        .topProfileImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .notificationDot {
          position: absolute;
          top: 7px;
          right: 8px;
          width: 9px;
          height: 9px;
          border: 2px solid #10131a;
          border-radius: 999px;
          background: #ff1744;
        }

        .loginButton {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #00e8f0;
          color: #020617;
          font-size: 0.9rem;
          font-weight: 950;
          padding: 0 18px;
          text-decoration: none;
        }

        .inquiriesPage.lightMode .exchangeHeader {
          border-bottom-color: rgba(16, 23, 47, 0.12);
        }

        .inquiriesPage.lightMode .brandHeader,
        .inquiriesPage.lightMode .topMenu a {
          color: #10172f;
        }

        .inquiriesPage.lightMode .brandHeader span {
          color: rgba(16, 23, 47, 0.58);
        }

        .inquiriesPage.lightMode .topIconButton,
        .inquiriesPage.lightMode .topProfileButton {
          border-color: rgba(16, 23, 47, 0.12);
          background: #fffdf9;
          color: #10172f;
        }

        .inquiriesPage.lightMode .topMenu a:hover,
        .inquiriesPage.lightMode .topMenu .activeTopMenu {
          background: rgba(0, 232, 240, 0.12);
          color: #008b95;
        }
        @media (max-width: 900px) {
          .inquiriesLayout {
            grid-template-columns: 1fr;
          }

          .inquiriesHeader {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

function MessageDetail({ message, sender, formatDate }) {
  const payload = message.postcard_payload || {};
  const isPostcard = message.message_type === "postcard";
  const [showPostcardModal, setShowPostcardModal] = useState(false);

  return (
    <article className="messageDetail">
      <div className="detailTop">
        <div className="detailSender">
          <div className="detailAvatar">
            {sender.avatar ? (
              <img src={sender.avatar} alt={sender.name} />
            ) : (
              sender.name.charAt(0)
            )}
          </div>

          <div>
            <p>{isPostcard ? "Postcard from" : "Message from"}</p>

            {sender.profileUrl ? (
              <a href={sender.profileUrl}>{sender.name}</a>
            ) : (
              <strong>{sender.name}</strong>
            )}

            <span>
              {sender.label} · {formatDate(message.created_at)}
            </span>
          </div>
        </div>

        <a href="/create-postcard" className="sendPostcardLink">
          Send postcard
        </a>
      </div>

      {isPostcard ? (
        <section className="postcardReadView">
          <div className="readPostcardFront">
            <div className="readSunsetLines">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <h2>{payload.postcard_title || message.subject || "Postcard"}</h2>

            <div className="readSun"></div>
            <div className="readWater"></div>
          </div>

          <div className="readPostcardBack">
            <div className="readStamp">
              <img src="/logo-ripple.png" alt="" />
            </div>

            <div className="readPostcardText">
              <h3>{payload.greeting || "Dear..."}</h3>
              <p>{payload.message || message.body}</p>
              <strong>{payload.signature || ""}</strong>
            </div>
          </div>
        </section>
      ) : (
        <section className="plainMessageView">
          <h2>{message.subject || "Message"}</h2>
          <p>{message.body}</p>
        </section>
      )}

      <style jsx>{`
        .messageDetail {
          padding: 22px;
        }

        .detailTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 18px;
        }

        .detailSender {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .detailAvatar {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #00e8f0;
          color: #020617;
          font-weight: 950;
          overflow: hidden;
        }

        .detailAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detailSender p {
          margin: 0;
          color: #67e8f9;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .detailSender a,
        .detailSender strong {
          display: block;
          margin-top: 5px;
          color: #eef3f7;
          font-size: 1.08rem;
          font-weight: 950;
          text-decoration: none;
        }

        .detailSender span {
          display: block;
          margin-top: 5px;
          color: rgba(238, 243, 247, 0.58);
          font-size: 0.82rem;
          font-weight: 850;
        }

        .sendPostcardLink {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #00e8f0;
          color: #020617;
          font-size: 0.84rem;
          font-weight: 950;
          padding: 0 16px;
          text-decoration: none;
          white-space: nowrap;
        }

        .postcardReadView {
          display: grid;
          grid-template-columns: 1fr 1.08fr;
          min-height: 420px;
          overflow: hidden;
          border-radius: 22px;
          background: #fffdf9;
          color: #25375f;
          margin-top: 22px;
        }

        .readPostcardFront {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            #ff6b6b 0%,
            #ff9d72 40%,
            #ffdca3 100%
          );
        }

        .readPostcardFront h2 {
          position: relative;
          z-index: 2;
          margin: 92px auto 0;
          padding: 0 22px;
          text-align: center;
          color: #25375f;
          font-family: "Brush Script MT", "Segoe Script", cursive;
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 400;
        }

        .readSunsetLines {
          position: absolute;
          inset: 32px 0 auto;
          display: grid;
          gap: 12px;
        }

        .readSunsetLines span {
          height: 13px;
          background: rgba(255, 202, 118, 0.7);
          border-radius: 999px;
          transform: skewX(-18deg);
        }

        .readSunsetLines span:nth-child(1) {
          margin-left: 46%;
        }

        .readSunsetLines span:nth-child(2) {
          margin-right: 24%;
        }

        .readSunsetLines span:nth-child(3) {
          margin-left: 12%;
          margin-right: 38%;
        }

        .readSun {
          position: absolute;
          left: 50%;
          bottom: 78px;
          width: 190px;
          height: 190px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: #ffe176;
        }

        .readWater {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 52px;
          background: linear-gradient(180deg, #77d4c8 0%, #4bb8b2 100%);
        }

        .readPostcardBack {
          position: relative;
          padding: 42px 46px;
          background: #fffdf9;
        }

        .readStamp {
          display: flex;
          justify-content: flex-end;
        }

        .readStamp img {
          width: 74px;
          height: 74px;
          object-fit: contain;
          opacity: 0.2;
          filter: grayscale(1);
        }

        .readPostcardText {
          margin-top: 44px;
        }

        .readPostcardText h3 {
          margin: 0;
          color: #25375f;
          font-size: 1.6rem;
          font-weight: 600;
        }

        .readPostcardText p {
          margin: 12px 0 26px;
          color: rgba(37, 55, 95, 0.86);
          line-height: 1.55;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .readPostcardText strong {
          color: #25375f;
        }

        .plainMessageView {
          margin-top: 22px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.07);
          padding: 24px;
        }

        .plainMessageView h2 {
          margin: 0;
          color: #eef3f7;
          font-size: 1.5rem;
        }

        .plainMessageView p {
          color: rgba(238, 243, 247, 0.74);
          line-height: 1.7;
          white-space: pre-wrap;
        }

        @media (max-width: 900px) {
          .postcardReadView {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </article>
  );
}