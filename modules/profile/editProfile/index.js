import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Picker,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCheckCircle,
  faUserCircle,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import {BasicStyles, Color} from 'common';
import {Rating, DateTime} from 'components';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: 1,
      school: 1,
    };
  }
  onChange(item, type) {
    if (type == 'gender') {
      this.setState({gender: item});
    } else {
      this.setState({school: item});
    }
  }

  render() {
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
              backgroundColor: Color.primary,
            }}>
            <FontAwesomeIcon
              icon={faUserCircle}
              style={{color: Color.white, margin: 15}}
              size={90}
            />
            <Text style={[{fontWeight: 'bold', color: Color.white}]}>
              Kennette Canales
            </Text>
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
              placeholder={'Enter Full Name'}
            />
            <Text style={{marginLeft: 20}}>Phone Number</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter Phone Number'}
            />
            <Text style={{marginLeft: 20}}>Email</Text>
            <TextInput
              style={[BasicStyles.formControl, {alignSelf: 'center'}]}
              placeholder={'Enter Email'}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{width: '40%', marginRight: 20}}>
                <Text>Birthdate</Text>
                <DateTime type={'date'} style={{marginTop: 0}} />
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
                    style={BasicStyles.pickerStyleCreate}>
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
            />
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
          <TouchableHighlight
            style={[
              BasicStyles.btn,
              BasicStyles.btnSecondary,
              {alignSelf: 'center'},
            ]}
            underlayColor={Color.gray}>
            <Text style={BasicStyles.textWhite}>Update</Text>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }
}

export default EditProfile;
