"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CreateBrandPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    brand_type: "",
    industry: "",
    location: "",
    short_description: "",
    long_description: "",
    mission: "",
    website_url: "",
    contact_email: "",
    looking_for: "",
    collaboration_types: "",
    budget_range: "",
    accent_name: "Ocean",
    accent_color: "#008C95",
    profile_style: "professional",
    is_published: true,
  });

  useEffect(() => {
    async function loadUser() {
      setCheckingUser(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data: existingProfile, error: profileError } = await supabase
        .from("brand_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        setError(profileError.message);
        setCheckingUser(false);
        return;
      }

      if (existingProfile) {
        router.push("/dashboard/brand");
        return;
      }

      setCheckingUser(false);
    }

    loadUser();
  }, [router]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setError("You must be logged in to create a brand profile.");
      return;
    }

    if (!form.company_name.trim()) {
      setError("Company name is required.");
      return;
    }

    setSaving(true);
    setError("");

    const slug = createSlug(form.company_name);

    if (!slug) {
      setError("Please enter a valid company name.");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from("brand_profiles").insert({
      user_id: user.id,
      slug,
      company_name: form.company_name.trim(),
      brand_type: form.brand_type.trim(),
      industry: form.industry.trim(),
      location: form.location.trim(),
      short_description: form.short_description.trim(),
      long_description: form.long_description.trim(),
      mission: form.mission.trim(),
      website_url: form.website_url.trim(),
      contact_email: form.contact_email.trim(),
      looking_for: form.looking_for.trim(),
      collaboration_types: form.collaboration_types.trim(),
      budget_range: form.budget_range.trim(),
      accent_name: form.accent_name,
      accent_color: form.accent_color,
      profile_style: form.profile_style,
      is_published: form.is_published,
    });

    if (insertError) {
      if (insertError.message.includes("brand_profiles_slug_key")) {
        setError(
          "That brand URL is already taken. Please slightly change the company name."
        );
      } else {
        setError(insertError.message);
      }

      setSaving(false);
      return;
    }

    router.push("/dashboard/brand");
  }

  if (checkingUser) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-slate-300">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Brand Profile
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Create your brand presence
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Build a professional brand profile for partnerships, creator
            collaborations, and Impact Exchange visibility.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
        >
          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Company name *
              </span>
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="Example: Ocean Impact Co."
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Brand type
              </span>
              <input
                name="brand_type"
                value={form.brand_type}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="Nonprofit, startup, agency, company"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Industry
              </span>
              <input
                name="industry"
                value={form.industry}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="Sustainability, wellness, education"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Location
              </span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="New York, NY"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Short description
              </span>
              <input
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="A short one-line summary of the brand."
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Mission
              </span>
              <textarea
                name="mission"
                value={form.mission}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="What does your brand stand for?"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Long description
              </span>
              <textarea
                name="long_description"
                value={form.long_description}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="Tell creators and partners more about the brand."
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Website URL
              </span>
              <input
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="https://example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Contact email
              </span>
              <input
                name="contact_email"
                type="email"
                value={form.contact_email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="partnerships@example.com"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Looking for
              </span>
              <textarea
                name="looking_for"
                value={form.looking_for}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="What kinds of creators, partners, or collaborations are you looking for?"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Collaboration types
              </span>
              <input
                name="collaboration_types"
                value={form.collaboration_types}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="Campaigns, events, content, partnerships"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Budget range
              </span>
              <input
                name="budget_range"
                value={form.budget_range}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
                placeholder="$500-$2,500, open, in-kind"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Accent color
              </span>
              <input
                name="accent_color"
                type="color"
                value={form.accent_color}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-900 px-2 py-2"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
              <input
                name="is_published"
                type="checkbox"
                checked={form.is_published}
                onChange={handleChange}
              />
              <span className="text-sm text-slate-200">
                Publish this brand profile
              </span>
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save brand profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}