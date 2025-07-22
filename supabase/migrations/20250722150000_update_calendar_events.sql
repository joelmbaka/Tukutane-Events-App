ALTER TABLE public.calendar_events
DROP COLUMN scheduled_date,
ADD COLUMN time_slot_id UUID REFERENCES public.time_slots(id);
