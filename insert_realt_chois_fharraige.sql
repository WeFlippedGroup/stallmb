-- Insert the new horse 'Realt Chois Fharraige'
insert into horses (name, breed, age, description, image_url, category, pedigree)
values (
  'Realt Chois Fharraige',
  'Connemara',
  '2013',
  'M1-372004000030876',
  '/assets/horses/realt-chois-fharraige/1.jpg',
  'breeding',
  '{
    "sire": { "name": "Teach Mor King", "id": "" },
    "dam": { "name": "", "id": "" },
    "damsire": { "name": "Smokey Finn", "id": "" }
  }'::jsonb
);
