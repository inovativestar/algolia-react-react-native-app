import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, Alert, StyleSheet } from 'react-native';
import { createStackNavigator, StackNavigator, createBottomTabNavigator, createSwitchNavigator, createDrawerNavigator, DrawerActions } from 'react-navigation';
import { Icon, Header, SearchBar, colors } from 'react-native-elements';
import { userManager } from '../config/firebase';
import { Colors, GradientColors } from '../config/colors';

export default class TabsHeader extends Component {
    constructor(props) {
        super(props);
    }

    goToMySetting = () => {
        this.props.navigation.navigate('MySetting');
    }

    addNewLyric = async () => {
        if (this.props.isPrivateLyric) {
            this.props.navigation.navigate('AddLyric', { isPrivateLyric: true })
        } else {
            const userData = await userManager.getUser();
            if (userData.isAnonymous) {
                Alert.alert("please sing up or sign in to add Lyric");
            } else {
                this.props.navigation.navigate('AddLyric');
            }
        }
    }

    render() {
        return (
        <View>
            <SafeAreaView style={{ backgroundColor: '#fff' }} forceInset={{ top: 'always', horizontal: 'never' }}>
               <View style={{ margin: 15, paddingBottom: 0, paddingTop: 0 }}>
                    <View style={styles.header} >
                        <View style={styles.btnsView}>
                            {this.props.showAddButton &&
                            <TouchableOpacity activeOpacity={1} onPress={() => this.addNewLyric()}  >
                                <Icon name="add" type="ionicons" size={26} color={Colors.gray4} />
                            </TouchableOpacity>}
                            {this.props.showSettingButton &&
                            <TouchableOpacity activeOpacity={1} onPress={() => this.goToMySetting()}  >
                                <Icon name="ios-contact" type="ionicon" size={26} color={Colors.gray4} />
                            </TouchableOpacity>}

                        </View>
                        <Text style={{ height: 40, fontSize: 32, color: Colors.gray4 }}>{this.props.title}</Text>

                    </View>
                </View>
            </SafeAreaView>
        </View>
        );
    }
}


const styles = StyleSheet.create({
    btnsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width:66,
    },
    header: {
        flexGrow: 1,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        height: 35,
        padding: 5,
        paddingLeft: 0,
        paddingRight: 0,
        margin: 0,
        marginTop: 0,
        paddingTop: 0,
    },
})
