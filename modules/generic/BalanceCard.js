import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './BalanceCardStyle';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color } from 'common';
import Skeleton from 'components/Loading/Skeleton';

class BalanceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
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
          {Currency.display(data.available_balance >= 0 ? data.available_balance : 0, data.currency)}
        </Text>

        {
          (data.current_balance != data.available_balance) && (
            <View>
              <Text style={{
                ...styles.CurrentBalanceTextStyle,
                fontWeight: 'bold'
              }}>
                {Currency.display(data.current_balance, data.currency)}
              </Text>
              <Text style={{
                ...styles.CurrentBalanceTextStyle,
                paddingBottom: 10
              }}>
                Current Balance
              </Text>
            </View>
          )
        }
        {
          this.state.isLoading && (<Skeleton size={2}/>)
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
