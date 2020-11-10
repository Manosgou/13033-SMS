import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { StyleSheet, Text, View } from "react-native";

//Components
import AppBar from "./Components/Appbar";
import Form from "./Components/Form";

//Colors
import { Colors } from "./Colors";

interface IState{
  fontsLoaded:boolean;
}

export default class App extends Component<IState> {
  state:IState={
    fontsLoaded:false,
  }
  getFonts = () =>
    Font.loadAsync({
      "Oswald-Regular": require("./assets/fonts/Oswald-Regular.ttf"),
    });

  render() {
    
      if (this.state.fontsLoaded) {
        return (
      <View style={styles.container}>
        <AppBar />
        <Form />
        <StatusBar style="auto" />
      </View>);}else{
        return(
          <AppLoading
          startAsync={this.getFonts}
          onFinish={() => {
            this.setState({ fontsLoaded: true });
          }}
        />
        );
        
      }
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BackgroundColor,
    alignItems: "center",
  },
});
