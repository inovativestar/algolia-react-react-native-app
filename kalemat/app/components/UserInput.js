import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Colors , GradientColors } from '../config/colors';

import { StyleSheet, View, Text, TextInput } from 'react-native';

export default class UserInput extends Component {

  render() {
    const { label, labelStyle, height, placeholder, secureTextEntry, autoCorrect, autoCapitalize, returnKeyType } = this.props;
    return (
      <View style={styles.inputWrapper}>
        <Text style={[styles.labelStyle, { ...labelStyle }]}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            height === "auto" ? { flex :1 , backgroundColor:"red"} : {height: height || 50} ,
            this.props.editable === false ? { color: Colors.gray3, } : null
          ]}
          ref={this.props.inputRef}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          placeholderTextColor={Colors.gray2}
          underlineColorAndroid="transparent"
          {...this.props}
        />
      </View>
    );
  }
}

UserInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string,
};



const styles = StyleSheet.create({

  input: {
    width: '100%',
    borderRadius: 7,
    paddingHorizontal: 15,
    color: Colors.gray4,
    backgroundColor: Colors.gray1,
    minHeight:50
  },
  labelStyle: {
    color: Colors.gray3,
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  inputWrapper: {
    marginBottom: 20,
    borderBottomWidth: 0,
    flexDirection: 'column',
  },
});
