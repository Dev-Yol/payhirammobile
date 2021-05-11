import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, TextInput, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import AddressTile from 'modules/addLocation/AddressTile.js';
import Style from 'modules/addLocation/Style.js';
import Button from 'components/Form/Button';
import { Color, Routes, BasicStyles } from 'common';
import Api from 'services/api';
import {Spinner} from 'components';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class AddLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: null,
      addresses: [],
      isAddingAddressName: false,
      addingAddress: false,
      value: '',
      isLoading: false,
      executing: false,
      location: null
    };
  }

  onFocusFunction = () => {
    const { location } = this.props.state
    /**
     * Executed each time we enter in this component &&
     * will be executed after going back to this component 
    */
    if (this.state.addingAddress && this.props.state.location != null) {
      // this.setState({ isAddingAddressName: true })
      if(location.route == null && location.region != null){
        location.route = location.locality
        this.addAddress()
      }else if(location.route != null && location.region == null){
        location.region = location.locality
        this.addAddress()
      }else if(location.route == null && location.region == null){
        location.route = location.locality
        location.region = location.locality
        this.addAddress()
      }else{
        this.addAddress()
      }
    }
  }

  componentDidMount() {
    this.retrieveAddresses();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  componentWillUnmount() {
    /**
     * removing the event listener added in the componentDidMount()
     */
    this.focusListener.remove()
  }

  selectHandler = (index) => {
    this.setState({ selectedAddress: index });
    const { params } = this.props.navigation.state;
    if(params?.payload == 'plans'){
      this.setState({
        location: this.state.addresses[index]
      })
    }else if(this.props.state.location_from == 'proposal'){
      const {setDefaultAddress} = this.props;
      setDefaultAddress(this.state.addresses[index]);
      console.log('[defaulthh]', this.props.state.defaultAddress);
      this.props.navigation.navigate('requestItemStack', {data: this.props.state.request});
    }else{
      const {setDefaultAddress} = this.props;
      setDefaultAddress(this.state.addresses[index]);
      console.log('[default]', this.props.state.defaultAddress, this.state.addresses[index]);
      this.props.navigation.pop()
    }
  };

  renderAddresses = () => {
    const { addresses } = this.state
    const { theme } = this.props.state;
    return addresses.map((address, index) => {
      return (
        <AddressTile
          key={index}
          index={index}
          // addressType={address.address_type}
          address={address.route}
          country={address.country}
          onPress={this.selectHandler}
          deletingClicked={() => this.alertMessage(index)}
          backgroundColor={
            this.state.selectedAddress === index ? (theme ? theme.secondary : Color.secondary) : '#FFFFFF'
          }
          fontColor={
            this.state.selectedAddress === index ? '#FFFFFF' : '#000000'
          }
        />
      );
    });
  };

  retrieveAddresses = () => {
    const {user} = this.props.state
    let parameters = {
      condition: [
        {
          value: user.id,
          column: 'account_id',
          clause: '=',
        }
      ],
      limit: 100,
      offset: 0
    }
    this.setState({isLoading: true})
    Api.request(Routes.retrieveSavedAddresses, parameters, response => {
      this.setState({addresses: response.data});
      // console.log("RESPONSE", response);
      this.setState({isLoading: false});
    }, error => {
      console.log('retrieving addresses error: ', error)
    })
  }

  addAddress = () => {
    const {user, location} = this.props.state;
    const {value} = this.state
    let parameters = {
      account_id: user.id,
      latitude: location.latitude,
      longitude: location.longitude,
      route: location.address,
      locality: location.locality,
      region: location.region,
      country: location.country,
      address_type: 'NULL'
    }
    // console.log("parameters: ", parameters)
    this.setState({isLoading: true, executing: true})
    Api.request(Routes.addAddress, parameters, response => {
      // const {setLocation} = this.props
      // console.log('=================== \nAdding Address Response: \n===================', response)
      this.retrieveAddresses();
      this.setState({isAddingAddressName: false, addingAddress: false})
      this.setState({isLoading: false, executing: false, value: ''})
      // setLocation(null)
    }, error => {
      console.log('Adding Address Error: ', error)
    })
  }

  alertMessage = (index) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to continue?',
      [
        {text: 'Cancel', onPress: () => console.log('Ok'), style: 'cancel'},
        {text: 'Ok', onPress: () => this.removeAddress(index), style: 'cancel'}
      ],
      { cancelable: false }
    )
  }

  removeAddress = (index) => {
    let parameter = {
      id: this.state.addresses[index].id
    }
    this.setState({isLoading: true})
    Api.request(Routes.removeAddress, parameter, response => {
      console.log('=================== \nRemoving Address Response: \n===================', response)
      this.retrieveAddresses();
      this.setState({isAddingAddressName: false})
      this.setState({isLoading: false, executing: false})
    }, error => {
      console.log('Removing Address Error: ', error)
    })
  }

  setAppointment(){
    const { user } = this.props.state;
    const { params } = this.props.navigation.state;
    if(user == null || (user?.plan?.status.toLowerCase() == 'pending')){
      Alert.alert(
        'Message',
        'You have pending request, you may upgrade or downgrade account once the request is resolved.',
        [
          {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }
    if(!params?.data ||  this.state.location == null){
      Alert.alert(
        'Message',
        'Invalid Accessed.',
        [
          {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }
    let parameter = {
      account_id: user.id,
      plan: params.data.value,
      amount: params.data.amount,
      currency: params.data.currency,
      status: 'pending',
      location: this.state.location
    };
    this.setState({isLoading: true});
    Api.request(Routes.plansCreate, parameter, (response) => {
      this.setState({isLoading: false})
      const { updateUser } = this.props;
      updateUser({
        ...user,
        plan: parameter
      })
      this.props.navigation.navigate('partnerPlansStack');
    }, error => {
      this.setState({isLoading: false})
    })
  }

  redirect = (route, param) => {
    this.props.navigation.navigate(route, {data: param});
  };

  render() {
    const {location, location_from, theme} = this.props.state
    const {isLoading, addresses} = this.state
    const { params } = this.props.navigation.state;
    return (
      <View style={{
        flex: 1,
        paddingBottom: 70
      }}>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>

            {this.renderAddresses()}

          </View>
        </ScrollView>
        {
          (params?.payload == 'plans' && addresses.length > 0) && (
            <View style={{
              position: 'absolute',
              bottom: 10,
              width: '100%'
            }}>
              <Button
                onClick={() => {
                  this.setAppointment()
                }}
                title={'Set Appointment'}
                style={{
                  backgroundColor: theme ? theme.secondary : Color.secondary,
                  left: '5%',
                  right: '5%',
                  width: '90%'
                }}
              />
            </View>
          )
        }

        {
          (!params?.payload || addresses.length == 0) && (
            <Button
              onClick={async () => {
                // const {setLocation} = await this.props
                // await setLocation(null)
                console.log('[lcoation again]', this.props.state.location);
                await this.redirect('locationWithMapStack', this.props.from)
                await this.setState({addingAddress: true})
              }}
              title={'Add Address'}
              style={{
                backgroundColor: theme ? theme.secondary : Color.secondary,
                position: 'absolute',
                bottom: 10,
                left: '5%',
                right: '5%',
                width: '90%'
              }}
              from={'proposal'}
            />
          )
        }

        
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isAddingAddressName}
        >
          <View style={Style.insideModalCenteredView}>
            <View style={Style.modalView}>
              <Text style={
                [
                  Style.modalText,
                  {
                    fontWeight: 'bold',
                    marginTop: 0
                  }
                ]
              }>Address Name: </Text>
              <View style={{ marginTop: 5, marginBottom: 5 }}>
                <TextInput
                  style={
                    [
                      {
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1
                      },
                      Style.textInput
                    ]
                  }
                  onChangeText={value => this.setState({ value })}
                  value={this.state.value}
                />
              </View>
              <Text style={
                [
                  {
                    fontWeight: 'bold',
                    textAlign: 'left'
                  },
                  Style.modalText
                ]
              }> Address: </Text>
              <Text style={
                [
                  Style.modalText,
                  {
                    color: Color.darkGray
                  }
                ]
              }>{location != null ? location.address : ''}</Text>
              <View
                style={
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }
              >
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor={Color.lightGray}
                  disabled={this.state.value !== '' && !this.state.executing ? false : true}
                  // style={{ 
                  //   ...Style.openButton, backgroundColor: Color.primaryDark }}
                  style={
                    [
                      BasicStyles.btn,
                      Style.btnWhite,
                      {
                        marginTop: 20
                      }
                    ]
                  }
                  onPress={() => {
                    this.addAddress()
                  }}
                >
                  <Text style={Style.textStyle}>Add</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    // updateUser: (user) => dispatch(actions.updateUser(user)),
    setLocation: (location) => dispatch(actions.setLocation(location)),
    setDefaultAddress: (defaultAddress) => dispatch(actions.setDefaultAddress(defaultAddress)),
    updateUser: (user) => dispatch(actions.updateUser(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);
