import React, { PureComponent, Fragment } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import { fetchSingers } from '../config/firebase';
import { searchSingers } from '../config/firebase';
import { convertObjectToArray } from '../config/globalFunctions';

const AutocompleteList = ({ data, inputAutocompleteHandler }) =>
    <TouchableOpacity onPress={() => inputAutocompleteHandler(data)} >
        <ListItem
        roundAvatar
        avatar={{uri:data[1].imageUrl}}
        title={data[1].name} />
    </TouchableOpacity>

class AutoComplete extends PureComponent {

    state = {
        loading: true,
        error: false,
        limit: 6,
        data: [],
        dataToShow: []
    };
    data = [];

    async componentDidMount() {
        try {
            await this.fetchData()
            this.filterdataToShow()
        } catch (error) {
            console.warn('Error componentDidMount: ', error)
        }
    }

    componentWillReceiveProps() {
      this.filterdataToShow()
    }

    fetchData = async () => {
        try {
            // this.data = await fetchSingers();
            // this.data = Object.entries(this.data);
            this.setState({ loading: false })
        } catch (error) {
            console.warn('Error fetchData: ', error)
            this.setState({ error: true })
        }
    }

    filterdataToShow() {
      const { limit, loading } = this.state
      const { searchWord } = this.props;
      this.searchWord = searchWord;
      if (loading) {return}
      let _this = this;
      searchSingers( searchWord, function(snapshot) {
        if( snapshot != null ) {
          _this.data = Object.entries(snapshot);
          const dataArr = _this.data;
          if (searchWord) {
              _this.setState({ dataToShow: dataArr.filter(word => {
                if( word[1].name.toLowerCase().substring(0,1).indexOf( searchWord.toLowerCase().substring(0,1) ) > -1 ) {
                  return true;
                } else {
                  return false;
                }
              })});
          } else {
            _this.setState({ dataToShow: _this.data.slice(-limit) });
          }
        } else {
          _this.setState({ dataToShow: [] });
        }
      } );
      // const dataArr = this.data;
      // if (searchWord) {
      //     this.setState({ dataToShow: dataArr.filter(word => {
      //       if( word[1].name.toLowerCase().indexOf( searchWord.toLowerCase() ) > -1 ) {
      //         return true;
      //       } else {
      //         return false;
      //       }
      //     })});
      // } else {
      //     this.setState({ dataToShow: dataArr.slice(-limit) });
      // }
    }

    renderList = () => {
        const { loading, error, dataToShow } = this.state;
        return <Card containerStyle={{ backgroundColor: 'red', marginTop: 0 }}>
            {loading && <Text style={{ fontSize: 17 }}>Loading...</Text>}
            {error && <Text style={{ fontSize: 17 }}>Error</Text>}
            {dataToShow.length === 0 && <Text style={{ fontSize: 17 }}>Singer was not found</Text>}
            {!loading && !error && dataToShow.length !== 0 && dataToShow.map((item) => <AutocompleteList
                key={item[0]}
                data={item}
                inputAutocompleteHandler={this.props.inputAutocompleteHandler}
            />)}
        </Card>
    }

    render = () => {
        this.renderList();
        if( this.props.searchWord !== this.searchWord ) {
          this.filterdataToShow();
        }
        if (this.props.show)
            return this.renderList()
        else
            return <View />
    }

}
export default AutoComplete;
