import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
  console.log('Fetching events from Supabase...');
  const { data, error } = await supabase
    .from('events')
    .select('*, category:categories(name)');

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
  console.log('Fetched events:', data);
  return data;
});

const initialState = {
  items: [
    {
      id: '1',
      title: 'Music Festival',
      date: '2023-07-15T18:00:00Z',
      location: 'Central Park',
      image_url: 'https://example.com/music-festival.jpg',
      category: { id: '1', name: 'Music' },
    },
    {
      id: '2',
      title: 'Tech Conference',
      date: '2023-07-20T09:00:00Z',
      location: 'Convention Center',
      image_url: 'https://example.com/tech-conference.jpg',
      category: { id: '2', name: 'Tech' },
    }
  ],
  status: 'idle',
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default eventsSlice.reducer;