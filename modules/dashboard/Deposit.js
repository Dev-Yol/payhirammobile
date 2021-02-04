import React, {Component} from 'react';
import Style from './Style';
import {Text, View, TouchableOpacity, TextInput, ScrollView, TouchableHighlight, ToastAndroid, Platform} from 'react-native';
import Picker from '@react-native-community/picker'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import {NavigationActions} from 'react-navigation';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { Spinner } from 'components';
import Currency from 'services/Currency.js';
import Api from 'services/api/index.js';
import MessageModal from 'components/Modal/Message.js';
import { Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
const height = Math.round(Dimensions.get('window').height);
class Deposit extends Component {
  constructor(props){
    super(props);
    this.state = {
      errorMessage: null,
      isLoading: false,
      amount: 0,
      bank: Helper.payments[0].title,
      description: null,
      currency: 'PHP',
      deposit_slip: null,
      isMessageModal: false
    }
  }

  submit = () => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      amount: this.state.amount,
      bank: this.state.bank,
      description: this.state.description,
      currency: this.state.currency,
      deposit_slip: null,
      status: 'pending'
    }
    this.setState({isLoading: true});
    console.log('parameter', parameter);
    Api.request(Routes.depositCreate, parameter, response => {
      this.setState({isLoading: false});
      this.setState({isMessageModal: true})
    });
  }

  redirect = () => {
    this.setState({isMessageModal: false})
    const navigateAction = NavigationActions.navigate({
      routeName: 'Dashboard'
    });
    this.props.navigation.dispatch(navigateAction);
  }

  validate = () => {
    const { userLedger } = this.props.state;
    let flag = false;
    console.log('state', this.state)
    if(Helper.request.MINIMUM > this.state.amount){
      let error = 'Minimum transaction is ' + Currency.display(Helper.request.MINIMUM, this.state.currency)
      this.setState({
        errorMessage: error
      })
      return
    }
    if(Helper.MAXIMUM_DEPOSIT < this.state.amount){
      let error = 'Maximum transaction is ' + Currency.display(Helper.MAXIMUM_DEPOSIT, this.state.currency)
      this.setState({
        errorMessage: error
      })
      return
    }
    if(this.state.bank == null || this.state.bank == ''){
      this.setState({
        errorMessage: 'Bank is required'
      })
      return
    }
    if(this.state.currency == null || this.state.currency == ''){
      this.setState({
        errorMessage: 'Currency is required'
      })
      return
    }
    setTimeout(() => {
      this.setState({errorMessage: null})
      this.submit()
    }, 100)
  }


  _inputs = () => {
    const { userLedger, user } = this.props.state;
    const { errorMessage } = this.state;
    const currency = Helper.currency.map((item, index) => {
                      return {
                        label: item.title,
                        value: item.value
                      };
                    });

    const bank = Helper.payments.map((item, index) => {
                    return {
                      label: item.title,
                      value: item.title
                    };
                  })
    return (
      <View style={{
        minHeight: height
      }}>
        <View style={{
          alignItems: 'center',
          borderRadius: 5,
          backgroundColor: Color.danger
        }}>
          <Text style={{
            color: Color.white,
            fontSize: 11,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            textAlign: 'justify'
          }}>Hi {user.username}! Zero charges for deposit except the charges from the banks upon depositing to our accounts.</Text>
        </View>
        {
          errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 20
            }}>
              <Text style={{
                color: Color.danger
              }}>Opps! {errorMessage}</Text>
            </View>
          )
        }
        <View style={{
          marginTop: 10
        }}>
          <Text>Select Currency</Text>
          {
            Platform.OS == 'android' && (
              <Picker selectedValue={this.state.currency}
              onValueChange={(currency) => this.setState({currency})}
              style={BasicStyles.pickerStyleCreate}
              >
                {
                  Helper.currency.map((item, index) => {
                    return (
                      <Picker.Item
                      key={index}
                      label={item.title} 
                      value={item.value}/>
                    );
                  })
                }
              </Picker>
            )
          }
          {
            Platform.OS == 'ios' && (
              <RNPickerSelect
                onValueChange={(currency) => this.setState({currency})}
                items={currency}
                style={BasicStyles.pickerStyleIOSNoMargin}
                placeholder={{
                  label: 'Click to select',
                  value: null,
                  color: Color.primary
                }}
                />
            )
          }
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Amount</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(amount) => this.setState({amount})}
            value={this.state.amount}
            placeholder={'0'}
            keyboardType={'numeric'}
          />
        </View>
        <View style={{
          marginTop: 10
        }}>
          <Text>Select Bank</Text>
          {
            Platform.OS == 'android' && (
              <Picker selectedValue={this.state.bank}
              onValueChange={(bank) => this.setState({bank})}
              style={BasicStyles.pickerStyleCreate}
              >
                {
                  Helper.payments.map((item, index) => {
                    return (
                      <Picker.Item
                      key={index}
                      label={item.title} 
                      value={item.title}/>
                    );
                  })
                }
              </Picker>
            )
          }
          {
            Platform.OS == 'ios' && (
              <RNPickerSelect
                onValueChange={(currency) => this.setState({bank})}
                items={bank}
                style={BasicStyles.pickerStyleIOSNoMargin}
                placeholder={{
                  label: 'Click to select',
                  value: null,
                  color: Color.primary
                }}
                /> 
            )
          }
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Message (optional)</Text>
          <TextInput
            style={ Platform.OS == 'android' ? {
              borderColor: Color.gray,
              borderWidth: 1,
              width: '100%',
              marginBottom: 20,
              textAlignVertical: 'top',
              borderRadius: 5,
              paddingLeft: 10
            } : {
              borderColor: Color.gray,
              borderWidth: 1,
              width: '100%',
              marginBottom: 20,
              textAlignVertical: 'top',
              borderRadius: 5,
              minHeight: 50,
              textAlignVertical: 'middle',
              paddingLeft: 10
            }}
            onChangeText={(description) => this.setState({description})}
            value={this.state.description}
            placeholder={'Optional'}
            multiline = {true}
            numberOfLines = {5}
          />
        </View>
        <View>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '100%',
                marginBottom: 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {
                this.validate()
              }}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Deposit</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }


  render(){
    const { payload } = this.props;
    const { isLoading, isMessageModal } = this.state;
    return (
      <View style={Style.MainContainer}>
        <ScrollView 
          style={Style.ScrollView}
          >
          {this._inputs()}
        </ScrollView>
        {isLoading ? <Spinner mode="overlay"/> : null }
        {isMessageModal ?
          <MessageModal
            visible={isMessageModal}
            title={'Success Message'}
            message={'We\'ve sent you an email to this account for further instructions of the deposit.'}
            onCLose={() => {
              this.redirect()
            }}
          /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Deposit);
