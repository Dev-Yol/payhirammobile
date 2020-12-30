import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './BalanceCardStyle';

class BalanceCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[styles.CardContainer, { backgroundColor: this.props.cardColor ,...this.props.styles}, ]}>
        <View style={styles.AvailableBalanceContainer}>
          <Text style={styles.AvailableBalanceTextStyle}>
            Available Balance
          </Text>
        </View>
        <View style={styles.BalanceContainer}>
          <Text style={styles.BalanceTextStyle}>
            {this.props.availableBalance}
          </Text>
        </View>
        <View style={styles.CurrentBalanceContainer}>
          <Text style={styles.CurrentBalanceTextStyle}>
            Current Balance: {this.props.currentBalance}
          </Text>
        </View>
      </View>
    );
  }
}

export default BalanceCard;
