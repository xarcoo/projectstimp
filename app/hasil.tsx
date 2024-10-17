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
          if (username !== null) {
            this.setState({username:username})
            if (score !== null) {
                this.setState({score:Number(score)})
            } else {
                this.setState({score:0})
            }
          } else {
            this.setState({username:''})
            if (score !== null) {
                this.setState({score:Number(score)})
            } else {
                this.setState({score:0})
            }
          }
        } catch (e) {
          console.error('Error reading username and score from AsyncStorage', e);
          this.setState({username:'', score:0})
        }
    };

    setHighscore = async () => {
      const { highscore, score } = this.state;

      const updatedScores = [...highscore, score].sort((a, b) => b - a).slice(0, 3);
  
      try {
        await AsyncStorage.setItem('highscore', JSON.stringify(updatedScores));
        this.setState({ highScores: updatedScores });
      } catch (error) {
        console.error('Error saving high scores:', error);
      }
    };

    getHighscore = async () => {
      try {
        const scores = await AsyncStorage.getItem('highscore');
        if (scores) {
          this.setState({ highScore: JSON.parse(scores) });
        }
      } catch (error) {
        console.error('Error loading high scores:', error);
      }
    };

    componentDidMount(): void {
        this.cekStorage()
        this.getHighscore()
        this.setHighscore()
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