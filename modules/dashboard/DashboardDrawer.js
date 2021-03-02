import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faQrcode, faBars } from '@fortawesome/free-solid-svg-icons';
import Dashboard from 'modules/dashboard';
import { NavigationActions } from 'react-navigation';
import { BasicStyles } from 'common';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
  }

  back = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Dashboard',
    });
    this.props.navigationProps.dispatch(navigateAction);
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faBars}
            size={BasicStyles.iconSize}
            style={BasicStyles.iconStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }
}


const DashboardStack = createStackNavigator({
  dashboardScreen: {
    screen: Dashboard,
    navigationOptions: ({ navigation }) => ({    
      title: 'Dashboard',
      headerLeft: <HeaderOptions navigationProps={navigation} />,
      drawerLabel: 'Dashboard',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#4c4c4c',
      headerRight: (
        // <View style={{marginRight: 40, paddingRight: 8}}>
        <FontAwesomeIcon icon={faQrcode} size={20} style={{ color: 'black', marginRight: 40 }}/>
        // </View>
      ),
    }),
  },
});

export default DashboardStack;