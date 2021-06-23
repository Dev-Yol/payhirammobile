import React, {Component} from 'react';
import styles from 'components/Modal/Style.js';
import {Text, View, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { Spinner } from 'components';
import Currency from 'services/Currency.js';
import Api from 'services/api/index.js';
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
    const {user} = props.state;
    if(user == null){
      return
    }
    let parameters = {
      account_id: user.id,
    };
    this.setState({isLoading: true})
    Api.request(
      Routes.notificationSettingOtp,
      parameters,
      (data) => {
        this.setState({isLoading: false})
      },
      (error) => {
        this.setState({isLoading: false})
      },
    );
  }

  submit = () => {
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
    Api.request(Routes.notificationSettingsRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length > 0){
        this.setState({errorMessage: null, successFlag: true})
        this.setState({successMessage: 'Sucessfully Verified'});
      }else{
        // blocked account
        this.setState({successMessage: null, successFlag: false})
        this.setState({errorMessage: 'Sorry, you are not authorize to proceed the transaction. Please get back after 30 minutes. Or you can email at ' + Helper.APP_EMAIL + ' as well if you want to resolve the account ASAP.'})
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
          onClicK={() => {this.generateOTP()}}>Click to resend.</Text>
        </View>
      </View>
    );
  }
  render(){
    const { isLoading, successFlag, successMessage } = this.state;
    return (
        <View style={{height: height - 650,
            width: width - 100,
            borderRadius: 10,
            backgroundColor: Color.white}}>
            <View>
            {this.props.blockedFlag == false && successFlag == false && successMessage == null && (this._otp())}
            {this.props.blockedFlag == true && (this._blocked())}
            {successFlag == true && successMessage != null && (this._success())}
            </View>
            {/* {
            this.props.blockedFlag == false && (
                this.footerActions()
            )
            } */}
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
