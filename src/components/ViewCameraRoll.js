import React, {Component} from 'react';
import {View, ScrollView, ImageBackground, ImageEditor, ImageStore, Image, TouchableOpacity, CameraRoll, Text, Alert} from 'react-native';
import { connect } from 'react-redux';
import {uploadImage, uploadImageBase64} from '../functions/documents';

class ViewCameraRoll extends Component{
    static navigationOptions = ({navigation}) => {
        return {
            headerRight:(
                <TouchableOpacity onPress={() => {
                    var fn = navigation.getParam('onUploadPressed');
                    var section = navigation.getParam('section');
                    var image = navigation.getParam('selectedPhoto');
                    fn(section, image);
                }}>
                    <Text>Upload  </Text>
                </TouchableOpacity>
            )
        }
    }
    constructor(props){
        super(props);
        this.state={
            photos:[],
            selectedPhoto:{
                image:'',
                uri:''
            }
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({onUploadPressed: this._onUploadPressed});
        CameraRoll.getPhotos({
            first:50,
            assetType:'Photos'
        })
        .then(r => {
            this.setState({photos:r.edges});
        })
        .catch(error => {
            Alert.alert('', error.message,[]);
        })
    }

    _onImageTapped = (image) => {
        this.setState({selectedPhoto:image});
        this.props.navigation.setParams({selectedPhoto:image});
    }

    _onUploadPressed = (section, selectedPhoto) => {
        if(selectedPhoto == undefined || selectedPhoto.uri == undefined || selectedPhoto.uri === ''){
            Alert.alert('', 'Select an image to upload',[]);
            return;
        }

        uploadImage(section, selectedPhoto)
        .then(result => {

        })
        .catch(error => {
            Alert.alert('', error.message,[]);
        })
    }    

    render(){
        return(
            <View style={{flex:1}}>
                <ScrollView>
                    <View style={{flex:1, flexDirection:'row', flexWrap:'wrap'}}>{
                        this.state.photos.map((p,i) => {
                            return(
                                <TouchableOpacity key={i} style={{width:100,height:100, margin:5}} onPress={() => this._onImageTapped(p.node.image)}>
                                    <ImageBackground key={i} style={{width:100, height:100}} source={{uri: p.node.image.uri}}>
                                        {
                                            this.state.selectedPhoto !== undefined && this.state.selectedPhoto.uri === p.node.image.uri &&
                                            <Image style={{position:'relative', top:10, left:10, width:20, height:20}} source={require('../assets/checked.png')}></Image>
                                        }                                        
                                    </ImageBackground>
                                </TouchableOpacity>
                            )
                        })
                    }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewCameraRoll);