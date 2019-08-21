import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight, Image, Alert, Platform } from 'react-native';

import { Colors , GradientColors } from '../config/colors';
import Swipeout from 'react-native-swipeout';
import LinearGradient from 'react-native-linear-gradient';

class LyricList extends Component {

  getContent = () => {
    const { imageUrl, lyricText, singer, songName } = this.props.data;

    let fullName = this.props.isPrivateLyric ? `${songName}` : `${singer} - ${songName}`;

    return (
      <TouchableOpacity
        activeOpacity={.8}
        style={styles.shadowIos}
        onPress={() => { this.props.openLyric(this.props.data) }}
      >
        <View style={[styles.cornerRadius,styles.shadowAndroid]}>
           <Image
            source={{ uri: imageUrl || "https://www.webermarking.ie/wp-content/uploads/2017/10/headshot.jpg", cache: 'force-cache', }}
            resizeMode="cover"
            style={{
              width: 100,
              height: "100%",
            }}
          />
        <View style={styles.txtView}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={styles.title}
          >{fullName}</Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={styles.subTitle}
          >{lyricText}</Text>
        </View>
            <LinearGradient
              colors={GradientColors.getRand()}
              start={{x: 0.0, y: 0.0}}
              end={{x: 1.0, y: 0.5}}
              style={styles.bottomBorder} >

          </LinearGradient>
        </View>
      </TouchableOpacity>
    );

  }

  getSwipeButtonOption = (swipeMode) => {
    const { deleteLyric, removeLyric, index } = this.props;
    switch (swipeMode) {
      case "delete":
        return {
          text: 'Delete',
          backgroundColor: '#fff',
          color: '#F44236',
          onPress: () => deleteLyric(index)
        }
      case "removeFavourite":
        return {
          text: 'Remove',
          backgroundColor: '#fff',
          color: '#F44236',
          onPress: () => removeLyric(index)
        }
    }
  }

  render() {
    const { swipeMode } = this.props;
    const swipeoutBtns = [
      this.getSwipeButtonOption(swipeMode),
    ]

    return (
      swipeMode ? (
        <Swipeout
          autoClose
          close
          right={swipeoutBtns}
          backgroundColor={"transparent"}
        >
          {this.getContent()}
        </Swipeout>
      ) : this.getContent()
    );
  }
}


const styles = StyleSheet.create({
  shadowIos: {
    shadowOffset     : { width: 0, height: 0, },
    shadowColor      : 'black',
    shadowOpacity    : 0.15,
    shadowRadius     : 7,
  },
  shadowAndroid: {
    elevation        : 6,
  },

  cornerRadius : {
    overflow       : 'hidden',
    flexDirection  : 'row-reverse',
    alignItems     : 'center',
    backgroundColor: '#FFF',
    borderRadius   : 7,
    margin         : 10,
    height         : 100,
  },

  txtView: {
    flex     : 1,
    padding  : 10,
    alignSelf: 'stretch',

  },

  title: {
     color    : Colors.gray3,
     fontSize : 18,
     textAlign: 'right',
     alignSelf: 'stretch',

   },

  subTitle: {
    color    : Colors.gray2,
    fontSize : 16,
    textAlign: 'right',
  },

  bottomBorder: {
    position: 'absolute',
    width   : '100%',
    height  : 5,
    left    : 0,
    right   : 0,
    bottom  : 0,

  },

  })
export default LyricList;
