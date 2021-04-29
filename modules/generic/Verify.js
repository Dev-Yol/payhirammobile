import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color, BasicStyles } from 'common';
import Skeleton from 'components/Loading/Skeleton';
import Button from 'components/Form/Button';

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
      }}>
        {
          (this.checkStatus() ==  false && user) && (
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: 25,
                borderRadius: 12,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 25,
                paddingBottom: 25,
                backgroundColor: Color.danger
              }}>
              <View style={{
                width: '60%'
              }}>
                <Text style={{
                  fontSize: BasicStyles.standardFontSize,
                  textAlign: 'justify',
                  color: Color.white
                }}>
                  Hi {user.username}! Your account is not verified. You can verify by clicking the button below.
                </Text>
              </View>

              <Button
                title={'Verify'}
                onClick={() => {
                  // redirect here
                }}
                style={{
                  width: '30%',
                  marginLeft: '10%',
                  backgroundColor: Color.white
                }}
                textStyle={{
                  fontSize: BasicStyles.standardFontSize,
                  color: Color.black
                }}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);

