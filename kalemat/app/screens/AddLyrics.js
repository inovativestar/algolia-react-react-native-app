import React, { Component } from 'react';
import { View, Text, Alert, Platform, AsyncStorage, ScrollView, KeyboardAvoidingView} from 'react-native';
import { LyricsManager, userManager } from '../config/firebase';
import AddLyricForm from '../components/AddLyricForm';
import MiniHeader from '../components/MiniHeader';

class AddLyric extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false,
      isPrivateLyric: this.props.navigation.getParam('isPrivateLyric', false),
      formData: null,
    };
  }

  componentDidMount = async () => {
    let badUser = await userManager.userIsbad();
    if (badUser) {
      alert("You cannot add item, You are in a bad users list");
      this.props.navigation.goBack();
      return;
    }
  }

  toggleSendingStatus = (state) => {
    this.setState({
      isSending: state
    })
  }

  onSubmit = async (data) => {
    if (!data) {
      alert("Form data is empty");
      return;
    }
    if (!this.state.isSending) {
      if (this.state.isPrivateLyric) {
        const response = await LyricsManager.createNewPrivate(data);
      } else {
        const response = await LyricsManager.createNew(data);
      }
      await AsyncStorage.removeItem('addLyricDraft')
      this.toggleSendingStatus(false);
      this.props.navigation.goBack();
    } else {
      alert('Please wait');
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        <MiniHeader
          title={this.state.isPrivateLyric ? "كلمات خاصة" : "اضف أغنية"}
          rightBtnTxt="Add"
          rightBtnAction={() => this.refs.AddLyricForm.onPushData()} />

        <KeyboardAvoidingView keyboardVerticalOffset={0} style={{flex:1,backgroundColor:'#fff'}}  behavior={Platform.OS === "ios" ? "padding" : null} enabled>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, }}
            keyboardShouldPersistTaps="never"
            keyboardDismissMode="interactive"
          >

          <AddLyricForm
            ref='AddLyricForm'
            isPrivateLyric={this.state.isPrivateLyric}
            isSending={this.state.isSending}
            toggleSendingStatus={this.toggleSendingStatus}
            onSubmit={this.onSubmit} />
            </ScrollView>
          </KeyboardAvoidingView>
      </View>
    );
  }
}

export default AddLyric;
