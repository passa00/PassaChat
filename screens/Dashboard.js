import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import { Avatar, Card, ListItem } from "react-native-elements";
import color from "../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome5";
import { CustomListItem } from "../components/CustomListItem";
import Dialog from "react-native-dialog";
import { useSelector, useDispatch } from "react-redux";
import {
  loadDialog,
  loadSpinner,
  unloadDialog,
  unloadSpinner,
} from "../actions";
import { Loader } from "../components/Loader";
import { authentication, db } from "../Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase";

export const Dashboard = ({ route, navigation }) => {
  const [menu, SetMenu] = useState(false);
  const [connectEmail, SetConnectEmail] = useState("");
  const dialogState = useSelector((state) => state.Dialog);
  const loadState = useSelector((state) => state.Loader);
  const dispatch = useDispatch();
  const [friends, SetFriends] = useState([]);
  const [image, SetImage] = useState("");

  useEffect(() => {
    // console.log(authentication.currentUser.uid);
    if (authentication.currentUser !== null) {
      const unsubs = db
        .collection("users")
        .doc(authentication.currentUser.uid)
        .onSnapshot((doc) => {
          SetImage(doc.data().imageurl);
        });

      const unsubscribe = db
        .collection(authentication.currentUser.uid)
        .doc("data")
        .collection("friends")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          SetFriends(
            snapshot.docs.map((doc) => {
              db.collection("users")
                .doc(doc.data().uid)
                .onSnapshot(async (docd) => {
                  await db
                    .collection(authentication.currentUser.uid)
                    .doc("data")
                    .collection("friends")
                    .doc(docd.data().uid)
                    .set(docd.data(), {
                      merge: true,
                    });
                });
              return {
                name: doc.data().name,
                imageurl: doc.data().imageurl,
                uid: doc.data().uid,
              };
            })
          );
        });
      return unsubscribe, unsubs;
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Passa Chat",
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: color.primary,
        height: 60,
      },
      headerTitleStyle: {
        color: color.darkTheme,
        fontSize: 25,
      },
      headerLeft: () => (
        <TouchableOpacity activeOpacity={0.3} onPress={editImage}>
          <View style={{ marginLeft: 10 }}>
            <Avatar rounded source={{ uri: image }} size={40}></Avatar>
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => {
            SetMenu((prev) => {
              return prev ? false : true;
            });
          }}
        >
          <View style={{ marginRight: 10 }}>
            <Icon name="user-cog" size={23} color={color.darkTheme}></Icon>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, image, route]);

  const editImage = () => {
    navigation.navigate("ImageScreen");
  };

  const connectHandler = async () => {
    SetConnectEmail("");
    if (authentication.currentUser !== null) {
      let isFriend = false;
      try {
        if (
          connectEmail === "" ||
          connectEmail === authentication.currentUser.email
        ) {
          throw { message: "Invalid data!" };
        }
        dispatch(unloadDialog());
        dispatch(loadSpinner());
        const snapshot = await db.collection("users").get();
        snapshot.forEach(async (doc) => {
          if (doc.data().email === connectEmail) {
            isFriend = true;
            await db
              .collection(authentication.currentUser.uid)
              .doc("data")
              .collection("friends")
              .doc(doc.data().uid)
              .set({
                email: doc.data().email,
                imageurl: doc.data().imageurl,
                name: doc.data().name,
                uid: doc.data().uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then()
              .catch((error) => alert(error.message));
            dispatch(unloadSpinner());
          }
        });
        if(isFriend==false){
        dispatch(unloadSpinner());
        alert("No user found!");
        }
      } catch (error) {
        dispatch(unloadSpinner());
        alert(error.message);
      }
        
    }
  };

  const logOut = () => {
    SetMenu(false);
    Alert.alert(
      "",
      "Do you want to Logout?",
      [
        { text: "cancel", style: "cancel" },
        {
          text: "confirm",
          onPress: () => {
            cnfrmLogOut();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const cnfrmLogOut = async () => {
    dispatch(loadSpinner());
    try {
      await authentication.signOut();
      await AsyncStorage.setItem("isLoggedIn", "false");
      dispatch(unloadSpinner());
      navigation.replace("LandingScreen");
    } catch (error) {
      dispatch(unloadSpinner());
      alert(error);
    }
  };

  return (
    <>
      {menu ? (
        <View style={styles.settings}>
          <Card containerStyle={styles.card}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                SetMenu(false);
                dispatch(loadDialog());
              }}
            >
              <ListItem
                bottomDivider
                containerStyle={{ backgroundColor: "transparent" }}
              >
                <ListItem.Content>
                  <ListItem.Title style={{ color: "darkcyan" }}>
                    Add a new chat
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={logOut}>
              <ListItem
                bottomDivider
                containerStyle={{ backgroundColor: "transparent" }}
              >
                <ListItem.Content>
                  <ListItem.Title style={{ color: "darkcyan" }}>
                    Log out
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
          </Card>
        </View>
      ) : null}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          SetMenu(false);
        }}
      >
        <ScrollView style={styles.container}>
          {friends.map((item, index) => {
            return (
              <CustomListItem
                key={item.uid}
                name={item.name}
                url={item.imageurl}
                uid={item.uid}
                navigation={navigation}
              />
            );
          })}

          <StatusBar backgroundColor={color.primary} />
          <Dialog.Container visible={dialogState}>
            <Dialog.Input
              label="email-id"
              value={connectEmail}
              onChangeText={(text) => {
                SetConnectEmail(text);
              }}
            ></Dialog.Input>
            <Dialog.Button
              label="Cancel"
              color={color.warning}
              onPress={() => {
                SetConnectEmail("");
                Keyboard.dismiss();
                dispatch(unloadDialog());
              }}
            />
            <Dialog.Button label="Connect" onPress={connectHandler} />
          </Dialog.Container>
        </ScrollView>
        {loadState ? <Loader /> : null}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.darkTheme,
    height: "100%",
  },
  settings: {
    position: "absolute",
    top: -13,
    right: 10,
    backgroundColor: "rgba(50,50,50,1)",
    width: 200,
    height: 250,
    zIndex: 10,
    borderRadius: 10,
  },
  card: {
    backgroundColor: "rgba(50,50,50,1)",
    padding: 0,
    margin: 0,
    width: "100%",
    height: "100%",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
  },
});
