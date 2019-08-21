import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Dimensions, AsyncStorage, BackHandler, Platform } from 'react-native';
import SignUpForm from '../components/SignUpForm';
import { userManager } from '../config/firebase';

export class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      isLoading: false,
    }
  }

  onSubmit = async (email, password, rePassword) => {
    this.setState({ error: null, isLoading: true });
    try {
      if (password !== rePassword) {
        this.setState({
          error: {
            message: "Do not match password"
          },
          isLoading: false,
        });
        return;
      }

      const accessToken = await userManager.newUser(email, password);

      this.props.navigation.navigate("AuthLoading");
    } catch (error) {
      this.setState({ error, isLoading: false })
    }
  }

  render() {
    return (
      <SignUpForm
        isLoading={this.state.isLoading}
        error={this.state.error}
        onSubmit={this.onSubmit}
      />

    );
  }
}

export default SignUp;
