import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useAuth } from '@/app/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

type CalendarEvent = {
  id: string;
  event_id: string;
  calendar_id: string;
  time_slot_id: string;
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    category_id: string | null;
    image_url: string;
  } | null;
  calendar: {
    name: string;
    color: string;
  } | null;
  time_slot: {
    start_time: string;
    end_time: string;
  } | null;
};

export default function CalendarScreen() {
  const { session } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (!session?.user) return;
    
    const fetchEvents = async () => {
      const { data: calendarEvents, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('Error fetching calendar events:', error);
        return;
      }

      const eventsWithDetails = await Promise.all(
        calendarEvents.map(async (event) => {
          const { data: eventData } = await supabase
            .from('events')
            .select('*')
            .eq('id', event.event_id)
            .single();
          
          const { data: calendarData } = await supabase
            .from('calendars')
            .select('name, color')
            .eq('id', event.calendar_id)
            .single();
          
          const { data: timeSlotData } = await supabase
            .from('time_slots')
            .select('start_time, end_time')
            .eq('id', event.time_slot_id)
            .single();
          
          return {
            ...event,
            event: eventData || null,
            calendar: calendarData || null,
            time_slot: timeSlotData || null
          };
        })
      );
      
      setEvents(eventsWithDetails);
    };
    
    fetchEvents();
  }, [session]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Calendar Events</Text>
      
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            {item.event?.image_url && (
              <Image 
                source={{ uri: item.event.image_url }} 
                style={styles.eventImage} 
              />
            )}
            
            <Text style={styles.eventTitle}>{item.event?.title}</Text>
            <Text style={styles.eventDescription}>{item.event?.description}</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Calendar:</Text>
              <Text style={styles.detailValue}>{item.calendar?.name}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>
                {item.time_slot ? 
                  `${new Date(item.time_slot.start_time).toLocaleString()} - 
                  ${new Date(item.time_slot.end_time).toLocaleString()}` : 
                  'No time slot'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{item.event?.location}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2d3748',
  },
  eventDescription: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#4a5568',
    width: 90,
  },
  detailValue: {
    flex: 1,
    color: '#2d3748',
  },
});
