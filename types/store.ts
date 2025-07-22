import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category_id: string;
  category: {
    name: string;
  };
  image_url: string;
}

export interface EventsState {
  items: Event[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface RootState {
  events: EventsState;
}

export interface AppStore extends RootState {
  events: EventsState;
}

import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;