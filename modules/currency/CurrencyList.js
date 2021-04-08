import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import {connect} from 'react-redux';
import styles from './Styles';
import { RadioButton, Text } from 'react-native-paper';

class CurrencyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'PHP'
    };
  }

  async setCur(val){
    await this.setState({currency: val})
  }
  
  async setCurren(val){
    await this.setState({currency: val})
  }
  
  render() {
    const { currency } = this.state
    return (
        <ScrollView>
          <View style={styles.PaymentMethodsContainer}>
          <RadioButton
              value="PHP"
              status={ currency == 'PHP' ? 'checked' : 'unchecked' }
              onPress={() => this.setCur('PHP')}
              color='#3F0050'
              />
            <Text style={{marginTop: '-8%', marginLeft: '12%', marginBottom: '3%'}}>PHP</Text>
            <RadioButton
              value="USD"
              status={ currency == 'USD' ? 'checked' : 'unchecked' }
              onPress={() => this.setCurren('USD')}
              color='#3F0050'
            />
            <Text style={{marginTop: '-8%', marginLeft: '12%', marginBottom: '3%'}}>USD</Text>
          </View>
        </ScrollView>
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
