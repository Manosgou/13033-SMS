import React from "react";
import { View, Text, StyleSheet } from "react-native";

//Colors
import {Colors} from '../Colors';

export default function Topbar() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>13033-SMS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    height: 80,
    width:'100%',
    backgroundColor:Colors.PrimaryColor
  },
  title: {
    textAlign: "center",
    alignItems:'center',
    marginTop:20,
    fontSize: 40,
    fontFamily:'Oswald-Regular',
    color: Colors.white,
    letterSpacing: 4,
    
  },
  trashIcon: {
    position: "absolute",
    right: 15,
    top: 40,
  },
});
