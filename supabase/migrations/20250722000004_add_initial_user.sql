-- Insert the initial user into the users table
INSERT INTO users (id, email, created_at)
VALUES (
  '1b40257b-e098-4375-8d81-7b6aff2f81a4',
  'user@gmail.com',
  '2025-07-22 09:01:01.32486+00'
)
ON CONFLICT (id) DO NOTHING;
