import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Dimensions, AsyncStorage } from 'react-native';
import SignInForm from '../components/SignInForm';
import { userManager } from '../config/firebase';

export class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: false,
    }
  }

  onSubmit = async (email, password) => {
    try {
      this.setState({ error: null, isLoading: true, });
      const response = await userManager.signInUser(email, password);
      this.props.navigation.navigate("AuthLoading");
    } catch (error) {
      this.setState({ error, isLoading: false })
    }
  }

  render() {
    return (
        <SignInForm
          isLoading={this.state.isLoading}
          error={this.state.error}
          onSubmit={this.onSubmit}
        />
    );
  }
}

export default SignIn;
