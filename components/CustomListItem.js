import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import color from "../constants/Colors";
import { authentication, db } from "../Firebase";
import firebase from "firebase";
import { Audio } from "expo-av";


const CustomListItem = (props) => {
  const [lastMsg, SetLastMsg] = useState([]);
  const [count, SetCount] = useState(-2);

  useEffect(() => {
    if (props.uid !== "") {
      const unsubscribe = db
        .collection(authentication.currentUser.uid)
        .doc("data")
        .collection(props.uid)
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          SetLastMsg(
            snapshot.docs.map((doc) => {
              return doc.data();
            })
          );
        });

      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    if (props.uid !== "") {
      if (props.navigation.isFocused() == true) {
        SetCount((count) => count + 1);
        if(count>=0){
        (async()=>{const { sound } = await Audio.Sound.createAsync(
          require("../assets/message_popup_sound.wav")
        );
        await sound.playAsync();
        setTimeout(async()=>{await sound.unloadAsync();},500);
        })();
      }
      }

      const unsubscribe = async () =>
        await db
          .collection(authentication.currentUser.uid)
          .doc("data")
          .collection("friends")
          .doc(props.uid)
          .set(
            {
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
    }
  }, [lastMsg]);

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        props.navigation.navigate("ChatScreen", {
          name: props.name,
          imageurl: props.url,
          uid: props.uid,
        });
        SetCount(0);
      }}
    >
      <ListItem bottomDivider containerStyle={styles.listItem}>
        <Avatar rounded source={{ uri: props.url }}></Avatar>
        <ListItem.Content>
          <ListItem.Title
            style={{ color: count > 0 ? "darkseagreen" : color.primary }}
          >
            {props.name}
          </ListItem.Title>
          <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail' style={{ color: "grey" }}>
            {lastMsg[0]?.message || ""}
          </ListItem.Subtitle>
        </ListItem.Content>
        {count > 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "green",
              borderRadius: 100,
              padding: 3,
              width: 25,
              height: 25,
            }}
          >
            <Text style={{ color: "darkseagreen" }}>{count}</Text>
          </View>
        ) : null}
      </ListItem>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "transparent",
  },
});

export { CustomListItem };
