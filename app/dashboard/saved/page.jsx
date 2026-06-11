"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ImpactHeaderBrand from "@/components/ImpactHeaderBrand";

export default function SavedPostsDashboardPage() {
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [savedRows, setSavedRows] = useState([]);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingBoard, setSavingBoard] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedBoardId, setSelectedBoardId] = useState("all");

  const [boardDraft, setBoardDraft] = useState({
    boardName: "",
    boardDescription: "",
  });

  useEffect(() => {
    loadSavedPage();
  }, []);

  const savedPosts = useMemo(() => {
    const postMap = new Map(posts.map((post) => [post.id, post]));

    return savedRows
      .map((savedRow) => {
        const post = postMap.get(savedRow.post_id);

        if (!post) {
          return null;
        }

        return {
          savedId: savedRow.id,
          savedAt: savedRow.created_at,
          boardId: savedRow.board_id || "",
          post,
        };
      })
      .filter(Boolean);
  }, [posts, savedRows]);

  const filteredSavedPosts = useMemo(() => {
    if (selectedBoardId === "all") {
      return savedPosts;
    }

    if (selectedBoardId === "unboarded") {
      return savedPosts.filter((item) => !item.boardId);
    }

    return savedPosts.filter((item) => item.boardId === selectedBoardId);
  }, [savedPosts, selectedBoardId]);

  const boardCounts = useMemo(() => {
    const counts = {};

    for (const item of savedPosts) {
      const key = item.boardId || "unboarded";
      counts[key] = (counts[key] || 0) + 1;
    }

    return counts;
  }, [savedPosts]);

  function updateBoardDraft(field, value) {
    setBoardDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function loadSavedPage() {
    setLoading(true);
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
        window.location.assign("/login");
        return;
      }

      setUser(user);

      const { data: boardData, error: boardError } = await supabase
        .from("saved_post_boards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (boardError) {
        throw boardError;
      }

      setBoards(boardData || []);

      const { data: savedData, error: savedError } = await supabase
        .from("impact_exchange_saved_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (savedError) {
        throw savedError;
      }

      const savedItems = savedData || [];
      setSavedRows(savedItems);

      const postIds = savedItems
        .map((item) => item.post_id)
        .filter(Boolean);

      if (!postIds.length) {
        setPosts([]);
        return;
      }

      const { data: postData, error: postError } = await supabase
        .from("impact_exchange_posts")
        .select("*")
        .in("id", postIds);

      if (postError) {
        throw postError;
      }

      setPosts(postData || []);
    } catch (error) {
      console.warn("LOAD SAVED POSTS ERROR:", error);

      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Could not load saved posts."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBoard(event) {
    event.preventDefault();

    setStatus("");
    setErrorMessage("");

    if (!user) {
      window.location.assign("/login");
      return;
    }

    if (!boardDraft.boardName.trim()) {
      setErrorMessage("Board name is required.");
      return;
    }

    try {
      setSavingBoard(true);

      const payload = {
        user_id: user.id,
        board_name: boardDraft.boardName.trim(),
        board_description: boardDraft.boardDescription.trim(),
      };

      const { error } = await supabase
        .from("saved_post_boards")
        .insert(payload);

      if (error) {
        throw error;
      }

      setBoardDraft({
        boardName: "",
        boardDescription: "",
      });

      setStatus("Saved board created.");
      await loadSavedPage();
    } catch (error) {
      console.warn("CREATE SAVED BOARD ERROR:", error);

      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Could not create this saved board."
      );
    } finally {
      setSavingBoard(false);
    }
  }

  async function handleMoveSavedPost(savedId, boardId) {
    setStatus("");
    setErrorMessage("");

    try {
      const cleanBoardId = boardId || null;

      const { error } = await supabase
        .from("impact_exchange_saved_posts")
        .update({
          board_id: cleanBoardId,
        })
        .eq("id", savedId)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setSavedRows((current) =>
        current.map((item) =>
          item.id === savedId ? { ...item, board_id: cleanBoardId } : item
        )
      );

      setStatus("Saved post moved.");
    } catch (error) {
      console.warn("MOVE SAVED POST ERROR:", error);

      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Could not move this saved post."
      );
    }
  }

  async function handleRemoveSavedPost(savedId) {
    setStatus("");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("impact_exchange_saved_posts")
        .delete()
        .eq("id", savedId)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setSavedRows((current) => current.filter((item) => item.id !== savedId));
      setStatus("Saved post removed.");
    } catch (error) {
      console.warn("REMOVE SAVED POST ERROR:", error);

      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Could not remove this saved post."
      );
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.assign("/login");
  }

  function getBoardName(boardId) {
    const board = boards.find((item) => item.id === boardId);
    return board?.board_name || "Unboarded";
  }

  if (loading) {
    return (
      <main className="savedDashboardPage">
        <section className="loadingCard">Loading saved posts...</section>
        <style jsx global>{savedStyles}</style>
      </main>
    );
  }

  return (
    <main className="savedDashboardPage">
      <header className="dashboardHeader">
        <div className="dashboardHeaderLogo">
          <ImpactHeaderBrand
            logoSize={52}
            compact
            subtitle="SAVE IDEAS. BUILD BOARDS. GROW YOUR IMPACT."
          />
        </div>

        <nav>
          <a href="/dashboard/profile">Profile</a>
          <a href="/dashboard/inquiries">Inquiries</a>
          <a href="/impact-exchange">Impact Exchange</a>
          <button type="button" onClick={handleSignOut}>
            Sign Out
          </button>
        </nav>
      </header>

      <section className="savedHero">
        <div>
          <p className="eyebrow">Saved Posts</p>
          <h1>Your saved inspiration boards.</h1>
          <p>
            Organize saved Impact Exchange posts into boards for campaign ideas,
            creator connections, brand research, and collaboration inspiration.
          </p>
        </div>

        <form className="createBoardCard" onSubmit={handleCreateBoard}>
          <p className="panelLabel">Create a board</p>

          <label>
            Board name
            <input
              value={boardDraft.boardName}
              placeholder="Food brands I like"
              onChange={(event) =>
                updateBoardDraft("boardName", event.target.value)
              }
            />
          </label>

          <label>
            Description
            <textarea
              value={boardDraft.boardDescription}
              placeholder="Optional notes about what this board is for."
              onChange={(event) =>
                updateBoardDraft("boardDescription", event.target.value)
              }
            />
          </label>

          <button type="submit" disabled={savingBoard}>
            {savingBoard ? "Creating..." : "Create Board"}
          </button>
        </form>
      </section>

      <section className="statusRow">
        {status && <p className="success">{status}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </section>

      <section className="boardFilters">
        <button
          type="button"
          className={selectedBoardId === "all" ? "activeFilter" : ""}
          onClick={() => setSelectedBoardId("all")}
        >
          All saved
          <span>{savedPosts.length}</span>
        </button>

        <button
          type="button"
          className={selectedBoardId === "unboarded" ? "activeFilter" : ""}
          onClick={() => setSelectedBoardId("unboarded")}
        >
          Unboarded
          <span>{boardCounts.unboarded || 0}</span>
        </button>

        {boards.map((board) => (
          <button
            type="button"
            key={board.id}
            className={selectedBoardId === board.id ? "activeFilter" : ""}
            onClick={() => setSelectedBoardId(board.id)}
          >
            {board.board_name}
            <span>{boardCounts[board.id] || 0}</span>
          </button>
        ))}
      </section>

      <section className="savedGrid">
        {filteredSavedPosts.length > 0 ? (
          filteredSavedPosts.map((item) => {
            const post = item.post;
            const postHref = formatExternalUrl(
              post.post_url || post.link_url || ""
            );
            const profileHref =
              post.author_profile_url ||
              (post.creator_slug ? `/creator/${post.creator_slug}` : "");

            return (
              <article className="savedPostCard" key={item.savedId}>
                {post.image_url && (
                  <img
                    className="postImage"
                    src={post.image_url}
                    alt={post.title || "Saved post"}
                  />
                )}

                <div className="savedCardBody">
                  <div className="savedTopline">
                    <span>{post.post_type || "Saved post"}</span>
                    <strong>{getBoardName(item.boardId)}</strong>
                  </div>

                  <h2>{post.title || "Untitled saved post"}</h2>

                  {post.body && <p>{post.body}</p>}

                  <div className="authorLine">
                    {post.author_avatar_url && (
                      <img src={post.author_avatar_url} alt="" />
                    )}

                    <div>
                      <strong>{post.author_name || "Impact creator"}</strong>
                      <span>{post.author_role || post.category || "Creator"}</span>
                    </div>
                  </div>

                  <label className="boardSelectLabel">
                    Save to board
                    <select
                      value={item.boardId || ""}
                      onChange={(event) =>
                        handleMoveSavedPost(item.savedId, event.target.value)
                      }
                    >
                      <option value="">Unboarded</option>
                      {boards.map((board) => (
                        <option key={board.id} value={board.id}>
                          {board.board_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="cardActions">
                    {profileHref && (
                      <a href={profileHref} target="_blank" rel="noopener noreferrer">
                        View profile
                      </a>
                    )}

                    {postHref && (
                      <a href={postHref} target="_blank" rel="noopener noreferrer">
                        Open link ↗
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveSavedPost(item.savedId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <section className="emptyState">
            <p className="eyebrow">Nothing here yet</p>
            <h2>No saved posts in this board.</h2>
            <p>
              Save posts from Impact Exchange, then organize them into boards
              here.
            </p>

            <a href="/impact-exchange">Explore Impact Exchange</a>
          </section>
        )}
      </section>

      <style jsx global>{savedStyles}</style>
    </main>
  );
}

function formatExternalUrl(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

const savedStyles = `
  .savedDashboardPage {
    min-height: 100vh;
    background:
      radial-gradient(circle at 12% 12%, rgba(0, 232, 240, 0.14), transparent 30%),
      linear-gradient(135deg, #05090b 0%, #08131a 52%, #05090b 100%);
    color: #ffffff;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 28px;
  }

  .loadingCard {
    width: min(620px, 100%);
    margin: 18vh auto 0;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 28px;
    background: rgba(255,255,255,0.07);
    padding: 34px;
    font-weight: 950;
  }

  .dashboardHeader {
    width: min(1240px, 100%);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    padding-bottom: 22px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }

  .dashboardHeaderLogo .impactHeaderBrand {
    gap: 12px !important;
  }

  .dashboardHeaderLogo .impactHeaderBrand img {
    width: 52px !important;
    height: 52px !important;
  }

  .dashboardHeaderLogo .impactHeaderBrand strong {
    font-size: 1.15rem !important;
    line-height: 1 !important;
    letter-spacing: -0.02em !important;
  }

  .dashboardHeaderLogo .impactHeaderBrand span {
    margin-top: 6px !important;
    font-size: 0.5rem !important;
    letter-spacing: 0.24em !important;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 14px;
    font-weight: 900;
  }

  nav a,
  nav button {
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    color: #ffffff;
    cursor: pointer;
    font: inherit;
    padding: 11px 16px;
    text-decoration: none;
  }

  .savedHero {
    width: min(1240px, 100%);
    margin: 42px auto 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
    gap: 26px;
    align-items: start;
  }

  .eyebrow,
  .panelLabel {
    margin: 0;
    color: #00e8f0;
    font-size: 0.74rem;
    font-weight: 950;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 740px;
    margin: 14px 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(3rem, 7vw, 5.8rem);
    letter-spacing: -0.06em;
    line-height: 0.94;
  }

  .savedHero p:not(.eyebrow):not(.panelLabel) {
    max-width: 700px;
    margin: 20px 0 0;
    color: rgba(255,255,255,0.7);
    font-size: 1.05rem;
    line-height: 1.7;
  }

  .createBoardCard {
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 26px;
    background:
      radial-gradient(circle at 92% 10%, rgba(0,232,240,0.16), transparent 28%),
      rgba(255,255,255,0.07);
    padding: 20px;
    display: grid;
    gap: 14px;
  }

  label {
    display: grid;
    gap: 8px;
    color: rgba(255,255,255,0.92);
    font-size: 0.84rem;
    font-weight: 900;
  }

  input,
  select,
  textarea {
    width: 100%;
    min-height: 46px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 13px;
    background: rgba(255,255,255,0.1);
    color: #ffffff;
    font: inherit;
    font-weight: 800;
    outline: none;
    padding: 0 13px;
  }

  textarea {
    min-height: 96px;
    padding: 13px;
    resize: vertical;
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(255,255,255,0.45);
  }

  select option {
    background: #101820;
    color: #ffffff;
  }

  .createBoardCard button,
  .emptyState a {
    min-height: 42px;
    border: 0;
    border-radius: 999px;
    background: #00e8f0;
    color: #020617;
    cursor: pointer;
    font: inherit;
    font-size: 0.86rem;
    font-weight: 950;
    padding: 0 18px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  .statusRow {
    width: min(1240px, 100%);
    margin: 18px auto 0;
  }

  .success,
  .error {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 900;
  }

  .success {
    color: #00e8f0;
  }

  .error {
    color: #ff6a61;
  }

  .boardFilters {
    width: min(1240px, 100%);
    margin: 28px auto 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .boardFilters button {
    min-height: 42px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 999px;
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.78);
    cursor: pointer;
    font: inherit;
    font-weight: 950;
    padding: 0 16px;
  }

  .boardFilters button span {
    min-width: 24px;
    min-height: 24px;
    display: inline-grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    color: #ffffff;
    font-size: 0.72rem;
  }

  .boardFilters .activeFilter {
    border-color: #00e8f0;
    background: rgba(0,232,240,0.14);
    color: #ffffff;
  }

  .savedGrid {
    width: min(1240px, 100%);
    margin: 24px auto 100px;
    columns: 3 280px;
    column-gap: 18px;
  }

  .savedPostCard {
    width: 100%;
    display: inline-block;
    break-inside: avoid;
    margin: 0 0 18px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 28px;
    background: rgba(255,255,255,0.07);
    box-shadow: 0 24px 70px rgba(0,0,0,0.22);
  }

  .postImage {
    width: 100%;
    max-height: 360px;
    object-fit: cover;
    display: block;
  }

  .savedCardBody {
    padding: 18px;
  }

  .savedTopline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .savedTopline span {
    color: #00e8f0;
    font-size: 0.7rem;
    font-weight: 950;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .savedTopline strong {
    border-radius: 999px;
    background: rgba(0,232,240,0.12);
    color: #00e8f0;
    font-size: 0.68rem;
    font-weight: 950;
    padding: 5px 9px;
  }

  .savedPostCard h2 {
    margin: 12px 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.7rem;
    letter-spacing: -0.04em;
    line-height: 1.05;
  }

  .savedPostCard p {
    margin: 12px 0 0;
    color: rgba(255,255,255,0.68);
    line-height: 1.55;
    white-space: pre-wrap;
  }

  .authorLine {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
  }

  .authorLine img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
  }

  .authorLine strong {
    display: block;
    font-size: 0.86rem;
  }

  .authorLine span {
    display: block;
    margin-top: 3px;
    color: rgba(255,255,255,0.48);
    font-size: 0.74rem;
    font-weight: 800;
  }

  .boardSelectLabel {
    margin-top: 16px;
  }

  .cardActions {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 16px;
  }

  .cardActions a,
  .cardActions button {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.08);
    color: #ffffff;
    cursor: pointer;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 950;
    padding: 0 12px;
    text-decoration: none;
  }

  .cardActions button {
    color: #ff8f87;
  }

  .emptyState {
    display: inline-block;
    width: 100%;
    break-inside: avoid;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 28px;
    background: rgba(255,255,255,0.07);
    padding: 26px;
  }

  .emptyState h2 {
    margin: 12px 0 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2.2rem;
    letter-spacing: -0.05em;
  }

  .emptyState p:not(.eyebrow) {
    margin: 12px 0 0;
    color: rgba(255,255,255,0.68);
    line-height: 1.6;
  }

  .emptyState a {
    margin-top: 18px;
  }

  @media (max-width: 900px) {
    .savedDashboardPage {
      padding: 18px;
    }

    .dashboardHeader,
    .savedHero,
    .statusRow,
    .boardFilters,
    .savedGrid {
      width: 100%;
    }

    .dashboardHeader {
      align-items: flex-start;
      flex-direction: column;
    }

    nav {
      flex-wrap: wrap;
    }

    .savedHero {
      grid-template-columns: 1fr;
    }

    .savedGrid {
      columns: 1;
    }
  }
`;