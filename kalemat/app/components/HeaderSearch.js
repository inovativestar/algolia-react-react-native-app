import React, { Component } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors, GradientColors } from '../config/colors';
import { clearSpaceWithoutTrim } from '../config/globalFunctions';


class HeaderSearch extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View activeOpacity={1} style={styles.search}>
                <View style={styles.searchIcon}>
                    {!this.props.loading && <Icon onPress={(val) => this.props.handleSearch(this.props.value)} name="search" type="font-awesome" size={15} color={Colors.gray} />}
                    {this.props.loading && <ActivityIndicator size="small" color="gray" />}
                </View>
                <TextInput
                    maxLength={20}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChangeText={(val) => this.props.handleSearchInput(clearSpaceWithoutTrim(val))}
                    underlineColorAndroid="transparent"
                    style={styles.searchInput} />
            </View>
        )
    }

}

export default HeaderSearch;

const styles = StyleSheet.create({

    search: {
        borderRadius: 1,
        borderColor: 1,
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        marginTop: 10,
        height: 40,
        position: 'relative',
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        borderRadius: 8,
        elevation: 13,
    },
    searchInput: {
        borderRadius: 8,
        padding: 10,
        paddingRight: 40,
        textAlign: "right",
        height: "100%",
        width: "100%",
        color: Colors.gray
    },
    searchIcon: {
        position: "absolute",
        zIndex: 999,
        right: 15,
    }

})
