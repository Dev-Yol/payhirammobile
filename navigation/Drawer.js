import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faQrcode, faShare } from '@fortawesome/free-solid-svg-icons';
import Slider from 'modules/slider';
import { Color, BasicStyles } from 'common';
import Requests from 'modules/request';
import Dashboard from 'modules/dashboard';
import Messenger from 'modules/messenger';
import Notification from 'modules/notification';
import Profile from 'modules/profile';
import Settings from 'modules/settings';
import { Product, Marketplace, Checkout } from 'components';
import Billing from 'modules/profile/Billing.js';
import Circle from 'modules/circle/index.js';
import OptionRight from './OptionRight';
import TermsAndConditions from 'modules/termsAndConditions';
import Support from 'components/Support';
import UpdateTicket from 'components/Support/UpdateTicket';
import Style from './Style.js';
import { connect } from 'react-redux'

const width = Math.round(Dimensions.get('window').width);
class MenuDrawerStructure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginState: true,
    };
  }
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}></View>
    );
  }
}

class QRCode extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => {
        this.props.setQRCodeModal(true)
      }}>
        <View style={{ paddingRight: 8 }} >
          <FontAwesomeIcon icon={faQrcode} size={BasicStyles.iconSize + 5} style={{ color: 'black', marginRight: 10 }} />
        </View>
      </TouchableOpacity>
    )
  }
}

class Share extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => {
        // this.props.setQRCodeModal(true)
      }}>
        <View style={{ paddingRight: 8 }} >
          <FontAwesomeIcon icon={faShare} size={BasicStyles.iconSize + 5} style={{ color: 'black', marginRight: 10 }} />
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setQRCodeModal: (isVisible) => {
      dispatch(actions.setQRCodeModal({ isVisible: isVisible }))
    },
  };
};

const QRCodeButton = connect(mapStateToProps, mapDispatchToProps)(QRCode)
const ShareButton = connect(mapStateToProps, mapDispatchToProps)(Share)
const _StackNavigator = createStackNavigator({

  Requests: {
    screen: Requests,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerTransparent: true
    }),
  },

  Terms: {
    screen: TermsAndConditions,
    navigationOptions: ({ navigation }) => ({
      title: 'Terms & condition',
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerTransparent: true
    }),
  },
  Circle: {
    screen: Circle,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <OptionRight navigationProps={navigation} />,
      headerRight: (
        <Share />
      ),
      headerTransparent: true
    }),
  },
  Dashboard: {
    screen: Dashboard,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <OptionRight navigationProps={navigation} />,
      headerRight: (
        <QRCodeButton />
      ),
      headerTransparent: true
    }),
  },
  Notification: {
    screen: Notification,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerTransparent: true
    }),
  },
  Messenger: {
    screen: Messenger,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerTransparent: true
    }),
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: Style.headerStyle,
      headerTintColor: Color.primary,
    }),
  },
  Marketplace: {
    screen: Marketplace,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: Style.headerStyle,
      headerTintColor: Color.primary,
    }),
  },
  Product: {
    screen: Product,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: Style.headerStyle,
      headerTintColor: Color.primary,
    }),
  },
  Checkout: {
    screen: Checkout,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: Style.headerStyle,
      headerTintColor: Color.primary,
    }),
  },
  Billing: {
    screen: Billing,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerStyle: Style.headerStyle,
      headerTintColor: Color.primary,
    }),
  },
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerTransparent: true
    }),
  },
  TermsAndConditions: {
    screen: TermsAndConditions,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerTransparent: true
    }),
  },
  Support: {
    screen: Support,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerTransparent: true
    }),
  },
  UpdateTicket: {
    screen: UpdateTicket,
    navigationOptions: ({ navigation }) => ({
      title: null,
      headerLeft: <MenuDrawerStructure navigationProps={navigation} />,
      headerRight: <OptionRight navigationProps={navigation} />,
      headerTransparent: true
    }),
  },
});

const Drawer = createDrawerNavigator(
  {
    Requests: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Requests',
      },
    },
    Circle: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Circle',
      },
    },
    Dashboard: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Dashboard',
      },
    },
    Messenger: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Messages',
      },
    },
    Profile: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Profile',
      },
    },
    Notification: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Notification',
      },
    },
    Marketplace: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Marketplace',
      },
    },
    Product: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Product',
      },
    },
    Checkout: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Checkout',
      },
    },
    Billing: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Billing',
      },
    },
    Settings: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Settings',
      },
    },
    TermsAndConditions: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Terms and Condition',
      },
    },
    Support: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Support',
      },
    },
    UpdateTicketStack: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: 'Update Ticket',
      },
    },
  },
  {
    contentComponent: Slider,
  },
);

export default Drawer;
