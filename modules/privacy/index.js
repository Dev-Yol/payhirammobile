import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class Privacy extends Component {
  render() {
    return (
      <WebView source={{ uri: 'https://payhiram.ph/privacy-policy' }} />
    );
  }
}

export default Privacy;
