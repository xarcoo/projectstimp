import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from '@rneui/themed';

const LEVELS = [
  { rows: 3, columns: 3 }, // Level 1
  { rows: 4, columns: 3 }, // Level 2
  { rows: 5, columns: 3 }, // Level 3
  { rows: 6, columns: 3 }, // Level 4
  { rows: 7, columns: 3 }, // Level 5
];

interface GridProps {
  rows: number;
  columns: number;
  highlightedKotak: number[];
  onLevelComplete: () => void;
}

const Grid: React.FC<GridProps> = ({ rows, columns, highlightedKotak, onLevelComplete }) => {
  const [activeKotak, setActiveKotak] = useState<number[]>([]);
  const [incorrectKotak, setIncorrectKotak] = useState<number[]>([]);

  useEffect(() => {
    // Set the provided highlighted kotak as active
    setActiveKotak(highlightedKotak);
    setIncorrectKotak([]); // Reset incorrect kotak

    // Change color back after 3 seconds
    const timer = setTimeout(() => {
      setActiveKotak([]);
      setIncorrectKotak([]);
    }, 3000);

    // Cleanup timer on component unmount or when effect is rerun
    return () => clearTimeout(timer);
  }, [highlightedKotak]);

  const handleBoxPress = (index: number) => {
    if (highlightedKotak.includes(index)) {
      // If clicked box is supposed to be highlighted, add it to active kotak
      setActiveKotak((prevKotak) => [...prevKotak, index]);
      // Check if all correct boxes are clicked to complete level
      if (activeKotak.length + 1 === highlightedKotak.length) {
        onLevelComplete();
      }
    } else {
      // Otherwise, add to incorrect kotak to turn it red
      setIncorrectKotak((prevKotak) => [...prevKotak, index]);
    }
  };

  const containerWidth = columns * 60; // Dynamically adjust container width
  const containerHeight = rows * 60; // Dynamically adjust container height

  return (
    <View style={[styles.container, { width: containerWidth, height: containerHeight }]}>
      {Array.from({ length: rows * columns }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.box,
            {
              width: containerWidth / columns - 10,
              height: containerHeight / rows - 10,
              backgroundColor: activeKotak.includes(index)
                ? 'green' // Green if it's part of activeKotak
                : incorrectKotak.includes(index)
                ? 'red' // Red if it's an incorrect selection
                : 'gray', // Default color
            },
          ]}
        >
          <View style={styles.buttonContainer}>
            <Button
              size="lg"
              title=""
              onPress={() => handleBoxPress(index)}
              color="transparent"
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [highlightedKotak, setHighlightedKotak] = useState<number[]>([]);

  useEffect(() => {
    if (currentLevel < LEVELS.length) {
      // Dynamically increase the number of patterns (highlighted boxes) per level: 3 + currentLevel
      const randomIndexes = generateRandomIndexes(LEVELS[currentLevel].rows * LEVELS[currentLevel].columns, 3 + currentLevel);
      setHighlightedKotak(randomIndexes);
    }
  }, [currentLevel]);

  const generateRandomIndexes = (max: number, count: number) => {
    const indexes = new Set<number>();
    while (indexes.size < count) {
      indexes.add(Math.floor(Math.random() * max));
    }
    return Array.from(indexes);
  };

  const handleLevelComplete = () => {
    setScore((prevScore) => prevScore + 20); // Add score
    setCurrentLevel((prevLevel) => prevLevel + 1); // Move to next level
  };

  return (
    <View style={styles.appContainer}>
      <Text style={styles.scoreText}>Score: {score}</Text>
      {currentLevel < LEVELS.length ? (
        <Grid
          rows={LEVELS[currentLevel].rows}
          columns={LEVELS[currentLevel].columns}
          highlightedKotak={highlightedKotak}
          onLevelComplete={handleLevelComplete}
        />
      ) : (
        <Text style={styles.finalText}>Game Over! Your final score is {score}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
  },
  finalText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ADD8E6',
    padding: 5,
  },
  box: {
    margin: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default App;
