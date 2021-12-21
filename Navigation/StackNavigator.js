import React from 'react';
import {StyleSheet} from 'react-native';
import LandingScreen from '../screens/LandingScreen';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import { AddChat } from '../screens/AddChat';
import color from '../constants/Colors';
import { createStackNavigator } from "@react-navigation/stack";
import { Dashboard } from '../screens/Dashboard';
import { ChatScreen } from '../screens/ChatScreen';
import { ImageScreen } from '../screens/ImageScreen';
import { DisplayPhotoScreen } from '../screens/DisplayPhotoScreen';

const AuthStackNavigator=()=>{
    const AuthStack = createStackNavigator();

    return(
        <AuthStack.Navigator initialRouteName="LandingScreen">
          <AuthStack.Screen
            name="LandingScreen"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <AuthStack.Screen
            name="Signup"
            component={Signup}
            options={{ title: "Sign up", headerTitleAlign: "center" }}
          />
          <AuthStack.Screen
            name="Login"
            component={Login}
            options={{ headerTitleAlign: "center" }}
          />
          <AuthStack.Screen name="Dashboard" component={Dashboard}/>
          <AuthStack.Screen name="AddChat" component={AddChat}/>
          <AuthStack.Screen name="ChatScreen" component={ChatScreen}/>
          <AuthStack.Screen name="ImageScreen" component={ImageScreen}/>
          <AuthStack.Screen name="DisplayPhotoScreen" component={DisplayPhotoScreen}/>

        </AuthStack.Navigator>
    );
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: color.primary,
    },
  });

export {AuthStackNavigator};