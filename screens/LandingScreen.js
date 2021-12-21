import "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import color from "../constants/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";


const LandingScreen = ({ navigation }) => {
  const [btnvisibility, Setbtnvisibility] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const shift = useRef(new Animated.Value(330)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isLoggedIn,SetisLoggedIn] = useState('true');

  useEffect(() => {

    getUser();
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }).start();
    }, 100);

    setTimeout(() => {
      Animated.timing(shift, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 900);

    setTimeout(() => {
      Setbtnvisibility(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 1900);

    // if(isLoggedIn==="true"){
    //   setTimeout(()=>{
    //     navigation.navigate('Dashboard');
    //   },2200);
    // }
  }, []);

  const getUser =async()=>{
    try{
    await AsyncStorage.getItem('isLoggedIn').then((value)=>{
      if(value==="true"){
        setTimeout(()=>{
          navigation.replace("Dashboard");
        },2200);
      }
      else{
        SetisLoggedIn('false');
      }
    });
  }
  catch(error){
    alert(error);
  }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={color.primary} />
      <Animated.View style={{ translateY: shift, opacity: fadeAnim }}>
        <Text style={styles.heading}>Passa chat</Text>
      </Animated.View>
      <Animated.View
        style={{ opacity: opacity, marginTop: "auto", marginBottom: "auto" }}
      >
        <Icon size={80} name="sms" color="white"></Icon>
      </Animated.View>

      {btnvisibility && (isLoggedIn==="false") ? (
        <>
          <TouchableOpacity
            style={{ ...styles.btns, marginTop: "auto" }}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Signup")}
          >
            <Animated.View style={{ opacity: opacity }}>
              <Text style={{ fontSize: 20, color: "white" }}>Sign up</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{ ...styles.btns, marginTop: 20, marginBottom: 10 }}
            onPress={() => navigation.navigate("Login")}
          >
            <Animated.View style={{ opacity: opacity }}>
              <Text style={{ fontSize: 20, color: "white" }}>Login</Text>
            </Animated.View>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "column",
    padding: 10,
    alignItems: "center",
    backgroundColor: color.primary,
    height: "100%",
    justifyContent: "center",
  },

  heading: {
    //   position:'absolute',
    fontSize: 50,
    fontWeight: "bold",
    marginTop: Platform.os === "android" ? 0 : StatusBar.currentHeight,
    color: "white",
  },

  btns: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: 50,
    backgroundColor: "rgba(0,0,0,0.67)",
    borderRadius: 10,
  },
});

export default LandingScreen;
