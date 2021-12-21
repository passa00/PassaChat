import React, { useState } from "react";
import color from "../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome5";
import InputText from "../components/InputText";
import { authentication } from "../Firebase";
import Dialog from "react-native-dialog";
import { loadDialog, unloadDialog } from "../actions";
import { useSelector, useDispatch } from "react-redux";
import { Loader } from "../components/Loader";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { loadSpinner, unloadSpinner } from "../actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [resetEmail, SetResetEmail] = useState("");
  const dispatch = useDispatch();
  const dialogState = useSelector((state) => state.Dialog);
  const loadState = useSelector((state) => state.Loader);
  const [credentials, SetCredentials] = useState({
    email_id: "",
    password: "",
  });

  const onLogin = async () => {
    dispatch(loadSpinner());
    try {
      if (credentials.email_id === "" || credentials.password === "") {
        throw "Empty fields are not allowed!";
      }
      await authentication
        .signInWithEmailAndPassword(credentials.email_id, credentials.password)
        .then(async (userCredential) => {
          try {
            if (!userCredential.user.emailVerified) {
              throw "Verfiy your email address to proceed further!";
            }
            await AsyncStorage.setItem('isLoggedIn','true');
            SetCredentials({email_id:'',password:''})
            dispatch(unloadSpinner());
            navigation.replace("Dashboard");
          } catch (error) {
            dispatch(unloadSpinner());
            alert(error);
          }
        })
        .catch((error) => {
          dispatch(unloadSpinner());
          alert(error.message);
        });
    } catch (error) {
      dispatch(unloadSpinner());
      alert(error);
    }
  };

  const resetPassword = () => {
    dispatch(loadDialog());
    try {
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const resetHandler = async () => {
    try {
      dispatch(unloadDialog());
      dispatch(loadSpinner());
      if (resetEmail !== "") {
        await authentication
          .sendPasswordResetEmail(resetEmail)
          .then(() => {
            dispatch(unloadSpinner());
            alert("Reset password link has been send to your email id.");
          })
          .catch((error) => {
            dispatch(unloadSpinner());
            alert(error.message);
          });
      } else {
        dispatch(unloadSpinner());
        alert("Invalid email-id!");
      }
    } catch (error) {
      dispatch(unloadSpinner());
      return error;
    }
  };

  const cancelHandler = () => {
    SetResetEmail("");
    dispatch(unloadDialog());
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView behavior="height" style={styles.container}>
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
          <Text style={styles.resetPassword} onPress={resetPassword}>
            forgot password?
          </Text>
          <View>
            <Button title="Login" onPress={onLogin}></Button>
          </View>
        </View>
        <Dialog.Container visible={dialogState}>
          <Dialog.Input
            label="email-id"
            value={resetEmail}
            onChangeText={(text) => {
              SetResetEmail(text);
            }}
          ></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={cancelHandler} />
          <Dialog.Button label="Reset" onPress={resetHandler} />
        </Dialog.Container>
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
    height: "50%",
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

  resetPassword: {
    marginTop: -20,
    alignSelf: "flex-end",
    textAlign: "right",
    color: color.primary,
    fontStyle: "italic",
  },
});
export default Login;
