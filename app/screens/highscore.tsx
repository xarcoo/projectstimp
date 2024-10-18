import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "@rneui/base";
import { Component, ReactNode } from "react";
import { FlatList, View } from "react-native";

export default class Highscore extends Component {
  state = {
    highscore: [],
  }

  getHighscore = async () => {
    try {
      const scores = await AsyncStorage.getItem('highscore');
      if (scores !== null) {
        this.setState({ highscore: JSON.parse(scores) });
      }
    } catch (error) {
      console.error('Error loading high scores:', error);
      }
  };

  componentDidMount(): void {
    this.getHighscore()
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>Highscore(s):</Text>
        {this.state.highscore.map((item, index) => (
            <View key={index}>
                <Text>{index + 1}. {item[0]}: {item[1]}</Text>
            </View>
        ))}
      </View>
    )
  }
}