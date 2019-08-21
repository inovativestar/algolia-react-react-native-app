import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  Text,
  YellowBox,
  StyleSheet,
  View,
} from 'react-native';
import { userManager } from '../config/firebase';
// import firebase from 'react-native-firebase';

export default class AuthLoadingScreen extends Component {

  componentDidMount = () => {
    this.checkUser();
  };

  checkUser = async () => {

    const user = await userManager.getUser();
    this.props.navigation.navigate(user ? 'App' : 'Auth');
  };

  render() {
    return (
      <View style={{
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }} >
        <StatusBar barStyle="default" />
        <ActivityIndicator size="large" />
        { <Text>Loading...</Text> }
      </View>
    );
  }
}