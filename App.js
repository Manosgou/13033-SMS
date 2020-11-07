import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';


//Components
import AppBar from './Components/Appbar.js';
import Form from './Components/Form.js';

export default class App extends Component {

  render() {
    return (
      <View style={styles.container}>
        <AppBar/>
        <Form/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
