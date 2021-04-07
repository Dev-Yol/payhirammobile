import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Linking,
    Dimensions,
    Platform
} from 'react-native';
import { BasicStyles, Color } from 'common'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
const height = Math.round(Dimensions.get('window').height);
class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: null
    }
  }
  onSuccess = e => {
      // Linking.openURL(e.data).catch(err =>
      //     console.error('An error occured', err)
      // );
    console.log('e',e)
    this.props.navigation.navigate('viewProfileStack', {code: e.data})
  };

  render() {
    return (
      <View style={{
        flex: 1
      }}>
        {
          Platform.OS == 'ios' && (
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={{
                flex: 1,
                width: '100%',
              }}
              onBarCodeRead={this.onSuccess}
            >
            </RNCamera>
          )
        }
        {
          Platform.OS == 'android' && (
             <QRCodeScanner
              onRead={this.onSuccess}
              flashMode={RNCamera.Constants.FlashMode.torch}
              showMarker
              containerStyle={{
                height: height,
                backgroundColor: Color.black
              }}
            />
          )
        }
      </View>
    );
  }
}

export default Scanner;