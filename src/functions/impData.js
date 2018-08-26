import * as impDataRepo from '../db/impDataRepository';

export const getImpDataSections = (updateStoreWithImpDataSections) => {
    return new Promise((resolve, reject) => {
        impDataRepo.getImpDataSections()
        .then(sections => {
            var result = [];
            sections.forEach(section => {
                result.push({
                    name:section,
                    id:section
                });
            });
            updateStoreWithImpDataSections(result);
            resolve(true);
        })
        .catch(error => reject(error));
    });;
}

export const getImpData = (section, updateStoreWithImpData) =>{
    return new Promise((resolve, reject) => {
        impDataRepo.getSectionImpData(section)
        .then(result => {
            updateStoreWithImpData(result);
            resolve(true);
        })
        .catch(error => reject(error));
    })
}

export const saveImpData = (section, data) => {
    return impDataRepo.saveSectionImpData(section, data);
}