import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Linking,
    Dimensions
} from 'react-native';
import { BasicStyles, Color } from 'common'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
const height = Math.round(Dimensions.get('window').height);
class Scanner extends Component {
  onSuccess = e => {
      // Linking.openURL(e.data).catch(err =>
      //     console.error('An error occured', err)
      // );
    this.props.navigation.navigate('viewProfileStack', {code: e.data})
  };

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        flashMode={RNCamera.Constants.FlashMode.torch}
        showMarker
        containerStyle={{
          height: height,
          backgroundColor: Color.black
        }}
      />
    );
  }
}

export default Scanner;