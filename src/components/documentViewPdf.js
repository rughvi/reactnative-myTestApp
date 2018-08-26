import React, {Component} from 'react';
import {StyleSheet, Button, View, Text, TextInput, ActivityIndicator, TouchableOpacity, Alert, Image} from 'react-native';
import {connect} from 'react-redux';
import PDFView from 'react-native-view-pdf';
import firebase from 'firebase';
import {downloadDocumentAsbase64} from '../storage/documents';
import {saveTagsToDocument} from '../functions/documents';

class DocumentViewPdf extends Component{
    constructor(props){
        super(props);
        this.document = this.props.navigation.getParam('document');
        this.section = this.props.navigation.getParam('section');
    }

    static navigationOptions = ({ navigation }) => {
        return{
            // headerTitle: 'Documents',
            headerRight: (
                <View style={{flexDirection:'row', alignItems:'stretch'}}>
                    <TouchableOpacity style={{width:30, height:30, marginLeft:10, marginRight:10}}
                        onPress={() => {
                                var fn = navigation.getParam('tapHashtag');
                                fn();
                            }
                        }>
                        <Image source={require('../assets/hashtag.png')} style={{width:30, height:30}}></Image>
                    </TouchableOpacity>                    
                </View>                
            )
        };
    };

    state={
        loading:true,
        base64Response : null,
        isPopupVisible:false,
        tags:''
    }

    componentDidMount(){
        this.props.navigation.setParams({tapHashtag:this._onEditTags});
        this.setState({loading:true, tags:this.document.tags});
        downloadDocumentAsbase64(this.document)
        .then(documentContentbase64 => {
            this.setState({loading:false, base64Response:documentContentbase64});
        })
        .catch(error => {
            Alert.alert('', error.message,[]);
        })
    }

    _onEditTags = () => {
        this.setState({isPopupVisible:true});
    }

    _onSaveTags = () => {
        var base64Response = this.state.base64Response;
        this.setState({isPopupVisible:false, loading:true, base64Response:null});        
        this.document.tags = this.state.tags;
        saveTagsToDocument(this.section, this.document)
        .then(() => {
            this.setState({loading:false, base64Response:base64Response});
        })
        .catch(error => {
            this.setState({loading:false, base64Response:base64Response});
            Alert.alert('', error.message,[])
        });
    }

    render(){
        const {title} = this.document; 
        return(
            <View style={styles.container}>                
                <View style={styles.header}>
                    <Text style={{fontSize:15}}>{this.section}</Text>
                    <Text style={{fontSize:15, fontStyle:'italic', color:'silver'}}>{title}</Text>
                </View>
                <View style={styles.body}>                
                {
                    this.state.base64Response && 
                    (this.document.contentType.indexOf('pdf') > -1) &&
                    <PDFView style={{ width:'100%', height:'100%'}}
                        onError={(error) => console.log('onError', error)}
                        onLoad={() => console.log('PDF rendered from url')}                        
                        resource={this.state.base64Response}
                        resourceType="base64"/>
                }
                {
                    this.state.base64Response && 
                    this.document.contentType.startsWith('image/') &&
                    <Image style={{ width:'100%', height:'100%', resizeMode:'contain'}}
                        source={{uri:'data:image/png;base64,' + this.state.base64Response}}/>
                }
                {
                    this.state.isPopupVisible &&
                    <View style={styles.popupBG}>
                        <View style={styles.popup}>
                             <TextInput multiline={true} numberOfLines={3} value={this.document.tags}
                                onChangeText={text => this.setState({tags:text})}
                                 style={{width:'100%', height:'65%', margin:0, color:'black', borderColor:'silver', borderWidth:1}}></TextInput>
                             <Text style={{fontStyle:'italic', fontSize:15, color:'silver'}}>Enter tags above seperated by space</Text>
                             <Button title='Save Tags' onPress={() => this._onSaveTags()}></Button>
                        </View>
                    </View>
                }
                {
                    this.state.loading &&
                    <ActivityIndicator style={{position:'absolute', left:'50%', top:'25%'}}/>
                }
                </View>
                {
                    !this.state.loading &&                    
                    <View style={styles.footer}>
                        <Text style={{fontStyle:'italic', fontSize:15, color:'silver'}}>tags:</Text>
                        <Text style={{fontStyle:'italic', fontSize:15}}>{this.document.tags}</Text>                        
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10,
        justifyContent:'center',
        alignItems:'center'
    },
    header:{
        height:'10%',
        width:'100%'
    },
    body:{
        height:'80%',
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    footer:{
        height:'10%',
        width:'100%',
        paddingTop:5
    },
    popupBG:{
        height:'100%',
        width:'100%',
        position:'absolute',
        top:'0%',
        left:'0%',
        flex:1,
        margin:0
    },
    popup:{
        height:'40%',
        width:'80%',
        backgroundColor:'white',
        position:'absolute',
        top:'30%',
        left:'10%',
        alignItems:'center',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000000',
        shadowOffset: {
        width: 0,
        height: 1
        },
        shadowRadius: 5,
        shadowOpacity: 1.0        
    }
})


const mapStateToProperties = (state) => {
    return{

    }
}

const mapDispatchToProperties = (dispatch) => {
    return{

    }
}

export default connect(mapStateToProperties, mapDispatchToProperties)(DocumentViewPdf);