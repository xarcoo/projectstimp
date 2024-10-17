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
  onGameOver: () => void; // New prop to handle game over when pressing wrong box
}

const Grid: React.FC<GridProps> = ({ rows, columns, highlightedKotak, onLevelComplete, onGameOver }) => {
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
    }, 3000); // 3 seconds delay to hide pattern

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
      // If an incorrect box is clicked, end the game immediately
      setIncorrectKotak((prevKotak) => [...prevKotak, index]);
      onGameOver();
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
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    if (currentLevel < LEVELS.length) {
      const randomIndexes = generateRandomIndexes(LEVELS[currentLevel].rows * LEVELS[currentLevel].columns, 3 + currentLevel);
      setHighlightedKotak(randomIndexes);
      setTimeLeft(30);
      setTimerStarted(false);
    }
  }, [currentLevel]);

  useEffect(() => {
    if (timerStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, timerStarted, gameOver]);

  const generateRandomIndexes = (max: number, count: number) => {
    const indexes = new Set<number>();
    while (indexes.size < count) {
      indexes.add(Math.floor(Math.random() * max));
    }
    return Array.from(indexes);
  };

  const handleLevelComplete = () => {
    setScore((prevScore) => prevScore + 20);
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel((prevLevel) => prevLevel + 1); 
    } else {
      setGameOver(true); 
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  const handleShowResult = () => {
    setGameOver(true);
  };

  useEffect(() => {
    const patternTimer = setTimeout(() => {
      setTimerStarted(true);
    }, 3000);
    return () => clearTimeout(patternTimer);
  }, [highlightedKotak]);

  return (
    <View style={styles.appContainer}>
      {gameOver ? (
        <>
          <Text style={styles.finalText}>Game Over! Your final score is {score}</Text>
          <Button title="Hasil" onPress={handleShowResult} style={styles.resultButton} />
        </>
      ) : (
        <>
          <Text style={styles.scoreText}>Score: {score}</Text>
          {timerStarted && <Text style={styles.timerText}>Time Left: {timeLeft} seconds</Text>}
          <Grid
            rows={LEVELS[currentLevel].rows}
            columns={LEVELS[currentLevel].columns}
            highlightedKotak={highlightedKotak}
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
          />
        </>
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
  timerText: {
    fontSize: 18,
    marginBottom: 10,
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
  resultButton: {
    marginTop: 20,
  },
});

export default App;
