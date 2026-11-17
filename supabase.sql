-- THƯ MỜI ONLINE: SUPABASE GUESTBOOK
-- Chạy toàn bộ file này trong Supabase Dashboard > SQL Editor.
-- Bảng cho phép khách ẩn danh đọc và thêm lời nhắn. Không mở quyền UPDATE / DELETE.

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null
    check (char_length(btrim(name)) between 1 and 60),
  message text not null
    check (char_length(btrim(message)) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.guestbook_entries enable row level security;

create index if not exists guestbook_entries_created_at_idx
  on public.guestbook_entries (created_at desc);

-- Cấp quyền tối thiểu cho role công khai của Supabase.
grant usage on schema public to anon, authenticated;
revoke all on table public.guestbook_entries from anon, authenticated;
grant select on table public.guestbook_entries to anon, authenticated;
grant insert (name, message) on table public.guestbook_entries to anon, authenticated;

-- Xóa policy cùng tên nếu chạy lại script để tránh trùng lặp.
drop policy if exists "Anyone can read guestbook entries" on public.guestbook_entries;
drop policy if exists "Anyone can add guestbook entries" on public.guestbook_entries;

create policy "Anyone can read guestbook entries"
on public.guestbook_entries
for select
to anon, authenticated
using (true);

create policy "Anyone can add guestbook entries"
on public.guestbook_entries
for insert
to anon, authenticated
with check (
  char_length(btrim(name)) between 1 and 60
  and char_length(btrim(message)) between 1 and 1000
);

-- Không tạo policy UPDATE hoặc DELETE và cũng không cấp các quyền này cho anon/authenticated.
