import {combineReducers} from 'redux';
import {impDataReducer} from './impDataReducer';
import {documentsReducer} from './documentsReducer';

const initialState = {
    
};

const initialReducer = (state = initialState, action) =>{
    return state;
}

export default appReducers = combineReducers({
    initialReducer,
    impDataReducer,
    documentsReducer
})