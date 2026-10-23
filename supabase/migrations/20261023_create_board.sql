-- Run this migration in Supabase SQL Editor. Never expose the service_role key in the site.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.board_posts (
  id uuid primary key default gen_random_uuid(),
  board text not null check (board in ('notice','resource')),
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 20000),
  external_url text check (external_url is null or external_url ~* '^https?://'),
  is_published boolean not null default true,
  author_id uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists board_posts_public_list_idx on public.board_posts(board, is_published, created_at desc);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id) values (new.id) on conflict (id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists board_posts_updated_at on public.board_posts;
create trigger board_posts_updated_at before update on public.board_posts for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.board_posts enable row level security;
drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select to authenticated using (id=auth.uid());
drop policy if exists "admin reads profiles" on public.profiles;
create policy "admin reads profiles" on public.profiles for select to authenticated using (public.is_admin());
drop policy if exists "published board posts are public" on public.board_posts;
create policy "published board posts are public" on public.board_posts for select to anon, authenticated using (is_published or public.is_admin());
drop policy if exists "admin creates board posts" on public.board_posts;
create policy "admin creates board posts" on public.board_posts for insert to authenticated with check (public.is_admin());
drop policy if exists "admin updates board posts" on public.board_posts;
create policy "admin updates board posts" on public.board_posts for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin deletes board posts" on public.board_posts;
create policy "admin deletes board posts" on public.board_posts for delete to authenticated using (public.is_admin());
