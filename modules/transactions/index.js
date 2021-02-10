import React, {Component} from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import Api from 'services/api/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faUserCircle, faUpload } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes} from 'common';
import Currency from 'services/Currency.js'
import Styles from './Styles.js'
import { connect } from 'react-redux';
import TransactionCard from 'modules/generic/TransactionCard';
// const sample = [{
//   id: 1,
//   amount: 500,
//   via: '****5678',
//   description: 'This is a test',
//   date: 'August 9, 2020 5:00 PM',
//   currency: 'PHP'
// }, {
//   id: 2,
//   amount: 600,
//   via: '****5678',
//   description: 'This is a test',
//   date: 'August 9, 2020 5:00 PM',
//   currency: 'PHP'
// }]


class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount(){
    console.log('user hereitis', JSON.stringify(this.props))
    // const {user} = this.props;
    // if (user != null) {
    this.retrieveLedgerHistory({created_at: 'desc'}, {column: 'created_at', value: ''})
    // }
  }

  onChange(item, type){
    if(type == 'gender'){
      this.setState({gender: item});
    }else{
      this.setState({school: item});
    }
  }

  retrieveLedgerHistory = (sort, filter) => {
    // const { user } = this.props.state
    let key = Object.keys(sort)
    // if (user == null) {
    //   return;
    // }
    let parameter = {
      // account_id: this.user.userID,
      offset: 0,
      limit: 50,
      sort: {
        column: key[0],
        value: sort[key[0]]
      },
      value: filter.value + '%',
      column: filter.column
    };
    Api.request(Routes.transactionRetrieve, parameter, (response) => {
      if (response != null) {
        this.setState({
          data: response.data
        })
      } else {
        this.setState({
          data: []
        })
      }
    }, error => {
      console.log('response', error)
    });
  };

  render() {
    const { data } = this.state;
    return (
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}>
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

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
