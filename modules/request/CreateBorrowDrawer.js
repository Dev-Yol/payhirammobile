import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import CreateBorrowRequest from 'modules/request/CreateBorrow.js';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.navigate('drawerStack');
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon icon={faChevronLeft} size={BasicStyles.iconSize} style={[BasicStyles.iconStyle, {
            color: Color.white
          }]} />
        </TouchableOpacity>
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



const CreateBorrowRequestStack = createStackNavigator({
  createBorrowRequestScreen: {
    screen: CreateBorrowRequest,
    navigationOptions: ({ navigation }) => ({
      title: 'Create Borrow Request',
      headerLeft: <HeaderOptions navigationProps={navigation} />,
      drawerLabel: 'Create Borrow Request',
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBorrowRequestStack);