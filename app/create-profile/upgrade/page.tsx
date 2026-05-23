import Link from "next/link";

export default function UpgradeProfilePage() {
  return (
    <main className="hero">
      <p className="eyebrow">Upgrade your profile</p>
      <h1 className="page-title">Profile upgrades are coming soon.</h1>
      <p className="lede">
        Start with a free creator profile now, or return to the profile options
        page to choose another path.
      </p>
      <div className="actions">
        <Link className="secondary-button" href="/create-profile">
          Back to create profile
        </Link>
        <Link className="button" href="/create-profile/free">
          Start Free Profile
        </Link>
      </div>
    </main>
  );
}
