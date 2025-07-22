import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Pressable, Image, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { useWindowDimensions } from 'react-native';
import EventCard from '../../components/EventCard';
import { fetchEvents } from '../../features/events/eventsSlice';
import { useAppDispatch, useAppSelector } from '../../types/store';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  name: string;
}

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.events.items);
  const status = useAppSelector((state) => state.events.status);
  const error = useAppSelector((state) => state.events.error);
  const { width } = useWindowDimensions();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: categoryCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ['categoryCounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('category_id');
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach(event => {
        if (event.category_id) {
          counts[event.category_id] = (counts[event.category_id] || 0) + 1;
        }
      });
      return counts;
    },
  });

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const filteredEvents = events.filter(event => selectedCategories.length === 0 || selectedCategories.includes(event.category_id));

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      
      {/* Filter Button */}
      <Pressable
        style={styles.filterButton}
        onPress={() => setShowFilterModal(true)}
      >
        <Text style={styles.filterButtonText}>Filter by Category</Text>
      </Pressable>
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Categories</Text>
            <ScrollView>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.checkboxContainer}
                  onPress={() => toggleCategory(category.id)}
                >
                  <View style={styles.checkbox}>
                    {selectedCategories.includes(category.id) && <View style={styles.checkboxInner} />}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    {category.name} ({categoryCounts[category.id] || 0})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {width >= 768 ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.gridContainer}>
            {filteredEvents.map((item, index) => (
              <View key={item.id} style={styles.gridItem}>
                <EventCard event={item} />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    width: '100%',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    width: '100%',
    textAlign: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
    textAlign: 'center',
    width: '100%',
  },
  list: {
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 20, // Add some padding at the bottom
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
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
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#007AFF',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
