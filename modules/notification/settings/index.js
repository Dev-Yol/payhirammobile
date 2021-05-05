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
      isLoading: false,
      id: null,
      enable: false
    };
  }

  async componentDidMount() {
    // this.setState({enable: await AsyncStorage.getItem(`${Helper.APP_NAME}fingerprint`)})
    this.retrieve();
  }

  retrieve = () => {
    let parameter = {
      condition: [{
        value: this.props.state.user.id,
        column: 'account_id',
        clause: '='
      }]
    };
    this.setState({isLoading: true})
    Api.request(Routes.notificationSettingsRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length > 0) {
        this.setState({
          login: response.data[0].email_login == 0 ? false : true,
          id: response.data[0].id
        })
      }
    })
  }

  create = () => {
    let param = {
      account_id: this.props.state.user.id,
      email_login: 1,
      email_otp: 0,
      email_pin: 0,
      sms_login: 0,
      sms_otp: 0
    }
    Api.request(Routes.notificationSettingsCreate, param, response => {
      this.setState({isLoading: false})
      if(response.data !== null) {
        this.setState({
          login: true,
          id: response.data
        })
      }
    })
  }

  update = (status) => {
    let login = this.state.login
    if(status === 'login') {
      this.setState({login: !this.state.login})
      login = !this.state.login
    }

    let parameter = {
      account_id: this.props.state.user.id,
      id: this.state.id,
      email_login: login ? 1 : 0,
      email_otp: 0,
      email_pin: 0,
      sms_login: 0,
      sms_otp: 0
    }
    this.setState({isLoading: true})
    Api.request(Routes.notificationSettingsUpdate, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length === 0) {
      }
    })
  }

  async changeState(status){
    const { setEnableFingerPrint } = this.props;
    const {enable} = this.state
    if(status == 'fingerPrint'){
      await this.setState({enable : !enable})
      if(this.state.id !== null) {
        this.update(status)
      } else {
        this.create();
      }
      setEnableFingerPrint(enable);
    }else{
      if(this.state.id !== null) {
        this.update(status)
      } else {
        this.create();
      }
    }
  }

  render() {
    const { theme } = this.props.state;
    const { isLoading } = this.state;
    return (
      <View>
        {isLoading ? <Spinner mode="overlay"/> : null }
        <ScrollView 
          showsVerticalScrollIndicator={false}>
          <View style={{
            flex: 1,
            height: height + 25
          }}>
            <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.gray, padding: 20}}>
              <View style={{flex: 1}}>
                <Text>Login</Text>
                <Text style={{fontSize: 10}}>Send me an email everytime there's a login with my account.</Text>
              </View>
              <Switch
                trackColor={{ false: Color.danger, true: theme ? theme.primary : Color.primary }}
                thumbColor={'white'} onValueChange={() => this.changeState('login')} value={this.state.login}
                ios_backgroundColor={Color.danger}
                />
            </View>
            {/* <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.gray, padding: 20}}>
              <View style={{flex: 1}}>
                <Text>Fingerprint</Text>
                <Text style={{fontSize: 10}}>Use for a convenient way to accept and process transactions.</Text>
              </View>
              <Switch
                trackColor={{ false: Color.danger, true: theme ? theme.primary : Color.primary }}
                thumbColor={'white'} onValueChange={() => this.changeState('fingerPrint')}
                value={this.state.enable}
                ios_backgroundColor={Color.danger}
                />
            </View> */}
            {/* <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.gray, padding: 20}}>
              <View style={{flex: 1}}>
                <Text>Account PIN</Text>
                <Text style={{fontSize: 10}}>Receive new PIN from email everytime there's a login with my account.</Text>
              </View>
              <Switch
                trackColor={{ false: Color.danger, true: theme ? theme.primary : Color.primary }}
                thumbColor={'white'} onValueChange={() => this.changeState('pin')}
                value={this.state.pin}
                ios_backgroundColor={Color.danger}
                />
            </View> */}
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
    setEnableFingerPrint(isEnable){
      dispatch(actions.setEnableFingerPrint(isEnable));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettings);