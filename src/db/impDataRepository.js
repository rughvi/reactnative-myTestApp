import * as firebase from 'firebase';

export const getImpDataSections = () => {
    return new Promise((resolve, reject) => {
        var impDataRef = firebase.database().ref('impData');
        impDataRef.once('value')
        .then(snapshot => {
            var value = snapshot.val();
            var keys = Object.keys(value);
            resolve(keys);
        })
        .catch(error => {
            reject(error);
        })
    });
}

export const getSectionImpData = (section) => {
    return new Promise((resolve, reject) => {
        var sectionImpDataRef = firebase.database().ref('impData/' + section + '/data');
        sectionImpDataRef.once('value')
        .then(snapshot =>{
            var value = snapshot.val();
            resolve(value);
        })
        .catch(error => reject(error))
    });
}

export const saveSectionImpData = (section, data) =>{
    var impDataRef = firebase.database().ref('impData/' + section + '/data');
    return impDataRef.set(data);
}