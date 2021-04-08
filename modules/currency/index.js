import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { BasicStyles } from 'common';
import CurrencyList from './CurrencyList';

class Currency extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  selectHandler = (index) => {
    const {setDefaultAddress} = this.props;
    this.setState({ selectedAddress: index });
    setDefaultAddress(this.state.addresses[index]);
    console.log('[default]', this.props.state.defaultAddress);
    this.props.navigation.pop()
  };

  render() {
    // return (
    //   <CurrencyList/>
    // );
    return addresses.map((address, index) => {
      return (
        <CurrencyList
          key={index}
          index={index}
          address={address.route}
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
  }
}

const styles = StyleSheet.create({
  TermsAndConditionsContainer: {
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '5%',
    marginRight: '5%'
  },
  SectionContainer: {
    width: '100%',
  },
  SectionTitleContainer: {},
  SectionTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
    marginTop: 10
  },
  SectionTwoTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
  },
  SectionDescriptionContainer: {},
  SectionDescriptionTextStyle: {
    textAlign: 'justify',
    fontSize: BasicStyles.standardFontSize
  },
});

export default Currency;
