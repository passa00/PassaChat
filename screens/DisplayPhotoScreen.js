import React, { useLayoutEffect } from "react";
import color from "../constants/Colors";
import { View, Text, StyleSheet, Image } from "react-native";

const DisplayPhotoScreen = ({ route, navigation }) => {
    
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.name,
      headerStyle: {
        backgroundColor: color.primary,
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: route.params.imageurl }}
        style={{ width: "100%", height: "100%", resizeMode: "contain" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.darkTheme,
    flex: 1,
  },
});

export { DisplayPhotoScreen };
