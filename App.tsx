import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


//Components
import AppBar from './Components/Appbar';
import Form from './Components/Form';


//Colors
import {Colors} from './Colors';

export default function App() {
  return (
    <View style={styles.container}>
      
      <AppBar/>
      <Form/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.BackgroundColor,
    alignItems: 'center',
  },
});
