import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class UserGuidelines extends Component {

  render() {
    return (
      <WebView source={{ uri: 'https://payhiram.ph/user-guide' }} />
    );
  }
}

export default UserGuidelines;
