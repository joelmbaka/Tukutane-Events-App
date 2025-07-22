-- Function to update event image URL
CREATE OR REPLACE FUNCTION update_event_image_url()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.image_url IS NULL THEN
        NEW.image_url := 'https://example.com/default-event-image.jpg';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set default image on event insert
CREATE TRIGGER set_default_event_image
BEFORE INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION update_event_image_url();
