import React, {Component} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import { Color } from 'common';

class OneTimePin extends Component {
  constructor(props) {
    super(props);
    this.setState = {
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
    }
    this.otpTextInput = []
  }

  completeOTPField = () => {
    const { otp } = this.state;
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
    }
    if(this.state.errorMessage == null){
      this.props.onComplete(finalOtp)
    }
  }

  inputHandler = (value, index) => {
    const { otp } = this.state;
    console.log('i', i)
    let newOtp = otp.map((item, index) => {
      if(i == index){
        item.code = code
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
  };

  render() {
    const { otp } = this.state;
    let inputs = []
    for (let i = 0; i < 6; i++) {
      inputs.push(
        <TextInput
          style={{
            borderColor: Color.gray,
            borderWidth: 1,
            width: '15%',
            marginBottom: 20,
            fontSize: 16,
            textAlign: 'center',
            borderRadius: 5,
            marginRight: 2,
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
      <View style={styles.OneTimePinContainer}>
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
        {inputs}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  OneTimePinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
  },
  OtpFieldContainer: {
    height: 55,
    width: 55,
    borderRadius: 5,
    borderWidth: 0.5,
    marginHorizontal: '2%',
    marginVertical: '1%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  OtpFieldTextStyle: {
    textAlign: 'center',
    fontSize: 20,
  },
});

export default OneTimePin;
