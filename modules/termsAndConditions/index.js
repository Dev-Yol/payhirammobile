import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class TermsAndConditions extends Component {
  render() {
    return (
      <WebView source={{ uri: 'https://payhiram.ph/terms-and-conditions' }} />
    );
  }
}

export default TermsAndConditions;
