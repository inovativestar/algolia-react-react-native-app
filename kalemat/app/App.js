import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  YellowBox,
  BackHandler,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import firebase from 'react-native-firebase';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
import Router, {Tabs} from './config/router';

import { userManager, LyricsManager } from './config/firebase';

export default class App extends Component {
  state = {
    tabs: Tabs
  }

  componentWillMount() {
    this.onAuthSateChanged = firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.getTabs(user.isAnonymous)
      }
    })
  }

  componentWillUnmount() {
    this.onAuthSateChanged = null
  }

  getTabs = isAnonymous => {
    let tabs = {...Tabs}
    if(isAnonymous) {
      delete tabs.Favourite
      delete tabs.MyLyrics
    }

    LyricsManager.getConfig( ( config ) => {
      this.setConfig( config, tabs )
    } );
  }

  async setConfig(config, tabs) {
    await AsyncStorage.setItem("configuration", JSON.stringify(config));
    this.setState({ tabs });
  }

  render() {

    let Test = Router(this.state.tabs)
    return (<Test />);
  }
}
