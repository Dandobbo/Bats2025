
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  events: '@events',
  info: '@info',
};

export default function App() {
  const [events, setEvents] = useState([]);
  const [info, setInfo] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [newInfo, setNewInfo] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const storedEvents = await AsyncStorage.getItem(STORAGE_KEYS.events);
      const storedInfo = await AsyncStorage.getItem(STORAGE_KEYS.info);
      if (storedEvents) setEvents(JSON.parse(storedEvents));
      if (storedInfo) setInfo(storedInfo);
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.info, info);
  }, [info]);

  const handleAddEvent = () => {
    if (newEvent) {
      setEvents([...events, newEvent]);
      setNewEvent('');
    }
  };

  const handleDeleteEvent = (index) => {
    const updated = [...events];
    updated.splice(index, 1);
    setEvents(updated);
  };

  const handleSaveInfo = () => {
    if (newInfo) {
      setInfo(newInfo);
      setNewInfo('');
    }
  };

  const checkCode = () => {
    if (codeInput === 'bats2025') {
      setIsTeacher(true);
      setCodeInput('');
    } else {
      Alert.alert('Access Denied', 'Incorrect code');
    }
  };

  const renderWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <Text key={i} style={styles.link} onPress={() => Linking.openURL(part)}>
          {part}
        </Text>
      ) : (
        <Text key={i}>{part}</Text>
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Bats Footy Program</Text>

      {!isTeacher && (
        <View style={styles.section}>
          <TextInput
            placeholder="Teacher access code"
            value={codeInput}
            onChangeText={setCodeInput}
            style={styles.input}
          />
          <Button title="Enter" onPress={checkCode} />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.subheading}>Upcoming Events</Text>
        {events.map((event, i) => (
          <View key={i} style={styles.eventItem}>
            <Text>{renderWithLinks(event)}</Text>
            {isTeacher && <Button title="❌" onPress={() => handleDeleteEvent(i)} />}
          </View>
        ))}
        {isTeacher && (
          <>
            <TextInput
              placeholder="New event"
              value={newEvent}
              onChangeText={setNewEvent}
              style={styles.input}
            />
            <Button title="Add Event" onPress={handleAddEvent} />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Important Information</Text>
        <Text>{renderWithLinks(info)}</Text>
        {isTeacher && (
          <>
            <TextInput
              placeholder="New information"
              value={newInfo}
              onChangeText={setNewInfo}
              style={styles.input}
            />
            <Button title="Update Info" onPress={handleSaveInfo} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subheading: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  section: { marginBottom: 20 },
  input: { borderColor: '#ccc', borderWidth: 1, padding: 10, marginVertical: 5 },
  eventItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  link: { color: 'blue', textDecorationLine: 'underline' }
});
