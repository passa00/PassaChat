import React from 'react';
import { View,Text,ActivityIndicator,StyleSheet } from 'react-native';
import color from '../constants/Colors';

export const Loader=(props)=>{

    return(
        <View style={styles.loader}>
            <ActivityIndicator {...props} size={50} color={color.primary}/>
        </View>
    );
};


const styles = StyleSheet.create({
    loader:{
        position:'absolute',
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:color.btnBackground,
    }
});