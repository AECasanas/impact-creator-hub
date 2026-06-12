import { supabase } from "@/lib/supabaseClient";

const SITE_URL = "https://impact-creator-hub.vercel.app";

function getAbsoluteImageUrl(imageUrl) {
  if (!imageUrl) {
    return `${SITE_URL}/logo-ripple.png`;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${SITE_URL}${imageUrl}`;
  }

  return `${SITE_URL}/${imageUrl}`;
}

function cleanDescription(value) {
  if (!value) {
    return "Discover creator and brand opportunities on Impact Creator Hub.";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, 180);
}

async function getPost(id) {
  const { data } = await supabase
    .from("impact_exchange_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.id);

  const title = post?.title
    ? `${post.title} | Impact Creator Hub`
    : "Impact Creator Hub Post";

  const description = cleanDescription(post?.body);
  const imageUrl = getAbsoluteImageUrl(post?.image_url);
  const postUrl = `${SITE_URL}/impact-exchange/post/${params.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: "Impact Creator Hub",
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post?.title || "Impact Creator Hub post",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharedImpactPostPage({ params }) {
  const post = await getPost(params.id);

  const imageUrl = getAbsoluteImageUrl(post?.image_url);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#10141c",
        color: "#eef3f7",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        padding: 24,
      }}
    >
      <section
        style={{
          width: "min(720px, 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 24,
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
          boxShadow: "0 28px 90px rgba(0,0,0,0.42)",
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={post?.title || "Impact Creator Hub post"}
            style={{
              width: "100%",
              maxHeight: 420,
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        <div style={{ padding: 28 }}>
          <p
            style={{
              margin: "0 0 10px",
              color: "#00e8f0",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Impact Creator Hub
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
            }}
          >
            {post?.title || "Impact Exchange Post"}
          </h1>

          {post?.body && (
            <p
              style={{
                margin: "14px 0 0",
                color: "rgba(238,243,247,0.72)",
                fontSize: 17,
                lineHeight: 1.55,
              }}
            >
              {post.body}
            </p>
          )}

          <a
            href="/impact-exchange"
            style={{
              minHeight: 44,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 22,
              borderRadius: 999,
              background: "#00e8f0",
              color: "#020617",
              fontSize: 14,
              fontWeight: 900,
              padding: "0 18px",
              textDecoration: "none",
            }}
          >
            View on Impact Exchange
          </a>
        </div>
      </section>
    </main>
  );
}