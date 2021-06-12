import React, { Component } from 'react';
import { View } from 'react-native'
import { WebView } from 'react-native-webview';

class TermsAndConditions extends Component {
  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <WebView
          source={{ uri: 'https://payhiram.ph/terms-and-conditions' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true} />
      </View>
    );
  }
}

export default TermsAndConditions;
