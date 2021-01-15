import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faQrcode,
  faBars,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import AccountSettings from 'modules/accountSettings';
import {NavigationActions} from 'react-navigation';
import {BasicStyles, Color} from 'common';
import {connect} from 'react-redux';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop()
  };
  render() {
    const { theme } = this.props.state;
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{Color: theme ? theme.primary : Color.primary }}
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

let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const AccountSettingsStack = createStackNavigator({
  accountSettingsScreen: {
    screen: AccountSettings,
    navigationOptions: ({navigation}) => ({
      title: 'Account Settings',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      drawerLabel: 'Account Settings',
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountSettingsStack);
