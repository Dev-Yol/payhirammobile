import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { BasicStyles, Helper } from 'common';
import {connect} from 'react-redux';
import styles from './Styles';

class CurrencyList extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
        <TouchableOpacity
        style={[
          styles.AddressTileContainer,
          {
            backgroundColor: this.props.backgroundColor,
            paddingRight: 30
          },
        ]}
        onPress={() => {
          this.props.onPress(this.props.index);
        }}>
        <View style={styles.AddressContainer}>
          <Text
            style={[styles.AddressTextStyle, {
                color: this.props.fontColor,
                fontWeight: 'bold',
                fontSize: 15,
                marginTop: 5,
                marginBottom: 5
              }
            ]}>
            {this.props.currency}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyList);
