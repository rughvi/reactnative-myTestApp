import React, {Component} from 'react';
import {View, ListView, Text, StyleSheet, TouchableHighlight, Alert, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import {getImpDataSections} from '../functions/impData';
import firebase from 'firebase';

const Block = ({onPress, displayName, color, initial}) =>{
    return(
        <TouchableHighlight style={[styles.card, {borderColor:color}]}
            onPress={onPress}>        
            <View style={{flex:1, flexDirection:'row'}}>
                <View style={[styles.cardBlock, {backgroundColor:color}]}>
                    <Text style={{fontSize:40}}>{initial}</Text>
                </View>
                <Text style={{margin:10, fontSize:18}}>{displayName}</Text>
            </View>
        </TouchableHighlight>
    );
}

class Home extends Component{
    static navigationOptions = {
        title: 'Home',
      };
    
    state = {
        currentUser:null,
        loading:true
    };
    
    componentWillMount(){
        this.setState({currentUser:firebase.auth().currentUser});
    }

    componentDidMount(){
        getImpDataSections(this.props.updateStoreWithImpDataSections)
        .then(result => {
            this.setState({loading : false});
        })
        .catch(error => {
            Alert.alert("", error.message, []);
        });
    }

    _onPressNavigate(section){
        this.props.navigation.navigate('ImpData', {section:section});
    }

    render(){
        const {sections} = this.props;
        const {navigationLocal} = this.props;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var datasource = ds.cloneWithRows(sections);
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{fontSize:18}}>Welcome</Text>
                    <Text style={{fontSize:18}}>{this.state.currentUser.displayName}</Text>
                </View>
                {   this.state.loading && 
                    <ActivityIndicator style={{position:'absolute', left:'50%', top:'30%'}}></ActivityIndicator>
                }
                {
                    !this.state.loading && 
                    <ListView style={{height:'90%'}}                    
                    dataSource={datasource}
                    renderRow={(section) => <Block onPress={() => this._onPressNavigate(section.id)} displayName={section.name} color={section.backgroundColor} initial={section.initial}/>}/>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        sections : state.impDataReducer.impDataSections
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateStoreWithImpDataSections: (sections) => dispatch({type:'impDataSectionsUpdate', value:sections})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
    container : {
        flex:1,
        padding:10
    },
    header:{
        height:'10%',
        padding:10
    },
    body:{
        height:'90%',
        justifyContent:'center',
        alignItems:'center'
    },  
    card:{
        //flex:1,
        //flexDirection:'row',
        height:'25%',
        //width:'100%',
        padding:0,
        margin:10,
        borderWidth: 2,
        backgroundColor:'white'
    },
    cardBlock:{
        height:'100%',
        width:50,
        justifyContent:'center',
        alignItems:'center'
    }
})