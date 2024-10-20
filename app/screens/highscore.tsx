import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@rneui/base";
import { Component } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { SlideInDown, SlideInLeft, SlideInRight, SlideInUp } from "react-native-reanimated";

export default class Highscore extends Component {
  state = {
    highscore: [],
  };

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
    this.getHighscore();
  }

  render() {
    const images = [
      require('../../assets/images/top_1.png'),
      require('../../assets/images/top_2.png'),
      require('../../assets/images/top_3.png'),
    ];

    return (
      <View style={styles.container}>
        <Animated.Text style={styles.title} entering={SlideInUp.duration(1000)}>
          Highscore(s):
        </Animated.Text>
        {this.state.highscore.map((item, index) => (
          <Animated.View key={index} style={styles.card} entering={SlideInDown.duration(1000)}>
            <Animated.Image 
              source={images[index]} 
              style={styles.image} 
              entering={SlideInLeft.duration(1000)}
              resizeMode="contain" 
            />
            <Animated.Text style={styles.score} entering={SlideInRight.duration(1000)}>
              {item[0]}: {item[1]}
            </Animated.Text>
          </Animated.View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontFamily: 'verdana',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  score: {
    fontSize: 20,
    fontFamily: 'verdana',
  },
});
