import React, {Component} from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faUserCircle, faUpload } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import Currency from 'services/Currency.js'
import Styles from './Styles.js'
import TransactionCard from 'modules/generic/TransactionCard';
const sample = [{
  id: 1,
  amount: 500,
  via: '****5678',
  description: 'This is a test',
  date: 'August 9, 2020 5:00 PM',
  currency: 'PHP'
}, {
  id: 2,
  amount: 600,
  via: '****5678',
  description: 'This is a test',
  date: 'August 9, 2020 5:00 PM',
  currency: 'PHP'
}]
class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: sample
    };
  }
  onChange(item, type){
    if(type == 'gender'){
      this.setState({gender: item});
    }else{
      this.setState({school: item});
    }
  }

  render() {
    const { data } = this.state;
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={Styles.MainContainer}>
            {
              data && data.map((item, index) => (
                <TransactionCard data={item}/>
              ))
            }     
            
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Transactions;
