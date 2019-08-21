import React, { Component } from 'react';
import { StyleSheet, Animated, View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, Alert, PanResponder, Dimensions, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import LyricDetailHeader from '../components/LyricDetailHeader';
import { LyricsManager, userManager } from '../config/firebase';
import DetailPlaceholder from '../components/DetailPlaceholder';
import firebase from 'react-native-firebase';
import PTRView from 'react-native-pull-to-refresh';
import { Colors, GradientColors } from '../config/colors';
import LinearGradient from 'react-native-linear-gradient';

class LyricDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      config: {},
      isLoading: true,
      favourite: false,
      isPendingLyric: true,
      disableVote: false,
      userIsAnonymous: true,
      isEditClosed: false,
      isPrivateLyric: this.props.navigation.getParam('isPrivateLyric', false),
      lyricData: this.props.navigation.getParam('data', null),
      lyricHeaderHeight: 0,
      showCloseBtn: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentWillMount = async () => {
    this.props.navigation.setParams({ isPandingEdit: false });
    const userData = await userManager.getUser();
    AsyncStorage.getItem("configuration").then((value) => {
      let config = JSON.parse( value );
      this.setState( config );
    });
  };

  componentDidMount () {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.loadData(user);
        this.onChangeFavourite = firebase.database().ref(`users/${user.uid}/favourite`);
        this.onChangeFavourite.on("value", this.onChangeFavouriteStatus);
      }
    });
  };

  componentWillUnmount = () => {
    if (this.onChangeFavourite !== null) {
      this.onChangeFavourite.off("value", this.onChangeFavouriteStatus);
    }
  }

  toggleFavourite = async (data) => {
    this.setState({ isFavLoading:true});
    const res = await LyricsManager.toggleLyricFavourite(data);
    if (JSON.stringify(res.snapshot) == "null") this.setState({ favourite: false ,isFavLoading:false });
  }

  checkFavourite = (data, lyricId) => {
    if (data === null) return false;
    const userFavouriteValues = Object.values(data);
    return userFavouriteValues.indexOf(lyricId) !== -1;
  }

  voteLyric = async (status) => {
    if (!this.state.disableVote) {
      this.setState({ disableVote: true });
      const { _id, objectID } = this.props.navigation.state.params.data;
      const lyricId = _id || objectID;
      const checkVoteLyric = await LyricsManager.checkVoteLyric(lyricId);
      const response = await LyricsManager.voteLyric(lyricId, status, checkVoteLyric);
      if (response.committed) {
        let dataCopy = { ...this.state.data };
        const rating = dataCopy[`${status}vote`];
        dataCopy[`${status}vote`] = (rating || 0) + 1;

        this.setState({ data: dataCopy });
      } else {
        Alert.alert("Please revote")
      }
    }
  }

  onChangeFavouriteStatus = (newParam) => {
    const values = newParam.val();
    const valuesType = typeof values;
    if (valuesType === "string" || values === null) return;
    const favArr = Object.values(values);
    const { _id, objectID } = this.props.navigation.state.params.data;
    const lyricId = _id || objectID;
    if (favArr.indexOf(lyricId) === -1) {
      this.setState({ favourite: false });
    } else {
      this.setState({ favourite: true });
    }
    this.setState({ isFavLoading:false});

  }

  editLyric = (data) => {
    const lyricId = this.props.navigation.state.params.data._id;
    this.props.navigation.navigate('EditLyric', { id: lyricId, data: this.state.lyricData, isPrivateLyric: this.state.isPrivateLyric })
  }

  loadData(userData) {
    try {
      const { _id, objectID } = this.props.navigation.state.params.data;
      const lyricId = _id || objectID;
      this.setState({ userIsAnonymous: userData.isAnonymous })
      const data = this.props.navigation.state.params.data;
      LyricsManager.viewCountIncrease(lyricId, userData.uid, ( count ) => {
      } );
      LyricsManager.getFavouriteLyrics( userData, ( userFavourite ) => {
        this.setState( { favourite: this.checkFavourite(userFavourite, lyricId) } );
      } );
      LyricsManager.checkVoteLyric( userData, lyricId, ( checkVoteLyric ) => {
        if (JSON.stringify(checkVoteLyric) !== "null") this.setState({ disableVote: true });
      });
      LyricsManager.checkLyricPending(lyricId, (checkEdited) => {
        this.setState( { checkEdited : checkEdited, isPendingLyric : JSON.stringify(checkEdited) !== "null" } );
        this.props.navigation.setParams({ isPandingEdit: JSON.stringify(checkEdited) !== "null" });
      } );
      this.setState({ isEditClosed: data.isEditClosed });
      data["_id"] = lyricId;
      let loadedData = {
        data,
        isLoading: false,
      }
      this.setState(loadedData);
    } catch (e) {
      console.log('Error at LyricDetail.getData ', e)
    }
  }

  handleScroll = (e) => {
    const pov = e.nativeEvent.contentOffset.y;
    if (pov > this.state.lyricHeaderHeight - 50) {
      this.setState({ showCloseBtn: true });
    } else if (pov < this.state.lyricHeaderHeight - 50) {
      this.setState({ showCloseBtn: false });
    }
  }

  find_dimesions(layout) {
    const { x, y, width, height } = layout;
    this.setState({ lyricHeaderHeight: height });
  }

  renderMain() {
    const {
      lyricHeaderHeight,
      data,
      isLoading,
      userIsAnonymous,
      isEditClosed,
      isPrivateLyric
    } = this.state;
    if( this.state.data ) {
      const { _id, objectID } = data;
      const lyricId = _id || objectID;
      return(
        <ScrollView
          onScroll={this.handleScroll}
          scrollEventThrottle={2206}
           contentContainerStyle={{ backgroundColor: '#fff', flexGrow:1}}>
          <LyricDetailHeader
            onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}
            isPrivateLyric={isPrivateLyric}
            data={data}
            lyricId={lyricId}
            disableVote={this.state.disableVote}
            favourite={this.state.favourite}
            isFavLoading={this.state.isFavLoading}
            toggleFavourite={this.toggleFavourite}
            editLyric={this.editLyric}
            voteLyric={this.voteLyric}
            userIsAnonymous={userIsAnonymous}
            isEditClosed={!!isEditClosed}
            stopEdit={this.state.config.stopEdit} />
          <View style={{ paddingVertical: 20, }}>
            <Text style={{ textAlign: 'center', fontSize: 20, color: "#444", lineHeight: 32, paddingHorizontal: 35, }}>
              {data && data.lyricText}
            </Text>
          </View>
        </ScrollView>
      );
    }
  }

  renderHeader() {
    if( this.state.showCloseBtn ) {
      return(
        <TouchableOpacity
          activeOpacity={.8}
          onPress={() => this.props.navigation.goBack()}
          style={styles.closeButtonStyle} >
          <LinearGradient
            colors={Colors.gradientBlack}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.5 }}
            style={{ width: '100%', height: '100%', flexGrow: 1, justifyContent: 'center' }} >
            <Icon
              style={{ alignItems: 'center', }}
              name="close"
              type="ionicons"
              size={26}
              color={"#FFF"} />
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  }

  render() {
    const {
      lyricHeaderHeight,
      data,
      isLoading,
      userIsAnonymous,
      isEditClosed,
      isPrivateLyric
    } = this.state;
    const { _id, objectID } = this.props.navigation.state.params.data;
    const lyricId = _id || objectID;
    return (
      <View style={{ flex: 1, backgroundColor: '#444', }}>
        <Text style={{position:"absolute",color:'#fff',width:'100%',top:'40%',textAlign:"center"}}>اموت واعرف ايش تدور؟ 🤔</Text>
          {this.renderHeader()}
          {this.renderMain()}
      </View>
    );
  }

}

export default LyricDetail;

const styles = StyleSheet.create({

  closeButtonStyle: {
    overflow: 'hidden',
    opacity: 0.8,
    borderRadius: 30,
    width: 45,
    aspectRatio: 1.0,
    position: "absolute",
    left: 10,
    top: 25,
    zIndex: 9999,
  },

})
