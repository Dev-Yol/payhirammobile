import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color, BasicStyles, Helper } from 'common';
import Skeleton from 'components/Loading/Skeleton';
import Button from 'components/Form/Button';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

class ApplyForVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  

  render() {
    const { data } = this.props;
    const { theme, user, imageCount, scheduleShow } = this.props.state;
    return (
      <View style={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: this.props.paddingTop ? this.props.paddingTop : 0,
        width: '100%'
      }}>
        {
          (Helper.checkStatus() ==  false && user) && (
            <View
              style={{
                width: '100%',
                marginTop: 20,
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
                    color: Color.white
                  }}>
                    {
                      (imageCount >= 2 && scheduleShow == true) ?
                      <Text>Hi {user.username}! Your account is not verified. We require our customers to be fully verified, via zoom or google meet, before they can proceed to transact. Please choose a schedule by clicking the button below:</Text>
                      :
                      <Text>Hi {user.username}! Your account is not verified. We require our customers to be fully verified, via zoom or google meet, before they can proceed to transact. Please provide all of your personal information to set schedule.</Text>
                    }
                  </Text>
                  <View style={{
                    width: '100%',
                  }}>
                    {
                      (imageCount >= 2 && scheduleShow == true)  &&
                      (
                      <Button
                        title={'Schedule'}
                        onClick={() => {
                          Linking.openURL('https://calendly.com/payhiramph/videocallverification')
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
                      />)
                      // :
                      // <Text style={{fontSize: BasicStyles.standardFontSize, color: Color.black, backgroundColor: Color.white, borderRadius: 25, padding: 5, textAlign: 'center'}}>"Please provide all of your personal information to set schedule."</Text>
                    }
                  </View>
                </View>
                <View style={{
                  width: '40%',
                  alignItems: 'flex-end'
                }}>
                  <FontAwesomeIcon icon={faUserShield} style={{
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
    setImageCount: (imageCount) => dispatch(actions.setImageCount(imageCount))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplyForVerification);

