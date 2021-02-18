import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal, TextInput, TouchableHighlight } from 'react-native';
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
      selectedAddress: 0,
      addresses: [],
      isAddingAddressName: false,
      addingAddress: false,
      value: '',
      isLoading: false,
      executing: false
    };
  }

  onFocusFunction = () => {
    /**
     * Executed each time we enter in this component &&
     * will be executed after going back to this component 
    */
    if (this.state.addingAddress) {
      this.setState({ isAddingAddressName: true })
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
  };

  renderAddresses = () => {
    const { addresses } = this.state
    return addresses.map((address, index) => {
      return (
        <AddressTile
          key={index}
          index={index}
          addressType={address.address_type}
          address={address.route}
          country={address.country}
          onPress={this.selectHandler}
          backgroundColor={
            this.state.selectedAddress === index ? '#22B173' : '#FFFFFF'
          }
          fontColor={
            this.state.selectedAddress === index ? '#FFFFFF' : '#000000'
          }
        />
      );
    });
  };

  retrieveAddresses = () => {
    let parameters = {
      condition: [
        {
          value: this.props.state.user.account_information.account_id,
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
      console.log("RESPONSE", response);
      this.setState({isLoading: false});
    }, error => {
      console.log('retrieving addresses error: ', error)
    })
  }

  addAddress = () => {
    const {user, location} = this.props.state;
    const {value} = this.state
    let parameters = {
      account_id: user.account_information.account_id,
      latitude: location.latitude,
      longitude: location.longtitude,
      route: location.address,
      locality: location.locality,
      region: location.region,
      country: location.country,
      address_type: value
    }
    console.log("parameters: ", parameters)
    this.setState({isLoading: true, executing: true})
    Api.request(Routes.addAddress, parameters, response => {
      console.log('=================== \nAdding Address Response: \n===================', response)
      this.retrieveAddresses();
      this.setState({isAddingAddressName: false})
      this.setState({isLoading: false, executing: false})
    }, error => {
      console.log('Adding Address Error: ', error)
    })
  }

  removeAddress = (id) => {
    let parameter = {
      id: id
    }

    Api.request(Routes.removeAddress, parameter, response => {
      console.log('=================== \nRemoving Address Response: \n===================', response)
      this.retrieveAddresses();
      this.setState({isAddingAddressName: false})
      this.setState({isLoading: false, executing: false})
    }, error => {
      console.log('Removing Address Error: ', error)
    })
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  render() {
    const {location} = this.props.state
    const {isLoading} = this.state
    return (
      <View style={{
        flex: 1,
        paddingBottom: 70
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>

            {this.renderAddresses()}

          </View>
        </ScrollView>

        <Button
          onClick={() => {
            this.redirect('locationWithMapStack')
            this.setState({addingAddress: true})
          }}
          title={'Add Address'}
          style={{
            backgroundColor: Color.secondary,
            position: 'absolute',
            bottom: 0,
            left: '5%',
            right: '5%',
            width: '90%'
          }}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isAddingAddressName}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
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
        {isLoading ? <Spinner mode="overlay" /> : null}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);
