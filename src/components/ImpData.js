import React, {Component} from 'react';
import {View, Button, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert} from 'react-native';
import {getImpData, saveImpData} from '../functions/impData';
import { connect } from 'react-redux';

class ImpData extends Component{
    static navigationOptions = ({ navigation }) => {
        return{
            headerTitle: 'Data',
            headerRight: (
                <TouchableOpacity style={{width:30, height:30, marginLeft:10, marginRight:10}}
                    onPress={() => {
                            var fn = navigation.getParam('tapDocuments');
                            var param = navigation.getParam('section');
                            fn(param);
                        }
                    }>
                    <Image source={require('../assets/documents.png')} style={{width:30, height:30}}></Image>
                </TouchableOpacity>
            )
        };
    };

    state={
        editable:false,
        loading:true
    }    
    section = '';
    enteredValue = '';

    componentDidMount(){        
        this.section = this.props.navigation.getParam('section');
        this.props.navigation.setParams({tapDocuments:this._onTapDocuments, section:this.section});
        getImpData(this.section, this.props.updateStoreWithImpData)
        .then(result => {
            this.setState({loading : false});
        })
        .catch(error => {
            Alert.alert("", error.message, []);
        });
    }

    _onTapDocuments = (section) => {
        this.props.navigation.navigate('Documents',{section:section});
    }

    _onTextChange = (text) =>{
        this.enteredValue = text;
    }

    _onPressSave = () => {
        this.setState({editable:false});
        this.setState({loading:true});
        saveImpData(this.section, this.enteredValue)
        .then(() => {
            this.setState({loading:false});
        })
        .catch(error => {
            Alert.alert("", error.message,[])
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{fontSize:15}}>{this.section}</Text>
                    <Text style={{fontSize:15, fontStyle:'italic', color:'silver'}}>{'Click pencil icon to edit document. \nClick tick icon after editing to save changes.'}</Text>
                </View>
                <View style={styles.body}>
                    <TextInput multiline={true} style={styles.textInput}
                        editable={this.state.editable}
                        onChangeText={this._onTextChange.bind(this)}
                        value={this.props.impData}></TextInput>
                    {
                        !this.state.editable &&
                        <TouchableOpacity style={{width:'15%', height:'15%', position:'absolute', left:'75%', top:'85%'}}
                            onPress={() => this.setState({editable:true})}>
                            <Image source={require('../assets/pencil.png')} resizeMode="contain" style={{width:'100%',height:'100%'}}></Image>
                        </TouchableOpacity>
                    }
                    {
                        this.state.editable &&
                        <TouchableOpacity style={{width:'15%', height:'15%', position:'absolute', left:'10%', top:'85%'}}
                            onPress={this._onPressSave.bind(this)}>
                            <Image source={require('../assets/checked.png')} resizeMode="contain" style={{width:'100%',height:'100%'}}></Image>
                        </TouchableOpacity>
                    }
                    {
                        this.state.loading &&
                        <ActivityIndicator style={{position:'absolute', left:'50%', top : '50%'}}></ActivityIndicator>
                    }
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:5
    },
    header:{
        height:'10%',
        width:'100%',
        margin:20
    },
    body:{
        height:'82%',
        width:'100%'
    },
    textInput:{
        height:'100%',
        width:'100%',
        padding:10,
        backgroundColor:'white',
        fontSize:18
    }
})

const mapStateToProps = (state) =>{
    return {
        impData:state.impDataReducer.impDataForSection
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateStoreWithImpData: (impData) => dispatch({type:'impDataForSectionUpdate', value:impData})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImpData);