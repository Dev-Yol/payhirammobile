import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color, BasicStyles, Helper, Routes } from 'common';
import Button from 'components/Form/Button';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Api from 'services/api/index.js';

class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  sendEmail(){
    const { user } = this.props.state;
    if(user == null){
      return
    }
    let parameter = {
      condition: [{
        value: user.code,
        column: 'code',
        clause: '='
      }]
    }
    this.setState({isLoading: true})
    Api.request(Routes.accountSendEmailVerification, parameter, response => {
      this.setState({isLoading: false})
      console.log('response', response)
      if(response.data.length > 0){
        Alert.alert(
          'Message',
          'Verification email sent to ' + user.email + '.',
          [
            {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
          ],
          { cancelable: false }
        )
      }else{
        Alert.alert(
          'Message',
          'Invalid accessed',
          [
            {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
          ],
          { cancelable: false }
        )
      }
    }, error => {
      this.setState({
        isLoading: false,
      })
    }) 
  }

  render() {
    const { data } = this.props;
    const { theme, user } = this.props.state;
    return (
      <View style={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: this.props.paddingTop ? this.props.paddingTop : 0,
        width: '100%'
      }}>
        {
          (user) && (
            <View
              style={{
                width: '100%',
                marginTop: 10,
                borderRadius: 12,
                paddingLeft: 10,
                paddingRight: 10,
                padding: 15,
                backgroundColor: Color.danger
              }}>
              <View style={{
                width: '100%',
                flexDirection: 'row',
              }}>
                <View style={{
                  width: '60%'
                }}>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    textAlign: 'justify',
                    color: Color.white,
                    paddingBottom: 10,
                    width: '100%'
                  }}>
                    Hi {user.username}! Your email address is not verified. You can verify by clicking the button below.
                  </Text>
                  <View style={{
                    width: '100%',
                  }}>
                    <Button
                      title={'Verify'}
                      onClick={() => {
                        this.sendEmail()
                      }}
                      style={{
                        width: '50%',
                        backgroundColor: Color.white,
                        height: 40
                      }}
                      textStyle={{
                        fontSize: BasicStyles.standardFontSize,
                        color: Color.black
                      }}
                    />
                  </View>
                </View>
                <View style={{
                  width: '40%',
                  alignItems: 'flex-end'
                }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{
                    color: Color.white
                  }}
                  size={100}
                  />
                </View>
              </View>
              
              
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);

