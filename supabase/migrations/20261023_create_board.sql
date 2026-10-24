-- Apply in Supabase SQL Editor or with the Supabase migration tool.
-- The browser only receives a publishable key. Do not use a service_role key here.
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
create or replace function public.set_board_post_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at=now(); return new; end;
$$;
drop trigger if exists board_posts_updated_at on public.board_posts;
create trigger board_posts_updated_at before update on public.board_posts for each row execute procedure public.set_board_post_updated_at();

alter table public.board_posts enable row level security;
grant usage on schema public to anon, authenticated;
grant select on public.board_posts to anon, authenticated;
grant insert, update, delete on public.board_posts to authenticated;

-- Admin authorization comes from app_metadata, which users cannot edit themselves.
-- After setting it, the administrator must sign out and sign in again to refresh the JWT.
drop policy if exists "published board posts are public" on public.board_posts;
create policy "published board posts are public" on public.board_posts for select to anon, authenticated
  using (is_published or (select auth.jwt()->'app_metadata'->>'board_role') = 'admin');
drop policy if exists "admin creates board posts" on public.board_posts;
create policy "admin creates board posts" on public.board_posts for insert to authenticated
  with check ((select auth.jwt()->'app_metadata'->>'board_role') = 'admin');
drop policy if exists "admin updates board posts" on public.board_posts;
create policy "admin updates board posts" on public.board_posts for update to authenticated
  using ((select auth.jwt()->'app_metadata'->>'board_role') = 'admin')
  with check ((select auth.jwt()->'app_metadata'->>'board_role') = 'admin');
drop policy if exists "admin deletes board posts" on public.board_posts;
create policy "admin deletes board posts" on public.board_posts for delete to authenticated
  using ((select auth.jwt()->'app_metadata'->>'board_role') = 'admin');
