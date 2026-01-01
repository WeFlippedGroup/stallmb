-- Insert the new horse 'F.L.S Poetic Sydney'
insert into horses (name, breed, age, description, image_url, category, pedigree)
values (
  'F.L.S Poetic Sydney',
  'Connemara',
  '2015',
  'M1-372004000032587',
  '/assets/horses/fls-poetic-sydney/1.jpg',
  'breeding',
  '{
    "sire": { "name": "Poetic Kelly", "id": "" },
    "dam": { "name": "", "id": "" },
    "damsire": { "name": "Gerryhinch Millrace", "id": "" }
  }'::jsonb
);
