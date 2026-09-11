-- ============================================================
-- Portfolio like counter — Supabase schema
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run)
--
-- Uses the SAME Supabase project as the blog (see
-- ../muniraj-blog/schema.sql) — if you already ran that file,
-- this part of it was already included, no need to run again.
-- ============================================================

create table if not exists portfolio_likes (
  id smallint primary key default 1,
  like_count integer not null default 0,
  constraint single_row check (id = 1)
);

insert into portfolio_likes (id, like_count) values (1, 0)
  on conflict (id) do nothing;

alter table portfolio_likes enable row level security;

create policy "public read portfolio likes" on portfolio_likes
  for select using (true);

create or replace function increment_portfolio_like()
returns integer
language sql
security definer
set search_path = public
as $$
  update portfolio_likes set like_count = like_count + 1 where id = 1
  returning like_count;
$$;

grant execute on function increment_portfolio_like() to anon;
