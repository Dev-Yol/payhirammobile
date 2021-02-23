import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Api from 'services/api/index.js';
import {
  faCheckCircle,
  faUserCircle,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import {BasicStyles, Color, Routes} from 'common';
import {Rating, DateTime} from 'components';
import { connect } from 'react-redux';
import UserImage from 'components/User/Image';
import Button from 'components/Form/Button';
import { Item } from 'native-base';
const gender = [{
  title: 'Male',
  value: 'male'
}, {
  title: 'Female',
  value: 'female'
}]
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      cellular_number: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      sex: null,
      id: null,
      address: null,
      birthDate: null
    };
  }
  
  componentDidMount = () => {
    const { user } = this.props.state
    this.retrieve()
    if((this.state.email != null || this.state.cellular_number != null || this.state.first_name != null || this.state.middle_name != null || this.state.last_name != null ||
      this.state.sex != null || this.state.address != null || this.state.birthDate != null) && user.status != 'granted'){
        Alert.alert(
          'Verification Link',
          'Click the button below for an appointment.',
          [
            {text: 'Ok', onPress: () => console.log('Generate Link')},
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            }
          ],
          { cancelable: false }
        )
      }
  }

  retrieve = () => {
    const { user } = this.props.state;
    if(user === null){
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'account_id'
      }]
    }
    this.setState({
      isLoading: true, 
      showDatePicker: false
    })
    Api.request(Routes.accountInformationRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length > 0){
        let data = response.data[0]
        this.setState({
          id: data.id,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          sex: data.sex,
          cellular_number: data.cellular_number,
          address: data.address,
          birthDate: data.birth_date
        })
        if(data.birth_date != null){
          this.setState({
            dateFlag: true,
            birthDateLabel: data.birth_date
          })
        }
      }else{
        this.setState({
          id: null,
          first_name: null,
          middle_name: null,
          last_name: null,
          sex: null,
          cellular_number: null,
          address: null,
          birthDate: new Date(),
        })
      }
    });
  }

  update = () => {
    const { user } = this.props.state;
    if(user == null){
      return
    }else if(this.state.first_name == null || this.state.middle_name == null || this.state.last_name == null || this.state.cellular_number == null || this.state.sex == null || this.state.address == null || this.state.birthDate == null){
      Alert.alert(
        'Error Message',
        'Please fill in all the fields.',
        [
          {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }else if(this.state.cellular_number.length != 11 || (this.state.cellular_number.substr(0, 2) != '09')){
      Alert.alert(
        'Error Message',
        'Please input a valid phone number.',
        [
          {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }
    let parameters = {
      id: this.state.id,
      account_id: user.id,
      first_name: this.state.first_name,
      middle_name: this.state.middle_name,
      last_name: this.state.last_name,
      cellular_number: this.state.cellular_number,
      sex: this.state.sex,
      address: this.state.address,
      birth_date: this.state.birthDate,
      email: this.state.email
    };
    this.setState({ isLoading: true });
    Api.request(
      Routes.accountInformationUpdate,
      parameters, (response) => {
        this.setState({ isLoading: false });
        this.retrieve()
        alert('Updated Successfully');
      },
      (error) => {
        this.setState({ isLoading: false });
      }
    )
  }

  render() {
    const { user, theme } = this.props.state;
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

            {
              user.status == 'verified' && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size={15}
                  style={{
                    color: 'aqua',
                    marginTop: -17,
                    marginLeft: 65
                  }}
                />
              )
            }
            <Rating ratings={''} style={[{flex: 2}]}></Rating>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{color: 'blue', marginLeft: 5}}
                size={15}
              />
              <Text style={{color: Color.white}}>{user.status}</Text>
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
            
            <Text style={{marginLeft: 20}}>First Name</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter your First Name'}
              onChangeText={(first_name) => this.setState({first_name})}
              value={this.state.first_name}
              required={true}
            />
            <Text style={{marginLeft: 20}}>Middle Name</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter your Middle Name'}
              onChangeText={(middle_name) => this.setState({middle_name})}
              value={this.state.middle_name}
              required={true}
            />
            <Text style={{marginLeft: 20}}>Last Name</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter your Last Name'}
              onChangeText={(last_name) => this.setState({last_name})}
              value={this.state.last_name}
              required={true}
            />
            <Text style={{marginLeft: 20}}>Phone Number</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter Phone Number'}
              onChangeText={(cellular_number) => this.setState({cellular_number: cellular_number.toString()})}
              value={this.state.cellular_number}
              keyboardType={'numeric'}
              maxLength = {11}
              required={true}
            />
            {/* <Text style={{marginLeft: 20}}>Email</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter Email'}
              value={user.email}
              variable={this.state.email}
              onChange={(value) => {this.setState({email: value})}}
              required={true}
            /> */}
            {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}> */}
              <View style={{width: '90%', marginLeft: '5%'}}>
                <Text>Birthdate</Text>
                <DateTime
                  type={'date'}
                  placeholder={'Select Date'}
                  onFinish={(date) => {
                    this.setState({
                      birthDate: date.date
                    })
                  }}
                  style={{
                    marginTop: 1
                  }}
                />
              </View>
              <View style={{width: '90%', marginLeft: '5%'}}>
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
                    selectedValue={this.state.sex}
                    onValueChange={(sex) => this.setState({sex})}
                    style={BasicStyles.pickerStyleCreate}
                    required={true}>
                    {
                      gender.map((item, index) => { 
                        return (
                          <Picker.Item 
                          key={index} 
                          label={item.title} 
                          value={item.value} />
                        )
                      })
                    }
                  </Picker>
                </View>
              </View>
            {/* </View> */}
            <Text style={{marginLeft: 20}}>Address</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              onChangeText={(address) => this.setState({address})}
              value={this.state.address}
              placeholder={'Enter address'}
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
              ]}
              onPress={() => this.upload()}>
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

