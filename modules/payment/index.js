import React, { Component } from 'react';
import { Color, BasicStyles } from 'common';
import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, ScrollView, Switch, Image, TextInput, Dimensions } from 'react-native';
import PaymentAccountTile from './PaymentAccountTile';
import styles from './Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const height = Math.round(Dimensions.get('window').height);
class AddPayment extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    const res = {
        creditCard: require('assets/credit-card.png'),
        debitCard: require('assets/debit-card.png'),
        wallet: require('assets/wallet.png')
    };
    return (
      <View>
        <ScrollView>
          <View style={styles.PaymentMethodsContainer}>
            <PaymentAccountTile src={res.creditCard} />
            <PaymentAccountTile src={res.debitCard} />
            <PaymentAccountTile src={res.wallet} />
          </View>
          <View style={styles.ButtonContainer}>
            <TouchableOpacity
              style={styles.CustomButtonContainer}
              onPress={() => {
                this.props.navigation.navigate('addPaymentStack');
              }}>
              <FontAwesomeIcon
                  icon={faPlus}
                  style={{
                    color: Color.white,
                  }}
                  size={16}
                />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default AddPayment;
