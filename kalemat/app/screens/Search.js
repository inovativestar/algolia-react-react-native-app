import React, { PureComponent } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, TouchableHighlight, TextInput, Image, Platform } from 'react-native';
import LyricList from '../components/LyricList';
import { Icon, Button } from 'react-native-elements';
import { LyricsManager, userManager } from '../config/firebase';
import { InstantSearch } from 'react-instantsearch/native';
import { connectInfiniteHits, connectSearchBox, connectStateResults } from 'react-instantsearch/connectors';
import { algoliaConfig } from '../config/config';
import { convertObjectToArray } from '../config/globalFunctions';

const Loading = connectStateResults(({ searching, children, totalItem, navigateToAddLyric }) => (
  <View>
    {searching === false && totalItem === 0 ? (
      <View style={{ alignItems: 'center', marginVertical: 20, }}>
        <Text
          style={{ fontSize: 20, color: "#444", textAlign: 'center', }}>
          Can't find your lyrics ?
        </Text>
        <Button
          title='Add it now!'
          color="#fff"
          buttonStyle={{
            backgroundColor: "#444",
            borderRadius: 5,
            marginTop: 20,
            marginBottom: 10,
            paddingHorizontal: 30,
          }}
          onPress={navigateToAddLyric}/>
      </View>
      ) : (
        <View>
          {children}
        </View>
      )}
  </View>
));

const TabsStyles = {
  container: {
    backgroundColor: '#444',
    flexDirection: 'row'
  },
  touchable: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    backgroundColor: '#444',
    borderBottomWidth: 3,
    borderBottomColor: '#444'
  },
  withBorder: {
    borderBottomColor: 'orange'
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff'
  }
}

const Tabs = ({changeSearchTypeHandler, searchType, getDataFromFirebaseHandler}) =>
  <View style={TabsStyles.container}>
    <TouchableHighlight style={[TabsStyles.touchable, (searchType === 'ALL') && TabsStyles.withBorder]} onPress={() => {
      changeSearchTypeHandler('ALL')
      getDataFromFirebaseHandler('ALL')
    }}>
      <Text style={TabsStyles.text}>All</Text>
    </TouchableHighlight>

    <TouchableHighlight style={[TabsStyles.touchable, (searchType === 'FAVOURITES') && TabsStyles.withBorder]} onPress={() => {
      changeSearchTypeHandler('FAVOURITES')
      getDataFromFirebaseHandler('FAVOURITES')
    }}>
      <Text style={TabsStyles.text}>Favourites</Text>
    </TouchableHighlight>

    <TouchableHighlight style={[TabsStyles.touchable, (searchType === 'MY_LYRICS') && TabsStyles.withBorder]} onPress={() => {
      changeSearchTypeHandler('MY_LYRICS')
      getDataFromFirebaseHandler('MY_LYRICS')
    }}>
      <Text style={TabsStyles.text}>My lyrics</Text>
    </TouchableHighlight>
  </View>

const Hits = connectInfiniteHits(({
    hits,
    hasMore,
    refine,
    openLyric,
    navigateToAddLyric,
    changeSearchTypeHandler,
    searchType,
    getDataFromFirebaseHandler,
    data,
    searchWordChangeHandler,
    userIsAnonymous
  }) => {
  const onEndReached = function () {
    if (hasMore) {
      refine();
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <SearchBox searchWordChangeHandler={searchWordChangeHandler} />
      {!userIsAnonymous && <Tabs changeSearchTypeHandler={changeSearchTypeHandler} searchType={searchType} getDataFromFirebaseHandler={getDataFromFirebaseHandler} />}
      <View style={{ flex: 1 }}>
        <Loading totalItem={searchType === 'ALL' ? hits.length : data.length} navigateToAddLyric={navigateToAddLyric}>
          <FlatList
            contentContainerStyle={{
              paddingVertical: 10,
              flexGrow: 1,
            }}
            data={searchType === 'ALL' ? hits : data}
            onEndReached={onEndReached}
            keyExtractor={(item, index) => item.objectID}
            renderItem={({ item, key }) => (<LyricList key={key} id={item.objectID} data={item} openLyric={openLyric} />)}
          />
        </Loading>
      </View>
    </View>
  )
});

const SearchBox = connectSearchBox(({ refine, currentRefinement, searchWordChangeHandler }) => {
  return (
    <View style={{ backgroundColor: "#444", height: Platform.OS === 'ios' ? 75 : 60, padding: 10, paddingTop: Platform.OS === 'ios' ? 25 : 10, }}>
      <View style={{ backgroundColor: '#fff', flex: 1, borderRadius: 5, alignItems: 'center', flexDirection: 'row', padding: 10 }}>
        <Icon name="search" type="font-awesome" size={15} color={"#444"} />
        <TextInput
          autoFocus
          ref={(search) => this.search = search}
          style={{ height: 40, width: '100%', marginLeft: 5, }}
          onChangeText={text => { refine(text); searchWordChangeHandler(text) }}
          value={currentRefinement}
          placeholder={"Search lyrics..."}
          autoCorrect={false}
          spellCheck={false}
          autoCapitalize={'none'}
          returnKeyType={"search"}
          placeholderTextColor="#444"
          underlineColorAndroid="transparent"
          clearButtonMode={'always'}
        />
      </View>
    </View>
  );
});

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      searchType: 'ALL',
      data: [],
      filteredData: [],
      searchWord: '',
      userIsAnonymous: false
    }
  }

  componentDidMount() {
    userManager.getUser()
      .then(user => {
        this.setState({userIsAnonymous: user.isAnonymous})
      })
  }

  openLyric = (data) => {
    this.props.navigation.navigate('LyricDetail', { data: data })
  }

  searchWordChangeHandler = searchWord => {
    this.setState({ searchWord  }, () => {
      this.filterData(searchWord)
    })
  }

  filterData = searchWord => {
    this.setState(prevState => {
      if(searchWord.length === 0)
        return { filteredData: [] }
      let filteredData = prevState.data.filter(song => song.songName.match(new RegExp(searchWord, 'i')))
      return { filteredData }
    })
  }

  navigateToAddLyric = () => {
    this.props.navigation.navigate('AddLyric')
  }

  changeSearchTypeHandler = searchType => {
    this.setState(prevState => {
      let nextState = { searchType }
      if(searchType !== prevState.searchType)
        nextState.filteredData = []
      return nextState
    })
  }

  getDataFromFirebaseHandler = async dataType => {
    switch (dataType) {
      case 'FAVOURITES':
          this.setState({ data: convertObjectToArray(await LyricsManager.getMyFavouriteLyrics()) })
        break;
      case 'MY_LYRICS':
          this.setState({ data: convertObjectToArray(await LyricsManager.getMyLyrics()) })
        break;
      default:
        this.setState({ data: [] })
    }
  }

  render() {
    return (
      <InstantSearch
        appId={algoliaConfig.appId}
        apiKey={algoliaConfig.apiKey}
        indexName={algoliaConfig.indexName} >
        <View style={{ height: '100%' }}>
          <Hits
            openLyric={this.openLyric}
            navigateToAddLyric={this.navigateToAddLyric}
            changeSearchTypeHandler={this.changeSearchTypeHandler}
            searchType={this.state.searchType}
            data={this.state.filteredData}
            getDataFromFirebaseHandler={this.getDataFromFirebaseHandler}
            searchWordChangeHandler={this.searchWordChangeHandler}
            userIsAnonymous={this.state.userIsAnonymous} />
        </View>
      </InstantSearch>
    );
  }
}

export default Search;
