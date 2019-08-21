import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Platform, Dimensions } from 'react-native';
import { Colors , GradientColors } from '../config/colors';
import unknown from '../assets/images/unknown.jpg';
import LinearGradient from 'react-native-linear-gradient';

const DEVICE_WIDTH  = Dimensions.get('window').width;

class TrendsListItem extends Component {

  openLyric = () => {
    this.props.openLyric(this.props.data);
  }

  render() {
    const { _id, imageUrl, singer, songName, subtitle, viewCount } = this.props.data;
    return (
      <TouchableOpacity activeOpacity={.8} style={[styles.container]} onPress={this.openLyric} >
        <View style={styles.imgWrapperr}>
           <ImageBackground
              source={{ uri: imageUrl || "https://www.webermarking.ie/wp-content/uploads/2017/10/headshot.jpg" , cache: 'force-cache', }}
              resizeMode="cover"
              style={styles.bgImage}>
          </ImageBackground>
        </View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={styles.titleStyle}>
          {singer}
        </Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={styles.subTitleStyle}>
          {songName}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default TrendsListItem;

const styles = StyleSheet.create({

  subTitleStyle: {
    color: Colors.gray3,
    fontSize: 14,
    textAlign: "right",
  },

  titleStyle: {
    color: Colors.gray4,
    textAlign: "right",
    fontSize: 16,
  },
  imgWrapperr:{
    flex: 1,
    shadowOffset     : { width: 0, height: 0, },
    shadowColor      : 'black',
    shadowOpacity    : 0.15,
    shadowRadius     : 10,
    elevation        : 13,
  },
  bgImage: {
    borderRadius:8,
    overflow:'hidden',

    width: "100%",
    height: "100%",
  },

  container: {
    width: "50%",
    aspectRatio: 0.8,
    marginBottom: 12,
    paddingHorizontal: 8,
    position: 'relative',
  },
})
