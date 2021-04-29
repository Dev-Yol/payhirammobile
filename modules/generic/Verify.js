import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color, BasicStyles } from 'common';
import Skeleton from 'components/Loading/Skeleton';
import Button from 'components/Form/Button';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  checkStatus(){
    const { user } = this.props.state;
    if(user == null){
      return false
    }
    switch(user.status.toLowerCase()){
      case 'not_verified': return false;break
      case 'verified': return false;break
      default: return true;break
    }
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
          (this.checkStatus() ==  false && user) && (
            <View
              style={{
                width: '100%',
                marginTop: 35,
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
                    paddingBottom: 10
                  }}>
                    Hi {user.username}! Your account is not verified. You can verify by clicking the button below.
                  </Text>
                  <View style={{
                    width: '100%',
                  }}>
                    <Button
                      title={'Verify'}
                      onClick={() => {
                        this.props.navigation.navigate('editProfileStack')
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);

