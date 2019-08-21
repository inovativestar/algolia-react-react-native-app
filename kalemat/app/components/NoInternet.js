import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

export default class NoInternet extends Component {

    render() {
        const { isInternet, isReloadingPage, reloadPage } = this.props;
        return (
            isInternet ? (
                this.props.children
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        onPress={reloadPage}
                        title="Reload Page"
                        loading={isReloadingPage}
                    // color="#841584"
                    // accessibilityLabel="Learn more about this purple button"
                    />
                </View>
            )
        );
    }
}
