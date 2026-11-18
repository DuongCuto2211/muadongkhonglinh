-- Chạy toàn bộ file này trong Supabase → SQL Editor → New query → Run
create table if not exists public.guestbook_entries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(btrim(name)) between 1 and 40),
  message    text not null check (char_length(btrim(message)) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table public.guestbook_entries enable row level security;

drop policy if exists "guestbook_select_public" on public.guestbook_entries;
drop policy if exists "guestbook_insert_public" on public.guestbook_entries;

create policy "guestbook_select_public" on public.guestbook_entries
  for select to anon, authenticated using (true);

create policy "guestbook_insert_public" on public.guestbook_entries
  for insert to anon, authenticated
  with check (char_length(btrim(name)) between 1 and 40 and char_length(btrim(message)) between 1 and 300);

-- Khách chỉ được đọc và thêm; không có quyền sửa/xóa
revoke all on public.guestbook_entries from anon, authenticated;
grant select, insert on public.guestbook_entries to anon, authenticated;

create index if not exists guestbook_entries_created_at_idx on public.guestbook_entries (created_at desc);
