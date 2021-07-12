import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';

class PartnerWeb extends Component {

  IndicatorLoadingView() {
    return (
      <ActivityIndicator
        color="#3235fd"
        size="large"
        style={styles.IndicatorStyle}
      />
    );
  }

  render() {
    return (
      <WebView 
        source={{ uri: 'https://payhiram.ph/user-guide/upgrade-account' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        renderLoading={this.IndicatorLoadingView}
        scalesPageToFit={true}
        startInLoadingState={true} />
    );
  }
}

const styles = StyleSheet.create({
  IndicatorStyle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

export default PartnerWeb;
