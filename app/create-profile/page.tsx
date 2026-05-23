import Link from "next/link";

export const dynamic = "force-dynamic";

export default function CreateProfilePage() {
  return (
    <main className="stack">
      <section className="hero">
        <p className="eyebrow">Create profile</p>
        <h1 className="page-title">Let&apos;s build your creator presence.</h1>
        <p className="lede">
          Choose the profile path that fits where you are today. You can start
          free, build a deeper Impact Kit, or review upgrade options.
        </p>
      </section>

      <section className="grid" aria-label="Creator profile options">
        <article className="card stack">
          <div>
            <p className="eyebrow">Choice 01</p>
            <h2>Create a Free Creator Profile</h2>
            <p className="muted">
              Publish your story, audience basics, social links, featured work,
              and collaboration options.
            </p>
          </div>
          <Link className="button" href="/create-profile/free">
            Start Free Profile
          </Link>
        </article>

        <article className="card stack">
          <div>
            <p className="eyebrow">Choice 02</p>
            <h2>Build an Impact Kit</h2>
            <p className="muted">
              Add stronger partnership details, audience stats, a rate card,
              past collaborations, and packages.
            </p>
          </div>
          <Link className="button" href="/create-profile/impact-kit">
            Start Impact Kit
          </Link>
        </article>

        <article className="card stack">
          <div>
            <p className="eyebrow">Choice 03</p>
            <h2>Upgrade Your Profile</h2>
            <p className="muted">
              Explore upcoming profile upgrades for creators who want more
              visibility and collaboration tools.
            </p>
          </div>
          <Link className="button" href="/create-profile/upgrade">
            Explore Upgrade
          </Link>
        </article>
      </section>

      <section className="card stack">
        <div>
          <p className="eyebrow">Example</p>
          <h2>Want to see a finished profile first?</h2>
          <p className="muted">
            The Maya Rivera sample is only linked from this example action.
          </p>
        </div>
        <Link className="secondary-button" href="/creator/maya-rivera">
          View Example Profile
        </Link>
      </section>
    </main>
  );
}
