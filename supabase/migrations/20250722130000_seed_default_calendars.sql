-- Create a function to add default calendars for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default calendars for the new user
  INSERT INTO public.calendars (user_id, name, color)
  VALUES 
    (NEW.id, 'Personal', '#3b82f6'),  -- Blue
    (NEW.id, 'Work', '#ef4444'),      -- Red
    (NEW.id, 'Family', '#10b981'),    -- Green
    (NEW.id, 'Hobbies', '#8b5cf6'),   -- Purple
    (NEW.id, 'Health', '#ec4899');    -- Pink
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that runs when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a comment to explain the function
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates default calendars for a new user';

-- Insert default calendars for any existing users who don't have any calendars yet
DO $$
BEGIN
  INSERT INTO public.calendars (user_id, name, color)
  SELECT 
    id, 
    name, 
    color
  FROM (
    VALUES 
      ('Personal', '#3b82f6'),
      ('Work', '#ef4444'),
      ('Family', '#10b981'),
      ('Hobbies', '#8b5cf6'),
      ('Health', '#ec4899')
  ) AS defaults(name, color)
  CROSS JOIN auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM public.calendars c WHERE c.user_id = u.id
  );
END $$;