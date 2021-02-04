import React, {Component} from 'react';
import { Color, Routes } from 'common';
import {Text, View, StyleSheet, ScrollView, Switch, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
const height = Math.round(Dimensions.get('window').height);
class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      pin: false,
      isLoading: false,
      id: null
    };
  }

  componentDidMount() {
    let parameter = {
      condition: [{
        value: this.props.state.user.account_information.account_id,
        column: 'account_id',
        clause: '='
      }]
    };
    let param = {
      account_id: this.props.state.user.account_information.account_id,
      email_login: 0,
      email_otp: 0,
      email_pin: 0,
      sms_login: 0,
      sms_otp: 0
    }
    this.setState({isLoading: true})
    Api.request(Routes.notificationSettingsRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length === 0) {
        console.log("wala pa");
        this.setState({isLoading: true})
        Api.request(Routes.notificationSettingsCreate, param, response => {
          this.setState({isLoading: false})
        })
      } else {
        console.log("naa na", response);
        this.setState({isLoading: false})
        this.setState({
          login: response.data[0].email_login == 0 ? false : true,
          pin: response.data[0].email_pin == 0 ? false : true,
          id: response.data[0].id
        })
      }
    })
  }

  update = (status) => {
    let login = this.state.login
    let pin = this.state.pin
    if(status === 'login') {
      this.setState({login: !this.state.login})
      login = !this.state.login
    } else {
      this.setState({pin: !this.state.pin})
      pin = !this.state.pin
    }

    let parameter = {
      id: this.state.id,
      email_login: login ? 1 : 0,
      email_pin: pin ? 1 : 0,
      account_id: this.props.state.user.account_information.account_id,
      email_otp: 0,
      sms_login: 0,
      sms_otp: 0
    }
    this.setState({isLoading: true})
    Api.request(Routes.notificationSettingsUpdate, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length === 0) {
        this.setState({isLoading: true})
      }
    })
  }

  changeState(status){
    this.update(status)
  }

  render() {
    const { theme } = this.props.state;
    const { isLoading } = this.state;
    return (
      <View>
        {isLoading ? <Spinner mode="overlay"/> : null }
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={{
            flex: 1,
            height: height + 25
          }}>
            <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.gray, padding: 20}}>
              <View style={{flex: 1}}>
                <Text>Login</Text>
                <Text style={{fontSize: 10}}>Send me an email everytime there's a login with my account.</Text>
              </View>
              <Switch trackColor={{ false: Color.danger, true: theme ? theme.primary : Color.primary }} thumbColor={'white'} onValueChange={() => this.changeState('login')} value={this.state.login}/>
            </View>
            <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.gray, padding: 20}}>
              <View style={{flex: 1}}>
                <Text>Account PIN</Text>
                <Text style={{fontSize: 10}}>Receive new PIN from email everytime there's a login with my account.</Text>
              </View>
              <Switch trackColor={{ false: Color.danger, true: theme ? theme.primary : Color.primary }} thumbColor={'white'} onValueChange={() => this.changeState('pin')} value={this.state.pin}/>
            </View>
          </View>
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettings);