import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "@rneui/base";
import { router } from "expo-router";
import { Component } from "react";
import { View } from "react-native";

export default class Game extends Component {
  state = {
    score: 0,
    username: '',
    highscore: [],
  }

  cekStorage = async () => {
    try {
      const score = await AsyncStorage.getItem('score');
      const username = await AsyncStorage.getItem('username');
      if (username) {
        this.setState({username: username})
        if (score) {
            this.setState({score: Number(score)})
        } else {
            this.setState({score:0})
        }
      } else {
        this.setState({username:''})
        if (score) {
            this.setState({score:Number(score)})
        } else {
            this.setState({score:0})
        }
      }
      // this.getHighscore()
      this.setHighscore()
    } catch (e) {
      console.error('Error reading username and score from AsyncStorage', e);
      this.setState({username:'', score:0})
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
      this.setState({highscore: scores})
    } catch (error) {
      console.error('Error saving high scores:', error);
    }
  };

  // setHighscore = async () => {
  //   const { highscore, username, score } = this.state;

  //   const newHighscore = { username, score };

  //   const updatedScores = [...highscore, newHighscore].sort((a, b) => b.score - a.score).slice(0, 3);

  //   try {
  //     await AsyncStorage.setItem('highscore', JSON.stringify(updatedScores));
  //     this.setState({highscore: updatedScores})
  //   } catch (error) {
  //     console.error('Error saving high scores:', error);
  //   }
  // };

  // getHighscore = async () => {
  //   try {
  //     const highscore = await AsyncStorage.getItem('highscore');
  //     if (highscore) {
  //       this.setState({ highscore: JSON.parse(highscore) });
  //     }
  //     this.setHighscore()
  //   } catch (error) {
  //     console.error('Error loading high scores:', error);
  //   }
  // };

  componentDidMount(): void {
    this.cekStorage()
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>Congrats {this.state.username}! You have finished playing. Your score: {this.state.score}</Text>
        <Button title="Play Again" onPress={() => router.push('./grid')}></Button>
        <Button title="High Scores" onPress={() => router.push('/screens/highscore')}></Button>
        <Button title="Main Menu" onPress={() => router.push('/screens/')}></Button>
      </View>
    )
  }
}