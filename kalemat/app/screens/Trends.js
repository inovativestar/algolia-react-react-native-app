import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert, Image, NetInfo, AsyncStorage, StatusBar } from 'react-native';
import ActionButton from 'react-native-action-button';
import TrendsListItem from '../components/TrendsListItem';
import { userManager, LyricsManager } from '../config/firebase';
import { AlgoliaFuncs } from '../config/algolia'
import { convertObjectToArray } from '../config/globalFunctions';
import { Icon } from 'react-native-elements';
import { clearSpace } from '../config/globalFunctions';
import { isArabic } from '../config/globalFunctions';
import Placeholder from 'rn-placeholder';
import TrendsPlaceholder from '../components/TrendsPlaceholder';
import HeaderSearch from '../components/HeaderSearch';
import TabsHeader from '../components/TabsHeader';
import DrawerContainer from '../components/DrawerContainer';
import NoData from '../components/NoData';
import NoInternet from '../components/NoInternet';

class Trends extends Component {

  constructor(props) {
    super(props);
    this.state = {
      config         : {},
      title          : '',
      isLoading      : true,
      isReloadingPage: false,
      timerReload    : 0,
      isLoadingSearch: false,
      data           : [],
      image          : null,
      search         : '',
      isConnected    : true,
      isMounted      : false,
      typingTimeout  : 0,
      originalData : []
    }
    this.initScreen = this.initScreen.bind(this);
    this.getData = this.getData.bind(this);
    this.getConfig = this.getConfig.bind(this);
  }

  componentDidMount = async () => {
    this.setState({ isMounted: true }, () => {
      if (this.state.isMounted) {
        this.setState({ isMounted: false }); {
          NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
          NetInfo.getConnectionInfo().then((connectionInfo) => {
            if( connectionInfo.type === 'none' ) {
              this.setState( { isConnected : false } );
            } else {
              this.setState( { isConnected : true } );
            }
            this.initScreen();
          });
        }
      }
    });

  };

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected: isConnected });
  }

  openLyric = (data) => {
    this.props.navigation.navigate('LyricDetail', { data: data })
  }

  getData (config, searching = false , searchWord) {
    if ( this.state.isConnected && ( config || this.state.config ) ) {
      // const { search } = this.state;
      if ( ! searching) {
        this.setState( { isLoading: true } );
      } else {
        this.setState( { isLoadingSearch: true } );
      }
      let dataArr = [];

      if(searchWord === undefined || searchWord === null || searchWord === 'undefined' || searchWord.length === 0) {

        if(this.state.originalData && this.state.originalData.length > 0) {

            this.setState( { data : this.state.originalData , isLoading : false , isLoadingSearch : false } );

          return;
        }
      }


      LyricsManager.getLyrics( config ? config : this.state.config, searchWord, ( item, prevChildKey, curChildKey) => {
        item._id = curChildKey;

        if( item.lyricText && item.singer && item.songName ) {
          if( searchWord === undefined || searchWord === null || searchWord === 'undefined' || searchWord.length === 0 ) {
            dataArr.push( item );
            console.log(dataArr);

          } else {
            if( item.lyricText.toLowerCase().indexOf( searchWord.toLowerCase() ) > -1 ||
                item.singer.toLowerCase().indexOf( searchWord.toLowerCase() ) > -1 ||
                item.songName.toLowerCase().indexOf( searchWord.toLowerCase() ) > -1 ) {
                    dataArr.push( item );
            }
          }
        }
        this.setState({
          data: dataArr
        });
        if( searchWord === undefined || searchWord === null || searchWord === 'undefined' || searchWord.trim().length === 0 && ! searching ) {
          this.setState( {originalData : dataArr} );
        }
        if( this.state.isLoading ) {
          this.setState( { isLoading : false } );
        }
        if( this.state.isLoadingSearch ) {
          this.setState( { isLoadingSearch : false } );
        }
      });
    }
  }


  pullToRefresh = () => {
      const { search } = this.state;
      this.setState( { isLoading : true } );
        setTimeout(() => {

          if(search.length < 3) {
            this.getData(null,false,null);
          }

          this.setState( { isLoading : false } );

      }, 300);



  }


  handleSearchInput(search) {
    search = search.trim();

    var doSearch = true;

    // if(search.match(/[A-Za-z0-9_.]/)) {doSearch = false;}
    if(search.length < 4) {doSearch = false; }
    // if(!search.match(/[\u0600-\u06FF]/)) {doSearch = false }

    this.setState({ search });

    if(doSearch) {

      this.setState({ search: search, isLoadingSearch : true});
      if(this.typingTimeout) clearTimeout(this.typingTimeout);
     /* this.typingTimeout = setTimeout(() => {
          this.getData( null, true , search );
      }, 1000);*/this.testSearch(search);

    }else{
      console.log("now you should reset the default result");
      //clearTimeout(this.typingTimeout);
      /*this.getData(null , false , null);*/


    }

  }

  testSearch = async (search) => {
    search = search.trim();
    let dataArr = [];

    // const data = await LyricsManager.searchLyrics( search ) ;
    // if( data == null) {
    //   return;
    // }
    // const result = Object.entries(data);
    // console.log("search for " + search + " #", result);


    let _this = this;
    AlgoliaFuncs.searchLyrics( search, function(key, data) {
      if( data != null ) {
        // let result = [];
        // result = Object.entries(snapshot);

        _this.setState( { data, isLoadingSearch : false } );

      }else{
        console.log("not found " + search);

      }
  } );
    /*LyricsManager.searchLyrics( search, function(key , snapshot) {
      if( snapshot != null ) {
        // let result = [];
        // result = Object.entries(snapshot);

        Object.entries(snapshot).forEach(([key, value]) => {
          console.log(`${key} ${value}`);
          value._id = key;
          dataArr.push( value );
        });

        console.log(dataArr);

        _this.setState( { data : dataArr } );

        }else{
          console.log("not found " + search);

        }
    } );*/



  }



  didFocus() {
    _this = this;
  }

  _getNetworkStatus = async () => {
    let isConnected = await NetInfo.isConnected.fetch();
    this.setState({isConnected: isConnected});
  }

  reloadPage = async () => {
    this.initScreen();
  }

  initScreen() {
    this.setState({ isReloadingPage: true, });
    this.props.navigation.setParams({ hideAdd: false });
    if (this.state.isConnected) {
      this.getConfig();
    }
  }

  checkConnection = async () => {

    this.setState({ isReloadingPage: true });
    let isConnected = await NetInfo.isConnected.fetch();
    this.setState({isConnected: isConnected});

    if(this.state.isConnected) {
      this.setState({ isReloadingPage: false });
      this.reloadPage();
    }

    if(this.timerReload) clearTimeout(this.timerReload);
    this.timerReload = setTimeout(() => {
      this.setState({ isReloadingPage: false, });
    }, 6000);


  }

  async getConfig() {
    let conf = await AsyncStorage.getItem("configuration");
    let config = JSON.parse( conf );
    this.setState({ isReloadingPage: false, config : config});
    this.getData(config, false , null);
    userManager.getUser()
      .then(user => {
        this.setState({ userIsAnonymous: user.isAnonymous })
      });
    this.props.navigation.addListener('didFocus', () => this.didFocus());
  }

  render() {
    const { isLoading, data, userIsAnonymous } = this.state;
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>

        <StatusBar
          barStyle = "dark-content"
          hidden = {false}
          backgroundColor = "#fff"
          translucent = {false}
          />
        <TabsHeader
          title="Lyrics ✨"
          navigation={this.props.navigation}
          showAddButton={ this.state.config ? !this.state.config.stopAdd : false }
          showSettingButton={false} />
          <HeaderSearch
          loading={this.state.isLoadingSearch}
          placeholder={"ابحث عن الكلمات"}
          value={this.state.search}
          handleSearch={(val) => this.testSearch(val)}
          handleSearchInput={(val) => this.handleSearchInput(val)} />
          <NoInternet
            isInternet={this.state.isConnected}
            reloadPage={() => this.checkConnection()}
            isReloadingPage={this.state.isReloadingPage} >
          <TrendsPlaceholder
            height={250}
            width="100%"
            color="#ccc"
            animate="fade"
            onReady={!isLoading} >

            <FlatList
              containerStyle={{ marginBottom: 20 }}
              contentContainerStyle={{ flexGrow: 1, }}
              columnWrapperStyle={{ padding: 5 }}
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={this.pullToRefresh} />}
              renderHeader={() => (data.length === 0 ? (<NoData />) : null)}
              data={data}
              keyExtractor={(item, index) => item._id ? item._id.toString(): item.key.toString()}
              renderItem={({ item }) => <TrendsListItem id={item._id} data={item} openLyric={this.openLyric} />}
              numColumns={2}
              enableEmptySections={true}
              ListEmptyComponent={() => !isLoading ? (<NoData />) : null} />
          </TrendsPlaceholder>
        </NoInternet>
     </View>
    );
  }
}

export default Trends;
