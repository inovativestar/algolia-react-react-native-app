import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, RefreshControl, Alert, NetInfo, AsyncStorage } from 'react-native';
import LyricList from '../components/LyricList';
import { LyricsManager, userManager } from '../config/firebase';
import firebase from 'react-native-firebase';
import { convertObjectToArray } from '../config/globalFunctions';
import ListPlaceholder from '../components/ListPlaceholder';
import NoData from '../components/NoData';
import HeaderSearch from '../components/HeaderSearch';
import ActionButton from 'react-native-action-button';
import { FloatingAction } from 'react-native-floating-action';
import { Icon } from 'react-native-elements';
import TabsHeader from '../components/TabsHeader';
import { clearSpace } from '../config/globalFunctions';

class MyLyrics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      isLoading: true,
      isLoadingSearch: false,
      data: [],
      search: '',
      isConnected: true,
      originalData : []
    }
    this.arrayholder = [];
    this.getData = this.getData.bind(this);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected: isConnected });
    this.getData();
  }

  componentWillMount = async () => {
  }

  componentDidMount = async () => {
    this.initScreen();
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      if( connectionInfo.type === 'none' ) {
        this.setState( { isConnected : false } );
      } else {
        this.setState( { isConnected : true } );
      }
      this.getData();
    });
  };

  async saveMyLyrics () {
    if( this.state.data == null || this.state.data.length == 0 ) {
      return;
    } else {
      await AsyncStorage.setItem('MY_LYRICS', JSON.stringify( this.state.data ));
    }
  }

  openLyric = (data) => {
    this.props.navigation.navigate('LyricDetail', { data: data, isPrivateLyric: true })
  }

  deleteLyric = (index) => {
    const { _id, songName } = this.state.data[index];
    Alert.alert(
      `Delete  ${songName}`,
      "Are you sure you want to delete ?",
      [
        { text: 'No', onPress: () => null, style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const response = await LyricsManager.deletePrivateLyric(_id);
            let dataCopy = [...this.state.data];
            dataCopy.splice(index, 1);
            this.setState({ data: dataCopy });
          }
        },
      ],
      { cancelable: false }
    )
  }

  getData (searching = false) {
      if (!searching) {
        this.setState({ isLoading: true });
      } else {
        this.setState({ isLoadingSearch: true });
      }
      let dataArr = [];
      if( this.state.isConnected ) {
        firebase.auth().onAuthStateChanged((user) => {
            LyricsManager.getMyLyrics( user.uid, ( item, key ) => {
              item._id = key;
              if( item.lyricText && item.songName ) {
                if( this.state.search.length > 0 ) {
                  if( item.lyricText.toLowerCase().indexOf( this.state.search.toLowerCase() ) > -1 ||
                      item.songName.toLowerCase().indexOf( this.state.search.toLowerCase() ) > -1 ) {
                          dataArr.push( item );
                      }
                } else {
                  dataArr.push( item );
                }
              }
              this.setState( { data : dataArr } );
              if( this.state.search === undefined || this.state.search === null || this.state.search === 'undefined' || this.state.search.trim().length === 0 && ! searching ) {
                this.setState( {originalData : dataArr} );
              }
              if( this.state.isLoading ) {
                this.setState( { isLoading : false } );
              }
              if( this.state.isLoadingSearch ) {
                this.setState( { isLoadingSearch : false } );
              }
              this.saveMyLyrics();
            } );
        });
      } else {
        AsyncStorage.getItem('MY_LYRICS').then( (data) => {

          var dataArr = [];
          if( data != null ) {
            var myLyrics = JSON.parse(data);
            myLyrics.map( ( item ) => {
              if( item.lyricText && item.singer && item.songName ) {
                if( this.state.search.length > 0 ) {
                  if( item.lyricText.toLowerCase().indexOf( this.state.search.toLowerCase() ) > -1 ||
                      item.singer.toLowerCase().indexOf( this.state.search.toLowerCase() ) > -1 ||
                      item.songName.toLowerCase().indexOf( this.state.search.toLowerCase() ) > -1 ) {
                          dataArr.push( item );
                          this.setState( { data : dataArr } );
                  }
                } else {
                  dataArr.push( item );
                  this.setState( { data : dataArr } );
                }
              }
              if( this.state.isLoading ) {
                this.setState( { isLoading : false } );
              }
              if( this.state.isLoadingSearch ) {
                this.setState( { isLoadingSearch : false } );
              }
            });
          }

        });

      }
  }

  handleSearch() {
  }

  searchFilterFunction = text => {
    const clearedText = text;
    this.setState({
      search: clearedText.trim()
    });
    if( clearedText.trim().length > 0 ) {
        this.getData();
    } else {
      this.setState( { data : this.state.originalData } );
    }
  }


  didFocus() {
    _this = this;
    this.props.navigation.setParams({
      title: this.state.search
    });
  }

  initScreen = async () => {
      this.getData();
      this.props.navigation.addListener('didFocus', () => this.didFocus());
  }

  render() {
    const { isLoading, data } = this.state;
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <TabsHeader
          title="My Lyrics ✨"
          navigation={this.props.navigation}
          showAddButton={true}
          showSettingButton={false}
          isPrivateLyric={true} />
        <HeaderSearch
          loading={this.state.isLoadingSearch}
          value={this.state.search}
          handleSearch={() => this.handleSearch()}
          handleSearchInput={(val) => this.searchFilterFunction(val)} />
        <ListPlaceholder
          animate='fade'
          onReady={!isLoading} >
          <FlatList
            contentContainerStyle={{
              paddingVertical: 10,
            }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={this.getData} />
            }
            // renderHeader={() => (data.length === 0 ? (<Text>No data</Text>) : null)}
            data={data}
            keyExtractor={(item, index) => item._id.toString()}
            renderItem={({ item, index }) => (
              <LyricList
                id={item._id}
                swipeMode="delete"
                isPrivateLyric={true}
                deleteLyric={this.deleteLyric}
                index={index}
                data={item}
                openLyric={this.openLyric} />
            )}
            enableEmptySections={true}
            ListEmptyComponent={() => <NoData />} />
        </ListPlaceholder>

      </View>
    );
  }
}

export default MyLyrics;
