import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert, Image, TouchableHighlight, TouchableOpacity, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {getDocuments} from '../functions/documents';

class Documents extends Component{
    static navigationOptions = ({ navigation }) => {
        return{
            headerTitle: 'Documents',
            headerRight: (
                <View style={{flexDirection:'row', alignItems:'stretch'}}>
                    <TouchableOpacity style={{width:30, height:30, marginLeft:10, marginRight:10}}
                        onPress={() => {
                                var fn = navigation.getParam('tapFileUpload');
                                var param = navigation.getParam('section');
                                fn(param);
                            }
                        }>
                        <Image source={require('../assets/fileUpload.png')} style={{width:30, height:30}}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:30, height:30, marginLeft:10, marginRight:10}}
                        onPress={() => {
                                var fn = navigation.getParam('tapPhotoUpload');
                                var param = navigation.getParam('section');
                                fn(param);
                            }
                        }>
                        <Image source={require('../assets/photoUpload.png')} style={{width:30, height:30}}></Image>
                    </TouchableOpacity>
                </View>
                
            )
        };
    };

    state = {
        loading:true
    }

    section = '';

    componentDidMount(){
        this.section = this.props.navigation.getParam('section');
        this.props.navigation.setParams({tapFileUpload:this._onTapFileUpload, tapPhotoUpload:this._onTapPhotoUpload, section:this.section});
        getDocuments(this.section, this.props.updateStoreWithSectionDocuments)
        .then(result => {
            this.setState({loading:false});
        })
        .catch(error => {            
            Alert.alert("", error.message, []);
            this.setState({loading:false});
        })
    }

    _onTapFileUpload = (section) => {
        // this.props.navigation.navigate('Documents',{section:section});        
    }

    _onTapPhotoUpload = (section) => {

    }

    _onTouchDocument(document){
        this.props.navigation.navigate('DocumentViewPdf',{section:this.section,document:document});
    }

    render(){
        const {documents} = this.props;       

        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{fontSize:15}}>{this.section}</Text>
                    {
                        !this.state.loading &&  
                        <Text style={{fontSize:15, fontStyle:'italic', color:'silver'}}>documents: {documents.length}</Text>
                    }
                </View>
                <ScrollView style={{height:'82%', width:'100%'}}>
                    <View style={styles.body}>
                        {
                            this.state.loading &&
                            <ActivityIndicator></ActivityIndicator>
                        }
                        {
                            !this.state.loading && (documents.length > 0) &&                            
                            documents.map((document, i) => { 
                                var imageSource = (document.contentType.startsWith('image/')?
                                                    {uri:document.thumbFileDownloadURL} :
                                                    require('../assets/pdf.png'));
                                
                                return (
                                    <TouchableHighlight key={i} style={styles.card} onPress={() => this._onTouchDocument(document)} >
                                        <View style={{height:'100%', width:'100%', alignItems:'center'}}>
                                            <Image source={imageSource} 
                                                    resizeMode={document.contentType.startsWith('image/') ? 'cover' : 'contain'} 
                                                    style={{height:100, width:'100%'}}></Image>
                                            <Text numberOfLines={2} style={{margin:5, fontSize:16, textAlign:'center'}}>{document.title}</Text>
                                        </View>
                                    </TouchableHighlight>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    header:{
        height:'10%',
        width:'100%',
        margin:20
    },
    body:{
        flexDirection:'row',
        flexWrap: 'wrap',
        alignItems:'flex-start',
        justifyContent:'center',
        height:'100%',
        width:'100%'
    },
    card:{
        alignItems:'center',
        height:150,
        width:150,
        margin:5,
        padding:0,
        borderColor:'black',
        borderWidth:2,
        borderRadius:10,
        overflow: 'hidden'
    }
});

const mapStateToProps = (state) => {
    return {
        documents : state.documentsReducer.documents
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateStoreWithSectionDocuments : (documents) => dispatch({type:'documentsForSectionUpdate', value:documents})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents);