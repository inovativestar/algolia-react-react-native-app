import React, { Component } from 'react';
import { View, ActivityIndicator, Text, Image, StyleSheet, TouchableOpacity, Alert, Platform, StatusBar} from 'react-native';
import { Icon } from 'react-native-elements';
import GradientButton from './GradientButton';
import { Colors, GradientColors } from '../config/colors';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import MiniHeader from '../components/MiniHeader';
import { isIphoneX } from '../config/globalFunctions';

class LyricDetailHeader extends Component {

  render() {

    const PublicHeader = () => (
      <View>
        <StatusBar
        barStyle = "light-content"
        hidden = {false}
        backgroundColor = "transparent"
        translucent = {true}
        />

        <View style={{
          position: "absolute",
          width: '100%',
          height: '100%',
        }} >
            <Image
            source={{ uri: data.imageUrl, cache: 'force-cache', }}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
            }} />
        </View>
        <View
          style={{
            backgroundColor: '#000',
            opacity: 0.5,
            position: "absolute",
            width: '100%',
            height: '100%',
          }}>
        </View>
        <View style={styles.containerHeader}>
          <View style={styles.containerTitle}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={1} onPress={() => { this.props.navigation.goBack() }}>
              <Icon name="arrow-back" type="ionicons" size={26} color={Colors.white} />
            </TouchableOpacity>
            <View>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.lyricTitle}>{data.singer}</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.lyricSubTitle}>{data.songName}</Text>
            </View>
            {!userIsAnonymous &&
              <TouchableOpacity style={styles.favoriteBtn} activeOpacity={0.8} onPress={() => toggleFavourite(data)}>

              {this.props.isFavLoading &&
                <ActivityIndicator size="small" color="white" />
              }
              {!this.props.isFavLoading &&
              <Icon
                  name={favourite ? "heart" : "heart-o"}
                  color={favourite ? "#F95F8F" : "#fff"}
                  type="font-awesome"
                  size={25}
                />
              }
              </TouchableOpacity>
            }
          </View>
          {!userIsAnonymous &&
            <View style={styles.voteContainer}>
              <View style={{ flexDirection: 'row', opacity: disableVote ? 0.95 : 1 }}>
                <GradientButton
                  gradienColors={Colors.gradientRed}
                  buttonText={data.downvote || 0}
                  textStyle={{fontSize:12}}
                  css={{
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginRight: 7,
                  }}
                  onPress={() => {
                    if (!disableVote) {
                      this.props.voteLyric('down')
                    } else {
                      Alert.alert("You already rated it");
                    }
                  }}
                />
                <GradientButton
                  gradienColors={Colors.gradientGreen2}
                  buttonText={data.upvote || 0}
                  textStyle={{fontSize:12}}
                  css={{
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    borderRadius: 5
                  }}
                  onPress={() => {
                    if (!disableVote) {
                      this.props.voteLyric('up')
                    } else {
                      Alert.alert("You already rated it");
                    }
                  }}
                />
              </View>
            </View>}
        </View>
        <View style={styles.containerBottom}>
          <View style={styles.tagsContainer}>
            {data.lyricsMeta && data.lyricsMeta.map((item, index) => {
              return (
                <View style={styles.tagItem} key={index}>
                  <Text style={styles.tagItemValue}>{item.metaValue}</Text>
                </View>
              )
            })}
          </View>
        </View>
        {!userIsAnonymous && !isEditClosed && !stopEdit &&
          <TouchableOpacity
            activeOpacity={.8}
            onPress={() => editLyric()}
            style={styles.fabEdit}
          >
            <LinearGradient
              colors={Colors.gradientBlue}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 0.5 }}
              style={{ width: '100%', height: '100%', flexGrow: 1, justifyContent: 'center' }}
            >
              <Icon
                style={{ alignItems: 'center', }}
                name="edit"
                type="ionicons"
                size={26}
                color={"#FFF"}
              />
            </LinearGradient>
          </TouchableOpacity>
        }
      </View>
    );
    const PrivateHeader = () => (<MiniHeader title={"Private Lyric"} rightBtnTxt="Edit" rightBtnAction={() => editLyric()} />);

    const {
      data,
      favourite,
      toggleFavourite,
      disableVote,
      isPrivateLyric,
      userIsAnonymous,
      isEditClosed,
      editLyric,
      onLayout,
      stopEdit
    } = this.props;
    return (
      <View onLayout={onLayout} style={styles.container}>
        {!isPrivateLyric && <PublicHeader />}
        {isPrivateLyric && <PrivateHeader />}
      </View>
    );
  }
}
export default withNavigation(LyricDetailHeader);
const styles = StyleSheet.create({
  lyricTitle: { fontSize: 44, color: "#fff", flex: 1, textAlign: 'center', justifyContent: 'center', },
  lyricSubTitle: { fontSize: 18, color: "#fff", opacity: 0.9, flex: 1, justifyContent: 'center', textAlign: 'center', },
  voteContainer: { alignItems: 'flex-start', },
  favoriteBtn: { alignItems: 'flex-end', },
  backBtn: { alignItems: 'flex-start', },
  containerTitle: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  fabEdit: {
    overflow: 'hidden',
    borderRadius: 30,
    width: 56,
    aspectRatio: 1.0,
    position: "absolute",
    right: 15,
    bottom: 35,
    zIndex: 99999,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  tagItem: {
    shadowOffset: { width: 0, height: 0, },
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderRadius: 5,
    elevation: 13,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginRight: 7
  },
  tagItemValue: {
    color: Colors.gray2,
    fontSize: 12,
    textAlign: 'center',
  },
  containerHeader: {
    padding: 15,
    paddingTop: 50,
    zIndex: 999,
    height: isIphoneX() ? 240 : 210,
  },
  containerBottom: {
    height: 60,
    padding: 15,
    backgroundColor: '#fff',
    position: 'relative',
  },
  container: {
    zIndex: 99
  },
})
