import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Dimensions, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation'
import ResetPasswordForm from '../components/ResetPasswordForm';
import { userManager } from '../config/firebase';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: false,
    }
  }

  onSubmit = async (email) => {
    this.setState({ error: null, isLoading: true });
    try {
      await userManager.resetPassword(email, this);
      this.props.navigation.navigate('SignIn', {'successMessage': 'Password reset link has been sent to your email'})
    } catch (error) {
      console.warn(error)
      this.setState({ error, isLoading: false });
    }
  }

  render() {
    return (
        <ResetPasswordForm
          isLoading={this.state.isLoading}
          error={this.state.error}
          onSubmit={this.onSubmit} />
    );
  }
}

export default withNavigation(ResetPassword);
