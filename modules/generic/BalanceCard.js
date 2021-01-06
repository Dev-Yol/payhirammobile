import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './BalanceCardStyle';
import Currency from 'services/Currency';

class BalanceCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    return (
      <View
        style={styles.CardContainer}>
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

export default BalanceCard;
