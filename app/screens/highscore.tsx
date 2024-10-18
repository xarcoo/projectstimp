import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@rneui/base";
import { Component } from "react";
import { View } from "react-native";
import Animated, { SlideInDown, SlideInLeft, SlideInRight, SlideOutDown } from "react-native-reanimated";

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
        <Animated.Text style={{fontSize: 30 }} entering={SlideInLeft.duration(1000)}>Highscore(s):</Animated.Text>
        {this.state.highscore.map((item, index) => (
            <View key={index}>
                <Animated.Text style={{fontSize: 20 }} entering={SlideInRight.duration(1000)}>{index + 1}. {item[0]}: {item[1]}</Animated.Text>
            </View>
        ))}
      </View>
    )
  }
}