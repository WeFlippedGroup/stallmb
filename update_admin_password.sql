-- Uppdatera lösenordet för användaren info@stallmb.com
-- Nytt lösenord: hastannons.se

-- Se till att pgcrypto tillägget är aktiverat (behövs för lösenordskryptering)
create extension if not exists pgcrypto;

-- Uppdatera lösenordet i auth.users tabellen
UPDATE auth.users
SET encrypted_password = crypt('hastannons.se', gen_salt('bf')),
    updated_at = now()
WHERE email = 'info@stallmb.com';
