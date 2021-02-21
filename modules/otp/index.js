import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, TextInput} from 'react-native';
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
        this.validateOTP(finalOtp)
      }
    }
  }

  inputHandler = (value, i) => {
    const { otp } = this.state;
    console.log('i', i)
    this.setState({
      errorMessage: null
    })
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
  };

  sendCreateRequest = (parameter) => {
    console.log('OTP Create Request API Call')
    Api.request(Routes.requestCreate, parameter, response => {
        this.setState({isLoading: false});
        console.log('[OTP] Create Request response', response)
        if(response.data != null){
          this.props.navigation.navigate('requestItemStack', {
            data: response.data
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

    if(user == null || data == null || code == null || (code && code.length < 6)){
      return
    }
    let parameters = [
      {
        condition: [
          {
            column: 'code',
            value: code,
            clause: '=',
          },
          {
            column: 'account_id',
            value: user.id,
            clause: '=',
          },
        ],
      },
    ];
    this.setState({isLoading: true});
    Api.request(
      Routes.notificationSettingsRetrieve,
      parameters,
      (data) => {
        console.log('[OTP Success]');
        this.handleResult()
      },
      (error) => {
        this.setState({isLoading: false, errorMessage: 'Invalid Code'});
        console.log('[OTP Error]');
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
          value={otp[i].code}
          maxLength={1}
          placeholder={'0'}
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
