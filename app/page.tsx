export default function Home() {
  return (
    <main className="min-h-screen bg-[#05090b] text-white">
      <section className="relative min-h-screen overflow-hidden">
        {/* Background image */}
        <div className= "pointer-events-none absolute inset-x-0 bottom-0 top-[128px] bg-[url('/impact-hero-background.png')] bg-cover bg-center"/>

        {/* Dark overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[128px] bg-black/25" />

        {/* Page content */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-8 py-8">
          {/* Header */}
          <header className="relative z-20 flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <img
                src="/logo-ripple.png"
                alt="Impact Creator Hub logo"
                className="h-16 w-16 object-contain"
              />

              <div>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  Impact Creator Hub
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.42em]">
                  <span className="text-white/65">Build your brand. </span>
                  <span className="text-[#f28c82]">Grow your impact.</span>
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-10 text-base font-medium text-white/85 md:flex">
              <NavLink href="/features">Features</NavLink>
<NavLink href="/for-creators">For Creators</NavLink>
<NavLink href="/for-brands">For Brands</NavLink>
<NavLink href="/about-us">About Us</NavLink>
<NavLink href="/login">Login</NavLink>

              <a
                href="/signup/creator"
                className="rounded-md bg-cyan-300 px-8 py-4 font-semibold text-black shadow-[0_0_24px_rgba(103,232,249,0.20)] transition hover:bg-cyan-200"
              >
                Get Started
              </a>
            </nav>
          </header>

          {/* Hero */}
          <div className="flex flex-1 items-center">
            <div className="max-w-3xl">
              <h1 className="text-6xl font-bold leading-[1.12] tracking-tight md:text-7xl">
                Build your
                <br />
                <span className="text-cyan-300">creator brand</span>
                <br />
                in{" "}
                <span className="relative inline-block">
                  one
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-[#f28c82]" />
                </span>{" "}
                place.
              </h1>

              <p className="mt-10 max-w-2xl text-xl leading-9 text-white/82">
                Impact Creator Hub helps influencers create a polished profile,
                share an Impact Kit, receive brand inquiries, and grow their
                personal brand beyond social media.
              </p>

              <div className="mt-10 flex flex-col gap-5 sm:flex-row">
                <a
  href="/features"
  className="rounded-md border border-cyan-300 px-10 py-5 text-center text-lg font-semibold text-white transition hover:border-[#f28c82]"
>
  Explore the Hub
</a>

                <a
                  href="/creator-profile"
                  className="rounded-md border border-cyan-300 px-10 py-5 text-center text-lg font-semibold text-white transition hover:border-[#f28c82]"
                >
                  View Example Profile
                </a>
              </div>

              <div className="mt-12 flex items-center gap-4 text-lg text-white/65">
                <span className="text-[#f28c82]">
                  <ShieldIcon />
                </span>
                <p>Start building your creator brand today.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group relative inline-flex pb-4 transition hover:text-white"
    >
      {children}
      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#f28c82] transition-all duration-200 group-hover:w-full" />
    </a>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}



