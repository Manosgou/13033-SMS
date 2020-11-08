import React, { Component } from 'react';
import { SafeAreaView, StyleSheet,View } from 'react-native';


//Components
import AppBar from './Components/Appbar.js';
import Form from './Components/Form.js';

//Colors
import {Colors} from './Colors';

export default class App extends Component {

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <AppBar/>
        <Form/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.BackgroundColor,
    alignItems: 'center',
  },
});
