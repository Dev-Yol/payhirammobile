import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions, Platform, SafeAreaView} from 'react-native';
import SettingTile from 'modules/settings/SettingTile.js';
import navigation from 'modules/settings/Routes.js';
import styles from 'modules/settings/Styles.js';
const height = Math.round(Dimensions.get('window').height);
import Footer from 'modules/generic/Footer'

class Settings extends Component {
  render() {
    return (
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{
            ...styles.SettingsContainer,
            minHeight: height,
            marginTop: 60
          }}>
            {navigation.map((item, index) => {
            return (
              <SettingTile
                key={index}
                item={item}
                onPress={(route) => {
                  this.props.navigation.navigate(route);
                }}
              />
            );
          })}
          </View>
        </ScrollView>
        <Footer
          {...this.props}
          selected={null}
          onSelect={(value) => {
            this.setState({
              page: value,
              activeIndex: value == 'summary' ? 0 : 1
            })
          }}
          from={'settings'}
        />
      </SafeAreaView>
    );
  }
}

export default Settings;
