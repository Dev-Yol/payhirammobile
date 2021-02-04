import React, { Component } from 'react';
import Style from './Style.js';
import { View, Image, TouchableHighlight, Text, ScrollView, FlatList, TextInput, Plat} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Routes, Color, Helper, BasicStyles, Countries } from 'common';
import { Spinner, ImageUpload } from 'components';
import {NavigationActions} from 'react-navigation';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import RNPickerSelect from 'react-native-picker-select';
import { Dimensions } from 'react-native';
class Billing extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      address_1: null,
      address_2: null,
      location: null,
      country: null,
      city: null
    }
  }

  componentDidMount(){
    // this.retrieve()
  }

  manageLocation = (location) => {
    this.setState({
      location: location
    })
  }

  setActive = () => {
    this.navigate('Checkout')
  }
  
  navigate = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
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
      isLoading: true
    })
    Api.request(Routes.accountInformationRetrieve, parameter, response => {
      this.setState({isLoading: false})
    });
  }

  _inputs = () => {
    const currency = Countries.list.map((item, index) => {
      return {
        label: item.title,
        value: item.title
      };
    });
    return (
      <View>
        <View style={{
          marginBottom: 100,
        }}>
          <View>
            <Text style={{
            }}>Address 1</Text>
            <TextInput
              style={BasicStyles.formControlCreate}
              onChangeText={(middleName) => this.setState({middleName})}
              value={this.state.address_1}
              placeholder={'123 Main Street'}
            />
          </View>

          <View>
            <Text style={{
            }}>Address 2(Optional)</Text>
            <TextInput
              style={BasicStyles.formControlCreate}
              onChangeText={(middleName) => this.setState({middleName})}
              value={this.state.address_2}
              placeholder={'Apt, Office, Suite'}
            />
          </View>

          <View style={{
            flexDirection: 'row'
          }}>
            <View style={{
              width: '49%',
              marginRight: '1%',
              backgroundColor: Color.white
            }}>
              <Text style={{
              }}>City</Text>
              <TextInput
                style={BasicStyles.formControlCreate}
                onChangeText={(locality) => this.setState({locality})}
                value={this.state.locality}
                placeholder={'Locality or town'}
              />
            </View>
            <View style={{
              width: '49%',
              marginLeft: '1%',
              backgroundColor: Color.white
            }}>
              <Text style={{
              }}>Country</Text>
              {
                Platform.OS == 'android' && (
                  <Picker selectedValue={this.state.currency}
                  onValueChange={(currency) => this.setState({currency})}
                  style={BasicStyles.pickerStyleCreate}
                  >
                    {
                      Helper.currency.map((item, index) => {
                        return (
                          <Picker.Item
                          key={index}
                          label={item.title} 
                          value={item.value}/>
                        );
                      })
                    }
                  </Picker>
                )
              }
              {
                Platform.OS == 'ios' && (
                  <RNPickerSelect
                    onValueChange={(currency) => this.setState({currency})}
                    items={currency}
                    style={BasicStyles.pickerStyleIOSNoMargin}
                    placeholder={{
                      label: 'Click to select',
                      value: null,
                      color: Color.primary
                    }}
                    />
                )
              }
            </View>
          </View>

          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {
                this.setActive()
              }}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Update</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  render() {
    const { user } = this.props.state;
    const { isLoading, isImageUpload } = this.state;
    return (
      <ScrollView
        style={Style.ScrollView}
        onScroll={(event) => {
          if(event.nativeEvent.contentOffset.y <= 0) {
            if(this.state.isLoading == false){
              this.retrieve()
            }
          }
        }}
        >
        <View style={[Style.MainContainer, {
        }]}>
          {
            this._inputs()
          }
        </View>
        {isLoading ? <Spinner mode="overlay"/> : null }
      </ScrollView>
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
)(Billing);
