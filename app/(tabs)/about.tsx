import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Tukutane Events App</Text>
      <Text style={styles.description}>
        Tukutane Events App is a platform designed to help you discover and manage local events in your community.
        Whether you're interested in music festivals, tech conferences, networking events, or health expos, 
        Tukutane provides a seamless way to find and organize your calendar.
      </Text>
      <Text style={styles.description}>
        Features include:
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>• Browse events by category</Text>
        <Text style={styles.listItem}>• Add events to your personal calendar</Text>
        <Text style={styles.listItem}>• View event details including location, time, and description</Text>
        <Text style={styles.listItem}>• Filter events based on your interests</Text>
      </View>
      <Text style={styles.description}>
        Built with React Native and Supabase, Tukutane Events App offers a smooth and responsive experience 
        across iOS, Android, and web platforms.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  list: {
    marginLeft: 20,
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 24,
  },
});
