
import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './features/events/eventsSlice';

export default configureStore({
  reducer: {
    events: eventsReducer,
  },
});
