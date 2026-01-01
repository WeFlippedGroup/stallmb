-- Insert the new stallion 'Show-La-Pan'

insert into horses (name, breed, age, description, image_url, category, pedigree)
values (
  'Show-La-Pan',
  'Connemara',
  '2014',
  'S1-372004100016430. Imp Irland. Vår fina avelshingst.',
  '/assets/horses/show-la-pan/1.jpg',
  'stallion',
  '{
    "sire": { "name": "Westside Mirah", "id": "" },
    "dam": { "name": "", "id": "" },
    "damsire": { "name": "Shadow’s Dun", "id": "" }
  }'::jsonb
);
