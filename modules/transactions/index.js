import React, {Component} from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
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
    this.retrieve(false)
  }

  onChange(item, type){
    if(type == 'gender'){
      this.setState({gender: item});
    }else{
      this.setState({school: item});
    }
  }

  retrieve = (flag) => {
    const { user } = this.props.state
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
      sort: {
        column: 'created_at',
        value: 'desc'
      },
      value: '%',
      column: 'created_at'
    };
    console.log('parameter', parameter)
    this.setState({isLoading: true});
    Api.request(Routes.transactionRetrieve, parameter, (response) => {
      console.log('[data]', response)
      this.setState({isLoading: false});
      if (response.data.length > 0) {
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'code'),
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
      <SafeAreaView>
        <ScrollView
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if(event.nativeEvent.contentOffset.y <= 0) {
              if(isLoading == false){
                this.retrieve(false)
              }
            }
            console.log(scrollingHeight, totalHeight);
            if(scrollingHeight >= (totalHeight - 20)) {
              if(isLoading == false){
                this.retrieve(true)
              }
            }
          }}
          showsVerticalScrollIndicator={false}>
        <View style={{
          marginTop: Platform.OS == 'ios' ? 50 : 50,
          marginBottom: Platform.OS == 'ios' ? 105 : 105
        }}>
            <View style={Styles.MainContainer}>
              {
                data && data.map((item, index) => (
                  <TransactionCard key={index} data={item}/>
                ))
              }
            </View>
        </View>
      </ScrollView>
       {isLoading ? <Spinner mode="overlay" /> : null}
    </SafeAreaView>
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
