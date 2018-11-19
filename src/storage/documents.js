import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export const getMetadata = (section, filename) => {
    return new Promise((resolve, reject) => {
        var fileRef = firebase.storage().ref(section + '/' + filename);        
        fileRef.getMetadata()
        .then(metadata => {
            var thumbFileDownload = (metadata.contentType.startsWith('image/') ? 
                            firebase.storage().ref(section + '/thumb_' + filename).getDownloadURL():
                            Promise.resolve(''));
            Promise.all([fileRef.getDownloadURL(), thumbFileDownload])
            .then(urls => {
                var data = {
                    contentType:metadata.contentType,
                    fileDownloadURL : urls[0],
                    thumbFileDownloadURL : urls[1]
                }            
                resolve(data);
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
}

export const downloadDocumentAsbase64 = (document) => {
    return new Promise((resolve, reject) => {
        RNFetchBlob.fetch('GET', document.fileDownloadURL)
        .then(response => {
            resolve(response.base64());
        })
        .catch(error => reject(error));
    })
}

export const uploadImage = (section, image) => {
    return new Promise((resolve, reject) => {
        var type = image.filename.substring(image.filename.lastIndexOf('.')+1);
        let mime = `image/${type}`;
        let fileRef = firebase.storage().ref(section + '/' + image.filename);
        let uploadBlob = null;
        fs.readFile(image.uri, "base64")
        .then(response => Blob.build(response, { type: `${mime};BASE64` }))
        .then(imageBlob =>{
            uploadBlob = imageBlob;
            return fileRef.put(imageBlob, {contentType:mime});
        })
        .then(snapshot => {
            uploadBlob.close();
            resolve({});
        })
        .catch(error => reject(error));
    });
}