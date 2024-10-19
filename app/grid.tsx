import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const levels = [
  { rows: 3, columns: 3 },
  { rows: 4, columns: 3 },
  { rows: 5, columns: 3 },
  { rows: 6, columns: 3 },
  { rows: 7, columns: 3 },
];

let totalScore = 0;

interface GridProps {
  rows: number;
  columns: number;
  highlightedKotak: number[];
  onLevelComplete: () => void;
  onGameOver: () => void;
  canPress: boolean;
}

const Grid: React.FC<GridProps> = ({ rows, columns, highlightedKotak, onLevelComplete, onGameOver, canPress }) => {
  const [activeKotak, setActiveKotak] = useState<number[]>([]);
  const [incorrectKotak, setIncorrectKotak] = useState<number[]>([]);

  useEffect(() => {
    setActiveKotak(highlightedKotak);
    setIncorrectKotak([]);

    const timer = setTimeout(() => {
      setActiveKotak([]);
      setIncorrectKotak([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [highlightedKotak]);

  const handleBoxPress = (index: number) => {
    if (!canPress || activeKotak.includes(index)) return;

    if (highlightedKotak.includes(index)) {
      setActiveKotak((prevKotak) => [...prevKotak, index]);

      if (activeKotak.length + 1 === highlightedKotak.length) {
        onLevelComplete();
      }
    } else {
      setIncorrectKotak((prevKotak) => [...prevKotak, index]);
      onGameOver();
    }
  };

  const containerWidth = columns * 60;
  const containerHeight = rows * 60;

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
                ? 'green'
                : incorrectKotak.includes(index)
                  ? 'red'
                  : 'gray',
            },
          ]}
        >
          <View style={styles.buttonContainer}>
            <Button size="lg" title="" onPress={() => handleBoxPress(index)} color="transparent" />
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
  const [canPress, setCanPress] = useState(false);

  useEffect(() => {
    if (currentLevel < levels.length) {
      const randomIndexes = generateRandomIndexes(levels[currentLevel].rows * levels[currentLevel].columns, 3 + currentLevel);
      setHighlightedKotak(randomIndexes);
      setTimeLeft(30);
      setTimerStarted(false);
      setCanPress(false);
    }
  }, [currentLevel]);

  useEffect(() => {
    if (timerStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0) {
      setGameOver(true);
      setScoreLocal();
      navigateToResults();
    }
  }, [timeLeft, timerStarted, gameOver]);

  const generateRandomIndexes = (max: number, count: number) => {
    const indexes = new Set<number>();
    while (indexes.size < count) {
      indexes.add(Math.floor(Math.random() * max));
    }
    return Array.from(indexes);
  };

  const setScoreLocal = async () => {
    try {
      await AsyncStorage.setItem('score', totalScore.toString());
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handleLevelComplete = async () => {
    if (currentLevel === 0) {
      totalScore = 0;
    }
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((prevLevel) => {
        const newLevel = prevLevel + 1;

        if (newLevel === levels.length) {
          setScore(100);
        } else {
          setScore((prevScore) => prevScore + 20);
        }
        return newLevel;
      });
    } else {
      setGameOver(true);
      setScore(100);
      await setScoreLocal();
      navigateToResults();
    }

    console.log("HandleLvl" + currentLevel);

    totalScore += 20;
    await setScoreLocal();

    console.log("HandleLevelComplete" + score);
    console.log("HandleLevelComplete TOTAL: " + totalScore);
  };

  const handleGameOver = async () => {
    setGameOver(true);
    await setScoreLocal();
    navigateToResults();
  };

  const navigateToResults = async () => {
    await setScoreLocal();
    console.log("NavigateLvl" + currentLevel);
    console.log("Navigate" + score);
    router.replace({ pathname: '/hasil', params: { totalScore } });
    totalScore = 0
  };

  useEffect(() => {
    const patternTimer = setTimeout(() => {
      setTimerStarted(true);
      setCanPress(true);
    }, 3000);
    return () => clearTimeout(patternTimer);
  }, [highlightedKotak]);

  return (
    <View style={styles.appContainer}>
      {!gameOver ? (
        <>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.levelText}>Level: {currentLevel + 1}</Text>
          {timerStarted && <Text style={styles.timerText}>Time Left: {timeLeft} seconds</Text>}
          <Grid
            rows={levels[currentLevel].rows}
            columns={levels[currentLevel].columns}
            highlightedKotak={highlightedKotak}
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
            canPress={canPress}
          />
        </>
      ) : (
        <Text style={styles.finalText}>Final Score: {score}</Text>
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
    marginBottom: 10,
  },
  levelText: {
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
});

export default App;
