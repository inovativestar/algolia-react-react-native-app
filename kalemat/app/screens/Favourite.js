import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, RefreshControl, Alert, NetInfo, AsyncStorage } from 'react-native';
import LyricList from '../components/LyricList';
import { LyricsManager } from '../config/firebase';
import { convertObjectToArray } from '../config/globalFunctions';
import ListPlaceholder from '../components/ListPlaceholder';
import NoData from '../components/NoData';
import HeaderSearch from '../components/HeaderSearch';
import TabsHeader from '../components/TabsHeader';
import { clearSpace } from '../config/globalFunctions';
import firebase from 'react-native-firebase';

class Favourite extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      isLoading: true,
      isLoadingSearch: false,
      data: [],
      search: '',
      isConnected: true,
      isMounted: false
    }
    this.arrayholder = [];
    this.getData = this.getData.bind(this);
  }

  openLyric = (data) => {
    this.props.navigation.navigate('LyricDetail', { data: data })
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected: isConnected });
    this.getData();
  }

  componentWillMount() {
  }

  componentDidMount () {
    this.setState({ isMounted: true }, () => {
      if (this.state.isMounted) {
        this.setState({ isMounted: false }); {
          this.props.navigation.setParams({ hideAdd: true });
          this.props.navigation.addListener('didFocus', () => this.didFocus());
          NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
          NetInfo.getConnectionInfo().then((connectionInfo) => {
            if( connectionInfo.type === 'none' ) {
              this.setState( { isConnected : false } );
            } else {
              this.setState( { isConnected : true } );
            }
            this.getData();
          });
        }
      }
    });
  }

  getData (searching = false) {
      search = this.state.search;
      if (!searching) {
        this.setState({ isLoading: true });
      } else {
        this.setState({ isLoadingSearch: true });
      }
      if( this.state.isConnected ) {
        firebase.auth().onAuthStateChanged((user) => {
          if(user) {
            let dataArr = [];
            LyricsManager.getFavouriteLyrics( user, ( userFavourite ) => {
              for (var i = 0; i < userFavourite.length; i++) {
                let key = userFavourite[i];
                LyricsManager.getLyricItem( key, (item) => {
                  if( item == null || key == null ) {
                    return;
                  }
                  item._id = key;
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
                  this.setState( { data : dataArr } );
                  if( this.state.isLoading ) {
                    this.setState( { isLoading : false } );
                  }
                  if( this.state.isLoadingSearch ) {
                    this.setState( { isLoadingSearch : false } );
                  }
                  if( userFavourite[ userFavourite.length - 1 ] === key ) {
                      this.saveFavourites( dataArr );
                  }
                } );
              }
            } );
          }
        });
      } else {
        let dataArr = [];
        this.getDataFromCache();
      }
  }

  async getDataFromCache() {
    try {
      const favouritesItem =  await AsyncStorage.getItem('favourites');

      if( favouritesItem == null ) {
        this.setState({
          isLoading: false,
          isLoadingSearch: false
        });
        return;
      }
      const favourites = JSON.parse(favouritesItem);
      var dataArr = [];
      if( favourites != null ) {
        favourites.map( ( item ) => {
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
        } );
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveFavourites (favourites) {
    if( favourites == null || favourites.length == 0 ) {
      return;
    } else {
      await AsyncStorage.setItem('favourites', JSON.stringify( favourites ));
    }
  }

  searchFilterFunction = text => {
    const clearedText = text;
    this.setState({
      search: clearedText.trim()
    }, () => {
      if( clearedText.trim().length > 0 ) {
          this.getData(true);
      }

    });
  }

  handleSearch() {
  }

  searchValue() {
    return this.state.search;
  }

  didFocus() {
    _this = this;
    this.props.navigation.setParams({
      title: this.state.search,
    });
  }

  removeLyric = (index) => {
    const data = this.state.data[index];
    const { _id, singer, songName } = data;
    Alert.alert(
      `Remove ${singer} - ${songName}`,
      "Are you sure you want to delete ?",
      [
        { text: 'No', onPress: () => null, style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const response = await LyricsManager.toggleLyricFavourite(data);
            let dataCopy = [...this.state.data];
            dataCopy.splice(index, 1);
            this.setState({ data: dataCopy });
          }
        },
      ],
      { cancelable: false }
    )
  }

  render() {
    const { isLoading, data } = this.state;
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <TabsHeader
          title={"المفضلة ✨"}
          navigation={this.props.navigation}
          showAddButton={false}
          showSettingButton={true} />
        <HeaderSearch
          loading={this.state.isLoadingSearch}
          value={this.state.search}
          handleSearch={() => this.handleSearch()}
          handleSearchInput={(val) => this.searchFilterFunction(val)} />
          <ListPlaceholder
            animate='fade'
            onReady={!isLoading}>
          <FlatList
            contentContainerStyle={{
              paddingVertical: 10,
            }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={this.getData}/>
            }
            // renderHeader={() => (data.length === 0 ? (<Text>No data</Text>) : null)}
            data={data}
            keyExtractor={(item, index) => item._id.toString()}
            renderItem={({ item, index }) => (
              <LyricList
                removeLyric={this.removeLyric}
                swipeMode="removeFavourite"
                id={item._id}
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


export default Favourite;
