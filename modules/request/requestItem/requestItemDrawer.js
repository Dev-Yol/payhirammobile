import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {Color, BasicStyles} from 'common';
import {connect} from 'react-redux';
import RequestItem from './index.js';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.navigate('drawerStack');
  };
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.iconSize}
            style={styles.iconStyle}
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

const RequestItemStack = createStackNavigator({
  requestItemScreen: {
    screen: RequestItem,
    navigationOptions: ({navigation}) => ({
      title: 'Request Item',
      headerLeft: <HeaderOptions navigationProps={navigation} />,
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
)(RequestItemStack);
