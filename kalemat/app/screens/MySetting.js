import React, { Component } from 'react';
import { View, Text, Alert, AsyncStorage, ScrollView, KeyboardAvoidingView} from 'react-native';
import { userManager } from '../config/firebase';
import { clearSpace } from '../config/globalFunctions';
import MiniHeader from '../components/MiniHeader';
import UserInput from '../components/UserInput';
import GradientButton from '../components/GradientButton';
import { Colors, GradientColors } from '../config/colors';
import firebase from 'react-native-firebase';

class MySetting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      error   : {},
      isAnonymous: true,
      isLoading:false,
    };
  }

  componentDidMount = async () => {
    firebase.auth().onAuthStateChanged((user) => {
      if( user ) {
        userManager.loadUserData( user.uid, (info) => {
          if (user) {
            this.setState({
              name: info && info.displayName ? info.displayName : '',
              email: user.email ? user.email : '',
              phone: info && info.phoneNumber ? info.phoneNumber : '',
            });
          }
        });
      }
    });
  }

  logOut = async () => {
    this.setState({isLoading: true});
    try {
      await userManager.logOutUser();
      this.props.navigation.navigate('AuthLoading');
      this.setState({isLoading: false});
    } catch (error) {
      this.setState({isLoading: false});

      Alert.alert(error.message);
    }
  }

  onSave = async () => {
    try {
      await userManager.editUser({
        name: this.state.name,
        phone: this.state.phone
      });

      this.props.navigation.navigate('AuthLoading');

    } catch (error) {

      Alert.alert(error.message);
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
      <MiniHeader
          title={"Setting"}
          showCloseBtn={true}
          rightBtnTxt="Save"
          rightBtnAction={() => this.onSave()} />

        <ScrollView
          style={{ backgroundColor: '#fff', flexGrow: 1, }}
          contentContainerStyle={{ flexGrow: 1, }} >
          <KeyboardAvoidingView style={{ padding: 20 }} behavior="padding" enabled>
            <View>
              <UserInput
                label="Email"
                autoCapitalize={'none'}
                autoCorrect={true}
                returnKeyType={'next'}
                underlineColorAndroid="transparent"
                placeholder="My Email"
                value={this.state.email}
                blurOnSubmit={false}
                selectTextOnFocus={false}
                editable={false} />
            </View>
            <View>
              <UserInput
                label="Name"
                autoCapitalize={'none'}
                autoCorrect={true}
                returnKeyType={'next'}
                underlineColorAndroid="transparent"
                placeholder="My Name"
                value={this.state.name}
                blurOnSubmit={false}
                selectTextOnFocus={false}
                onChangeText={(value) => this.setState({ name: value })} />
            </View>
            <View>
              <UserInput
                label="Phone"
                autoCapitalize={'none'}
                autoCorrect={true}
                returnKeyType={'next'}
                underlineColorAndroid="transparent"
                placeholder="My Phone"
                value={this.state.phone}
                blurOnSubmit={false}
                selectTextOnFocus={false}
                onChangeText={(value) => this.setState({ phone: value })} />
            </View>
            <View>
            <GradientButton
            isLoading={this.state.isLoading}
            gradienColors={Colors.gradientRed}
            buttonText="تسجيل خروج"
            onPress={() => this.logOut()} />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

export default MySetting;
