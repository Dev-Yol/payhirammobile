import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { Routes, Color, Helper, BasicStyles } from 'common';
import AccountSettingsInput from 'modules/accountSettings/AccountSettingsInput.js';
import AccountSettingsButton from 'modules/accountSettings/AccountSettingsButton.js';
import styles from 'modules/accountSettings/Styles.js';
import PasswordWithIcon from 'components/InputField/Password.js';
import Api from 'services/api/index.js';
import { Spinner } from 'components';

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
    let { user } = this.props.state;
    const Label = ({ label }) => {
      return (
        <View
          style={{
            textAlign: 'left',
            alignSelf: 'flex-start',
          }}>
          <Text style={{ marginBottom: 5 }}>{label}</Text>
        </View>
      );
    };

    return (
      <ScrollView style={{ flex: 1, paddingTop: 10 }}>
        <View style={[styles.AccountSettingsContainer]}>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <Label label={'Username'} />
          <TextInput
            style={BasicStyles.formControl}
            editable={false}
            value={user.username}
          />
          <Label label={'Email'} />
          <TextInput
            style={BasicStyles.formControl}
            value={this.state.email}
            placeholder={'Enter Email address'}
            onChangeText={(e) => {
              this.setState({ email: e })
            }}
          />
          <TouchableHighlight
            style={[BasicStyles.btn, BasicStyles.btnSecondary]}
            onPress={this.updateEmail}
            underlayColor={Color.gray}>
            <Text style={BasicStyles.textWhite}>Update Email</Text>
          </TouchableHighlight>
          <Label label={'Password'} />
          <PasswordWithIcon
            onTyping={(input) =>
              this.setState({
                password: input,
              })
            }
          />
          <Label label={'Confirm Password'} />
          <PasswordWithIcon
            onTyping={(input) =>
              this.setState({
                confirmPassword: input,
              })
            }
          />
          <TouchableHighlight
            style={[BasicStyles.btn, BasicStyles.btnSecondary]}
            onPress={() => {
              this.updatePassword();
            }}
            underlayColor={Color.gray}>
            <Text style={BasicStyles.textWhite}>Change Password</Text>
          </TouchableHighlight>
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
