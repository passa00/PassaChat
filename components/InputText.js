import React from 'react';
import color from '../constants/Colors';
import { View,Text,StyleSheet,TextInput } from 'react-native';


const InputText = (props)=>{
    return(
        <View>
            <TextInput placeholderTextColor={color.inputTextColorBlur} {...props} style={{...styles.input,...props.style}}>{props.children}</TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    input:{
        borderColor:color.primary,
        borderWidth:1,
        padding:5,
        color:color.inputTextColor,
        borderRadius:10,
    }
});

export default InputText;