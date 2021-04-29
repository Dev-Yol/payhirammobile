import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color } from 'common';
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
      <View>
        {
          (this.checkStatus() ==  false && user) && (
            <View
              style={{
                width: '90%',
                borderRadius: 10,
                justifyContent: 'flex-start',
                backgroundColor: Color.secondary,
                marginLeft: '5%',
                marginRight: '5%',
                marginTop: 25
              }}>
              
              <Text style={{
                textAlign: 'center',
                fontSize: 30,
                color: '#FFFFFF',
                fontWeight: 'bold',
                paddingTop: 10,
                paddingBottom: 20
              }}>
                Hi {user.username}! You can verify your account by clicking the button below.
              </Text>

              <Button
                title={'Verify now!'}
                onClick={() => {
                  // redirect here
                }}
                style={{
                  width: '50%',
                  backgroundColor: Color.white
                }}
                textStyle={{
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

