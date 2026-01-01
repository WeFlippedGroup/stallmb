-- Insert the new horse 'Robe Emily'
-- Note: 'loaned' category support might need to be added to DB check constraints if any exists.
-- Assuming standard text column for category.

insert into horses (name, breed, age, description, image_url, category, pedigree)
values (
  'Robe Emily',
  'Connemara',
  '2016',
  'M1-372004000033440. Imp Irland. Tävlas främst i fälttävlan.',
  '/assets/horses/robe-emily/1.jpg',
  'loaned',
  '{
    "sire": { "name": "Robe Earl", "id": "" },
    "dam": { "name": "", "id": "" },
    "damsire": { "name": "Templebready Bo’Sun", "id": "" }
  }'::jsonb
);
