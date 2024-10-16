import { Text } from "@rneui/base";
import { Component, ReactNode } from "react";
import { View } from "react-native";

export default class Game extends Component {
    state = {

    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>Ini Game</Text>
            </View>
        )
    }
}