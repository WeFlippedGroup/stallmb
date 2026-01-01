-- Insert the new horse 'Dunguaire Aisling'
insert into horses (name, breed, age, description, image_url, category, pedigree)
values (
  'Dunguaire Aisling',
  'Connemara',
  '2010',
  'M1-372004000025423. Imp Irland.',
  '/assets/horses/dunguaire-aisling/1.jpg',
  'breeding',
  '{
    "sire": { "name": "", "id": "" },
    "dam": { "name": "Currachmore Cashel", "id": "" },
    "damsire": { "name": "Kylemore Rocky", "id": "" }
  }'::jsonb
);
