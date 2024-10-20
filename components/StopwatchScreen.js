import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function StopwatchScreen() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const startStopwatch = useCallback(() => {
    if (running) {
      clearInterval(intervalRef.current);
      setTime(0);
      setLaps([]);
      setRunning(false);
    } else {
      setRunning(true);
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    }
  }, [running, time]);

  const stopStopwatch = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const lapTime = useCallback(() => {
    setLaps((prevLaps) => [...prevLaps, time]);
  }, [time]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(time)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startStopwatch}>
          <Text style={styles.buttonText}>{running ? 'Reset' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={running ? stopStopwatch : lapTime}>
          <Text style={styles.buttonText}>{running ? 'Stop' : 'Lap'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={laps}
        renderItem={({ item, index }) => (
          <Text style={styles.lapText}>Lap {index + 1}: {formatTime(item)}</Text>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  timeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  lapText: {
    fontSize: 16,
    marginBottom: 5,
  },
});