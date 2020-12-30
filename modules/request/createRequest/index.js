import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, Dimensions} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faAsterisk} from '@fortawesome/free-solid-svg-icons';
import {Picker} from '@react-native-community/picker';
import {connect} from 'react-redux';
import Api from 'services/api/index.js';
import {Spinner} from 'components';

import FulfillmentCard from 'modules/generic/FulfilmentCard';
import BalanceCard from 'modules/generic/BalanceCard';
import Button from 'components/Form/Button';
import TextInputWithLabel from 'components/Form/TextInputWithLabel';
import LocationTextInput from 'components/Form/LocationTextInput';
import PickerWithLabel from 'components/Form/PickerWithLabel';
import styles from './Styles';
import {BasicStyles, Routes, Helper, Color} from 'common';
import DateTime from 'components/DateTime';
import Currency from 'services/Currency';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class CreateRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'PHP',
      date: '',
      time: '',
      fulfillmentType: null,
      amount: 0,
      maximumProcessingCharge: null,
      details: '',
      money_type: '',
      isLoading: false,
    };
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  onDateFinish = (datetime) => {
    this.setState({
      date: datetime.date,
    });
  };


  handleSelectFulfillment = (item) => {
    this.setState({
      fulfillmentType: item
    });
  };

  handleAmountChange = (amount) => {
    this.setState({amount: amount});
  };

  handleDetailsChange = (details) => {
    this.setState({details: details});
  };

  handleMaxProcessingChargeChange = (maximumProcessingCharge) => {
    this.setState({maximumProcessingCharge: maximumProcessingCharge});
  };

  createRequest = async () => {
    const {user} = this.props.state;
    let parameters = {
      account_id: user.account_information.account_id,
      money_type: this.state.money_type,
      currency: this.state.currency,
      type: this.state.fulfillmentType,
      amount: this.state.amount,
      interest: 1,
      months_payable: 1,
      needed_on: this.state.date,
      billing_per_month: 1,
      max_charge: null,
      reason: this.state.details,
      location: {
        route: this.props.state.location.address,
        locality: this.props.state.location.locality,
        region: this.props.state.location.region,
        country: this.props.state.location.country,
        latitude: this.props.state.location.latitude,
        longitude: this.props.state.location.longitude,
      },
      comaker: '',
      coupon: '',
    };
    this.props.setRequestInput(parameters);
    this.props.navigation.navigate('otpStack', {
      performTransaction: this.sendRequest,
    });
  };

  sendRequest = () => {
    this.setState({isLoading: true});
    Api.request(
      Routes.requestCreate,
      this.props.state.requestInput,
      (response) => {
        console.log('RESPONSE', response);
        this.setState({isLoading: false});
      },
      (error) => {
        console.log('API ERROR', error);
        this.setState({isLoading: false});
      },
    );
  };

  render() {
    return (
      <View style={{
        flex: 1
      }}>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <BalanceCard
            data={{
              amount: 500,
              currency: 'PHP',
              current_amount: 2500
            }}
          />
          <View style={{
            ...BasicStyles.standardContainer
          }}>
            <View>
              <Text style={{
                fontWeight: 'bold'
              }}>
                Fill in the details
              </Text>
            </View>


            <LocationTextInput 
              variable={this.state.amount}
              label={'Select Location'}
              onError={false}
              required={true}
              route={'addLocationStack'}
              navigation={this.props.navigation}
            />


            <View style={styles.SelectFulfillmentContainer}>
              <Text
                style={[
                  styles.SelectFulfillmentTextStyle,
                  {fontSize: BasicStyles.standardFontSize},
                ]}>
                Select type of fulfillment
              </Text>
              <FontAwesomeIcon
                icon={faAsterisk}
                size={7}
                style={{paddingLeft: 15, color: '#FF2020'}}
              />
            </View>

            <View style={{height: 200, width: '100%'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <FulfillmentCard onSelect={(item) => this.handleSelectFulfillment(item)}/>
              </ScrollView>
            </View>


            <PickerWithLabel 
              label={'Select Currency'}
              data={Helper.currency}
              placeholder={'Click to select'}
              onChange={(value) => this.setState({
                currency: value
              })}
              required={true}
              onError={false}
            />


            <TextInputWithLabel 
              variable={this.state.amount}
              onChange={(value) => this.handleAmountChange(value)}
              label={'Amount'}
              onError={false}
              required={true}
            />

            <TextInputWithLabel 
              variable={this.state.maximumProcessingCharge}
              onChange={(value) => this.handleMaxProcessingChargeChange(value)}
              label={'Maximum processing charge'}
              onError={false}
              required={false}
              placeholder={'Optional'}
            />


            <View style={styles.SelectFulfillmentContainer}>
              <Text
                style={[
                  styles.SelectFulfillmentTextStyle,
                  {fontSize: BasicStyles.standardFontSize},
                ]}>
                Needed on
              </Text>
              <FontAwesomeIcon
                icon={faAsterisk}
                size={7}
                style={{paddingLeft: 15, color: '#FF2020'}}
              />
            </View>
            <DateTime
              onFinish={this.onDateFinish}
              placeholder="Select date and time"
              type="date"
            />


            <TextInputWithLabel 
              variable={this.state.details}
              onChange={(value) => this.handleDetailsChange(value)}
              label={'Details'}
              onError={false}
              required={true}
              placeholder={'Add details here'}
              multiline={true}
              numberOfLines={5}
            />


            <View style={styles.AmountContainer}>
              <View style={styles.AmountTextContainer}>
                <Text
                  style={[
                    styles.AmountTextStyle,
                    {fontSize: BasicStyles.standardFontSize},
                  ]}>
                  Subtotal
                </Text>
              </View>
              <View style={styles.AmountDetailsContainer}>
                <Text
                  style={[
                    styles.AmountDetailsStyle,
                    {fontSize: BasicStyles.standardFontSize},
                  ]}>
                  {
                    Currency.display(0.00, 'PHP')
                  }
                </Text>
              </View>
            </View>
            <View style={styles.ChangesContainer}>
              <Text
                style={[
                  styles.ChangesTextStyle,
                  {fontSize: BasicStyles.standardFontSize},
                ]}>
                Changes will vary to the processor
              </Text>
            </View>
            <View style={styles.TotalContainer}>
              <View style={styles.AmountContainer}>
                <View style={styles.AmountTextContainer}>
                  <Text style={styles.AmountTextStyle}>Total</Text>
                </View>
                <View style={styles.AmountDetailsContainer}>
                  <Text style={styles.AmountDetailsStyle}>
                  {
                    Currency.display(0.00, 'PHP')
                  }
                  </Text>
                </View>
              </View>
              <Button
                onClick={() => this.createRequest()}
                title={'Post'}
                style={{
                  backgroundColor: Color.secondary
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    // updateUser: (user) => dispatch(actions.updateUser(user)),
    setLocation: (location) => dispatch(actions.setLocation(location)),
    setRequestInput: (requestInput) =>
      dispatch(actions.setRequestInput(requestInput)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateRequest);
