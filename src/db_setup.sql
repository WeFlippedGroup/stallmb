-- Create the table for horses
create table public.horses (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  breed text default 'Connemara'::text,
  age text null,
  description text null,
  image_url text null,
  category text null, -- 'breeding', 'sale', 'youngster', 'retired'
  constraint horses_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.horses enable row level security;

-- Create policies

-- 1. Allow public read access to all horses
create policy "Enable read access for all users" on public.horses
  as permissive for select
  to public
  using (true);

-- 2. Allow authenticated users (Admin) to insert/update/delete
create policy "Enable insert for authenticated users only" on public.horses
  as permissive for insert
  to authenticated
  with check (true);

create policy "Enable update for authenticated users only" on public.horses
  as permissive for update
  to authenticated
  using (true)
  with check (true);

create policy "Enable delete for authenticated users only" on public.horses
  as permissive for delete
  to authenticated
  using (true);

-- Set up Storage Bucket for images
insert into storage.buckets (id, name, public)
values ('horse-images', 'horse-images', true);

-- Storage Policies
create policy "Give public access to horse-images" on storage.objects
  for select
  to public
  using (bucket_id = 'horse-images');

create policy "Enable upload for authenticated users" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'horse-images');
  
create policy "Enable update for authenticated users" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'horse-images');

create policy "Enable delete for authenticated users" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'horse-images');
