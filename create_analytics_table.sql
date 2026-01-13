create table if not exists visitor_stats (
  id uuid default gen_random_uuid() primary key,
  visited_at timestamptz default now() not null,
  path text,
  user_agent text
);

-- Give access to anon/public for inserting (via server action ideally, but RLS needed if client side. 
-- Since we use server action, we bypass RLS if using service role, or we rely on anon key.)
-- For this simple tracker, we'll allow insert for anon but RLS policies are good practice.

alter table visitor_stats enable row level security;

create policy "Allow anonymous inserts"
on visitor_stats for insert
to anon
with check (true);

create policy "Allow read for authenticated users only"
on visitor_stats for select
to authenticated
using (true);

-- Create index for faster date queries
create index idx_visitor_stats_visited_at on visitor_stats(visited_at);
