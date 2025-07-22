-- Seed initial event categories
INSERT INTO categories (id, name)
VALUES
    (gen_random_uuid(), 'Music'),
    (gen_random_uuid(), 'Sports'),
    (gen_random_uuid(), 'Technology'),
    (gen_random_uuid(), 'Food & Drink'),
    (gen_random_uuid(), 'Arts & Culture'),
    (gen_random_uuid(), 'Networking'),
    (gen_random_uuid(), 'Health & Wellness'),
    (gen_random_uuid(), 'Education')
ON CONFLICT (name) DO NOTHING;
