/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppState} from 'react-native';
import store from './src/store/store';
import * as firebase from 'firebase';
import firebaseconfig from './src/cloud/firebaseconfig';
import AppNavigator from './src/navigation/appNavigator';

export default class App extends Component {  

  componentWillMount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    AppState.addEventListener('change', this._handleAppStateChange);
    firebase.initializeApp(firebaseconfig);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }

    if(nextAppState === 'inactive')
    {
      console.log('App has come to the inactive!')
    }

    if(nextAppState === 'background')
    {
      console.log('App has come to the background!')
      firebase.auth().signOut()
      .then(() => {})
      .catch(error => {});
    }
  }

  render() {
    return (
      <Provider store={store}>
        <AppNavigator></AppNavigator>
      </Provider>
            
    );
  }
}