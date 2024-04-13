import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';

const StopwatchApp: React.FC = () => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [lapStartTime, setLapStartTime] = useState(0);
  const [savedTimes, setSavedTimes] = useState<number[]>([]);

  let interval: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (isActive) {
      interval = setInterval(() => {
        setMilliseconds(prevMilliseconds => prevMilliseconds + 100);
      }, 100);
    } else if (!isActive && milliseconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, milliseconds]);

  const handleStartStop = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setLapStartTime(Date.now() - milliseconds);
    }
  };

  const handleLapReset = () => {
    if (isActive) {
      const lapTime = Date.now() - lapStartTime;
      setSavedTimes([...savedTimes, lapTime]);
      setLapStartTime(Date.now());
    } else {
      setMilliseconds(0);
      setSavedTimes([]);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setMilliseconds(0);
    setSavedTimes([]);
  };

  const formatTime = (time: number) => {
    return (
      ('0' + Math.floor(time / 60000)).slice(-2) + ':' +
      ('0' + Math.floor((time / 1000) % 60)).slice(-2) + ',' +
      ('0' + Math.floor((time / 10) % 100)).slice(-2)
    );
  };

  const renderSavedTime = ({ item, index }: { item: number; index: number }) => {
    const sortedTimes = [...savedTimes].sort((a, b) => a - b);
    const minTime = sortedTimes[0]; 
    const maxTime = sortedTimes[sortedTimes.length - 1]; 

    let textColor = 'white'; 

    if (item === minTime) {
      textColor = 'green'; 
    } else if (item === maxTime) {
      textColor = 'red'; 
    }

    return (
      <View style={styles.savedTimeItem}>
        <Text style={[styles.savedTimeText, { color: textColor }]}>
          Lap {index + 1}:                                                        {formatTime(item)}
        </Text>
      </View>
    );
  };

  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(milliseconds)}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLapReset}>
            <Text style={styles.buttonText}>{isActive ? 'Lap' : 'Reset'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: isActive ? '#fb7676' : '#32cd32' }]}
            onPress={handleStartStop}>
            <Text style={[styles.buttonText, { color: isActive ? '#ff0000' : '#00ff00' }]}>
              {isActive ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.savedTimesContainer}>
          <FlatList
            data={savedTimes}
            renderItem={renderSavedTime}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </View>
  );
};

const buttonSize = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    marginTop: 250,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 90,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 70,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  savedTimesContainer: {
    flex: 1,
    width: '100%',
  },
  savedTimeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  savedTimeText: {
    fontSize: 18,
    color: 'white',
  },
});

export default StopwatchApp;
