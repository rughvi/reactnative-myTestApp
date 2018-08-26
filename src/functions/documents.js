import * as documentsRepo from '../db/documentsRepository';
import * as documentsStorage from '../storage/documents';

export const getDocuments = (section, updateStoreWithSectionDocuments) => {
    return new Promise((resolve, reject) => {
        documentsRepo.getDocuments(section)
        .then(documents => {
            Promise.all(getMetadataForDocuments(section, documents))
            .then(documentsWithMetadata => {
                updateStoreWithSectionDocuments(documentsWithMetadata);
                resolve(true);
            })
            .catch(error => reject(error));            
        })
        .catch(error => reject(error));
    });
}

const getMetadataForDocuments = (section, documents) => {
    return documents.map(document => {
        return new Promise((resolve, reject) => {
            documentsStorage.getMetadata(section, document.imgLocation)
            .then(metadata => {
                resolve({
                    ...document,
                    ...metadata
                })
            })
            .catch(error => reject(error));
        }) 
    })
}

export const saveTagsToDocument = (section, document) => {
    return new Promise((resolve, reject) => {
        documentsRepo.saveTagsToDocument(section, document)
        .then(() => {
            resolve();
        })
        .catch(error => reject(error));
    })    
};