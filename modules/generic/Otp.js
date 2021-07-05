import React, {Component} from 'react';
import {Text, View, TextInput, Dimensions, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { Spinner } from 'components';
import Button from 'components/Form/Button';
import Api from 'services/api/index.js';
import DeviceInfo from 'react-native-device-info';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Otp extends Component {
  constructor(props){
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
      errorMessage: null,
      successMessage: null,
      successFlag: false,
      otpTextInput: []
    }
    this.otpTextInput = []
  }

  generateOTP = () => {
    const {user} = this.props.state;
    if(user == null){
      return
    }
    
    let deviceId = DeviceInfo.getDeviceId();
    let model = DeviceInfo.getModel();
    let uniqueId = DeviceInfo.getUniqueId();
    let parameters = {
      account_id: user.id,
      unique_code: user.device_info.unique_code,
      curr_unique_id: uniqueId,
      curr_device_id: deviceId,
      curr_model: model
    };
    console.log('[parameters]', parameters)
    this.setState({isLoading: true})
    Api.request(
      Routes.notificationSettingDeviceOtp,
      parameters,
      (data) => {
        console.log('[sdf]', data)
        this.setState({isLoading: false})
      },
      (error) => {
        this.setState({isLoading: false})
      },
    );
  }

  authorize = () => {
    let finalOtp = '';
    this.setState({
      errorMessage: null
    })
    for (var i = 0; i < 6; i++) {
      let item = this.state.otp[i]
      if(item.code == null || item.code == ''){
        this.setState({
          errorMessage: 'Incomplete Code'
        })
        return
      }else{
        finalOtp += item.code
      }
    }
    if(this.state.errorMessage != null){
      return
    }
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }, {
        value: finalOtp,
        column: 'code',
        clause: '='
      }]
    }
    console.log('paramter', parameter)
    this.setState({isLoading: true})
    Api.request(Routes.notificationSettingsRetrieve, parameter, (response) => {
      this.setState({isLoading: false})
      this.setState({
        isLoading: false,
        errorMessage: null
      })
      if(response.data.length > 0){
        console.log('[OTP Success]', response.data);
        this.props.verify() 
      }else{
        this.setState({
          errorMessage: 'Invalid Code.'
        })
      }
    });
  }

  setText = (code, i) => {
    console.log('i', i)
    let otp = this.state.otp.map((item, index) => {
      if(i == index){
        item.code = code
      }
      return item
    })
    this.setState({otp: otp})
    if(i < 5 && (otp[i].code != null && otp[i].code != '')){
      let newIndex = parseInt(i + 1)
      this.otpTextInput[i + 1].focus();
      this.setState({activeIndex: newIndex})
    }else{
      // disabled here
    }
    console.log('state', this.state);
  }

  _success = () => {
    const { successMessage } = this.state;
    return (
      <View style={{
        justifyContent: 'center',
        width: '100%',
        height: height - (200)
      }}>
        <Text style={{
          color: Color.primary,
          textAlign: 'center'
        }}>
        {successMessage}
        </Text>
      </View>
    );
  }

  _blocked = () => {
    return (
      <View style={{
        justifyContent: 'center',
        width: '100%',
        height: height - (200)
      }}>
        <Text style={{
          color: Color.danger,
          textAlign: 'center'
        }}>
        {this.props.error}
        </Text>
      </View>
    );
  }

  _otp = () => {
    let inputs = []
    for (let i = 0; i < 6; i++) {
      inputs.push(
        <TextInput
          style={{
            borderColor: Color.gray,
            borderWidth: 1,
            width: '15%',
            marginBottom: 10,
            fontSize: 16,
            textAlign: 'center',
            borderRadius: 5,
            marginRight: 3,
            height: 50
          }}
          onChangeText={(code) => this.setText(code, i)}
          value={this.state.otp[i].code}
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
      <View style={{
        paddingLeft: 10,
        // paddingTop: 10,
        // paddingRight: 10
      }}>
        {
          this.state.errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingBottom: 5
            }}>
              <Text style={{
                color: Color.danger,
                textAlign: 'center'
              }}>Opps! {this.state.errorMessage}</Text>
            </View>
          )
        }
        <View style={{
          marginLeft: 5,
        //   marginRight: 5,
          flexDirection: 'row',
          alignContent: 'center'
        }}>
          {
            inputs
          }
        </View>
        <View style={{
            flexDirection: 'row',
            width: '100%',
            marginLeft: 25
            // alignContent: 'center'
        }}>
          <Text style={{
            textAlign: 'center',
            color: 'gray',
            marginBottom: 25,
            fontStyle: 'italic',
            fontSize: 12
          }}>
            Didn't received a code?
          </Text>
          <Text style={{
            textAlign: 'center',
            color: 'blue',
            marginBottom: 25,
            marginLeft: 1,
            fontStyle: 'italic',
            textDecorationLine: 'underline',
            fontSize: 12
          }}
          onPress={() => this.generateOTP()}>Click to resend.</Text>
        </View>
      </View>
    );
  }
  render(){
    const { isLoading, successFlag, successMessage } = this.state;
    const { theme, user } = this.props.state;
    return (
        <View style={{
          height: height - 560,
          width: width - 100,
          borderRadius: 10,
          backgroundColor: Color.white}}>
          <View>
          {this.props.blockedFlag == false && successFlag == false && successMessage == null && (this._otp())}
          {this.props.blockedFlag == true && (this._blocked())}
          {successFlag == true && successMessage != null && (this._success())}
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'space-between',
            width: '100%',
            marginLeft: 5
          }}>
            <Button
              onClick={() => this.props.back()}
              title={'Cancel'}
              style={{
                borderColor: Color.danger,
                borderWidth: 1,
                width: '45%',
                height: 50,
                borderRadius: 25,
                backgroundColor: 'transparent'
              }}
              textStyle={{
                color: Color.danger,
                fontSize: BasicStyles.standardFontSize
              }}
            />
            <Button
              onClick={() => this.authorize()}
              title={'Verify'}
              style={{
                backgroundColor: theme ? theme.secondary : Color.secondary,
                width: '50%',
                borderRadius: 25
              }}
            />
          </View>
          {isLoading ? <Spinner mode="overlay"/> : null }
        </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Otp);
