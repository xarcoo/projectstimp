import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@rneui/base";
import { Component, ReactNode } from "react";
import { FlatList, View } from "react-native";

export default class Highscore extends Component {
    state = {
        highscore: [],
    }

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

    render() {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>High Scores:</Text>
                <FlatList
                data={this.state.highscore}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <Text>{`${index + 1}. ${item}`}</Text>
                )}
                />
            </View>
        )
    }
}