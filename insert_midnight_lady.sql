-- Insert the new horse 'Midnight Lady'
insert into horses (name, breed, age, description, image_url, category, pedigree)
values (
  'Midnight Lady',
  'Connemara',
  '2012',
  'Imp Irland. M1-372004000032411',
  '/assets/horses/midnight-lady/1.jpg',
  'breeding',
  '{
    "sire": { "name": "Ballinavilla Prince", "id": "" },
    "dam": { "name": "", "id": "" },
    "damsire": { "name": "Callowfeenish Buachaill", "id": "" }
  }'::jsonb
);
