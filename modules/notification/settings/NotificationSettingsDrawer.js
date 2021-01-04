import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faQrcode,
  faBars,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import NotificationSettings from './index.js';
import {NavigationActions} from 'react-navigation';
import {BasicStyles} from 'common';
import {connect} from 'react-redux';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop()
  };
  render() {
    return (
      <View style={{flexDirection: 'row', marginLeft: 10}}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={30}
            style={{color: '#572066'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {};
};

const NotificationSettingsStack = createStackNavigator({
  notificationSettingsScreen: {
    screen: NotificationSettings,
    navigationOptions: ({navigation}) => ({
      title: 'Notification Settings',
      headerLeft: <HeaderOptions navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettingsStack);
