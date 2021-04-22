import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack';
import PaymentMethodsScreen from './index.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles } from 'common'

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop();
  };
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
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

const paymentMethodsStack = createStackNavigator(
  {
    paymentMethodsScreen: {
      screen: PaymentMethodsScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Payment Methods',
        headerLeft: <HeaderOptions navigationProps={navigation} />,
        ...BasicStyles.headerDrawerStyle
      }),
    },
  }
);

export default paymentMethodsStack;


