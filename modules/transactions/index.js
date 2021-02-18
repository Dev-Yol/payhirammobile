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
import _ from 'lodash';
import { Spinner } from 'components';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      limit: 10,
      offset: 0,
      isLoading: false,
    };
  }

  componentDidMount(){
    console.log('user hereitis', JSON.stringify(this.props))
    // const {user} = this.props;
    // if (user != null) {
    this.retrieveLedgerHistory({created_at: 'desc'}, {column: 'created_at', value: ''}, false)
    // }
  }

  onChange(item, type){
    if(type == 'gender'){
      this.setState({gender: item});
    }else{
      this.setState({school: item});
    }
  }

  retrieveLedgerHistory = (sort, filter, flag) => {
    this.setState({isLoading: true});
    // const { user } = this.props.state
    let key = Object.keys(sort)
    // if (user == null) {
    //   return;
    // }
    let parameter = {
      account_id: this.props.state.user.id,
      limit: this.state.limit,
      offset: this.state.offset,
      sort: {
        column: key[0],
        value: sort[key[0]]
      },
      value: filter.value + '%',
      column: filter.column
    };
    Api.request(Routes.transactionRetrieve, parameter, (response) => {
      this.setState({isLoading: false});
      if (response != null) {
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    }, error => {
      console.log('response', error)
    });
  };

  render() {
    const { data, isLoading } = this.state;
    return (
      <ScrollView
        onScroll={(event) => {
          let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
          let totalHeight = event.nativeEvent.contentSize.height
          if(event.nativeEvent.contentOffset.y <= 0) {
            if(this.state.loading == false){
              // this.retrieve(false)
            }
          }
          console.log(scrollingHeight, totalHeight);
          if(scrollingHeight >= (totalHeight)) {
            if(this.state.loading == false){
              this.retrieveLedgerHistory({created_at: 'desc'}, {column: 'created_at', value: ''}, true)
            }
          }
        }}
        showsVerticalScrollIndicator={false}>
      <View>
        {isLoading ? <Spinner mode="overlay" /> : null}
          <View style={Styles.MainContainer}>
            {
              data && data.map((item, index) => (
                <TransactionCard data={item}/>
              ))
            }     
            
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
