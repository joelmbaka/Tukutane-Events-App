-- Insert sample events for the user
INSERT INTO events (
  title,
  description,
  location,
  date,
  category_id,
  image_url
) VALUES
(
  'Tech Conference',
  'Annual technology conference featuring the latest trends and innovations.',
  'Convention Center, Nairobi',
  '2025-08-01 09:00:00+03',
  (SELECT id FROM categories WHERE name = 'Technology'),
  'https://oqdmvh61m9qj3x98.public.blob.vercel-storage.com/networking.jpeg'
),
(
  'Music Festival',
  'Live music performances by local and international artists.',
  'Central Park',
  '2025-08-05 18:00:00+03',
  (SELECT id FROM categories WHERE name = 'Entertainment'),
  'https://oqdmvh61m9qj3x98.public.blob.vercel-storage.com/music.jpg'
),
(
  'Health Expo',
  'Exhibition of health products and wellness services.',
  'Expo Center',
  '2025-08-10 10:00:00+03',
  (SELECT id FROM categories WHERE name = 'Health & Wellness'),
  'https://oqdmvh61m9qj3x98.public.blob.vercel-storage.com/health-expo.jpeg'
),
(
  'Business Networking',
  'Professional networking event for entrepreneurs and business leaders.',
  'Business Hub',
  '2025-08-15 14:00:00+03',
  (SELECT id FROM categories WHERE name = 'Business'),
  'https://oqdmvh61m9qj3x98.public.blob.vercel-storage.com/networking.jpeg'
);

-- Insert RSVPs for the user
INSERT INTO rsvps (
  user_id,
  event_id,
  status
) VALUES
(
  '1b40257b-e098-4375-8d81-7b6aff2f81a4',
  (SELECT id FROM events WHERE title = 'Tech Conference'),
  'going'
),
(
  '1b40257b-e098-4375-8d81-7b6aff2f81a4',
  (SELECT id FROM events WHERE title = 'Music Festival'),
  'maybe'
),
(
  '1b40257b-e098-4375-8d81-7b6aff2f81a4',
  (SELECT id FROM events WHERE title = 'Health Expo'),
  'going'
),
(
  '1b40257b-e098-4375-8d81-7b6aff2f81a4',
  (SELECT id FROM events WHERE title = 'Business Networking'),
  'going'
);
