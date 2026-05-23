import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <p className="eyebrow">Impact Creator Hub</p>
        <h1>Build creator profiles that brands can understand quickly.</h1>
        <p>
          A simple home for creators to share their story, audience highlights,
          and collaboration opportunities.
        </p>
        <Link className="primary-link" href="/creator-profile">
          View Creator Profile
        </Link>
      </section>
    </main>
  );
}
