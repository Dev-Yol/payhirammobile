import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Linking,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import { BasicStyles, Color } from 'common'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
const height = Math.round(Dimensions.get('window').height);
class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: null,
      data: null
    }
  }

  manageRedirect = (code) => {
    const { payload } = this.props.navigation.state.params;
    if(payload && payload == 'transfer'){
      this.props.navigation.navigate('directTransferDrawer', {
        data: {  
          from: payload,
          code: code,
          success: false
        }
      })
    }else if(payload && payload == 'scan_payment'){
      this.props.navigation.navigate('acceptPaymentStack', {
        data: {  
          from: payload,
          code: code,
          success: false
        }
      })
    }else{
      this.props.navigation.navigate('viewProfileStack', {
        code: code
      })
    }
  }
  onSuccess = e => {
      // Linking.openURL(e.data).catch(err =>
      //     console.error('An error occured', err)
      // );
    let code = e.data
    let scanCode = null
    let expiry = null
    if(this.state.data == null){
      if(code && code.length < 60){
        expiry = parseInt(code.substring(32, code.length))
        scanCode = code.substring(0, 32)
      }else{
        expiry = parseInt(code.substring(64, code.length))
        scanCode = code.substring(0, 64)
      }
      let newDate = new Date().getTime()
      let difference = (newDate - expiry) / 1000
      this.setState({
        data: scanCode
      })
      console.log('difference', difference)
      if(difference < (5 * 60) && scanCode != null){
        this.setState({
          data: null
        })
        this.manageRedirect(scanCode)
      }else{
        Alert.alert(
          "Message Alert",
          "Invalid Accessed",
          [
            { text: "OK", onPress: () => {
              this.setState({
                data: null
              })
            }}
          ]
        );
      }
    }
    
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