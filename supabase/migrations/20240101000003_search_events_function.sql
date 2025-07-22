-- Create function for event search
CREATE OR REPLACE FUNCTION search_events(query TEXT)
RETURNS SETOF events AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM events
    WHERE
        title ILIKE '%' || query || '%'
        OR description ILIKE '%' || query || '%'
        OR location ILIKE '%' || query || '%'
    ORDER BY date;
END;
$$ LANGUAGE plpgsql;
