import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Notifications from 'modules/notification';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';

class HeaderOptions extends Component {
  constructor(props){
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop();
  };
  render() {
    const { theme } = this.props.state;
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
          icon={ faChevronLeft }
          size={BasicStyles.headerBackIconSize}
          style={{color: theme ? theme.primary : Color.primary }} />
        </TouchableOpacity>
      </View>
    );
  }
}

class HeaderRight extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const { notifications } = this.props.state;
    return (
      <View style={{ flexDirection: 'row' }}>
        <View>
        { notifications.unread > 0 && (
          <Text style={BasicStyles.badge}>{notifications.unread}</Text>
          )
        }
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout())
  };
};


let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

let HeaderRightWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderRight);

const NotificationStack = createStackNavigator({
  notificationScreen: {
    screen: Notifications, 
    navigationOptions: ({ navigation }) => ({
      title: 'Notifications',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      headerRight: <HeaderRightWithRedux navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationStack);