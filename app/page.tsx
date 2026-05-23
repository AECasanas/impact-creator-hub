import Link from "next/link";

export default function HomePage() {
  return (
    <main className="hero">
      <p className="eyebrow">Creator operating system</p>
      <h1>Turn measurable impact into brand-ready creator profiles.</h1>
      <p className="lede">
        Impact Creator Hub helps mission-led creators publish a polished profile,
        share proof of audience trust, and receive qualified brand inquiries.
      </p>
      <div className="actions">
        <Link className="button" href="/onboarding/creator">
          Build your creator profile
        </Link>
        <Link className="secondary-button" href="/dashboard">
          Open dashboard
        </Link>
      </div>
      <section className="grid" aria-label="Platform highlights">
        <article className="card">
          <h2>Creator profiles</h2>
          <p className="muted">
            Publish a focused media kit with your niche, impact statement,
            audience size, links, and contact path.
          </p>
        </article>
        <article className="card">
          <h2>Brand inquiries</h2>
          <p className="muted">
            Let mission-aligned partners submit campaign ideas directly from
            your public creator page.
          </p>
        </article>
        <article className="card">
          <h2>Supabase powered</h2>
          <p className="muted">
            Row Level Security keeps creators in control while published
            profiles stay discoverable.
          </p>
        </article>
      </section>
    </main>
  );
}
