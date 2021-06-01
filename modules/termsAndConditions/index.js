import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { BasicStyles } from 'common'
import { WebView } from 'react-native-webview';

class TermsAndConditions extends Component {
  render() {
    return (
      // <ScrollView
      //   showsVerticalScrollIndicator={false}>
      <WebView source={{ uri: 'https://payhiram.ph/terms-and-conditions' }} />
      // </ScrollView>
    );
  }
}

// const styles = StyleSheet.create({
//   TermsAndConditionsContainer: {
//     width: '90%',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginLeft: '5%',
//     marginRight: '5%'
//   },
//   SectionContainer: {
//     width: '100%',
//   },
//   SectionTitleContainer: {},
//   SectionTitleTextStyle: {
//     fontSize: BasicStyles.standardTitleFontSize,
//     fontWeight: 'bold',
//     marginTop: 10
//   },
//   SectionTwoTitleTextStyle: {
//     fontSize: BasicStyles.standardTitleFontSize,
//     fontWeight: 'bold',
//   },
//   SectionDescriptionContainer: {},
//   SectionDescriptionTextStyle: {
//     textAlign: 'justify',
//     fontSize: BasicStyles.standardFontSize
//   },
// });

export default TermsAndConditions;
