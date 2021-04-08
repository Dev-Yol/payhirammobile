import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { BasicStyles, Helper } from 'common';
import CurrencyList from './CurrencyList';
import {connect} from 'react-redux';

class Currency extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedCurrency: null
    }
  }

  selectHandler = (index) => {
    const {setCurrencyBal} = this.props;
    this.setState({selectedCurrency: index})
    if(index == 0){
      let php = 'PHP'
      setCurrencyBal(php);
      this.props.navigation.pop()
    }else if(index == 1){
      let usd = 'USD'
      setCurrencyBal(usd)
      this.props.navigation.pop()
    }
  };

  render() {
    return Helper.currencyBal.map((item, index) => {
      return (
        <CurrencyList
          key={index}
          index={index}
          currency={item.currency}
          onPress={this.selectHandler}
          backgroundColor={
            this.state.selectedCurrency === index ? '#22B173' : '#FFFFFF'
          }
          fontColor={
            this.state.selectedCurrency === index ? '#FFFFFF' : '#000000'
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

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setCurrencyBal: (currencyBal) => dispatch(actions.setCurrencyBal(currencyBal)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Currency);
