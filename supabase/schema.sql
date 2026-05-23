create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'creator' check (role in ('creator', 'brand', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  display_name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  headline text,
  bio text,
  niche text,
  location text,
  website_url text,
  profile_image_url text,
  cover_image_url text,
  impact_statement text,
  audience_size integer not null default 0 check (audience_size >= 0),
  rate_card_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_social_links (
  id uuid primary key default gen_random_uuid(),
  creator_profile_id uuid not null references public.creator_profiles(id) on delete cascade,
  platform text not null,
  url text not null,
  follower_count integer not null default 0 check (follower_count >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brand_inquiries (
  id uuid primary key default gen_random_uuid(),
  creator_profile_id uuid not null references public.creator_profiles(id) on delete cascade,
  brand_name text not null,
  contact_name text not null,
  email text not null,
  campaign_goal text,
  budget_range text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_profiles_slug_idx on public.creator_profiles(slug);
create index if not exists creator_profiles_published_idx on public.creator_profiles(is_published);
create index if not exists creator_social_links_profile_idx on public.creator_social_links(creator_profile_id);
create index if not exists brand_inquiries_profile_idx on public.brand_inquiries(creator_profile_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_creator_profiles_updated_at on public.creator_profiles;
create trigger set_creator_profiles_updated_at
before update on public.creator_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_creator_social_links_updated_at on public.creator_social_links;
create trigger set_creator_social_links_updated_at
before update on public.creator_social_links
for each row execute function public.set_updated_at();

drop trigger if exists set_brand_inquiries_updated_at on public.brand_inquiries;
create trigger set_brand_inquiries_updated_at
before update on public.brand_inquiries
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.creator_social_links enable row level security;
alter table public.brand_inquiries enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can create their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can delete their own profile"
on public.profiles for delete
to authenticated
using (auth.uid() = id);

create policy "Published creator profiles are public"
on public.creator_profiles for select
to public
using (is_published = true or auth.uid() = user_id);

create policy "Creators can create their own creator profile"
on public.creator_profiles for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Creators can update their own creator profile"
on public.creator_profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Creators can delete their own creator profile"
on public.creator_profiles for delete
to authenticated
using (auth.uid() = user_id);

create policy "Published creator social links are public"
on public.creator_social_links for select
to public
using (
  exists (
    select 1
    from public.creator_profiles
    where creator_profiles.id = creator_social_links.creator_profile_id
      and (creator_profiles.is_published = true or creator_profiles.user_id = auth.uid())
  )
);

create policy "Creators can create their own social links"
on public.creator_social_links for insert
to authenticated
with check (
  exists (
    select 1
    from public.creator_profiles
    where creator_profiles.id = creator_social_links.creator_profile_id
      and creator_profiles.user_id = auth.uid()
  )
);

create policy "Creators can update their own social links"
on public.creator_social_links for update
to authenticated
using (
  exists (
    select 1
    from public.creator_profiles
    where creator_profiles.id = creator_social_links.creator_profile_id
      and creator_profiles.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.creator_profiles
    where creator_profiles.id = creator_social_links.creator_profile_id
      and creator_profiles.user_id = auth.uid()
  )
);

create policy "Creators can delete their own social links"
on public.creator_social_links for delete
to authenticated
using (
  exists (
    select 1
    from public.creator_profiles
    where creator_profiles.id = creator_social_links.creator_profile_id
      and creator_profiles.user_id = auth.uid()
  )
);

create policy "Anyone can submit inquiries for published creators"
on public.brand_inquiries for insert
to public
with check (
  exists (
    select 1
    from public.creator_profiles
    where creator_profiles.id = brand_inquiries.creator_profile_id
      and creator_profiles.is_published = true
  )
);

create policy "Creators can read their own brand inquiries"
on public.brand_inquiries for select
to authenticated
using (
  exists (
    select 1
    from public.creator_profiles
    where creator_profiles.id = brand_inquiries.creator_profile_id
      and creator_profiles.user_id = auth.uid()
  )
);

create policy "Creators can update their own brand inquiries"
on public.brand_inquiries for update
to authenticated
using (
  exists (
    select 1
    from public.creator_profiles
    where creator_profiles.id = brand_inquiries.creator_profile_id
      and creator_profiles.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.creator_profiles
    where creator_profiles.id = brand_inquiries.creator_profile_id
      and creator_profiles.user_id = auth.uid()
  )
);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select on public.creator_profiles to anon, authenticated;
grant insert, update, delete on public.creator_profiles to authenticated;
grant select on public.creator_social_links to anon, authenticated;
grant insert, update, delete on public.creator_social_links to authenticated;
grant insert on public.brand_inquiries to anon, authenticated;
grant select, update on public.brand_inquiries to authenticated;
