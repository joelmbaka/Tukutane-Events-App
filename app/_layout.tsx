import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ThemeProvider } from '@rneui/themed';
import theme from '../theme';
import { Provider } from 'react-redux';
import store from '../store';
import { AuthProvider } from './providers/AuthProvider';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    if (session && !inTabsGroup) {
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup) {
      router.replace('/auth/sign-in');
    }
  }, [session, isLoading, segments]);

  // Create a client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable automatic refetching on window focus
        refetchOnWindowFocus: false,
        // Time in milliseconds after which the data will be considered stale
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Time in milliseconds before inactive queries are garbage collected
        gcTime: 60 * 60 * 1000, // 1 hour
        // Retry failed queries once
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
