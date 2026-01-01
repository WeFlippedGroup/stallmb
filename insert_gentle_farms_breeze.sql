-- Insert the new horse 'Gentle Farm’s Breeze RC 1425'
insert into horses (name, breed, age, description, image_url, category, pedigree)
values (
  'Gentle Farm’s Breeze RC 1425',
  'Connemara',
  '2005',
  'RC 1425. Ett avelssto av högsta klass.',
  '/assets/horses/gentle-farms-breeze/1.jpg',
  'breeding',
  '{
    "sire": { "name": "Kulan Kavat RC 90", "id": "" },
    "dam": { "name": "", "id": "" },
    "damsire": { "name": "Myrens Wilbur RC 59", "id": "" }
  }'::jsonb
);
