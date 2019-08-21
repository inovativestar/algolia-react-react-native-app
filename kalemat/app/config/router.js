import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, Alert, StyleSheet } from 'react-native';
import { createStackNavigator, StackNavigator, createBottomTabNavigator, createSwitchNavigator, createDrawerNavigator, DrawerActions } from 'react-navigation';
import { Icon, Header, SearchBar, colors } from 'react-native-elements';
import { userManager } from '../config/firebase';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, GradientColors } from '../config/colors';
import Welcome from '../screens/Welcome';
import SignIn from '../screens/SignIn';
import ResetPassword from '../screens/ResetPassword';
import SignUp from '../screens/SignUp';
import Trends from '../screens/Trends';
import Favourite from '../screens/Favourite';
import AboutApp from '../screens/AboutApp';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import Search from '../screens/Search';
import MyLyrics from '../screens/MyLyrics';
import LyricDetail from '../screens/LyricDetail';
import AddLyric from '../screens/AddLyrics';
import EditLyric from '../screens/EditLyrics';
import MySetting from '../screens/MySetting';

const TabBarLabel = (props) => <Text style={{ color: props.focused ? Colors.gray4 : Colors.gray2, fontSize: Platform.OS === 'ios' ? 11 : 14, paddingVertical: Platform.OS === 'ios' ? 0 : 6, }}>{props.label}</Text>;

export let Tabs = {
  'Trends': {
    screen: Trends,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => <Icon name="ios-cloud-outline" type="ionicon" size={30} color={focused ? Colors.gray4 : Colors.gray2} />
    },
  },
  'Favourite': {
    screen: Favourite,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => <Icon name="ios-heart-outline" type="ionicon" size={30} color={focused ? Colors.gray4 : Colors.gray2} />
    },
  },
  'MyLyrics': {
    screen: MyLyrics,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => <Icon name="ios-list-outline" type="ionicon" size={30} color={focused ? Colors.gray4 : Colors.gray2} />
    },
  },
  'About': {
    screen: AboutApp,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => <Icon name="ios-more-outline" type="ionicon" size={30} color={focused ? Colors.gray4 : Colors.gray2} />
    },
  },
}

const MainTabs = (Tabs) => createBottomTabNavigator(Tabs, {
  swipeEnabled: true,
  tabBarOptions: {
    showLabel: false,
    activeTintColor: Colors.gray4,
    inactiveTintColor: Colors.gray2,
    style: {
      borderTopColor: 'transparent',
      borderTopWidth: 0,
      backgroundColor: '#fff',
      borderTopColor: 'lightgray',
      marginBottom: 0,
    }
  }
});

const AuthStack = createStackNavigator({
    "Welcome": Welcome,
    "SignIn": SignIn,
    "SignUp": SignUp,
    "ResetPassword": ResetPassword
  }, {
    headerMode: 'none',
  });

addNewLyric = async (navigation) => {
  const userData = await userManager.getUser();
  if (userData.isAnonymous) {
    alert("please sing up or sign in to add Lyric");
  } else {
    navigation.navigate('AddLyric');
  }
}

goToMySetting = (navigation) => {
  navigation.navigate('MySetting');
}

const AppStack = MainTabsTest => (
  createStackNavigator({
    "Tabs": {
      screen: MainTabsTest,
      navigationOptions: ({ navigation }) => {

        const params = navigation.state || {};

        return {
          header: null,
        }
      }
    },
    "Search": {
      screen: Search,
      navigationOptions: {
        header: null,
        headerMode: 'none',
      }
    },
    "LyricDetail": {
      screen: LyricDetail,
      navigationOptions: ({ navigation }) => {
        const { isPandingEdit, data } = navigation.state.params;
        const { _id, objectID } = data;
        const lyricId = _id || objectID;
        return ({
          title: `${navigation.state.params.data.singer} - ${navigation.state.params.data.songName}`,
          headerStyle: {
            backgroundColor: '#444',
          },
          header: null,
          headerTintColor: 'red',
          headerRight:
            <TouchableOpacity
              activeOpacity={.7}
              style={{ paddingHorizontal: 10, }}
              onPress={() => {
                if (!isPandingEdit) {
                  navigation.navigate('EditLyric', { id: lyricId });
                } else {
                  Alert.alert("Message", "Pending status")
                }
              }}>
              <Icon
                name="create"
                color="lightgrey"
                type="ionicons"
                size={30}/>
            </TouchableOpacity>,
        })
      },
    },
    "AddLyric": {
      screen: AddLyric,
      navigationOptions: ({ navigation }) => ({
        header: null,
        headerMode: 'float',
        title: "Add Lyric",
        headerTintColor: 'lightgrey',
      }),
    },
    "EditLyric": {
      screen: EditLyric,
      navigationOptions: ({ navigation }) => ({
        headerMode: 'float',
        title: "Edit Lyric",
        header: null,
        headerTintColor: 'lightgrey',

      }),
    },
    "AboutApp": {
      screen: AboutApp,
      navigationOptions: ({ navigation }) => ({
        headerMode: 'float',
        title: "About",
        headerTintColor: 'lightgrey',
        headerStyle: {
          backgroundColor: 'Blue',
        }
      }),
    },
    "MySetting": {
      screen: MySetting,
      navigationOptions: ({ navigation }) => ({
        headerMode: 'float',
        title: "Edit Lyric",
        header: null,
        headerTintColor: 'lightgrey',

      }),
    },
  }, {
      mode: 'modal',
      navigationOptions: {
        gesturesEnabled: true,
      }
    })
);

const RootStack = MainTabs => createSwitchNavigator(
  {
    "AuthLoading": AuthLoadingScreen,
    "App": AppStack(MainTabs),
    "Auth": AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);


export default Tabs => RootStack(MainTabs(Tabs))
