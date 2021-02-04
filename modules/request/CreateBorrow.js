import React, {Component} from 'react';
import Style from './Style';
import {Text, View, TouchableOpacity, TextInput, ScrollView, TouchableHighlight, ToastAndroid, Platform} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import {NavigationActions} from 'react-navigation';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { Spinner, LocationAutoComplete } from 'components';
import Currency from 'services/Currency.js';
import Api from 'services/api/index.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
const width = Math.round(Dimensions.get('window').width);
class CreateBorrowRequest extends Component {
  constructor(props){
    super(props);
    this.state = {
      errorMessage: null,
      isLoading: false,
      type: 1,
      currency: 'PHP',
      amount: 0,
      neededOn: new Date(),
      neededOnLabel: null,
      showDatePicker: false,
      dateFlag: false,
      reason: null,
      money_type: 'Cash',
      max_charge: null
    }
  }

  componentDidMount(){
    const { setLocation } = this.props;
    setLocation(null);
  }

  redirect = (route) => {
    this.props.navigation.navigate(route)
  }

  submit = () => {
    const { location } = this.props.state;
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      money_type: 'cash',
      currency: this.state.currency,
      type: this.state.type,
      amount: this.state.amount,
      interest: null,
      months_payable: null,
      needed_on: this.state.neededOn,
      billing_per_month: 0,
      reason: this.state.reason,
      location: location,
      images: [],
      comaker: null,
      max_charge: this.state.max_charge

    }
    this.setState({isLoading: true});
    console.log('parameter', parameter);
    Api.request(Routes.requestCreate, parameter, response => {
      this.setState({isLoading: false});
      const navigateAction = NavigationActions.navigate({
        routeName: 'Requests'
      });
      this.props.navigation.dispatch(navigateAction);
    });
  }

  validate = () => {
    const { location, userLedger } = this.props.state;
    let flag = false;
    this.setState({showDatePicker: false})
    if(Helper.request.MINIMUM > this.state.amount){
      let error = 'Minimum transaction is ' + Currency.display(Helper.request.MINIMUM, this.state.currency)
      this.setState({
        errorMessage: error
      })
      flag = true;
      return
    }
    if(this.state.neededOn == null || this.state.neededOn == '' || this.state.dateFlag == false){
      this.setState({
        errorMessage: 'Needed on date is required'
      })
      flag = true;
      return
    }
    if(this.state.reason == null || this.state.reason == ''){
      this.setState({
        errorMessage: 'Details is required'
      })
      flag = true;
      return
    }
    setTimeout(() => {
      if(flag == false){
        this.setState({errorMessage: null})
        this.submit()
      }
    }, 100)
  }

  _types = () => {
    const { type } = this.state;
    return (
      <ScrollView horizontal={true} style={Style.ScrollView}>
        <View style={{
          flexDirection: 'row'
        }}>
        {
          Helper.fulfillmentBorrowTypes.map((item, index) => {
            return (
              <TouchableHighlight style={{
                width: width / 2,
                borderRadius: 5,
                borderColor: Color.primary,
                borderWidth: 1,
                marginRight: 10,
                padding: 5,
                backgroundColor: item.value == type ? Color.primary : Color.white
              }}
              onPress={() => {this.setState({type: item.value, showDatePicker: false, money_type: item.money_type})}}
              underlayColor={Color.gray}
                >
                <View>
                  <Text style={{
                    paddingTop: 5,
                    paddingBottom: 5,
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: item.value == type ? Color.white : '#000'
                  }}>{item.label}</Text>
                  <Text style={{
                    paddingTop: 5,
                    paddingBottom: 5,
                    fontSize: 12,
                    textAlign: 'center',
                    color: item.value == type ? Color.white : '#000'
                  }}>{item.description}</Text>
                </View>
              </TouchableHighlight>
            );
          })
        }
        </View>
      </ScrollView>
    );
  }

  setDate = (event, date) => {
    this.setState({
      showDatePicker: false,
      dateFlag: true,
      neededOn: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      neededOnLabel: Currency.getMonth(date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear()
    });
    console.log('date', this.state.neededOn);
  }

  _datePicker = () => {
    const { showDatePicker, neededOn } = this.state;
    return (
      <View>
        { showDatePicker && <DateTimePicker value={neededOn}
            mode={'date'}
            display="default"
            date={new Date()}
            onCancel={() => this.setState({showDatePicker: false})}
            minimumDate={new Date()}
            onConfirm={this.setDate} 
            onChange={this.setDate} />
        }
      </View>
    );
  }
  _inputs = () => {
    const { userLedger, user, location } = this.props.state;
    const { errorMessage } = this.state;
    const currency = Helper.currency.map((item, index) => {
                      return {
                        label: item.title,
                        value: item.value
                      };
                    });
    return (
      <View>
        <View style={{
          alignItems: 'center',
          borderRadius: 5,
          backgroundColor: Color.danger
        }}>
          <Text style={{
            color: Color.white,
            fontSize: 11,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            textAlign: 'justify'
          }}>Hi {user.username}! Investors are excited to fulfil your request! Just a gentle reminder that you can't change any information of the request once posted.</Text>
        </View>
        {
          errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 20
            }}>
              <Text style={{
                color: Color.danger
              }}>Opps! {errorMessage}</Text>
            </View>
          )
        }
        {
          userLedger != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 20
            }}>
              <Text style={{
                color: Color.primary,
                fontWeight: 'bold'
              }}>Your current balance</Text>
              <Text style={{
                  color: Color.primary,
                  fontSize: 30,
                  fontWeight: 'bold'
              }}>{Currency.display(userLedger.amount, userLedger.currency)}</Text>
            </View>
          )
        }
        <View style={{
          marginTop: 20
          }}>
            <Text>Select Type</Text>
            <Text style={{
              fontSize: 12,
              color: Color.normalGray
            }}>Just swipe right for more options</Text>
        </View>
        {
          this._types()
        }
        <View style={{
          marginTop: 10
        }}>
          <Text>Select Currency</Text>
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
        <View>
          <Text style={{
            paddingTop: 10
          }}>Amount</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(amount) => this.setState({amount})}
            value={this.state.amount}
            placeholder={'0'}
            keyboardType={'numeric'}
          />
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Maximum Charge</Text>
          <TextInput
            style={BasicStyles.formControlCreate}
            onChangeText={(max_charge) => this.setState({max_charge})}
            value={this.state.max_charge}
            placeholder={'Optional'}
            keyboardType={'numeric'}
          />
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Needed on</Text>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.secondary,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {this.setState({showDatePicker: true})}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>{this.state.dateFlag == false ? 'Click to add date' : this.state.neededOnLabel}</Text>
          </TouchableHighlight>
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Location</Text>
          {
            location != null && (
              <Text style={{
                paddingTop: 10,
                paddingBottom: 10,
                color: Color.primary
              }}>
                {
                  location.route + ', ' +
                  location.locality + ', ' +
                  location.country
                }
              </Text>
            )
          }
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.secondary,
                width: '100%',
                marginBottom: 20,
                alignItems: 'center',
                borderRadius: 5,
                justifyContent: 'center'
              }}
              onPress={() => {this.redirect('locationStack')}}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>{ location != null ? 'Click to change location' : 'Click to add location'}</Text>
          </TouchableHighlight>
        </View>
        <View>
          <Text style={{
            paddingTop: 10
          }}>Details</Text>
          <TextInput
            style={ Platform.OS == 'android' ? {
              borderColor: Color.gray,
              borderWidth: 1,
              width: '100%',
              marginBottom: 20,
              textAlignVertical: 'top',
              borderRadius: 5,
              paddingLeft: 10
            } : {
              borderColor: Color.gray,
              borderWidth: 1,
              width: '100%',
              marginBottom: 20,
              textAlignVertical: 'top',
              borderRadius: 5,
              minHeight: 50,
              textAlignVertical: 'middle',
              paddingLeft: 10,
              paddingTop: 10
            }}
            onChangeText={(reason) => this.setState({reason})}
            value={this.state.reason}
            placeholder={'Enter details here...'}
            multiline = {true}
            numberOfLines = {5}
          />
        </View>
        <View>
          <TouchableHighlight style={{
                height: 50,
                backgroundColor: Color.primary,
                width: '100%',
                marginBottom: 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {
                this.validate()
              }}
              underlayColor={Color.gray}
                >
              <Text style={{
                color: Color.white,
                textAlign: 'center',
              }}>Post</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }


  render(){
    const { payload } = this.props;
    const { isLoading } = this.state;
    return (
      <View style={Style.MainContainer}>
        <ScrollView 
          style={Style.ScrollView}
          >
          {this._inputs()}
        </ScrollView>
        {this._datePicker()}
        {isLoading ? <Spinner mode="overlay"/> : null }
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setLocation: (location) => dispatch(actions.setLocation(location))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBorrowRequest);
