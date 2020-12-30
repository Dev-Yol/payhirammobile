import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import AddressTile from 'modules/addLocation/AddressTile.js';
import styles from 'modules/addLocation/Style.js';
import Button from 'components/Form/Button';
import { Color } from 'common';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

const dummyData = [
  {
    addressType: 'Home',
    address: '123 Road, Cebu City, Cebu',
    country: 'Philippines',
  },
  {
    addressType: 'Home',
    address: '123 Road, Cebu City, Cebu',
    country: 'Philippines',
  },
  {
    addressType: 'Home',
    address: '123 Road, Cebu City, Cebu',
    country: 'Philippines',
  },
];
class AddLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: 0,
    };
  }

  selectHandler = (index) => {
    this.setState({selectedAddress: index});
  };

  renderAddresses = () => {
    return dummyData.map((address, index) => {
      return (
        <AddressTile
          key={index}
          index={index}
          addressType={address.addressType}
          address={address.address}
          country={address.country}
          onPress={this.selectHandler}
          backgroundColor={
            this.state.selectedAddress === index ? '#22B173' : '#FFFFFF'
          }
          fontColor={
            this.state.selectedAddress === index ? '#FFFFFF' : '#000000'
          }
        />
      );
    });
  };

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            height: height + 25
          }}>
          
            {this.renderAddresses()}

          </View>
        </ScrollView>

        <Button
          onClick={() => this.redirect('locationWithMapStack')}
          title={'Add Address'}
          style={{
            backgroundColor: Color.secondary,
            position: 'absolute',
            bottom: 0,
            left: '5%',
            right: '5%',
            width: '90%'
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    // updateUser: (user) => dispatch(actions.updateUser(user)),
    setLocation: (location) => dispatch(actions.setLocation(location)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);
