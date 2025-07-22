import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/providers/AuthProvider';
import { format } from 'date-fns';

type Calendar = {
  id: string;
  name: string;
  color: string;
};

type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
};

type CalendarSelectorProps = {
  eventId: string;
  visible: boolean;
  onClose: () => void;
  onSelectCalendar: (calendarId: string, slotId: string) => void;
};

export default function CalendarSelector({ 
  eventId, 
  visible, 
  onClose,
  onSelectCalendar
}: CalendarSelectorProps) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCalendars();
      loadTimeSlots();
    }
  }, [visible]);

  const loadCalendars = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('calendars')
      .select('id, name, color')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error loading calendars:', error);
      return;
    }
    
    setCalendars(data || []);
  };

  const loadTimeSlots = async () => {
    const { data, error } = await supabase
      .from('time_slots')
      .select('id, start_time, end_time')
      .eq('is_available', true)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error loading time slots:', error);
      return;
    }
    
    setTimeSlots(data || []);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add to Calendar</Text>
          
          <Text style={styles.subtitle}>Select Time Slot:</Text>
          <Picker
            selectedValue={selectedSlot}
            onValueChange={(itemValue: string) => setSelectedSlot(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a time slot" value="" />
            {timeSlots.map(slot => (
              <Picker.Item 
                key={slot.id} 
                label={`${format(new Date(slot.start_time), 'EEE, MMM d - h:mm a')} to ${format(new Date(slot.end_time), 'h:mm a')}`} 
                value={slot.id} 
              />
            ))}
          </Picker>
          
          <Text style={styles.subtitle}>Select Calendar:</Text>
          <FlatList
            data={calendars}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.calendarItem, 
                  selectedCalendar === item.id && styles.selectedCalendar
                ]}
                onPress={() => setSelectedCalendar(item.id)}
              >
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addButton, (!selectedCalendar || selectedSlot === '') && styles.disabledButton]} 
              onPress={() => {
                if (selectedCalendar && selectedSlot !== '') {
                  onSelectCalendar(selectedCalendar, selectedSlot);
                }
              }}
              disabled={!selectedCalendar || selectedSlot === '' || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Adding...' : 'Add to Calendar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  picker: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCalendar: {
    backgroundColor: '#e6f7ff',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});