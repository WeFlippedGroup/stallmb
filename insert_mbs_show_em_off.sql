-- Insert the new horse 'MB’s Show Em Off' (Sessan)

insert into horses (name, breed, age, description, image_url, category, pedigree)
values (
  'MB’s Show Em Off',
  'Connemara',
  '2020',
  '”Sessan”. M1-752033033207559.',
  '/assets/horses/mbs-show-em-off/1.jpg',
  'loaned',
  '{
    "sire": { "name": "Show-La-Pan", "id": "" },
    "dam": { "name": "", "id": "" },
    "damsire": { "name": "Robe Earl", "id": "" }
  }'::jsonb
);
