const initialState = {
    impDataSections:[],
    impDataForSection:''
};
export const impDataReducer = (state = initialState, action) =>{
    switch(action.type){
        case 'impDataForSectionUpdate':
            return {...state, impDataForSection:action.value};
        case 'impDataSectionsUpdate':
            return {...state, impDataSections:action.value};
        default:
            return state;
    }
}