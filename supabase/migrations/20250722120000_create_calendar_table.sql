CREATE TABLE public.calendar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, event_id)  -- Prevent duplicate entries
);

COMMENT ON TABLE public.calendar IS 'Tracks events users have added to their personal calendars';

-- File: supabase/migrations/20250722120001_create_calendars_table.sql
CREATE TABLE public.calendars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.calendars IS 'Stores user calendars';

-- File: supabase/migrations/20250722120002_create_calendar_events_table.sql
CREATE TABLE public.calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMPTZ NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.calendar_events IS 'Stores events added to user calendars';