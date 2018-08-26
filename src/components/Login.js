import React, {Component} from 'react';
import {View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import firebase from 'firebase';

class Login extends Component{
    state = {
        loading : false
    }
    onPressLogin(){
        
        if(!this.state.email){
            Alert.alert("", "Email is empty", []);
            return;
        }

        if(!this.state.password){
            Alert.alert("", "Password is empty", []);
            return;
        }
        this.setState({loading:true});
        firebase.auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
            this.setState({loading:false});
            this.props.navigation.navigate('Home');
        })
        .catch(error => {
                Alert.alert("", error.message, []);
                this.setState({loading:false});
        });
    }
    render(){
        return(
            <View style={styles.container}>
                <Text style={{fontSize:20}}>Please login</Text>
                <TextInput style={styles.textInput}
                    placeholder="Email"
                    autoCapitalize="none"
                    onChangeText={(text) => this.setState({email:text})}>
                </TextInput>
                <TextInput style={styles.textInput}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize="none"
                    onChangeText={text => this.setState({password:text})}>
                </TextInput>
                <Button title="Login"
                    onPress={this.onPressLogin.bind(this)}>
                </Button>
                <ActivityIndicator animating={this.state.loading}></ActivityIndicator>
            </View>
        );
    }
}

const mapStateToProps = (state) =>{
    return {
        // user : state.user.user
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        justifyContent:'center',
        alignItems:'stretch'
    },
    textInput:{
        height:40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        fontSize:20,
        padding:10
    }
})