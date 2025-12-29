-- Add pedigree column to horses table
alter table public.horses 
add column pedigree jsonb default '{}'::jsonb;
