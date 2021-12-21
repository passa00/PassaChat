import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import color from "../constants/Colors";
import { authentication, db } from "../Firebase";
import * as ImagePicker from "expo-image-picker";
import { Loader } from "../components/Loader";
import { loadSpinner,unloadSpinner } from "../actions";
import { useSelector,UseDispatch, useDispatch } from "react-redux";

const ImageScreen = ({ navigation }) => {
  const [image, SetImage] = useState(null);
  const loadState = useSelector((State)=>State.Loader);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: color.darkTheme },
      headerTintColor: "white",

      headerLeft:()=>(
        <TouchableOpacity activeOpacity={0.5} style={{marginLeft:20}} onPress={()=>{navigation.goBack()}}>
            <Icon name="arrow-left" size={22} color="white"></Icon>
        </TouchableOpacity>
      ),

      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ marginRight: 15 }}
          onPress={changeImage}
        >
          <Icon name="pen" size={20} color="white"></Icon>
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(authentication.currentUser.uid)
      .onSnapshot((doc) => {
        SetImage(doc.data().imageurl);
      });

    return unsubscribe;
  }, []);

  const changeImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled && result.base64) {
        dispatch(loadSpinner());
      await db
        .collection("users")
        .doc(authentication.currentUser.uid)
        .set(
          {
            imageurl: `data:image/jpeg;base64, ${result.base64}`,
          },
          { merge: true }
        )
        .then(()=>{dispatch(unloadSpinner());alert("Updated successfully!");})
        .catch((error) => {dispatch(unloadSpinner()); alert(error.message);});
    } else if (!result.cancelled){
      alert("Error in updating photo");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }}
        style={{ width: "100%", height: "100%", resizeMode: "contain" }}
      />
      {loadState ? <Loader /> : null}
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
export { ImageScreen };
