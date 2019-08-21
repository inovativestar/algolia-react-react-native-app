import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet, AsyncStorage, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Icon } from 'react-native-elements';

import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import GradientButton from './GradientButton';
import { Colors, GradientColors } from '../config/colors';
import { fetchSingers } from '../config/firebase';
import { clearSpace } from '../config/globalFunctions';

import AutoComplete from './AutoComplete'
import UserInput from './UserInput';

class AddLyricForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singerID: "",
      singer: "",
      songName: "",
      metaData: {
        tone: "",
        rhythm: "",
      },
      songText: "",
      imageUrl: null,
      error: {},
      singerOnFocus: false,
      isPrivateLyric: this.props.isPrivateLyric
    }
  }

  onChangeState = (state) => {
    this.setState(state, () => {
      try {
        const { singerID, singer, songName, metaData, songText } = this.stateWithoutSpace();
        AsyncStorage.setItem("addLyricDraft", JSON.stringify({ singerID, singer, songName, metaData, songText }));
      } catch (error) { }
    })
  }

  inputAutocomplete = data => {
    console.log("sinnnnn", data);
    this.setState({ singer: data[1].name , singerID: data[0] , imageUrl: data[1].imageUrl }, () => (this.setState({ singerOnFocus: false })))
  }

  stateWithoutSpace = () => {
    let { singerID, singer, imageUrl, songName, metaData, songText } = this.state;
    let stateCopy = { singer, songName, metaData, songText };

    stateCopy.singer = clearSpace(singer);
    stateCopy.singerID = clearSpace(singerID);
    stateCopy.imageUrl = clearSpace(imageUrl);
    stateCopy.songName = clearSpace(songName);
    stateCopy.songText = clearSpace(songText);
    stateCopy.metaData = {
      rhythm: clearSpace(metaData.rhythm),
      tone: clearSpace(metaData.tone)
    }
    return stateCopy;
  }

  privateValidate = async () => {
    let { songName, songText } = this.stateWithoutSpace();
    if (!this.props.isSending) {
      let error = {};
      if (songName.length === 0) error.songName = "Please fill in the field";
      if (songText.length === 0) error.songText = "Please fill in the field";
      const errorLength = Object.keys(error).length;
      const isSendingStatus = errorLength === 0;
      this.props.toggleSendingStatus(isSendingStatus);
      this.setState({ error });
      if (errorLength === 0) {
        this.props.toggleSendingStatus(false);
        let item = {
          songName: songName,
          songText: songText,
        };
        this.props.onSubmit(item);
      }
    }

  }

  validate = async () => {


    let { singerID, singer,imageUrl, songName, songText, metaData } = this.stateWithoutSpace();
    console.log("ddddddd", this.state);
    if (!this.props.isSending) {
      let error = {};
      let allSingers = await fetchSingers();
      let exists = ( Object.values( allSingers ) ).filter(word => { return singer == word.name } );
      if (exists.length == 0) {
        error.singer = "Singer not exists";
      }
      if (exists.length > 0 && singer.length === 0) error.singer = "Please fill in the field";
      if (songName.length === 0) error.songName = "Please fill in the field";
      if (songText.length === 0) error.songText = "Please fill in the field";
      if (metaData.rhythm.length === 0) error.metaData = { ...error.metaData, rhythm: 'Please fill in the field' }
      if (metaData.tone.length === 0) error.metaData = { ...error.metaData, tone: 'Please fill in the field' };
      const errorLength = Object.keys(error).length;
      const isSendingStatus = errorLength === 0;
      this.props.toggleSendingStatus(isSendingStatus);
      this.setState({ error });
      if (errorLength === 0) {
        this.props.toggleSendingStatus(false);
        let item = {
          singer  : singer,
          singerID: singerID,
          imageUrl: imageUrl,
          songName: songName,
          songText: songText,
          metaData: metaData
        };
        console.log("item", item);

        this.props.onSubmit(item);
      }
    }
  }

  onPushData() {
    if (this.state.isPrivateLyric) { this.privateValidate() } else { this.validate(); }
  }

  componentWillMount = async () => {
    try {
      const draftData = await AsyncStorage.getItem('addLyricDraft');
      let draftDataParse = JSON.parse(draftData);
      this.setState(draftDataParse)
    } catch (e) { }
  };

  render() {
    const { imageUrl, error } = this.state;
    const { isSending } = this.props;
    let showSingerIfPublicLyric;
    let showMetaIfPublicLyric;
    if (!this.props.isPrivateLyric) {
      showSingerIfPublicLyric = (
        <View>
          <UserInput
            label="Singer"
            autoCapitalize={'none'}
            autoCorrect={false}
            returnKeyType={'next'}
            underlineColorAndroid="transparent"
            placeholder="Adele"
            onChangeText={(singer) => {
              this.setState( { singer : singer } );
              this.onChangeState({ singer });
              if (singer.length > 0) {
                this.setState({ singerOnFocus: true });
              } else {
                this.setState({ singerOnFocus: false });
              }
            }}
            value={this.state.singer}
            onSubmitEditing={() => { this.songNameInput.focus() }}
            blurOnSubmit={false}
            onFocus={() => {
              if (this.state.singer.length > 0) {
                this.setState({ singerOnFocus: true });
              }
            }}

          />
          {error.singer !== undefined && <FormValidationMessage>{error.singer}</FormValidationMessage>}
          <AutoComplete searchWord={this.state.singer} show={this.state.singerOnFocus} inputAutocompleteHandler={this.inputAutocomplete} />
        </View>
      );

      showMetaIfPublicLyric = (
        <View style={styles.metaData} >
          <View style={{ flex: 1, paddingRight: 10, }} >
            <UserInput
              label="Tone"
              placeholder="Tone"
              autoCapitalize={'none'}
              autoCorrect={false}
              returnKeyType={'next'}
              underlineColorAndroid="transparent"
              onChangeText={(tone) => this.onChangeState({ metaData: { ...this.state.metaData, tone } })}
              value={this.state.metaData.tone}
              onSubmitEditing={() => { this.rhythmInput.focus() }}
              blurOnSubmit={false}
              inputRef={el => (this.toneInput = el)} />
            {error.metaData !== undefined && <FormValidationMessage>{error.metaData.tone}</FormValidationMessage>}
          </View>
          <View style={{ flex: 1, paddingLeft: 10, }} >
            <UserInput
              label="Rhythm"
              placeholder="Rhythm"
              autoCapitalize={'none'}
              autoCorrect={false}
              returnKeyType={'next'}
              underlineColorAndroid="transparent"
              onChangeText={(rhythm) => this.onChangeState({ metaData: { ...this.state.metaData, rhythm } })}
              value={this.state.metaData.rhythm}
              onSubmitEditing={() => { this.songTextInput.focus() }}
              blurOnSubmit={false}
              inputRef={el => (this.rhythmInput = el)}
            />
            {error.metaData !== undefined && <FormValidationMessage>{error.metaData.rhythm}</FormValidationMessage>}
          </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
        {showSingerIfPublicLyric}
        <View>
          <UserInput
            label="Song name"
            placeholder="Song name"
            autoCapitalize={'none'}
            autoCorrect={false}
            returnKeyType={'next'}
            underlineColorAndroid="transparent"
            onChangeText={(songName) => this.onChangeState({ songName })}
            value={this.state.songName}
            inputRef={el => (this.songNameInput = el)}
            onSubmitEditing={() => this.state.isPrivateLyric ? this.songTextInput.focus() : this.toneInput.focus()}
            blurOnSubmit={false}/>
          {error.songName !== undefined && <FormValidationMessage>{error.songName}</FormValidationMessage>}
        </View>
        {showMetaIfPublicLyric}
        <View>
          <UserInput
            label="Song text"
            placeholder={"Hello from the other side \nI must've called a thousand times"}
            autoCapitalize={'none'}
            autoCorrect={true}
            height={"auto"}
            returnKeyType={'next'}
            underlineColorAndroid="transparent"
            inputRef={el => (this.songTextInput = el)}
            onChangeText={(songText) => this.onChangeState({ songText })}
            value={this.state.songText}
            onSubmitEditing={() => this.onPushData()}
            multiline={true}
            numberOfLines={6}
            inputStyle={{
              textAlignVertical: 'top',
            }}
          />
          {error.songText !== undefined && <FormValidationMessage>{error.songText}</FormValidationMessage>}
        </View>

      </View>
    );
  }
}

export default AddLyricForm;

const styles = StyleSheet.create({
  metaData: { flexDirection: 'row' },
})
