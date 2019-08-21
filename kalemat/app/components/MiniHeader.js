import React, { Component } from 'react';
import { Colors, GradientColors } from '../config/colors';
import { isIphoneX } from '../config/globalFunctions';
import { withNavigation } from 'react-navigation';

import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Platform, Dimensions, StatusBar } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';
import { Icon, Header, SearchBar, colors } from 'react-native-elements';
import Placeholder from 'rn-placeholder';


class MiniHeader extends Component {


  render() {
    const iconName = this.props.showCloseBtn ? "close" : "arrow-back"
    const headerHeight = isIphoneX() ? 120 : 95


    return (
      <View>
        <StatusBar
        barStyle = "light-content"
        hidden = {false}
        backgroundColor = "transparent"
        translucent = {true}
         />

        <View style={[styles.header, { height: headerHeight }]}>
          <Svg viewBox="0 0 379 96" height={headerHeight} width="100%" preserveAspectRatio="none" >
            <Defs>
              <LinearGradient x1="-24.68189%" y1="-38.9962877%" x2="100%" y2="119.817088%" id="LinearGradientID">
                <Stop stopColor="#35E4FB" offset="0%"></Stop>
                <Stop stopColor="#57C0FC" offset="48.3178288%"></Stop>
                <Stop stopColor="#8194FE" offset="100%"></Stop>
              </LinearGradient>
            </Defs>
            <G id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <G id="Header/small" fill="url(#LinearGradientID)">
                <Path d="M1.36424205e-12,6.04844445e-07 L379,6.04844445e-07 L378.999982,83.3091485 C336.999994,96.4363828 270.666667,98.6666667 180,90 C89.3333333,81.3333333 29.333341,80 2.29310222e-05,86 L1.36424205e-12,6.04844445e-07 Z" id="Rectangle-5" transform="translate(189.500000, 47.584821) scale(-1, 1) translate(-189.500000, -47.584821) "></Path>
              </G>
            </G>
          </Svg>

          <View style={styles.navbar}>
            <TouchableOpacity style={styles.leftBtn} activeOpacity={1} onPress={() => { this.props.navigation.goBack() }}>
              <Icon name={iconName} type="ionicons" size={26} color={Colors.white} />
            </TouchableOpacity>
            <Text numberOfLines={1} style={{ textAlign:'center', fontSize: 30, color: Colors.white, flex: 1 }}>{this.props.title}</Text>
            <TouchableOpacity style={styles.rightBtn} activeOpacity={1} onPress={() => { this.props.rightBtnAction() }}>
              <Text style={{ fontSize: 17, color: Colors.white }}>{this.props.rightBtnTxt}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  header: {
    width: "100%",
    position: "relative",
    backgroundColor: '#fff'
  },
  navbar: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 65,
    bottom: 10,
    position: "absolute",
    width: '100%',
    paddingHorizontal: 15,

  },

  leftBtn: {
    paddingVertical: 15,
    paddingRight: 20,
    flex: .2
  },
  rightBtn: {
    paddingVertical: 15,
    paddingLeft: 20,
    flex: .2
  },


});


export default withNavigation(MiniHeader);
