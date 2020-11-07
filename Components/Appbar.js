import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Topbar() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>13033-SMS📨</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    height: 80,
    width:'100%',
    backgroundColor:'#006400'
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    color: "white",
    letterSpacing: 4,
    fontFamily: "Lobster",
    marginTop: 30,
  },
  trashIcon: {
    position: "absolute",
    right: 15,
    top: 40,
  },
});
