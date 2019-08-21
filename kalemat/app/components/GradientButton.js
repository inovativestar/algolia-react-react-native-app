import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import { Colors , GradientColors } from '../config/colors';

import { StyleSheet, ActivityIndicator, View, Text ,TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class gradientbutton extends Component {
  render() {
    const { isLoading, buttonText , onPress , gradienColors, css , textStyle } = this.props;
    const isCss = css ? css : {
      paddingVertical  : 15,
      paddingHorizontal: 25
    };
    return (
      <View>
        <TouchableOpacity
          disabled={isLoading}
          activeOpacity={.8}
          onPress={onPress}
          >
          <LinearGradient
            colors={gradienColors}
            start={{x: 0.0, y: 0.0}}
            end={{x: 1.0, y: 0.5}}
            style={[styles.buttonStyle , {...isCss}]} >
            {!this.props.isLoading &&
            <Text style={[styles.buttonText , {...textStyle}]} >
              {buttonText}
            </Text>
            }
            {this.props.isLoading &&
              <ActivityIndicator size="small" color="white" />
            }

        </LinearGradient>


        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
    color    : '#fff',
    fontSize : 16,
   },
   buttonStyle: {
    shadowOffset     : { width: 0, height: 0, },
    shadowColor      : 'black',
    shadowOpacity    : 0.15,
    shadowRadius     : 10,
    borderRadius     : 7,
    elevation        : 13,
    backgroundColor  : "#fff",
   },

});
