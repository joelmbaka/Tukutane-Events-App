import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Card, Badge, Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarSelector from '../app/components/CalendarSelector';
import { useAuth } from '../app/providers/AuthProvider';

const EventCard = ({ event }) => {
  const navigation = useNavigation();
  const { session } = useAuth();
  const user = session?.user;
  const [showNotification, setShowNotification] = useState(false);
  const [showCalendarSelector, setShowCalendarSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(event.date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    let timer;
    if (showNotification) {
      timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showNotification]);

  const handlePress = () => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  const addToCalendar = () => {
    setShowCalendarSelector(true);
  };

  const handleCalendarSelect = async (calendarId, slotId) => {
    console.log('Adding event to calendar', { calendarId, slotId });
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          event_id: event.id,
          calendar_id: calendarId,
          time_slot_id: slotId
        });

      if (error) {
        console.error('Error adding event to calendar:', error);
        throw error;
      }
      
      console.log('Event added to calendar successfully');
      setShowCalendarSelector(false);
      Alert.alert('Success', 'Event added to your calendar');
    } catch (error) {
      console.error('Failed to add event to calendar:', error);
      Alert.alert('Error', 'Failed to add event to calendar: ' + error.message);
    }
  };

  return (
    <View style={{ position: 'relative' }}>
      {showNotification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>RSVP confirmed!</Text>
        </View>
      )}
      <Card containerStyle={styles.card}>
        <TouchableOpacity onPress={handlePress} style={styles.touchableArea}>
          <Card.Image
            source={{ uri: event.image_url || 'https://via.placeholder.com/300?text=Event+Image' }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
            <View style={styles.details}>
              <Text style={styles.detailText}>{format(new Date(event.date), 'MMM dd, yyyy h:mm a')}</Text>
              <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Badge value={event.category?.name} status="primary" badgeStyle={styles.badge} />
          <View style={styles.buttonGroup}>
            <Button
              title="RSVP"
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
              onPress={() => {
                console.log('RSVP pressed');
                setShowNotification(true);
              }}
            />
            <TouchableOpacity 
              style={styles.calendarButton} 
              onPress={addToCalendar}
            >
              <Icon name="calendar-plus" type="font-awesome-5" size={20} color="white" />
            </TouchableOpacity>
            
            <CalendarSelector 
              visible={showCalendarSelector}
              onClose={() => setShowCalendarSelector(false)}
              onSelectCalendar={handleCalendarSelect}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    height: 160,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#388E3C',
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  calendarButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
  },
  notification: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  touchableArea: {
    flex: 1,
  },
});

export default EventCard;