"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ImpactHeaderBrand from "@/components/ImpactHeaderBrand";

const accentLogoImages = {
  "Electric Cyan": "/logo-colors/impact-logo-electric-cyan.png",
  Orange: "/logo-colors/impact-logo-orange.png",
  Pink: "/logo-colors/impact-logo-pink.png",
  Purple: "/logo-colors/impact-logo-purple.png",
  "Emerald Green": "/logo-colors/impact-logo-emerald-green.png",
  White: "/logo-colors/impact-logo-white.png",
};

export default function PublicBrandProfilePage() {
  const params = useParams();
  const slug = params?.slug;

  const [brand, setBrand] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBrandProfile() {
      if (!slug) return;

      setLoading(true);
      setError("");

      const { data, error: brandError } = await supabase
        .from("brand_profiles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (brandError) {
        setError(brandError.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setBrand(null);
        setLoading(false);
        return;
      }

      setBrand(data);

      const { data: postData, error: postError } = await supabase
        .from("impact_exchange_posts")
        .select("*")
        .eq("brand_slug", slug)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!postError) {
        setPosts(postData || []);
      }

      setLoading(false);
    }

    loadBrandProfile();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-300">Loading brand profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Brand profile not found</h1>
          <p className="mt-3 text-slate-300">
            This brand profile may be unpublished or unavailable.
          </p>
        </div>
      </main>
    );
  }

  const accentColor = brand.accent_color || "#22d3ee";
  const accentImage =
    accentLogoImages[brand.accent_name] ||
    "/logo-colors/impact-logo-electric-cyan.png";

  const socialUrl = formatExternalUrl(brand.social_url || "");
  const websiteUrl = formatExternalUrl(brand.website_url || "");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="brandProfileHeaderLogo">
          <ImpactHeaderBrand logoSize={44} compact />
        </div>

        <a
          href="/dashboard/brand"
          className="rounded-full px-5 py-2.5 text-xs font-black text-slate-950 transition hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          Edit Profile / Add More
        </a>
      </nav>

      <section className="w-full">
        <div
          className="relative min-h-[620px] w-full overflow-hidden border-y border-white/10 bg-slate-800 md:min-h-[700px]"
          style={{
            background: brand.banner_url
              ? `linear-gradient(rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.9)), url(${brand.banner_url}) center/cover`
              : `linear-gradient(135deg, ${accentColor}, #020617 58%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
              <div className="grid gap-24 lg:grid-cols-[420px_1fr] lg:items-center">
                <div className="relative h-96 w-full max-w-[420px] overflow-visible">
                  <div className="h-full w-full overflow-hidden rounded-[2.5rem] border-[8px] border-white bg-slate-950 shadow-[0_18px_44px_rgba(16,23,47,0.22),0_24px_70px_rgba(0,0,0,0.28)]">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={`${brand.company_name} brand photo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-950">
                        <span className="font-serif text-8xl font-black text-white">
                          {brand.company_name?.charAt(0) || "B"}
                        </span>
                      </div>
                    )}
                  </div>

                  <img
                    src={accentImage}
                    alt=""
                    className="absolute bottom-10 right-[-30px] h-20 w-20 rounded-full border-[6px] border-white bg-black object-cover shadow-2xl"
                  />
                </div>

                <div className="pb-4">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-cyan-200">
                    Brand Profile
                  </p>

                  <h1 className="max-w-5xl text-5xl font-black tracking-tight md:text-7xl lg:text-8xl">
                    {brand.company_name}
                  </h1>

                  <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-200 md:text-2xl md:leading-10">
                    {brand.short_description ||
                      "A brand building partnerships through Impact Creator Hub."}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {websiteUrl && (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                      >
                        Visit Website
                      </a>
                    )}

                    {brand.contact_email && (
                      <a
                        href={`mailto:${brand.contact_email}`}
                        className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-slate-950"
                      >
                        Contact Brand
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-slate-950/75 backdrop-blur">
              <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-3">
                <InfoCard label="Industry" value={brand.industry} />
                <InfoCard label="Brand Type" value={brand.brand_type} />
                <InfoCard label="Location" value={brand.location} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <ProfileSection title="Current Projects">
              <PlaceholderFeed
                items={[
                  {
                    title: "Featured campaign",
                    text: "A featured campaign or active initiative will appear here once the brand adds one.",
                  },
                  {
                    title: "Partnership priority",
                    text: "This space can highlight a current partnership goal or creator collaboration need.",
                  },
                  {
                    title: "Impact focus",
                    text: "Brands can use this area to show what impact area they are currently promoting.",
                  },
                ]}
              />
            </ProfileSection>

            <ProfileSection title="Impact Exchange Posts">
              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                        {post.category || "Post"}
                      </p>
                      <h3 className="mt-3 text-lg font-bold text-white">
                        {post.title}
                      </h3>
                      {post.body && (
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {post.body}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <PlaceholderFeed
                  items={[
                    {
                      title: "Upcoming opportunity",
                      text: "Brand opportunities posted to the Impact Exchange will appear here.",
                    },
                    {
                      title: "Creator call",
                      text: "Open calls for creators, collaborators, or ambassadors can be shown here.",
                    },
                    {
                      title: "Partnership update",
                      text: "Recent brand updates and collaboration notices can appear in this section.",
                    },
                  ]}
                />
              )}
            </ProfileSection>
          </div>

          <aside className="space-y-6">
            <ProfileSection title="Mission">
              <p className="leading-8 text-slate-300">
                {brand.mission ||
                  "This brand has not added a mission statement yet."}
              </p>
            </ProfileSection>

            <ProfileSection title="About the Brand">
              <p className="leading-8 text-slate-300">
                {brand.long_description ||
                  brand.short_description ||
                  "More details about this brand will appear here soon."}
              </p>
            </ProfileSection>

            <ProfileSection title="Brand Boards">
              <PlaceholderGrid
                items={[
                  {
                    title: "Campaign Board",
                    text: "Future campaign briefs, creator calls, and collaboration boards can live here.",
                  },
                  {
                    title: "Media Kit Board",
                    text: "Brand assets, press notes, and partnership materials can be organized here.",
                  },
                  {
                    title: "Impact Board",
                    text: "A place to feature social impact goals, reports, or community initiatives.",
                  },
                ]}
              />
            </ProfileSection>

            <ProfileSection title="Looking For">
              <p className="leading-8 text-slate-300">
                {brand.looking_for ||
                  "This brand has not listed current partnership goals yet."}
              </p>
            </ProfileSection>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold">Partnership Snapshot</h2>

              <div className="mt-6 space-y-5">
                <SnapshotItem
                  label="Collaboration Types"
                  value={brand.collaboration_types}
                />

                <SnapshotItem label="Budget Range" value={brand.budget_range} />

                <SnapshotItem
                  label="Contact"
                  value={brand.contact_email}
                  isEmail
                />

                <SnapshotItem label="Website" value={websiteUrl} isLink />

                <SnapshotItem
                  label={brand.social_platform || "Social"}
                  value={socialUrl}
                  isLink
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold">Campaign Readiness</h2>

              <div className="mt-5 space-y-4">
                <MiniStatus label="Brand profile" value="Live" />
                <MiniStatus label="Campaign board" value="Coming next" />
                <MiniStatus label="Impact posts" value="Ready to connect" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-bold">Profile Style</h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {brand.profile_style || "Professional"} brand profile with{" "}
                {brand.accent_name || "custom"} accent styling.
              </p>

              <div
                className="mt-5 h-3 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        .brandProfileHeaderLogo .impactHeaderBrand {
          gap: 10px !important;
        }

        .brandProfileHeaderLogo .impactHeaderBrand img {
          width: 44px !important;
          height: 44px !important;
        }

        .brandProfileHeaderLogo .impactHeaderBrand strong {
          font-size: 0.95rem !important;
          line-height: 1 !important;
          letter-spacing: -0.02em !important;
        }

        .brandProfileHeaderLogo .impactHeaderBrand span {
          margin-top: 5px !important;
          font-size: 0.42rem !important;
          letter-spacing: 0.2em !important;
        }

        @media (max-width: 700px) {
          .brandProfileHeaderLogo .impactHeaderBrand img {
            width: 38px !important;
            height: 38px !important;
          }

          .brandProfileHeaderLogo .impactHeaderBrand strong {
            font-size: 0.85rem !important;
          }

          .brandProfileHeaderLogo .impactHeaderBrand span {
            font-size: 0.36rem !important;
            letter-spacing: 0.16em !important;
          }
        }
      `}</style>
    </main>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="border-white/10 p-6 md:border-r last:border-r-0">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">
        {value || "Not listed"}
      </p>
    </div>
  );
}

function ProfileSection({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PlaceholderFeed({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-2xl border border-dashed border-white/15 bg-slate-900/70 p-5"
        >
          <p className="text-base font-bold text-white">{item.title}</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function PlaceholderGrid({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-1">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-dashed border-white/15 bg-slate-900/70 p-5"
        >
          <p className="text-sm font-bold text-white">{item.title}</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function SnapshotItem({ label, value, isEmail, isLink }) {
  if (!value) {
    return (
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-sm text-slate-400">Not listed</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      {isEmail ? (
        <a
          href={`mailto:${value}`}
          className="mt-1 block break-words text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          {value}
        </a>
      ) : isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block break-words text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-sm leading-6 text-slate-300">{value}</p>
      )}
    </div>
  );
}

function MiniStatus({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900 p-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-bold text-cyan-300">{value}</span>
    </div>
  );
}

function formatExternalUrl(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}