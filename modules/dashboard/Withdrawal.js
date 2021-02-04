import React, {Component} from 'react';
import Style from './Style';
import {Text, View, TouchableOpacity, TextInput, ScrollView, TouchableHighlight, ToastAndroid} from 'react-native';
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
import OtpModal from 'components/Modal/Otp.js';
import PinModal from 'components/Modal/Pin.js';
import { Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
const height = Math.round(Dimensions.get('window').height);
class Withdrawal extends Component {
  constructor(props){
    super(props);
    this.state = {
      errorMessage: null,
      isLoading: false,
      amount: 0,
      bank: Helper.payments[0].title,
      currency: 'PHP',
      accountName: null,
      accountNumber: null,
      charge: 0,
      isMessageModal: false,
      isOtpModal: false,
      blockedFlag: false,
      otpData: null
    }
  }

  updateOtp = () => {
    const { user } = this.props.state;
    if(Helper.authorize == 'PIN'){
      this.setState({blockedFlag: false, errorMessage: null})
      setTimeout(() => {
        this.setState({isOtpModal: true})
      }, 500)
    }else{
      if(user == null){
        return
      }
      let parameter = {
        account_id: user.id
      }
      this.setState({isLoading: true});
      Api.request(Routes.notificationSettingOtp, parameter, response => {
        this.setState({isLoading: false});
        this.setState({otpData: response})
        if(response.error == null){
          this.setState({blockedFlag: false, errorMessage: null})
        }else{
          this.setState({blockedFlag: true})
          this.setState({errorMessage: response.error})
        }
        setTimeout(() => {
          this.setState({isOtpModal: true})
        }, 500)
      });
    }
  }

  onSuccessOtp = () => {
    this.setState({isOtpModal: false})
    this.submit()
  }

  submit = () => {
    const { user } = this.props.state;
    if(this.validate() == false){
      return
    }
    let parameter = {
      account_id: user.id,
      amount: this.state.amount,
      bank: this.state.bank,
      currency: this.state.currency,
      account_name: this.state.accountName,
      account_number: this.state.accountNumber,
      charge: this.state.charge
    }
    this.setState({isLoading: true});
    console.log('parameter', parameter);
    Api.request(Routes.withdrawalCreate, parameter, response => {
      this.setState({isLoading: false});
      this.setState({isMessageModal: true});
    });
  }

  checkCharges = () => {
    if(this.validate() == false){
      return
    }
    let parameter = {
      condition: [{
        column: 'min_amount',
        clause: '<=',
        value: this.state.amount
      }, {
        column: 'max_amount',
        clause: '>=',
        value: this.state.amount
      }, {
        column: 'type',
        clause: '=',
        value: this.state.bank
      }]
    }
    this.setState({isLoading: true});
    Api.request(Routes.transferChargesRetrieve, parameter, response => {
      this.setState({isLoading: false});
      if(response.data.length > 0){
        this.setState({charge: response.data[0].charge})
      }else{
        this.setState({charge: 0, errorMessage: 'Charge not found!'})
      }
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
    this.setState({errorMessage: null})
    if(Helper.request.MINIMUM > this.state.amount){
      let error = 'Minimum transaction is ' + Currency.display(Helper.request.MINIMUM, this.state.currency)
      this.setState({
        errorMessage: error
      })
      return false
    }
    if(Helper.MAXIMUM_WITHDRAWAL < this.state.amount){
      let error = 'Maximum transaction is ' + Currency.display(Helper.MAXIMUM_WITHDRAWAL, this.state.currency)
      this.setState({
        errorMessage: error
      })
      return false
    }
    if(userLedger.amount < (parseInt(this.state.amount) + parseInt(this.state.charge))){
      let error = 'You have an insufficient balance.'
      this.setState({
        errorMessage: error
      })
      return false
    }
    if(this.state.bank == null || this.state.bank == ''){
      this.setState({
        errorMessage: 'Bank is required'
      })
      return false
    }
    if(this.state.currency == null || this.state.currency == ''){
      this.setState({
        errorMessage: 'Currency is required'
      })
      return false
    }
    if(this.state.accountName == null || this.state.accountName == ''){
      this.setState({
        errorMessage: 'Account Name is required'
      })
      return false
    }
    if(this.state.accountNumber == null || this.state.accountNumber == ''){
      this.setState({
        errorMessage: 'Account Number is required'
      })
      return false
    }
    return true
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
          }}>Hi {user.username}! We are happy to serve you! Just a friendly reminder that the processing of the withdrawal will take up to 7 working days! For faster transaction you can create or post a request.</Text>
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
            onChangeText={(amount) => this.setState({amount, charge: 0})}
            value={this.state.amount}
            placeholder={'0'}
            keyboardType={'numeric'}
          />
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Account Name</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(accountName) => this.setState({accountName})}
            value={this.state.accountName}
            placeholder={'Enter account name'}
          />
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Account Number</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(accountNumber) => this.setState({accountNumber})}
            value={this.state.accountNumber}
            placeholder={'Enter account number'}
          />
        </View>

        <View>
          <Text style={{
            paddingTop: 10,
            fontWeight: 'bold',
            paddingBottom: 10
          }}>Summary</Text>
        </View>
        {
          errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <Text style={{
                color: Color.danger
              }}>Opps! {errorMessage}</Text>
            </View>
          )
        }
        <View style={{
          alignItems: 'center',
          paddingTop: 10,
          flexDirection: 'row',
          paddingBottom: 10
        }}>
          <Text style={{
            width: '70%'
          }}>Your current balance</Text>
          <Text style={{
            width: '30%',
          }}>{Currency.display(userLedger.amount, userLedger.currency)}</Text>
        </View>
        <View style={{
          alignItems: 'center',
          paddingTop: 10,
          flexDirection: 'row',
          paddingBottom: 10
        }}>
          <Text style={{
            width: '70%',
            color: Color.primary,
            fontWeight: 'bold'
          }}>Withdraw amount</Text>
          <Text style={{
            width: '30%',
            fontWeight: 'bold',
            color: Color.primary 
          }}>{Currency.display(this.state.amount, this.state.currency)}</Text>
        </View>
        <View style={{
          alignItems: 'center',
          paddingTop: 10,
          flexDirection: 'row',
          paddingBottom: 10
        }}>
          <Text style={{
            width: '70%'
          }}>Withdraw charge</Text>
          <Text style={{
            width: '30%'
          }}>{Currency.display(this.state.charge, this.state.currency)}</Text>
        </View>
        <View style={{
          alignItems: 'center',
          paddingTop: 10,
          flexDirection: 'row',
          paddingBottom: 10
        }}>
          <Text style={{
            width: '70%'
          }}>Total amount</Text>
          <Text style={{
            width: '30%'
          }}>{Currency.display(parseInt(this.state.charge) + parseInt(this.state.amount), this.state.currency)}</Text>
        </View>
        {
          this.state.charge == 0 && (
          <View>
            <TouchableHighlight style={{
                  height: 50,
                  backgroundColor: Color.warning,
                  width: '100%',
                  marginBottom: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  borderRadius: 5,
                }}
                onPress={() => {
                  this.checkCharges()
                }}
                underlayColor={Color.gray}
                  >
                <Text style={{
                  color: Color.white,
                  textAlign: 'center',
                }}>Check Charges</Text>
            </TouchableHighlight>
          </View>
          )
        }
        {
          this.state.charge > 0 && (
          <View>
            <TouchableHighlight style={{
                  height: 50,
                  backgroundColor: Color.primary,
                  width: '100%',
                  marginBottom: 100,
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                }}
                onPress={() => {
                  this.updateOtp()
                }}
                underlayColor={Color.gray}
                  >
                <Text style={{
                  color: Color.white,
                  textAlign: 'center',
                }}>Withdraw</Text>
            </TouchableHighlight>
          </View>
          )
        }
      </View>
    );
  }

  render(){
    const { payload } = this.props;
    const { isLoading,isMessageModal } = this.state;
    const { isOtpModal, blockedFlag, errorMessage} = this.state;
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
            message={'Just refresh your dashboard.'}
            onCLose={() => {
              this.redirect()
            }}
          /> : null}
        {
          Helper.authorize == 'OTP' && (
            <OtpModal
              visible={isOtpModal}
              title={blockedFlag == false ? 'Authentication via OTP' : 'Blocked Account'}
              actionLabel={{
                yes: 'Authenticate',
                no: 'Cancel'
              }}
              onCancel={() => this.setState({isOtpModal: false})}
              onSuccess={() => this.transfer()}
              onResend={() => this.updateOtp()}
              error={errorMessage}
              blockedFlag={blockedFlag}
            ></OtpModal>
          )
        }
        {
          Helper.authorize == 'PIN' && (
            <PinModal
              visible={isOtpModal}
              title={'Authentication via PIN'}
              actionLabel={{
                yes: 'Authenticate',
                no: 'Cancel'
              }}
              onCancel={() => this.setState({isOtpModal: false})}
              onSuccess={() => this.transfer()}
              error={errorMessage}
              blockedFlag={blockedFlag}
            ></PinModal>
          )
        }
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
)(Withdrawal);
