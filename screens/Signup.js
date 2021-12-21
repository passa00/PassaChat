import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import color from "../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome5";
import InputText from "../components/InputText";
import { db,authentication } from "../Firebase";
import { Alert } from "react-native";
import { loadSpinner, unloadSpinner } from "../actions";
import { Loader } from "../components/Loader";
import {
  View,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

const Signup = () => {
  const loadState = useSelector((state) => state.Loader);
  const dispatch = useDispatch();
  const [credentials, SetCredentials] = useState({
    email_id: "",
    user_name: "",
    password: "",
    cnfrmPassword: "",
  });

  const onSignUP = async () => {
    if (
      !credentials.email_id ||
      !credentials.user_name ||
      !credentials.password ||
      !credentials.cnfrmPassword
    ) {
      alert("Empty fields are not allowed!");
      return;
    }
    if (credentials.password !== credentials.cnfrmPassword) {
      alert("password mismatch!");
      return;
    }
    dispatch(loadSpinner());
    try {
      await authentication
        .createUserWithEmailAndPassword(
          credentials.email_id,
          credentials.password
        )
        .then(async (userCredential) => {
          await authentication.currentUser
            .updateProfile({
              displayName: credentials.user_name
            })
            .then(()=>{
                const user = authentication.currentUser;
                // alert(JSON.stringify(user));
                db.collection("users").doc(user.uid).set({
                    imageurl:'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
                    email:user.email,
                    uid:user.uid,
                    name:user.displayName
                }).then().catch((error)=>alert('error in updating user data'));
            })
            .catch((error) => alert("error in updating user name!"));
          await authentication.currentUser.sendEmailVerification().then(() => {
            Alert.alert(
              "!!Important!!",
              "An email verification link has been sent to your provided email address please verify your email-address to complete Signup process.",
              [{ text: "OK", style: "default" }],
              { cancelable: true }
            );
          });
          dispatch(unloadSpinner());
        })
        .catch((error) => {
          dispatch(unloadSpinner());
          Alert.alert(
            "Oops! something went wrong.",
            error.message,
            [{ text: "OK", style: "default" }],
            { cancelable: true }
          );
        });
    } catch (error) {
      dispatch(unloadSpinner);
      return error;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        behavior="height"
        style={styles.container}
      >
        <View style={styles.card}>
          <Icon size={40} name="user" color={color.primary} solid></Icon>
          <InputText
            keyboardType="email-address"
            placeholder="enter email id"
            style={styles.input}
            value={credentials.email_id}
            onChangeText={(text) => {
              SetCredentials((prev) => {
                return {
                  ...prev,
                  email_id: text,
                };
              });
            }}
          />
          <InputText
            placeholder="enter user name"
            style={styles.input}
            value={credentials.user_name}
            onChangeText={(text) => {
              SetCredentials((prev) => {
                return {
                  ...prev,
                  user_name: text,
                };
              });
            }}
          />
          <InputText
            secureTextEntry={true}
            placeholder="enter password"
            style={styles.input}
            value={credentials.password}
            onChangeText={(text) => {
              SetCredentials((prev) => {
                return {
                  ...prev,
                  password: text,
                };
              });
            }}
          />
          <InputText
            secureTextEntry={true}
            placeholder="confirm password"
            style={styles.input}
            value={credentials.cnfrmPassword}
            onChangeText={(text) => {
              SetCredentials((prev) => {
                return {
                  ...prev,
                  cnfrmPassword: text,
                };
              });
            }}
          />
          <View>
            <Button title="Sign up" onPress={onSignUP}></Button>
          </View>
        </View>
        {loadState ? <Loader /> : null}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.theme,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  card: {
    width: "80%",
    height: "70%",
    backgroundColor: color.theme,
    borderColor: color.primary,
    borderWidth: 0.5,
    alignItems: "center",
    padding: 10,
    justifyContent: "space-evenly",
    borderRadius: 20,
  },

  input: {
    width: 250,
  },
});
export default Signup;
