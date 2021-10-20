import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';

class AvailableLocation extends Component {

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
      <View style={{
        flex: 1
      }}>
        <WebView
          source={{ uri: 'https://payhiram.ph/locations' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          renderLoading={this.IndicatorLoadingView}
          scalesPageToFit={true}
          startInLoadingState={true} />
      </View>
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

export default AvailableLocation;
