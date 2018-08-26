const initialState = {
    documents:[]
}

export const documentsReducer = (state = initialState, action) => {
    switch(action.type){
        case 'documentsForSectionUpdate':
            return {...state, documents:action.value};
        default:
            return state;
    }
}