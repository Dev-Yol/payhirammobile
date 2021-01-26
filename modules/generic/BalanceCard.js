import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './BalanceCardStyle';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color } from 'common';

class BalanceCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    const { theme } = this.props.state;
    return (
      <View
        style={[styles.CardContainer, {
          backgroundColor: theme ? theme.secondary : Color.secondary
        }]}>
        <Text style={styles.AvailableBalanceTextStyle}>
          Available Balance
        </Text>
        <Text style={styles.BalanceTextStyle}>
          {Currency.display(data.balance, data.currency)}
        </Text>
        {
          /*
            <Text style={styles.CurrentBalanceTextStyle}>
              Current Balance: {Currency.display(data.current_amount, data.currency)}
            </Text>
          */
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

export default connect(mapStateToProps, mapDispatchToProps)(BalanceCard);
