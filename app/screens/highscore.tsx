import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@rneui/base";
import { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";

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
        <Animated.Text style={styles.title} entering={SlideInLeft.duration(1000)}>
          Highscore(s):
        </Animated.Text>
        {this.state.highscore.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image 
              source={images[index]} 
              style={styles.image} 
              resizeMode="contain" 
            />
            {/* <Animated.Text style={styles.score} entering={SlideInRight.duration(1000)}>
              {index + 1}. {item[0]}: {item[1]}
            </Animated.Text> */}
            <Animated.Text style={styles.score} entering={SlideInRight.duration(1000)}>
              {item[0]}: {item[1]}
            </Animated.Text>
          </View>
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
    backgroundColor: "#f0f0f0", // Light background color
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center vertically
    width: '90%', // Card width
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff", // Card background color
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3, // For Android shadow
  },
  image: {
    width: 40, // Adjust size as needed
    height: 40, // Adjust size as needed
    marginRight: 16, // Space between image and text
  },
  score: {
    fontSize: 20,
  },
});
