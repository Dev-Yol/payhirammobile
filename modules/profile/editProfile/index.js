import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Api from 'services/api/index.js';
import {
  faCheckCircle,
  faUserCircle,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import {BasicStyles, Color, Routes} from 'common';
import {Rating, DateTime} from 'components';
import { connect } from 'react-redux';
import UserImage from 'components/User/Image';
import Button from 'components/Form/Button';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: 1,
      school: 1,
      email: '',
      phone_number: '',
      sex: 0,
      address: '',
      birth_date: ''
    };
  }
  onChange(item, type) {
    if (type == 'gender') {
      this.setState({gender: item});
    } else {
      this.setState({school: item});
    }
  }

  update = () => {
    console.log('IMmmmmmmmmmmmmmmmmmmmmmmmmmm herrrrrrrrrrrrrrrrrrrrrrrrrrre')
    const { user } = this.props.state;
    let parameters = {
      id: user.account_information.account_id,
      phone_number: user.account_information.phone_number,
      sex: user.account_information.phone_number,
      address: user.account_information.address,
      birth_date: user.account_information.birth_date,
      email: user.email
    };
    this.setState({ isLoading: true });
    Api.request(
      Routes.accountProfileUpdate,
      parameters, (response) => {
        console.log('Successfully updated=====================', parameters)
        this.setState({ isLoading: false });
        alert('Updated Successfully');
      },
      (error) => {
        console.log('Failed to Update', error);
        this.setState({ isLoading: false });
      }
    )
  }

  render() {
    const { user, theme } = this.props.state;
    let fullName = user.account_information.first_name + user.account_information.middle_name + user.account_information.last_name
    console.log('=============================', fullName)
    const {data} = [
      {
        title: 'Male',
        value: 'male',
      },
      {
        title: 'Female',
        value: 'female',
      },
    ];
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 10,
              width: '100%',
              backgroundColor: theme ? theme.primary : Color.primary,
            }}>

            {
              user && (
                <UserImage
                  user={user}
                  style={{
                    height: 100,
                    width: 100
                  }}
                  size={100}
                  color={Color.white}
                  />
              )
            }

            {
              user.username && (
                <Text style={[{fontWeight: 'bold', color: Color.white}]}>
                  {user.username}
                </Text>
              )
            }
            
            <Rating ratings={''} style={[{flex: 2}]}></Rating>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{color: 'blue'}}
                size={15}
              />
              <Text style={{color: Color.white}}>Verified</Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                borderBottomWidth: 1,
                padding: 15,
                marginBottom: 10,
                fontWeight: 'bold',
                borderColor: Color.gray,
              }}>
              Basic Settings
            </Text>
            
            <Text style={{marginLeft: 20}}>Full Name</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={fullName != 0 ? fullName : 'Enter your Full Name'}
              // value={fullName}
              variable={this.state.fullname}
              onChange={(value) => {this.setState({fullName: value})}}
              required={true}
            />
            <Text style={{marginLeft: 20}}>Phone Number</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter Phone Number'}
              value={user.account_information.phone_number}
              variable={this.state.phone_number}
              onChange={(value) => {this.setState({phone_number: value})}}
              required={true}
            />
            <Text style={{marginLeft: 20}}>Email</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter Email'}
              value={user.email}
              variable={this.state.email}
              onChange={(value) => {this.setState({email: value})}}
              required={true}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{width: '40%', marginRight: 20}}>
                <Text>Birthdate</Text>
                <DateTime type={'date'} style={{marginTop: 0}} 
                value={user.account_information.birth_date}
                variable={this.state.birth_date}
                onChange={(value) => {this.setState({birth_date: value})}}
                required={true}/>
              </View>
              <View style={{width: '40%', marginLeft: 20}}>
                <Text>Gender</Text>
                <View
                  style={{
                    borderColor: Color.gray,
                    borderWidth: 1,
                    paddingLeft: 10,
                    marginBottom: 20,
                    borderRadius: 5,
                  }}>
                  <Picker
                    selectedValue={this.state.gender}
                    onValueChange={(input) => this.onChange(input, 'gender')}
                    style={BasicStyles.pickerStyleCreate}
                    value={user.account_information.sex}
                    variable={this.state.sex}
                    onChange={(value) => {this.setState({sex: value})}}
                    required={true}>
                    <Picker.Item key={1} label={'Male'} value={1} />
                    <Picker.Item key={2} label={'Female'} value={2} />
                  </Picker>
                </View>
              </View>
            </View>
            <Text style={{marginLeft: 20}}>Address</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter Address'}
              value={user.account_information.address}
              variable={this.state.address}
              onChange={(value) => {this.setState({address: value})}}
              required={true}
            />
          </View>
          {/* <View>
            <Text
              style={{
                borderBottomWidth: 1,
                padding: 15,
                marginBottom: 10,
                fontWeight: 'bold',
                borderColor: Color.gray,
              }}>
              Educational Background Settings
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{width: '40%', marginRight: 20}}>
                <View
                  style={{
                    borderColor: Color.gray,
                    borderWidth: 1,
                    paddingLeft: 10,
                    marginBottom: 20,
                    borderRadius: 5,
                  }}>
                  <Picker
                    selectedValue={this.state.school}
                    onValueChange={(input) => this.onChange(input, 'school')}
                    style={BasicStyles.pickerStyleCreate}>
                    <Picker.Item key={1} label={'Primary'} value={1} />
                    <Picker.Item key={2} label={'Secondary'} value={2} />
                    <Picker.Item key={2} label={'Tertiary'} value={2} />
                  </Picker>
                </View>
              </View>
              <View style={{width: '40%', marginLeft: 20}} />
            </View>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'School Name'}
            />
            <Text style={{marginLeft: 20}}>Address</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter Address'}
            />
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={{marginLeft: 20, flexGrow: 1}}>Graduated</Text>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{color: 'green', marginRight: 20}}
                size={15}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingTop: 10,
              }}>
              <View style={{width: '40%', marginRight: 20}}>
                <Text>From</Text>
                <DateTime type={'date'} style={{marginTop: 0}} />
              </View>
              <View style={{width: '40%', marginLeft: 20}}>
                <Text>To</Text>
                <DateTime type={'date'} style={{marginTop: 0}} />
              </View>
            </View>
          </View> */}
          <View>
            <Text
              style={{
                borderBottomWidth: 1,
                padding: 15,
                marginBottom: 10,
                fontWeight: 'bold',
                borderColor: Color.gray,
              }}>
              ID's
            </Text>
            <TouchableOpacity
              style={[
                BasicStyles.formControl,
                {
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <View style={{flexDirection: 'row'}}>
                <Text>Upload Photo</Text>
                <FontAwesomeIcon
                  icon={faUpload}
                  style={{marginLeft: 20}}
                  size={15}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Button
              title={'Update'}
              onClick={() => this.update()}
              style={{
                width: '90%',
                marginRight: '5%',
                marginLeft: '5%',
                backgroundColor: theme ? theme.secondary : Color.secondary
              }}
            />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);

