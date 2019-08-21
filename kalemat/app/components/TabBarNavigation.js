import React, { Component } from 'react';
import { View, Text, } from 'react-native';
import {
  TabBarBottom
} from "react-navigation";

import { Icon } from 'react-native-elements';

const TabBarNavigation = props => {
  return (
    <View>
      <View style={styles.actionButton}>
        <Icon name="open-book" type="entypo" size={45} color={"#fff"} style={styles.buttonIcon} />
      </View>
      <View style={{ backgroundColor: "red" }}>
        <TabBarBottom {...props} />
      </View>
    </View>
  );
};

const styles = {
  actionButton: {
    backgroundColor: "#6200EE",
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    position: "absolute",
    bottom: 40,
    left: 155,
    zIndex: 999
  },
  buttonIcon: {
    textAlign: "center",
  }
}

export default TabBarNavigation;
