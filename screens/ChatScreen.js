import React, { useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import color from "../constants/Colors";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import InputText from "../components/InputText";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  FlatList,
} from "react-native";
import { authentication, db } from "../Firebase";
import firebase from "firebase";
// import {PlaySound} from 'react-native-play-sound';
// import sound from '../assets/message_sent_sound.mp3';
import { Audio } from "expo-av";

const ChatScreen = ({ route, navigation }) => {
  const [message, SetMessage] = useState("");
  const [msgData, SetMsgData] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection(authentication.currentUser.uid)
      .doc("data")
      .collection(route.params.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        SetMsgData(
          snapshot.docs.map((doc) => {
            return doc.data();
          })
        );
      });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.name,
      headerTitleAlign: "left",
      headerStyle: {
        backgroundColor: color.primary,
        height: 55,
      },

      headerTitleStyle: {
        color: "whitesmoke",
        fontSize: 25,
        marginLeft: 35,
      },

      headerLeft: () => (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon name="chevron-left" size={25}></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={() => {
                navigation.navigate("DisplayPhotoScreen", {
                  imageurl: route.params.imageurl,
                  name: route.params.name,
                });
              }}
            >
              <View style={{ marginLeft: 17 }}>
                <Avatar
                  rounded
                  source={{ uri: route.params.imageurl }}
                ></Avatar>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ),
    });
  }, [navigation]);

  const sendMessage = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/message_sent_sound.mp3")
      );
      SetMessage("");
      await sound.playAsync();
      await db
        .collection(authentication.currentUser.uid)
        .doc("data")
        .collection(route.params.uid)
        .add({
          uid: authentication.currentUser.uid,
          message: message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setTimeout(async ()=>{await sound.unloadAsync();});
      await db
        .collection(route.params.uid)
        .doc("data")
        .collection(authentication.currentUser.uid)
        .add({
          uid: authentication.currentUser.uid,
          message: message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.chats}>
            <FlatList
              inverted={true}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              data={msgData}
              renderItem={(itemData) => {
                return (
                  <View
                    style={
                      itemData.item.uid === authentication.currentUser.uid
                        ? styles.selfChatBox
                        : styles.otherChatBox
                    }
                  >
                    <Text style={{ color: "whitesmoke" }}>
                      {itemData.item.message}
                    </Text>
                  </View>
                );
              }}
            ></FlatList>
          </View>
          <View style={styles.footer}>
            <InputText
              style={{
                width: 325,
                marginRight: 10,
                borderRadius: 50,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              value={message}
              onChangeText={(text) => {
                SetMessage(text);
              }}
            ></InputText>
            <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
              <Icon
                name="arrow-alt-circle-right"
                solid
                size={35}
                color={color.primary}
              ></Icon>
            </TouchableOpacity>
          </View>

          <StatusBar backgroundColor={color.primary}></StatusBar>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    height: "100%",
  },
  chats: {
    flex: 1,
    backgroundColor: color.darkTheme,
  },
  selfChatBox: {
    backgroundColor: color.primary,
    maxWidth: "80%",
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    marginVertical: 6,
    marginHorizontal: 6,
  },
  otherChatBox: {
    backgroundColor: "darkslategray",
    maxWidth: "80%",
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    marginVertical: 6,
    marginHorizontal: 6,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexBasis: 70,
    backgroundColor: color.darkTheme,
  },
});
export { ChatScreen };
