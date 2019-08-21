import React, { Component } from "react";
import PropTypes from "prop-types";
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { withNavigation } from 'react-navigation'

import GradientButton from './GradientButton';
import UserInput from './UserInput';
import MiniHeader from './MiniHeader';
import { Colors , GradientColors } from '../config/colors';

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "khalid@gmail.com",
      password: "121212",
    };
  }

  render() {
    const { onSubmit, navigation: { navigate, replace } } = this.props;
    return (
        <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>

          <MiniHeader
            title="Login"
            rightBtnTxt="Rigister"
            rightBtnAction={() => replace('SignUp')}
          />

          <View style={{
            backgroundColor: '#fff',
            paddingVertical: 0,
            width: '100%',
            borderRadius: 15,
            padding: 15,
            paddingTop:20,
          }}>
            {this.props.error && (
              <Text style={{ textAlign: 'center', fontSize: 14, color: '#F40B42' }}>{this.props.error.message}</Text>
            )}
            {<Text style={{ textAlign: 'center', fontSize: 14, color: 'green' }}>{this.props.navigation.getParam('successMessage')}</Text>}


            <View>
              <UserInput
                label="Email"
                placeholder="Email"
                autoCapitalize={'none'}
                returnKeyType={'next'}
                autoCorrect={false}
                keyboardType={"email-address"}
                onChangeText={(email) => this.setState({ email })}
                onSubmitEditing={() => { this.passwordInput.focus() }}
                blurOnSubmit={false}
                value={this.state.email}
              />
            </View>

            <View>
              <UserInput
                label="Password"
                inputRef={el => (this.passwordInput = el)}
                secureTextEntry
                placeholder="Password"
                returnKeyType={'done'}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={(password) => this.setState({ password })}
                onSubmitEditing={() => onSubmit(this.state.email, this.state.password)}
                value={this.state.password}
              />
            </View>


            <GradientButton
              gradienColors={Colors.gradientBlue}
              buttonText="Login"
              onPress={() => onSubmit(this.state.email, this.state.password)}
              isLoading={this.props.isLoading}
            />
            <TouchableOpacity
              activeOpacity={.8}
              style={{ marginTop: 20, }}
              onPress={() => navigate('ResetPassword')}
            >
              <Text style={{ textAlign: 'center', color: Colors.gray2 }}>Forget your password?</Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
    );
  }
}

export default withNavigation(SignInForm)

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

});
