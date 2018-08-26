import {createStore, applyMiddleware} from 'redux';
import appReducers from '../reducers/appReducers';

const store = createStore(appReducers);

export default store;