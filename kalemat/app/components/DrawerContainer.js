import React, { Component } from 'react';
import { View, Text, } from 'react-native';
import Drawer from 'react-native-drawer';


class DrawerContainer extends Component {

  closeControlPanel = () => {
    this._drawer.close()
  };

  openControlPanel = () => {
    this._drawer.open()
  };

  render() {
    return (
      <Drawer
        open={true}
        ref={(ref) => this._drawer = ref}
        type="static"
        content={<Text>12345</Text>}
        openDrawerOffset={100}
        styles={drawerStyles}
        tweenHandler={Drawer.tweenPresets.parallax}
      >
        {this.props.children}
      </Drawer>
    );
  }
}

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 },
}

export default DrawerContainer;
