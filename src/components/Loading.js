import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import firebase from 'firebase';

class Loading extends Component{
    componentDidMount(){
        setTimeout(() =>{
            firebase.auth().onAuthStateChanged(user => {                
                this.props.navigation.navigate(user ? 'Home' : 'Login')
              })
        },1000);        
    }
    render(){
        return(
            <View style={styles.container}>
                <Text style={{fontSize:20}}>Starting ...</Text>
                <ActivityIndicator></ActivityIndicator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default Loading;