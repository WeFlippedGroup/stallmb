-- Insert the stallion 'Gräns Diamond Surf'

insert into horses (name, breed, age, description, image_url, category, pedigree)
values (
  'Gräns Diamond Surf',
  'Connemara',
  '2002',
  'RC 100. En fantastisk hingst med fina meriter.',
  '/assets/horses/grans-diamond-surf/1.jpg',
  'stallion',
  '{
    "sire": { "name": "Gräns Ruben RC 67", "id": "" },
    "dam": { "name": "", "id": "" },
    "damsire": { "name": "Hagens Jaguar RC 58", "id": "" }
  }'::jsonb
);
