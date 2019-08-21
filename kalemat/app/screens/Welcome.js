import React, { Component } from 'react';
import { View, ActivityIndicator, Button,Image, Text, StyleSheet, SafeAreaView, TouchableHighlight, Dimensions, AsyncStorage ,TouchableOpacity } from 'react-native';
import SignInForm from '../components/SignInForm';
import { userManager } from '../config/firebase';
import { Colors , GradientColors } from '../config/colors';
import LinearGradient from 'react-native-linear-gradient';
import bgSrc from '../assets/images/intro.jpg';
export class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error    : null,
      isLoading: false,
    }
  }
  SignInPage = () => {this.props.navigation.push('SignIn');}
  SignUpPage = () => {this.props.navigation.push('SignUp');}

  onSkip = async () => {
    this.setState({ error: null, isLoading: true, });
    try {
      this.setState({ error: null, isLoading: true, });
      const response = await userManager.signInAnonymously();
      this.props.navigation.navigate("AuthLoading");
    } catch (error) {
      this.setState({ error, isLoading: false })
    }
  }

  render() {
    const { isLoading } = this.state;
    return (
      <View style={{flex: 1, flexDirection: 'column',backgroundColor:"#fff", justifyContent: 'space-between',padding:10}}>
       <SafeAreaView />
        <TouchableOpacity
          disabled={isLoading}
          activeOpacity={.8}
          style={styles.skipBtn}
          onPress={this.onSkip}
          >
          {isLoading &&
            <ActivityIndicator size="small" color="grey" />
          }
          <Text style={{color: Colors.blue,fontWeight:"bold",fontSize:16,padding:10}} >تخطي</Text>
        </TouchableOpacity>
        <View style={styles.viewTitle}>
          <Text style={styles.title}>كلمات</Text>
          <Text style={styles.subTitle}>ليست كالكلمات</Text>
        </View>
        <View  style={{flex:2}}>
          <Image style={styles.imageStyle } source={bgSrc} resizeMode="contain" resizeMetho="scale" />
        </View>
        <View style={styles.buttonView} >
          <TouchableOpacity
            disabled={isLoading}
            activeOpacity={.8}
            onPress={this.SignInPage}
            >
            <LinearGradient
              colors={Colors.gradientBlue}
              start={{x: 0.0, y: 0.0}}
              end={{x: 1.0, y: 0.5}}
              style={[styles.buttonStyle , styles.linearGradient]} >
              <Text style={styles.buttonText} >
                Log in
              </Text>
          </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading}
            activeOpacity={.8}
            style={styles.buttonStyle}
            onPress={this.SignUpPage}
            >
            <Text style={[styles.buttonText, styles.buttonBlackText]} >Sign Up</Text>
          </TouchableOpacity>
        </View>
          <View  style={{ justifyContent:"flex-end"}}>
            <Text style={[styles.copyright, {color: Colors.blue}]} >
               Kalemat.app
            </Text>
            <Text style={styles.copyright} >
               Copyright © 2019 EssamSoft. All rights reserved.
            </Text>
            <Text style={styles.copyright2} >
            All Lyrics are property of their respective owners and are provided for educational purposes only
            </Text>
          </View>
        <SafeAreaView />
      </View>
      );
    }
}

const styles = StyleSheet.create({
  skipBtn: {
    alignItems     : "center",
    flexDirection: 'row',
    justifyContent : "flex-start"

   },
  viewTitle: {
     flex           : 1,
    flexDirection  : 'column',
    justifyContent : "flex-end"
  },
  title : {
    fontSize  : 38,
    fontWeight: "bold",
    textAlign : 'center',
    color     : Colors.blue,
  },
  subTitle : {
    fontSize : 30,
    textAlign: 'center',
    color    : Colors.gray,
  },
  buttonView: {
    alignItems     : "center",
    justifyContent : "flex-start",
    flex           : 1
  },
  buttonBlackText: {
    color: '#636363',
   },
   buttonText: {
    fontSize : 18,
    textAlign: 'center',
    color    : '#fff',
   },
	buttonStyle: {
    shadowOffset     : { width: 0, height: 0, },
    shadowColor      : 'black',
    shadowOpacity    : 0.15,
    shadowRadius     : 10,
    borderRadius     : 7,
    elevation        : 13,
    backgroundColor  : "#fff",
    paddingVertical  : 10,
    paddingHorizontal: 25,
    width            : 250,
    margin           : 10
  },
  imageStyle: {
      flex : 1,
      width: "100%",
   },
  copyright: {
    textAlign: "center",
    color    : Colors.lightgray
  },
  copyright2: {
    textAlign: "center",
    color    : Colors.lightgray,
    fontSize: 10
  },
	container: {
    padding        : 10,
    height         : "100%",
    flex           : 1,
    flexDirection  : 'column',
    justifyContent : 'space-between',
    alignItems     : "stretch"
  },
  })
export default Welcome;
