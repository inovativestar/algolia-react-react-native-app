import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class NoData extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> {this.props.text || "No Data"}  </Text>

      </View>
    );
  }
}

export default NoData;


const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "#444",
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})