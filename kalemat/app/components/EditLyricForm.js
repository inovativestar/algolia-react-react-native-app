import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleShee, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Icon } from 'react-native-elements';

import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import MiniHeader from './MiniHeader';
import { clearSpace } from '../config/globalFunctions';
import GradientButton from './GradientButton';
import { Colors, GradientColors } from '../config/colors';

import UserInput from './UserInput';
class EditLyricsForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      singer: "",
      singerID: "",
      songName: "",
      metaData: {
        tone: "",
        rhythm: "",
      },
      songText: "",
      imageUrl: null,
      error: {},
      isPrivateLyric: this.props.isPrivateLyric,
    }
  }

  onSubmit() {
    if (this.state.isPrivateLyric) { this.privateValidate() } else { this.validate(); }
  }

  privateValidate = async () => {
    const {
      songName,
      songText
    } = this.state;

    if (!this.props.isSending) {
      let error = {};
      if (songName.length === 0) error.songName = "Please fill in the field";
      if (songText.length === 0) error.songText = "Please fill in the field";
      const errorLength = Object.keys(error).length;
      const isSendingStatus = errorLength === 0;
      this.props.toggleSendingStatus(isSendingStatus);
      this.setState({ error });
      if (errorLength === 0) {
        this.props.onSubmit({
          songName,
          songText,
        });
      }
    }
  }

  validate = async () => {
    const {
      singer,
      songName,
      metaData,
      songText
    } = this.state;
    if (!this.props.isSending) {
      let error = {};
      if (singer.length === 0) error.singer = "Please fill in the field";
      if (songName.length === 0) error.songName = "Please fill in the field";
      if (songText.length === 0) error.songText = "Please fill in the field";
      if (metaData.rhythm.length === 0) error.metaData = { ...error.metaData, rhythm: 'Please fill in the field' }
      if (metaData.tone.length === 0) error.metaData = { ...error.metaData, tone: 'Please fill in the field' };
      const errorLength = Object.keys(error).length;
      const isSendingStatus = errorLength === 0;
      this.props.toggleSendingStatus(isSendingStatus);
      this.setState({ error });
      if (errorLength === 0) {
        this.props.onSubmit({
          singer,
          songName,
          metaData,
          songText,
        });
      }
    }
  }

  privateValidate = async () => {
    const {
      songName,
      songText
    } = this.state;
    if (!this.props.isSending) {
      let error = {};
      if (songName.length === 0) error.songName = "Please fill in the field";
      if (songText.length === 0) error.songText = "Please fill in the field";
      const errorLength = Object.keys(error).length;
      const isSendingStatus = errorLength === 0;
      this.props.toggleSendingStatus(isSendingStatus);
      this.setState({ error });
      if (errorLength === 0) {
        this.props.onSubmit({
          songName,
          songText,
        });
      }
    }
  }

  onPushData() {
    if (this.state.isPrivateLyric) { this.privateValidate() } else { this.validate(); }
  }

  componentDidMount = () => {
    if (this.state.isPrivateLyric) {
      const { songName, lyricText } = this.props.data
      this.setState({
        songName,
        songText: lyricText,
      });
    } else {
      const { singer, songName, lyricText, lyricsMeta, imageUrl } = this.props.data
      const metaData = {};
      lyricsMeta.forEach(element => {
        metaData[element.metaKey] = element.metaValue
      });
      this.setState({
        singer,
        songName,
        metaData: {
          ...this.state.metaData,
          ...metaData,
        },
        songText: lyricText,
        imageUrl: imageUrl
      });
    }
  };


  render() {
    const { imageUrl, error, isPrivateLyric } = this.state;
    const { isSending } = this.props;
    return (
      <ScrollView
      style={{ backgroundColor: '#fff',paddingHorizontal: 20 }}
      keyboardShouldPersistTaps="never"
      keyboardDismissMode="on-drag" >
        {!isPrivateLyric &&
          <View>
            <UserInput
              label="Singer"
              autoCapitalize={'none'}
              autoCorrect={false}
              returnKeyType={'next'}
              underlineColorAndroid="transparent"
              placeholder="Adele"
              pointerEvents="none"
              //onChangeText={(singer) => this.setState({ singer })}
              value={this.state.singer}
              onSubmitEditing={() => { this.songNameInput.focus() }}
              blurOnSubmit={false}
              editable={false}
              selectTextOnFocus={false}
            />
            {error.singer !== undefined && <FormValidationMessage>{error.singer}</FormValidationMessage>}
          </View>
        }
        <View>
          <UserInput
            label="Song name"
            autoCapitalize={'none'}
            autoCorrect={true}
            returnKeyType={'next'}
            underlineColorAndroid="transparent"
            placeholder="Title of song"
            onChangeText={(songName) => this.setState({ songName })}
            value={this.state.songName}
            onSubmitEditing={() => { this.toneInput.focus() }}
            blurOnSubmit={false}
            selectTextOnFocus={false}
            inputRef={el => (this.songNameInput = el)}
          />
          {error.songName !== undefined && <FormValidationMessage>{error.songName}</FormValidationMessage>}
        </View>
        {!isPrivateLyric &&
          <View style={{ flexDirection: 'row' }} >
            <View style={{ flex: 1, paddingRight: 10, }} >
              <UserInput
                label="Tone"
                placeholder="Tone"
                autoCapitalize={'none'}
                autoCorrect={false}
                returnKeyType={'next'}
                underlineColorAndroid="transparent"
                onChangeText={(tone) => this.setState({ metaData: { ...this.state.metaData, tone } })}
                value={this.state.metaData.tone}
                onSubmitEditing={() => { this.rhythmInput.focus() }}
                blurOnSubmit={false}
                inputRef={el => (this.toneInput = el)}
              />
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
                onChangeText={(rhythm) => this.setState({ metaData: { ...this.state.metaData, rhythm } })}
                value={this.state.metaData.rhythm}
                onSubmitEditing={() => { this.songTextInput.focus() }}
                blurOnSubmit={false}
                inputRef={el => (this.rhythmInput = el)}
              />
              {error.metaData !== undefined && <FormValidationMessage>{error.metaData.rhythm}</FormValidationMessage>}
            </View>
          </View>
        }
        <View>
          <UserInput
            label="Song text"
            placeholder={"Hello from the other side \nI must've called a thousand times"}
            autoCapitalize={'none'}
            autoCorrect={true}
            returnKeyType={'next'}
            underlineColorAndroid="transparent"
            height={'auto'}
            inputRef={el => (this.songTextInput = el)}
            onChangeText={(songText) => this.setState({ songText })}
            value={this.state.songText}
            onSubmitEditing={() => this.onSubmit()}
            multiline={true}
            numberOfLines={6}
            inputStyle={{
              textAlignVertical: 'top'
            }}
          />
          {error.songText !== undefined && <FormValidationMessage>{error.songText}</FormValidationMessage>}
        </View>
      </ScrollView>
    );
  }
}

export default EditLyricsForm;
