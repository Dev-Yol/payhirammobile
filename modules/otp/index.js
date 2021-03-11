import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, TextInput} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import Button from 'components/Form/Button.js';
import styles from 'modules/otp/Styles.js';
import OneTimePin from 'modules/otp/OneTimePin.js';
import {Routes, Color, Helper, BasicStyles} from 'common';
import {Spinner} from 'components';
import {connect} from 'react-redux';
import Api from 'services/api';
const height = Math.round(Dimensions.get('window').height);

class OTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      otp: [{
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
      }],
      activeIndex: 0,
      otpTextInput: [],
      errorMessage: null
    };
    this.otpTextInput = []
  }

  componentDidMount() {
    this.generateOTP();
  }

  handleResult = () => {
    const { data } = this.props.navigation.state.params
    console.log('[OTP] Action Handler')
    if(data){
      switch(data.payload){
        case 'createRequest':
          console.log('[OTP] On createRequest', data)
          this.sendCreateRequest(data.data)
          break;
        case 'transferFund':
          console.log('[OTP] On transferFund', data)
          this.sendTransferFund(data.data)
          break;
        case 'directTransfer':
          console.log("[OTP] on Direct Transfer", data)
          this.sendDirectTransfer(data)
          break
      }
    } 
  }

  completeOTPField = () => {
    const { otp, errorMessage } = this.state;
    let finalOtp = '';
    for (var i = 0; i < 6; i++) {
      let item = otp[i]
      if(item.code == null || item.code == ''){
        this.setState({
          errorMessage: 'Incomplete Code'
        })
        return
      }else{
        finalOtp += item.code
      }
      if(i === 5 && errorMessage == null){
        console.log('[OTP] Success Message', finalOtp)
        // this.validateOTP(finalOtp)
      }
    }
  }

  inputHandler = (value, i) => {
    const { otp } = this.state;
    this.setState({
      errorMessage: null
    })
    if(!value){
      let newOtp = otp.map((item, index) => {
        if(i == index){
          item.code = value
        }
        return item
      })
      this.setState({otp: newOtp})
      if(i > 0){
        let newIndex = parseInt(i - 1)
        this.otpTextInput[i - 1].focus();
        this.setState({activeIndex: newIndex})          
      }
      return
    }else{
      let newOtp = otp.map((item, index) => {
        if(i == index){
          item.code = value
        }
        return item
      })
      this.setState({otp: newOtp})
      if(i < 5 && (newOtp[i].code != null && newOtp[i].code != '')){
        let newIndex = parseInt(i + 1)
        this.otpTextInput[i + 1].focus();
        this.setState({activeIndex: newIndex})
      }else{
        // disabled here
      }
      if(i == 5){
        this.completeOTPField(i)      
      }
      return  
    }

  };

  sendDirectTransfer = (data) => {
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
    this.setState({isLoading: true});
    Api.request(Routes.ledgerDirectTransfer, parameter, response => {
        this.setState({isLoading: false});
        console.log('[OTP] Create Request response', response)
        if(response.error == null){
          this.navigateToScreen('directTransferDrawer', 'transferFundScreen', {
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
                this.props.navigation.pop()
              }}
            ],
            { cancelable: false }
          );
        }
      },
      (error) => {
        console.log('API ERROR', error);
        this.setState({isLoading: false});
      },
    );
  };

  sendCreateRequest = (parameter) => {
    console.log('OTP Create Request API Call')
    this.setState({isLoading: true});
    Api.request(Routes.requestCreate, parameter, response => {
        this.setState({isLoading: false});
        console.log('[OTP] Create Request response', response)
        if(response.data != null){
          this.props.navigation.navigate('requestItemStack', {
            data: response.data,
            from: 'create'
          })          
        }
      },
      (error) => {
        console.log('API ERROR', error);
        this.setState({isLoading: false});
      },
    );
  };


  navigateToScreen = (route, routeName, data) => {
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
    this.props.navigation.dispatch(navigateAction);
  }

  sendTransferFund = (data) => {
    const { user } = this.props.state;
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
    this.setState({isLoading: true});
    Api.request(Routes.requestManageByThread, parameter, response => {
        this.setState({isLoading: false});
        console.log('[OTP] Transfer fund response', response)
        if(response.error != null){
          Alert.alert(
            "Error Message",
            response.error,
            [
              { text: "Ok", onPress: () => {
                this.props.navigation.pop()
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
          this.navigateToScreen('transferFundStack', 'transferFundScreen', {
            ...data,
            status: 2
          })
        }
      },
      (error) => {
        console.log('API ERROR', error);
        this.setState({isLoading: false});
      },
    );
  };

  generateOTP = () => {
    const {user} = this.props.state;
    if(user == null){
      return
    }
    let parameters = {
      account_id: user.id,
    };
    this.setState({isLoading: true});
    Api.request(
      Routes.notificationSettingOtp,
      parameters,
      (data) => {
        this.setState({isLoading: false});
      },
      (error) => {
        if (error) {
          this.setState({isLoading: false});
        }
      },
    );
  };

  validateOTP = (code) => {
    const {user} = this.props.state;
    const {data} = this.props.navigation.state.params;
    this.setState({
      errorMessage: null
    })
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
    this.setState({isLoading: true});
    console.log('[OTP] parameters', JSON.stringify(parameters))
    Api.request( Routes.notificationSettingsRetrieve, parameters, (response) => {
        this.setState({
          isLoading: false,
          errorMessage: null
        })
        console.log("[OTP] Retrieve OTP", response)
        if(response.data.length > 0){
          console.log('[OTP Success]');
          this.handleResult() 
        }else{
          this.setState({
            errorMessage: 'Invalid Code.'
          })
        }
      },
      (error) => {
        this.setState({isLoading: false, errorMessage: 'Invalid Code'});
        console.log('[OTP Error]', parameter);
      },
    );
  };

  render() {
    const { user, theme } = this.props.state;
    const { isLoading } = this.state;
    const { otp } = this.state;
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
            height: 50
          }}
          onChangeText={(code) => this.inputHandler(code, i)}
          secureTextEntry={true}
          value={otp[i].code}
          maxLength={1}
          placeholder={'•'}
          keyboardType={'numeric'}
          key={i}
          autoFocus={this.state.activeIndex == i}
          ref={ref => this.otpTextInput[i] = ref}
        />
      );
    }

    return (
      <View style={styles.Container}>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        {(user) && (
          <View style={{
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: height,
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
                    this.state.errorMessage != null && (
                      <View style={{
                        alignItems: 'center',
                        paddingBottom: 20
                      }}>
                        <Text style={{
                          color: Color.danger,
                          textAlign: 'center'
                        }}>Opps! {this.state.errorMessage}</Text>
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
            <View style={styles.ButtonContainer}>
              <Button 
                style={{
                  backgroundColor: Color.danger,
                  width: '48%',
                  marginRight: '1%',
                  marginLeft: '1%'
                }}
                title={'Back'}
                onClick={() => this.props.navigation.pop()}
              />
              <Button 
                style={{
                  backgroundColor: theme ? theme.secondary : Color.secondary,
                  width: '48%',
                  marginRight: '1%',
                  marginLeft: '1%'
                }}
                title={'Continue'}
                onClick={() => this.validateOTP()}
              />
            </View>
          )
        }
      </View>
    );
  }
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
