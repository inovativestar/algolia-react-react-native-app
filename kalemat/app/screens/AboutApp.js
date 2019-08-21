import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, RefreshControl, Alert, Platform } from 'react-native';
import LyricList from '../components/LyricList';
import { LyricsManager } from '../config/firebase';
import { convertObjectToArray } from '../config/globalFunctions';
import ListPlaceholder from '../components/ListPlaceholder';
import NoData from '../components/NoData';
import TabsHeader from '../components/TabsHeader';
import UserInput from '../components/UserInput';
import GradientButton from '../components/GradientButton';
import { Colors, GradientColors } from '../config/colors';

class AboutApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
    }
  }

  render() {
    const { isLoading, data } = this.state;
    return (
      <View style={{ flex: 1,backgroundColor:"#FFF" }}>
          <TabsHeader
            title="عن البرنامج ✨"
            navigation={this.props.navigation}
            showAddButton={false}
            showSettingButton={true} />
          <ScrollView
            style={{flexGrow: 1, backgroundColor: "#fff", padding: 20  }}
            contentContainerStyle={{ flexGrow: 1, }}
            keyboardShouldPersistTaps="never"
            keyboardDismissMode="on-drag" >
            <Text>Thank you for using kalemat.app</Text>
            <GradientButton
              gradienColors={Colors.gradientRed}
              buttonText="try our other app"
              onPress={() => null} />
            <GradientButton
              gradienColors={Colors.gradientYellow}
              buttonText="try our other app"
              onPress={() => null} />
            <GradientButton
              gradienColors={Colors.gradientBlue}
              buttonText="try our other app"
              onPress={() => null} />
            <GradientButton
              gradienColors={Colors.gradientBlue2}
              buttonText="try our other app"
              onPress={() => null} />
            <GradientButton
              gradienColors={Colors.gradientGreen2}
              buttonText="try our other app"
              onPress={() => console.log(GradientColors.getRand())} />
         </ScrollView>
      </View>
    );
  }
}

export default AboutApp;
