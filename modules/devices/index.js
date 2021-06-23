import React, { Component } from 'react';
import { Color, Routes } from 'common';
import { Text, View, StyleSheet, ScrollView, Switch, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
const height = Math.round(Dimensions.get('window').height);
class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      isLoading: false,
      id: null,
      enable: false,
      data: []
    };
  }

  componentDidMount() {
    let varc = this.props.navigation.addListener('didFocus', () => {
      this.retrieve();
    })
  }

  retrieve = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }]
    };
    this.setState({ isLoading: true })
    Api.request(Routes.deviceRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if(response.data.length > 0) {
        this.setState({ data: response.data })
        console.log('[]data', data)
      } else {
        this.setState({ data: [] })
      }
    })
  }

  // create = () => {
  //   let param = {
  //     account_id: this.props.state.user.id,
  //     email_login: 1,
  //     email_otp: 0,
  //     email_pin: 0,
  //     sms_login: 0,
  //     sms_otp: 0
  //   }
  //   Api.request(Routes.notificationSettingsCreate, param, response => {
  //     this.setState({ isLoading: false })
  //     if (response.data !== null) {
  //       this.setState({
  //         login: true,
  //         id: response.data
  //       })
  //     }
  //   })
  // }

  // update = (status) => {
  //   let login = this.state.login
  //   if (status === 'login') {
  //     this.setState({ login: !this.state.login })
  //     login = !this.state.login
  //   }

  //   let parameter = {
  //     account_id: this.props.state.user.id,
  //     id: this.state.id,
  //     email_login: login ? 1 : 0,
  //     email_otp: 0,
  //     email_pin: 0,
  //     sms_login: 0,
  //     sms_otp: 0
  //   }
  //   this.setState({ isLoading: true })
  //   Api.request(Routes.notificationSettingsUpdate, parameter, response => {
  //     this.setState({ isLoading: false })
  //     if (response.data.length === 0) {
  //     }
  //   })
  // }

  // changeState(status) {
  //   const { setEnableFingerPrint } = this.props;
  //   const { enable } = this.state
  //   if (status == 'fingerPrint') {
  //     this.setState({ enable: !enable })
  //     if (this.state.id !== null) {
  //       this.update(status)
  //     } else {
  //       this.create();
  //     }
  //     setEnableFingerPrint(enable);
  //   } else {
  //     if (this.state.id !== null) {
  //       this.update(status)
  //     } else {
  //       this.create();
  //     }
  //   }
  // }

  render() {
    const { theme } = this.props.state;
    const { isLoading, data } = this.state;
    if(data?.length > 0){
      console.log('[data]', data.length)
    }else{
      console.log('[dfa', data)
    }
    return (
      <View>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <Text style={{ padding: 10 }}>Switched on device as primary.</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}>
            <View style={{
              flex: 1,
              height: height + 25
            }}>
              {
              (data && data.length > 0) && data.map((item, index) => (
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.gray, padding: 20 }} key={index}>
                  <View style={{ flex: 1 }}>
                    <Text>{item.details}</Text>
                    <Text style={{ fontSize: 10 }}>Model: {item.model}</Text>
                    <Text style={{ fontSize: 10 }}>OS: {item.details.os}</Text>
                    <Text style={{ fontSize: 10 }}>Device ID: {item.details.deviceId}</Text>
                  </View>
                  <Switch
                    trackColor={{ false: Color.danger, true: theme ? theme.primary : Color.primary }}
                    thumbColor={'white'} onValueChange={() => this.changeState('login')} value={this.state.login}
                    ios_backgroundColor={Color.danger}
                  />
                </View>
                ))
              }
              </View>
        </ScrollView>
      </View>
    );
  }
}


const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setEnableFingerPrint(isEnable) {
      dispatch(actions.setEnableFingerPrint(isEnable));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);