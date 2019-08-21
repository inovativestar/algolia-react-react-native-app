import React, { Component } from 'react';
import { View, Text, ScrollView, AsyncStorage, SafeAreaView } from 'react-native';
import { LyricsManager, userManager } from '../config/firebase';
import EditLyricsForm from '../components/EditLyricForm';
import MiniHeader from '../components/MiniHeader';

class EditLyric extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSending: false,
      data: this.props.navigation.getParam('data', null),
      isPrivateLyric: this.props.navigation.getParam('isPrivateLyric', false),
    };
    console.log(this.state.data);
  }

  toggleSendingStatus = (state) => {
    this.setState({
      isSending: state
    })
  }

  onSubmit = async (data) => {
    let isAdmin = await userManager.userIsAdmin();
    const id = this.props.navigation.state.params.id;
    if (this.state.isPrivateLyric) {
      const response = await LyricsManager.createEditedPrivateLyric(id, data);
    } else {
      if (isAdmin) {
        const response = await LyricsManager.editLyric(id, data);
      }else{
        const response = await LyricsManager.createEditedLyric(id, data);
      }
    }
    this.props.navigation.goBack();
    this.toggleSendingStatus(false);
  }

  componentDidMount = async () => {
    let badUser = await userManager.userIsbad();
    if (badUser) {
      alert("You cannot make edit, You are in a bad users list!");
      this.props.navigation.goBack();
      return;
    }
  };

  getSongTitle = async () => {
    const title = await this.state.data.songName;
    return title.split(' ').slice(0, 2).join(' ');
  }

  render() {
    return (
      <View style={{flex: 1 }}>
        {this.state.data && (
          <MiniHeader
            title={"Edit: " + this.state.data.songName}
            rightBtnTxt="Save"
            // rightBtnAction={this.onSubmit}
            rightBtnAction={() => this.refs.EditLyricsForm.onPushData()} />
        )}
          {this.state.data && (
            <EditLyricsForm
              ref='EditLyricsForm'
              isSending={this.state.isSending}
              isPrivateLyric={this.state.isPrivateLyric}
              data={this.state.data}
              toggleSendingStatus={this.toggleSendingStatus}
              onSubmit={this.onSubmit} />
          )}
      </View>
    );
  }
}

export default EditLyric;
