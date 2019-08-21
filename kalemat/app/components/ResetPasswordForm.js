import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';

import { withNavigation } from 'react-navigation'
import UserInput from './UserInput';
import GradientButton from './GradientButton';
import MiniHeader from './MiniHeader';
import { Colors , GradientColors } from '../config/colors';

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "khalid@gmail.com"
    };
  }

  render() {
    const { onSubmit, } = this.props;

    return (
      <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
          <MiniHeader
            title="Reset Password"
          />

        <View style={{
          backgroundColor: '#fff',
          paddingVertical: 0,
          width: '100%',
          borderRadius: 15,
          padding:15,
          paddingTop:20,
        }}>
          {this.props.error && (
            <Text style={{ textAlign: 'center', fontSize: 14, color: '#F40B42' }}>{this.props.error.message}</Text>
          )}

          <UserInput
            label="Email"
            placeholder="Email"
            autoCapitalize={'none'}
            returnKeyType={'next'}
            autoCorrect={false}
            iconName="user"
            keyboardType={"email-address"}
            onChangeText={(email) => this.setState({ email })}
            onSubmitEditing={() => { this.passwordInput.focus() }}
            blurOnSubmit={false}
            value={this.state.email}
          />

          <GradientButton
            buttonText="Send reset code"
            gradienColors={Colors.gradientBlue}
            onPress={() => onSubmit(this.state.email)}
            isLoading={this.props.isLoading}
            />

        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default withNavigation(ResetPasswordForm)


const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff',
    flex: 1,
  },
});
