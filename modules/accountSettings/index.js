import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Routes, Color, Helper, BasicStyles } from 'common';
import styles from 'modules/accountSettings/Styles.js';
import PasswordWithIcon from 'components/InputField/Password.js';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
import Button from 'components/Form/Button';
import TextInputWithLabel from 'components/Form/TextInputWithLabel';
import QRCode from 'react-native-qrcode-svg';
import { ColorPropType } from 'react-native';
const height = Math.round(Dimensions.get('window').height);

class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
      error: false
    };
  }
  isValidEmail = () => {
    let { email } = this.state;
    if (email !== '' && email !== null) {
      return Helper.validateEmail(email);
    } else {
      return false;
    }
  }
  componentDidMount() {
    this.setState({
      email: this.props.state.user.email
    })
  }
  updateEmail = () => {
    if (this.isValidEmail()) {
      const { user } = this.props.state;
      let parameters = {
        id: user.id,
        email: this.state.email
      };
      this.setState({ isLoading: true });
      Api.request(
        Routes.accountUpdateEmail,
        parameters,
        (response) => {
          this.setState({ isLoading: false });
          alert('Email updated!');
          this.state.email = ''
        },
        (error) => {
          console.log('update email error', error);
          this.setState({ isLoading: false });
        },
      );
    } else {
      alert("Invalid Email")
    }
  }
  validPassword(value) {
    this.setState({password: value})
    if (/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(value) === false) {;
      this.setState({error: true})
    } else {
      this.setState({error: false})
    }
  }
  updatePassword = () => {
    if (
      this.state.password != null &&
      this.state.password != '' &&
      this.state.confirmPassword != null &&
      this.state.confirmPassword != '' &&
      this.state.password === this.state.confirmPassword &&
      this.state.error === false
    ) {
      const { user } = this.props.state;
      let parameters = {
        id: user.id,
        password: this.state.password,
      };
      this.setState({ isLoading: true });
      Api.request(
        Routes.accountUpdatePassword,
        parameters,
        (response) => {
          console.log('update password response', response);
          this.setState({ isLoading: false });
          alert('Password updated!');
          this.state.password = ''
          this.state.confirmPassword = ''
        },
        (error) => {
          console.log('update password error', error);
          this.setState({ isLoading: false });
        },
      );
    } else {
      alert("Invalid Password!");
    }
  };

  render() {
    let { user, theme } = this.props.state;

    return (
      <ScrollView style={{ flex: 1, paddingTop: 10 }}>
        <View style={[styles.AccountSettingsContainer, {height: height + 25}]}>
            <QRCode
              size={220}
              value={user.code}
            />
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}

          <TextInputWithLabel 
            variable={user.username}
            onChange={(value) => {}}
            label={'Username'}
            selectTextOnFocus={false}
            onError={false}
            editable={false}
            required={false}
          />

          <TextInputWithLabel 
            variable={this.state.email}
            onChange={(value) => {this.setState({email: value})}}
            label={'Email Address'}
            onError={false}
            placeholder={'Enter Email address'}
            required={true}
            editable={true}
          />

          <Button
            style={{
              backgroundColor: theme ? theme.secondary : Color.secondary,
              marginTop: 15,
              marginBottom: 15
            }}
            title={'Update Email'}
            onClick={() => this.updateEmail()}/>

          { this.state.error === true && (
            <Text style={{color: Color.danger}}>Password must be atleast 8 alphanumeric characters. It should contain 1 number, 1 special character and 1 capital letter.</Text>
          )}
          
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            paddingBottom: 10,
            marginRight: '83%'
          }}>
            Password
          </Text>
          <PasswordWithIcon
            onTyping={(input) =>
              this.validPassword(input)
            }
            style={{
              width: '100%'
            }}
            />

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            paddingBottom: 10,
            marginRight: '68%'
          }}>
            Confirm Password
          </Text>
          <PasswordWithIcon
            onTyping={(input) =>
              this.setState({
                confirmPassword: input,
              })
            }
            
            style={{
              paddingBottom: 20,
              width: '100%'
            }}
          />

          <Button 
            style={{
              backgroundColor: theme ? theme.secondary : Color.secondary
            }}
            title={'Change Password'}
            onClick={() => this.updatePassword()}/>

        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  state
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
