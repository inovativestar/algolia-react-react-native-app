import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { withNavigation } from 'react-navigation'

import GradientButton from './GradientButton';
import UserInput from './UserInput';
import MiniHeader from './MiniHeader';
import { Colors , GradientColors } from '../config/colors';

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rePassword: ""
    };
  }

  render() {
    const { onSubmit, navigation: { navigate, replace } } = this.props;
    return (
      <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>

          <MiniHeader
            title="Signup"
            rightBtnTxt="Login"
            rightBtnAction={() => replace('SignIn')}/>
        <View style={{
          backgroundColor: '#fff',
          paddingVertical: 0,
          width: '100%',
          borderRadius: 15,
          padding:15,
          paddingTop:20
        }}>

          {this.props.error && (
            <Text style={{ textAlign: 'center', fontSize: 14, color: '#F40B42' }}>{this.props.error.message}</Text>
          )}

          <UserInput
            label="Email"
            placeholder="Email"
            keyboardType={"email-address"}
            autoCapitalize={'none'}
            returnKeyType={'next'}
            autoCorrect={false}
            iconName="user"
            onChangeText={(email) => this.setState({ email })}
            onSubmitEditing={() => { this.passwordInput.focus() }}
            blurOnSubmit={false}
            value={this.state.email}/>
          <UserInput
            inputRef={el => (this.passwordInput = el)}
            secureTextEntry
            label="Password"
            placeholder="Password"
            returnKeyType={'next'}
            autoCapitalize={'none'}
            autoCorrect={false}
            iconName="lock"
            onChangeText={(password) => this.setState({ password })}
            onSubmitEditing={() => { this.rePasswordInput.focus() }}
            blurOnSubmit={false}
            value={this.state.password}/>
          <UserInput
            inputRef={el => (this.rePasswordInput = el)}
            secureTextEntry
            label="Repeat Password"
            placeholder="Repeat Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            iconName="lock"
            onChangeText={(rePassword) => this.setState({ rePassword })}
            onSubmitEditing={() => onSubmit(this.state.email, this.state.password, this.state.rePassword)}
            value={this.state.rePassword}/>
          <GradientButton
            gradienColors={Colors.gradientBlue}
            buttonText="Signup"
            onPress={() => onSubmit(this.state.email, this.state.password, this.state.rePassword)}
            isLoading={this.props.isLoading}/>
         </View>
       </KeyboardAvoidingView>
    );
  }
}

export default withNavigation(SignUpForm)

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FFF',
    flex: 1,
  },

});
