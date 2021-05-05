import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {Color, BasicStyles} from 'common';
import {connect} from 'react-redux';
import Transactions from './index.js';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    if(this.props.navigationProps.state.params?.from != 'notification'){
      this.props.navigationProps.navigate('drawerStack');
    }else{
      this.props.navigationProps.pop();
    }
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
            style={{color: theme ? theme.primary : Color.primary }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
  };
};

let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const TransactionsStack = createStackNavigator({
  transactionsScreen: {
    screen: Transactions,
    navigationOptions: ({navigation}) => ({
      title: 'Transaction History',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

const styles = StyleSheet.create({
  iconStyle: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionsStack);
