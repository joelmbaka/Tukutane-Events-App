-- Create time_slots table
CREATE TABLE public.time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.time_slots IS 'Stores available time slots for events';

-- Generate initial slots for next 7 days (3-hour intervals)
INSERT INTO public.time_slots (start_time, end_time)
SELECT
  generate_series(
    NOW(),
    NOW() + INTERVAL '7 days',
    INTERVAL '3 hours'
  ) AS start_time,
  generate_series(
    NOW() + INTERVAL '3 hours',
    NOW() + INTERVAL '7 days 3 hours',
    INTERVAL '3 hours'
  ) AS end_time;
