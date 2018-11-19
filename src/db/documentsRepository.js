import firebase from 'firebase';

export const getDocuments = (section) => {
    return new Promise((resolve, reject) => {
        var documentsRef = firebase.database().ref('impData/' + section + '/documents');
        documentsRef.once('value')
        .then(snapshot => {
            var documents = [];
            var snapshotValue = snapshot.val();
            if(snapshotValue)
            {
                var keys = Object.keys(snapshotValue);
                keys.forEach((key, index) => {
                    var value = snapshotValue[key];
                    documents.push({
                        id:key,
                        imgLocation:value.location,
                        title:value.title,
                        tags:value.tags
                    })
                });
            }            
            resolve(documents);
        })
        .catch(error => reject(error));
    });
}

export const addDocument = (section, imageFileName, title, tags) => {
    let document = {
        title:title,
        tags:tags,
        location:imageFileName
        };

    var documentsRef = firebase.database().ref('impData/' + section + '/documents/');
    return documentsRef.push(document);
}

export const saveTagsToDocument = (section, document) => {
    var documentRef = firebase.database().ref('impData/' + section + '/documents/' + document.id + "/tags");
    return documentRef.set(document.tags);
}
