import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color, BasicStyles, Helper } from 'common';
import Skeleton from 'components/Loading/Skeleton';
import Button from 'components/Form/Button';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Verify from 'modules/generic/Verify'
import ApplyForVerification from 'modules/generic/ApplyForVerification'

class MessageAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  render() {
    const { data } = this.props;
    const { theme, user } = this.props.state;
    return (
      <View style={{
        marginTop: this.props.from == 'request' && Helper.checkStatus(user) <  Helper.accountVerified ? 0 : 0
      }}>
        {
          (user && Helper.checkStatus(user) == Helper.notVerified) && 
          (<Verify {...this.props}/>)
        }
        {
          (user && Helper.checkStatus(user) == Helper.emailVerified) && 
          (<ApplyForVerification/>)
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageAlert);

