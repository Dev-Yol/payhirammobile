import React, {Component} from 'react';
import { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, TextInput, KeyboardAvoidingView} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import Button from 'components/Form/Button.js';
import styles from 'modules/otp/Styles.js';
import OneTimePin from 'modules/otp/OneTimePin.js';
import {Routes, Color, Helper, BasicStyles} from 'common';
import {Spinner} from 'components';
import {connect} from 'react-redux';
import Api from 'services/api';
import { useKeyboard } from '@react-native-community/hooks'

const height = Math.round(Dimensions.get('window').height);
const otpTemp = [{
          code: null
        }, {
          code: null
        }, {
          code: null
        }, {
          code: null
        }, {
          code: null
        }, {
          code: null
      }];
function OTP(props){
  const [activeIndex, setActiveIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [otpTextInput, setOTPTextInput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(otpTemp)
  const [displayHeight, setDisplayHeight] = useState(height)
  const keyboard = useKeyboard()
  
  useEffect(() => {
    console.log('keyboard height', keyboard.keyboardShown)
    setDisplayHeight(keyboard.keyboardShown ? height - (keyboard.keyboardHeight + 60) : height)
    generateOTP()
  });
 

  const handleResult = () => {
    const { data } = props.navigation.state.params
    console.log('[OTP] Action Handler', props.navigation.state.params)
    if(data){
      switch(data.payload){
        case 'createRequest':
          console.log('[OTP] On createRequest', data)
          sendCreateRequest(data.data)
          break;
        case 'transferFund':
          console.log('[OTP] On transferFund', data)
          sendTransferFund(data.data)
          break;
        case 'directTransfer':
          console.log("[OTP] on Direct Transfer", data)
          sendDirectTransfer(data)
          break
      }
    } 
  }

  const completeOTPField = () => {
    let finalOtp = '';
    for (var i = 0; i < 6; i++) {
      let item = otp[i]
      if(item.code == null || item.code == ''){
        setErrorMessage('Incomplete Code')
        return
      }else{
        finalOtp += item.code
      }
      if(i === 5 && errorMessage == null){
        console.log('[OTP] Success Message', finalOtp)
        validateOTP(finalOtp)
      }
    }
  }

  const inputHandler = (value, i) => {
    setErrorMessage(null)
    if(!value){
      let newOtp = otp.map((item, index) => {
        if(i == index){
          item.code = value
        }
        return item
      })
      setOtp(newOtp)
      if(i > 0){
        let newIndex = parseInt(i - 1)
        otpTextInput[i - 1].focus();
        setActiveIndex(newIndex)         
      }
      return
    }else{
      let newOtp = otp.map((item, index) => {
        if(i == index){
          item.code = value
        }
        return item
      })
      setOtp(newOtp)
      if(i < 5 && (newOtp[i].code != null && newOtp[i].code != '')){
        let newIndex = parseInt(i + 1)
        otpTextInput[i + 1].focus();
        setActiveIndex(newIndex)
      }else{
        // disabled here
      }
      if(i == 5){
        // this.completeOTPField(i)
        otpTextInput[i].blur()
      }
      return  
    }

  };

  const sendDirectTransfer = (data) => {
    console.log('OTP Create Request API Call')
    let parameter = {
      from: {
        code: data.from.code,
        email: data.from.email
      },
      to: {
        code: data.to.code,
        email: data.to.email
      },
      amount: data.amount,
      currency: data.currency,
      notes: data.notes,
      charge: data.charge
    }
    console.log('[SEND directTransfer] parameter', parameter)
    setIsLoading(true)
    Api.request(Routes.ledgerDirectTransfer, parameter, response => {
        setIsLoading(false)
        console.log('[OTP] Create Request response', response)
        if(response.error == null){
          navigateToScreen('directTransferDrawer', 'transferFundScreen', {
            ...data,
            success: true,
            code: data.to.code
          })          
        }else{
          Alert.alert(
            "Error Message",
            response.error,
            [
              { text: "Ok", onPress: () => {
                props.navigation.pop()
              }}
            ],
            { cancelable: false }
          );
        }
      },
      (error) => {
        console.log('API ERROR', error);
        setIsLoading(false)
      },
    );
  };

  const sendCreateRequest = (parameter) => {
    console.log('OTP Create Request API Call')
    setIsLoading(true)
    Api.request(Routes.requestCreate, parameter, response => {
        setIsLoading(false)
        console.log('[OTP] Create Request response', response)
        if(response.data != null){
          props.navigation.navigate('requestItemStack', {
            data: response.data,
            from: 'create'
          })          
        }
      },
      (error) => {
        console.log('API ERROR', error);
        setIsLoading(false)
      },
    );
  };


  const navigateToScreen = (route, routeName, data) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({routeName: routeName, params: {
            data: data
          }}),
        ]
      })
    });
    props.navigation.dispatch(navigateAction);
  }

  const sendTransferFund = (data) => {
    const { user } = props.state;
    if(user == null || data == null){
      return
    }
    console.log('OTP Transfer fund API Call')
    console.log('OTP Transfer fund API Call', data)
    let parameter = {
      code: data.code,
      account_code: user.code
    }
    console.log('[Fund Transfer] data', parameter)
    setIsLoading(true)
    Api.request(Routes.requestManageByThread, parameter, response => {
        setIsLoading(false)
        console.log('[OTP] Transfer fund response', response)
        if(response.error != null){
          Alert.alert(
            "Error Message",
            response.error,
            [
              { text: "Ok", onPress: () => {
                props.navigation.pop()
              }}
            ],
            { cancelable: false }
          );
        }else{
          // go to fund transfer and success message
          // this.props.navigation.pop()
          // this.props.navigation.navigate('transferFundStack', {
          //   data: {
          //     ...data,
          //     status: 2
          //   }
          // }) 
          navigateToScreen('transferFundStack', 'transferFundScreen', {
            ...data,
            status: 2
          })
        }
      },
      (error) => {
        console.log('API ERROR', error);
        setIsLoading(false)
      },
    );
  };

  const generateOTP = () => {
    const {user} = props.state;
    if(user == null){
      return
    }
    let parameters = {
      account_id: user.id,
    };
    setIsLoading(false)
    Api.request(
      Routes.notificationSettingOtp,
      parameters,
      (data) => {
        setIsLoading(false)
      },
      (error) => {
        setIsLoading(false)
      },
    );
  };

  const validateOTP = (code) => {
    const {user} = props.state;
    const {data} = props.navigation.state.params;
    
    setErrorMessage(null)
    console.log('[CODE]', code)
    if(user == null || data == null || code == null || (code && code.length < 6)){
      return
    }
    let parameters = {
      condition: [{
        column: 'code',
        value: code,
        clause: '=',
      }, {
        column: 'account_id',
        value: user.id,
        clause: '=',
      }]
    };
    setErrorMessage(false)
    console.log('[OTP] parameters', JSON.stringify(parameters))
    Api.request( Routes.notificationSettingsRetrieve, parameters, (response) => {
        setIsLoading(false)
        setErrorMessage(false)
        console.log("[OTP] Retrieve OTP", response)
        if(response.data.length > 0){
          console.log('[OTP Success]');
          handleResult() 
        }else{
          setErrorMessage('Invalid Code.')
        }
      },
      (error) => {
        setIsLoading(false)
        setErrorMessage('Invalid Code')
      },
    );
  };
  
  let inputs = []
  for (let i = 0; i < 6; i++) {
    inputs.push(
      <TextInput
        style={{
          borderColor: Color.lightGray,
          borderWidth: 1,
          width: '15%',
          marginLeft: '1%',
          marginBottom: 20,
          fontSize: 16,
          textAlign: 'center',
          borderRadius: 5,
          height: 50,
          borderRadius: 15,
          fontSize: 20
        }}
        onChangeText={(code) => inputHandler(code, i)}
        secureTextEntry={true}
        value={otp[i].code}
        maxLength={1}
        placeholder={'•'}
        keyboardType={'numeric'}
        key={i}
        ref={ref => otpTextInput[i] = ref}
      />
    );
  }
  const { user, theme } = props.state;
  return (
    <View
      style={{
        flex: 1
      }}
      >
      {isLoading ? <Spinner mode="overlay" /> : null}
      {(user) && (
        <View style={{
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: displayHeight,
          marginTop: 20
        }}>
          <View style={styles.OTPContainer}>
            <View style={styles.OTPTextContainer}>
              <Text style={[BasicStyles.standardFontSize, {textAlign: 'center'}]}>
                Please type the one time pass code sent to {user.email}.
              </Text>
            </View>
            <View style={styles.OTPInputContainer}>
                {
                  errorMessage != null && (
                    <View style={{
                      alignItems: 'center',
                      paddingBottom: 20
                    }}>
                      <Text style={{
                        color: Color.danger,
                        textAlign: 'center'
                      }}>Opps! {errorMessage}</Text>
                    </View>
                  )
                }
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '90%',
                  marginLeft: '5%',
                  marginRight: '5%'
                }}>
                {inputs}
                </View>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '90%',
              marginLeft: '5%',
              marginRight: '5%'
            }}>
              <Text>
                Didn't receive a code?
              </Text>
              <TouchableOpacity
                onPress={this.generateOTP}>
                <Text style={{
                  fontSize: BasicStyles.standardFontSize,
                  color: Color.success,
                  marginLeft: 5
                }}>
                  Click to resend.
                </Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      )}
      {
        (user) && (
          <View style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            position: 'absolute',
            bottom: 10,
            left: 0
          }}>
            <Button 
              style={{
                backgroundColor: Color.danger,
                width: '48%',
                marginRight: '1%',
                marginLeft: '1%'
              }}
              title={'Back'}
              onClick={() => props.navigation.pop()}
            />
            <Button 
              style={{
                backgroundColor: theme ? theme.secondary : Color.secondary,
                width: '48%',
                marginRight: '1%',
                marginLeft: '1%'
              }}
              title={'Continue'}
              onClick={() => completeOTPField()}
            />
          </View>
        )
      }
    </View>
  );
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setIsValidOtp: (isValidOtp) => {
      dispatch(actions.setIsValidOtp(isValidOtp));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OTP);
