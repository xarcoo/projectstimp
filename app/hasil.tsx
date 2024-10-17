import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "@rneui/base";
import { router } from "expo-router";
import { Component, ReactNode } from "react";
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
        try {
          //belum dibuat
        } catch (e) {
          console.error('Error setting highscore to AsyncStorage', e);
        }
    };

    componentDidMount(): void {
        this.cekStorage()
    }

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