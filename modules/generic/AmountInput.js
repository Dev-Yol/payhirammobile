import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from './BalanceCardStyle';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color, BasicStyles } from 'common';

class AmountInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      errorMessage: null
    }
  }

  render() {
    const { theme, ledger, currencyBal } = this.props.state;
    console.log('[currencyBal]', currencyBal)
    const { errorMessage } = this.state;
    return (
      <View
        style={{
          width: '100%',
          paddingTop: 20,
          paddingBottom: 20
        }}>
          {/*
            errorMessage && (
              <Text style={{
                color: Color.danger,
                fontSize: BasicStyles.standardFontSize,
                width: '100%',
                textAlign: 'center'
              }}>{
                errorMessage
              }</Text>
            )
          */}
          <TextInput
            value={this.state.amount}
            keyboardType={'numeric'}
            onChangeText={(input) => {
              if(ledger && ledger.available_balance < input){
                this.setState({
                  errorMessage: 'Insufficient Balance!'
                })
                this.props.onChange(input, ledger && (currencyBal != null ? currencyBal : ledger.currency))
              }else{
                this.setState({
                  amount: input
                })
                this.props.onChange(input, ledger && (currencyBal != null ? currencyBal : ledger.currency))
              }
            }}
            style={{
              textAlign: 'center',
              fontSize: 52,
              width: '100%',
            }}
            placeholder={'0.00'}
          />
          
          {
            (ledger && this.props.disableRedirect == false) && (
              <TouchableOpacity style={{
                width: '100%',
                paddingBottom: 20
              }}
              onPress={() => {
                if(this.props.disableRedirect){
                  //
                }else{
                  this.props.navigation.navigate('currencyStack')  
                }
              }
            }
              >
                <View style={{
                  width: '100%',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    paddingTop: 5,
                    paddingBottom: 5
                  }}>{Currency.display(ledger && ledger.available_balance ? ledger.available_balance.toFixed() : 0, currencyBal != null ? currencyBal : ledger.currency) +  '  >'}</Text>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    color: Color.gray
                  }}>Available Balance</Text>
                </View>
              </TouchableOpacity>
            )
          }

      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AmountInput);
