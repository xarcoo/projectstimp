import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "@rneui/base";
import { router } from "expo-router";
import { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";

export default class Hasil extends Component {
  state = {
    score: 0,
    username: '',
    highscore: [],
  }

  cekStorage = async () => {
    try {
      const score = await AsyncStorage.getItem('score');
      const username = await AsyncStorage.getItem('username');
      this.setState({ username: username || '', score: score ? Number(score) : 0 });
      this.setHighscore();
    } catch (e) {
      console.error('Error reading username and score from AsyncStorage', e);
      this.setState({ username: '', score: 0 });
    }
  };

  setHighscore = async () => {
    try {
      const highscore = await AsyncStorage.getItem('highscore');
      let scores = highscore ? JSON.parse(highscore) : [];
      scores.push([this.state.username, this.state.score]);
      scores.sort((a, b) => b[1] - a[1]);
      scores = scores.slice(0, 3);
      await AsyncStorage.setItem('highscore', JSON.stringify(scores));
      this.setState({ highscore: scores });
    } catch (error) {
      console.error('Error saving high scores:', error);
    }
  };

  componentDidMount() {
    this.cekStorage();
  };

  renderHighScores = () => {
    return (
      <FlatList
        data={this.state.highscore}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.highscoreText}>
            {item[0]}: {item[1]}
          </Text>
        )}
        style={styles.highscoreList}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.congratulationsText}>
          Congrats {this.state.username}! You have finished playing. Your score: {this.state.score}
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Play Again" 
            onPress={() => router.replace('/grid')}
            containerStyle={styles.button}
          />
          <Button 
            title="High Scores" 
            onPress={() => router.replace('/screens/highscore')}
            containerStyle={styles.button}
          />
          <Button 
            title="Main Menu" 
            onPress={() => router.replace('/screens')}
            containerStyle={styles.button}
          />
        </View>

        {/* {this.state.highscore.length > 0 && (
          <View style={styles.highscoreContainer}>
            <Text style={styles.highscoreTitle}>High Scores:</Text>
            {this.renderHighScores()}
          </View>
        )} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  congratulationsText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: "#343a40",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    width: 200,
  },
  highscoreContainer: {
    marginTop: 20,
    width: '100%',
  },
  highscoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  highscoreList: {
    maxHeight: 150,
    width: '100%',
  },
  highscoreText: {
    fontSize: 16,
    color: "#495057",
  },
});
