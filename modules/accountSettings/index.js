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
const height = Math.round(Dimensions.get('window').height);

class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
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
        id: user.account_information.account_id,
        email: this.state.email
      };
      this.setState({ isLoading: true });
      Api.request(
        Routes.accountUpdateEmail,
        parameters,
        (response) => {
          this.setState({ isLoading: false });
          alert('Email updated!');
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
  updatePassword = () => {
    if (
      this.state.password != null &&
      this.state.password != '' &&
      this.state.confirmPassword != null &&
      this.state.confirmPassword != '' &&
      this.state.password === this.state.confirmPassword
    ) {
      const { user } = this.props.state;
      let parameters = {
        id: user.account_information.account_id,
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
        },
        (error) => {
          console.log('update password error', error);
          this.setState({ isLoading: false });
        },
      );
    } else {
      alert("Passwords don't match!");
    }
  };


  render() {
    let { user, theme } = this.props.state;

    return (
      <ScrollView style={{ flex: 1, paddingTop: 10 }}>
        <View style={[styles.AccountSettingsContainer, {height: height + 25}]}>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}

         <TextInputWithLabel 
            variable={user.username}
            onChange={(value) => {}}
            label={'Username'}
            onError={false}
            required={false}
          />


          <TextInputWithLabel 
            variable={this.state.email}
            onChange={(value) => {this.setState({email: value})}}
            label={'Email Address'}
            onError={false}
            placeholder={'Enter Email address'}
            required={true}
          />

          <Button 
            style={{
              backgroundColor: theme ? theme.secondary : Color.secondary,
              marginTop: 15,
              marginBottom: 15
            }}
            title={'Update Email'}
            onClick={() => this.updateEmail}/>



          <PasswordWithIcon
            onTyping={(input) =>
              this.setState({
                password: input,
              })
            }
          />


          <PasswordWithIcon
            onTyping={(input) =>
              this.setState({
                confirmPassword: input,
              })
            }
          />

          <Button 
            style={{
              backgroundColor: theme ? theme.secondary : Color.secondary
            }}
            title={'Change Password'}
            onClick={() => this.updatePassword}/>

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
