import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
  TouchableHighlight,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Api from 'services/api/index.js';
import {
  faCheckCircle,
  faUserCircle,
  faUpload,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes } from 'common';
import { Rating, DateTime } from 'components';
import { connect } from 'react-redux';
import UserImage from 'components/User/Image';
import Button from 'components/Form/Button';
import ImagePicker from 'react-native-image-picker';
import { Spinner } from 'components';
import Skeleton from 'components/Loading/Skeleton';
import ImageModal from 'components/Modal/ImageModal';
import ImageResizer from 'react-native-image-resizer';
import Config from 'src/config.js';

const gender = [{
  title: 'Male',
  value: 'male'
},
{
  title: 'Female',
  value: 'female'
}];
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      // cellular_number: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      sex: null,
      id: null,
      // address: null,
      // birthDate: null,
      profile: null,
      url: null,
      photo: null,
      dataRetrieve: null,
      isLoading: false,
      uploadedID: [],
      imageModal: false,
      urlID: null,
      reachMax: false,
      radioSelected: 'male',
      rating: null,
      verifyButton: false
    };
  }

  componentDidMount = () => {
    const { user } = this.props.state
    this.retrieve()
    this.retrieveUploadedId()
    this.verifyApplication()
    // if ((this.state.email != null || this.state.first_name != null || this.state.middle_name != null || this.state.last_name != null ||
    //   this.state.sex != null || this.state.uploadedID.length > 2) && (user.status != 'GRANTED' || user.status != 'VERIFIED') ) {
    //   // this.state.sex != null || this.state.address != null || this.state.birthDate != null) && user.status != 'granted'){
    //   Alert.alert(
    //     'Verification Link',
    //     'Click the button below for an appointment.',
    //     [
    //       { text: 'Ok', onPress: () => console.log('Generate Link') },
    //       {
    //         text: 'Cancel',
    //         onPress: () => console.log('Cancel Pressed'),
    //         style: 'cancel',
    //       }
    //     ],
    //     { cancelable: false }
    //   )
    // }
  }

  retrieve = () => {
    const { user } = this.props.state;
    if (user === null) {
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
    Api.request(Routes.accountProfileRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        const { data } = response
        this.setState({ dataRetrieve: response.data[0] })
        this.setState({
          id: data[0].account_id,
          first_name: data[0].first_name,
          middle_name: data[0].middle_name,
          last_name: data[0].last_name,
          sex: data[0].sex,
          rating: data[0].rating,
          // cellular_number:  data[0].cellular_number,
          // address: data[0].address,
          profile: data[0]
        })
        this.verifyApplication()
        // if(data.birth_date != null){
        //   this.setState({
        //     dateFlag: true,
        //     birthDateLabel: data.birth_date
        //   })
        // }
      } else {
        this.setState({
          id: null,
          first_name: null,
          middle_name: null,
          last_name: null,
          sex: null,
          // cellular_number: null,
          // address: null
          // birthDate: new Date(),
        })
      }
    });
  }

  retrieveUploadedId = () => {
    const { user } = this.props.state
    // this.state.uploadedID = []
    let parameter = {
      account_id: user.id,
      payload: 'image_upload'
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountCardsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      response.data[0].content.map(element => {
        this.state.uploadedID.push(element)
      })
      if(response.data[0].content.length == 4){
        this.setState({ reachMax : true })
      }
    })
    this.verifyApplication()
  }

  verifyApplication = () => {
    const { first_name, middle_name, last_name, sex, uploadedID} = this.state
    if(first_name != null && middle_name != null && last_name != null && sex != null && uploadedID.length == 4 && (user.status != 'VERIFIED' || user.status != 'GRANTED')){
      this.setState({verifyButton: true})
    }
  }

  upload = () => {
    const { user } = this.props.state
    const { profile } = this.state
    const options = {
      noData: true
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ photo: null })
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ photo: null })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        this.setState({ photo: null })
      } else {
        ImageResizer.createResizedImage(response.uri, response.width * 0.5, response.height * 0.5, 'JPEG', 72, 0)
          .then(res => {
            this.setState({ photo: res })
            let formData = new FormData();
            let uri = Platform.OS == "android" ? res.uri : res.uri.replace("file://", "");
            formData.append("file", {
              name: response.fileName,
              type: response.type,
              uri: uri
            });
            formData.append('file_url', response.fileName);
            formData.append('account_id', user.id);
            this.setState({ isLoading: true })
            Api.upload(Routes.imageUpload, formData, response => {
              this.setState({ isLoading: false })
              let imageData = new FormData()
              imageData.append('account_id', user.id);
              imageData.append('url', response.data.data)
              if (profile.profile == null) {
                Api.upload(Routes.accountProfileCreate, imageData, response => {
                  if (response.data !== null) {
                    this.retrieve();
                    Alert.alert(
                      'Message',
                      'Image successfully uploaded',
                      [
                        { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
                      ],
                      { cancelable: false }
                    )
                  }
                })
              } else {
                imageData.append('id', profile.profile.id)
                this.setState({ isLoading: true })
                Api.upload(Routes.accountProfileUpdate, imageData, response => {
                  if (response.data !== null) {
                    this.retrieve();
                    Alert.alert(
                      'Message',
                      'Image successfully updated',
                      [
                        { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
                      ],
                      { cancelable: false }
                    )
                  }
                })
              }
            })
          })
          .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            console.log(err)
          });
      }
    })
  }

  uploadMessage = () => {
    const { reachMax } = this.state
    if(reachMax == true){
      Alert.alert(
        'Message',
        'You have reached the maximum number of uploads',
        [
          { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
        ],
        { cancelable: false }
      )
    }else{
      Alert.alert(
        'Notice',
        "You are only allowed to upload maximum of Four(4) ID's",
        [
          { text: 'Ok', onPress: () => this.uploadId(), style: 'cancel' }
        ],
        { cancelable: false }
      )
    }
  }

  uploadId = () => {
    const { user } = this.props.state
    const options = {
      noData: true
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ photo: null })
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ photo: null })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        this.setState({ photo: null })
      } else {
        ImageResizer.createResizedImage(response.uri, response.width * 0.5, response.height * 0.5, 'JPEG', 72, 0)
          .then(res => {
            this.setState({ photo: res })
            let formData = new FormData();
            let uri = Platform.OS == "android" ? res.uri : res.uri.replace("file://", "");
            formData.append("file", {
              name: response.fileName,
              type: response.type,
              uri: uri
            });
            formData.append('file_url', response.fileName);
            formData.append('account_id', user.id);
            this.setState({ isLoading: true })
            Api.upload(Routes.imageUpload, formData, response => {
              this.setState({ isLoading: false })
              let imageData = new FormData()
              imageData.append('account_id', user.id);
              imageData.append('payload_value', response.data.data)
              imageData.append('payload', 'upload_image')
                Api.upload(Routes.accountCardsCreate, imageData, response => {
                  if (response.data !== null) {
                    this.retrieve();
                    Alert.alert(
                      'Message',
                      'ID successfully uploaded',
                      [
                        { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
                      ],
                      { cancelable: false }
                    )
                  }
                })
            })
          })
          .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            console.log('[ERROR]', err)
          });
      }
    })}

  update = () => {
    const { user } = this.props.state;
    const { dataRetrieve } = this.state
    if (user == null) {
      return
    } else if (this.state.first_name == null || this.state.middle_name == null || this.state.last_name == null || this.state.sex == null) {
      Alert.alert(
        'Error Message',
        'Please fill in all the fields.',
        [
          { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
        ],
        { cancelable: false }
      )
      return
    } else if (this.state.first_name == dataRetrieve.first_name || this.state.middle_name == dataRetrieve.middle_name || this.state.last_name == dataRetrieve.last_name || this.state.sex == dataRetrieve.sex) {
      Alert.alert(
        'Message',
        'Nothing is Updated',
        [
          { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
        ],
        { cancelable: false }
      )
      return
    }
    // }else if(this.state.cellular_number.length != 11 || (this.state.cellular_number.substr(0, 2) != '09')){
    //   Alert.alert(
    //     'Error Message',
    //     'Please input a valid phone number.',
    //     [
    //       {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
    //     ],
    //     { cancelable: false }
    //   )
    //   return
    // }
    let parameters = {
      id: this.state.id,
      account_id: user.id,
      first_name: this.state.first_name,
      middle_name: this.state.middle_name,
      last_name: this.state.last_name,
      sex: this.state.sex,
      // address: this.state.address,
      // birth_date: this.state.birthDate,
      email: this.state.email
    };
    this.setState({ isLoading: true });
    Api.request(
      Routes.accountInformationUpdate,
      parameters, (response) => {
        this.setState({ isLoading: false });
        this.retrieve()
        console.log('[response]', response);
        alert('Updated Successfully');
      },
      (error) => {
        this.setState({ isLoading: false });
      }
    )
  }

  radioClick(id) {
    this.setState({
      sex: id
    })
  }

  gender = () => {
    const { theme } = this.props.state;
    return (
      gender.map((val) => {
        return (
          <TouchableOpacity
          style={{flexDirection: 'row', width: '80%'}}
          key={val.value} onPress={this.radioClick.bind(this, val.value)}>
            <View style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: theme ? theme.primary : Color.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              marginTop: '5%'
            }}>
              {
                val.value == (this.state.sex != null ? this.state.sex : this.state.radioSelected) ?
                <View style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: theme ? theme.primary : Color.primary
                }} />
                : null
              }
            </View>
            <Text style={{flexDirection: 'column', 
              marginTop: '5%', marginLeft: '5%'}}>{val.title}</Text>
          </TouchableOpacity>
        )
      })
    );
  }
 
  render() {
    const { isLoading } = this.state
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

            {/* {
              this.state.profile && ( */}

            {/* )
            } */}

            <TouchableOpacity
              style={{
                height: 110,
                width: 110,
                borderRadius: 100,
                borderColor: theme ? theme.primary : Color.primary,
                borderWidth: 2
              }}
              onPress={() => this.upload()}>
              <UserImage
                user={this.state.profile}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 100
                }}
                size={100}
                color={Color.white}
              />
              <View style={{
                height: 40,
                width: 40,
                borderRadius: 100,
                marginRight: 5,
                position: 'absolute',
                right: -5,
                bottom: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <View style={{
                  height: 35,
                  width: 35,
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: theme ? theme.primary : Color.primary,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <FontAwesomeIcon style={{
                    borderColor: theme ? theme.primary : Color.primary
                  }}
                    icon={faEdit}
                    size={20}
                    color={theme ? theme.primary : Color.primary}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {
              user.username && (
                <Text style={[{ fontWeight: 'bold', color: Color.white }]}>
                  {user.username}
                </Text>
              )
            }

            {
              (user.status == 'VERIFIED' || user.status == 'GRANTED') && (
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
            {
              this.state.rating != null && (
                <Rating ratings={this.state.rating} rating={' '} style={[{ flex: 2 }]}></Rating>
              )
            }
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {(user.status == 'VERIFIED' || user.status == 'GRANTED') && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: 'blue', marginLeft: 5 }}
                  size={15}
                />
              )}
              <Text style={{ color: Color.white, marginLeft: '1%' }}>{user.status}</Text>
            </View>
            {
              this.state.verifyButton == true && (
                <Button 
                  style={{
                    backgroundColor: theme ? theme.secondary : Color.secondary,
                    width: '50%',
                    marginRight: '10%',
                    marginLeft: '15%',
                    marginTop: '1%'
                  }}
                  title={'Apply for Verification'}
                  onClick={() => Linking.openURL('https://calendly.com/payhiramph/shortdiscussion')}
                />
              )
            }
          </View>

          {isLoading ? <Spinner mode="overlay" /> : null}
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

            <Text style={{ marginLeft: 20 }}>First Name</Text>
            <TextInput
              style={[BasicStyles.formControl, { alignSelf: 'center' }]}
              placeholder={'Enter your First Name'}
              onChangeText={(first_name) => this.setState({ first_name })}
              value={this.state.first_name}
              required={true}
            />
            <Text style={{ marginLeft: 20 }}>Middle Name</Text>
            <TextInput
              style={[BasicStyles.formControl, { alignSelf: 'center' }]}
              placeholder={'Enter your Middle Name'}
              onChangeText={(middle_name) => this.setState({ middle_name })}
              value={this.state.middle_name}
              required={true}
            />
            <Text style={{ marginLeft: 20 }}>Last Name</Text>
            <TextInput
              style={[BasicStyles.formControl, { alignSelf: 'center' }]}
              placeholder={'Enter your Last Name'}
              onChangeText={(last_name) => this.setState({ last_name })}
              value={this.state.last_name}
              required={true}
            />
            <View style={{ width: '90%', marginLeft: '5%' }}>
              <Text>Gender</Text>
              {this.gender()}
              {/* <View
                style={{
                  borderColor: Color.gray,
                  borderWidth: 1,
                  paddingLeft: 10,
                  marginBottom: 20,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={this.state.sex}
                  onValueChange={(sex) => this.setState({ sex })}
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
              </View> */}
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
                style={
                  {
                    borderColor: Color.gray,
                    borderWidth: 1,
                    backgroundColor: Color.gray,
                    borderRadius: 25,
                    position: 'absolute',
                    padding: 10,
                    marginTop: '0%',
                    marginLeft: '55%'
                  }}
                onPress={() => this.uploadMessage()}>
                <View style={{ flexDirection: 'row' }}>
                  <FontAwesomeIcon
                    icon={faUpload}
                    style={{ marginRight: 18, marginLeft: 10 }}
                    size={15}
                    />
                    <Text>Upload ID</Text>
                </View>
              </TouchableOpacity>
              <View style={{
              flexDirection: 'row',
              flex: 1,
              flexWrap: 'wrap',
              alignItems: 'flex-start'
              }}>
                {
                  this.state.uploadedID.map((item, index) => {
                    if(item.payload == "upload_image"){
                      return (
                        <TouchableOpacity style={{
                          height: 100,
                          width: '48%',
                          borderWidth: 1,
                          borderColor: Color.gray,
                          margin: 1
                        }}
                          onPress={() => { this.setState({ imageModal: true, urlID: item.payload_value }) }}
                          key={index}>
                          <Image
                            source={{ uri: Config.BACKEND_URL  + item.payload_value }}
                            style={{
                              width: 205,
                              height: 98
                            }}
                          />
                        </TouchableOpacity>
                      )
                    }
                  })
                }
                <ImageModal visible={this.state.imageModal} url={Config.BACKEND_URL  + this.state.urlID} action={() => { this.setState({ imageModal: false }) }}></ImageModal>
              </View>
            </View>
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

          <Button
            title={'Update'}
            onClick={() => this.update()}
            style={{
              width: '90%',
              marginRight: '5%',
              marginLeft: '5%',
              marginTop: '5%',
              marginBottom: '5%',
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

