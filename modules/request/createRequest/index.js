import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faAsterisk} from '@fortawesome/free-solid-svg-icons';
import {Picker} from '@react-native-community/picker';
import {connect} from 'react-redux';
import Api from 'services/api/index.js';
import {Spinner} from 'components';

import FulfillmentCard from 'modules/request/createRequest/FulfillmentCard';
import BalanceCard from 'modules/generic/BalanceCard';
import CustomButton from './CustomButton';
import styles from './Styles';
import {BasicStyles, Routes, Helper} from 'common';
import DateTime from 'components/DateTime';
class CreateRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'PHP',
      date: '',
      time: '',
      fulfillmentType: '',
      amount: '0',
      maximumProcessingCharge: '',
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

  renderFulfillmentTypes = () => {
    const fulfullmentTypes = Helper.fulfillmentTypes;
    return fulfullmentTypes.map((fulfillment, index) => {
      return (
        <FulfillmentCard
          key={index}
          index={fulfillment.value}
          cardColor="#22B173"
          fulfillmentType={fulfillment.label}
          fulfillmentDescription={fulfillment.description}
          handleSelect={this.handleSelectFulfillment}
        />
      );
    });
  };

  handleSelectFulfillment = (value) => {
    const fulfullmentTypes = Helper.fulfillmentTypes;
    const type = fulfullmentTypes.filter((type) => type.value === value);
    this.setState({
      fulfillmentType: type[0].value,
      money_type: type[0].money_type,
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
      <View style={{height: '100%', width: '100%', alignItems: 'center'}}>
        <View style={styles.CreateRequestContainer}>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <ScrollView>
            <BalanceCard
              cardColor="#22B173"
              availableBalance={'PHP 25,000.00'}
              currentBalance={'PHP 52,000.00'}
            />
            <View style={styles.FillInDetailsContainer}>
              <Text style={styles.FillInDetailsTextStyle}>
                Fill in the details
              </Text>
            </View>
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
                {this.renderFulfillmentTypes()}
              </ScrollView>
            </View>
            <View style={styles.SelectFulfillmentContainer}>
              <Text
                style={[
                  styles.SelectFulfillmentTextStyle,
                  {fontSize: BasicStyles.standardFontSize},
                ]}>
                I need
              </Text>
              <FontAwesomeIcon
                icon={faAsterisk}
                size={7}
                style={{paddingLeft: 15, color: '#FF2020'}}
              />
            </View>
            <CustomButton
              buttonColor="#22b173"
              fontColor="#fffff"
              buttonText="Cash"
              width="100%"
            />
            <View style={styles.SelectFulfillmentContainer}>
              <Text
                style={[
                  styles.SelectFulfillmentTextStyle,
                  {fontSize: BasicStyles.standardFontSize},
                ]}>
                Select Currency
              </Text>
              <FontAwesomeIcon
                icon={faAsterisk}
                size={7}
                style={{paddingLeft: 15, color: '#FF2020'}}
              />
            </View>
            <View style={styles.TextInputContainer}>
              <Picker
                selectedValue={this.state.language}
                style={{
                  fontSize: BasicStyles.standardFontSize,
                  height: 60,
                  width: '90%',
                  borderRadius: 5,
                  borderColor: '#EOEOEO',
                  borderWidth: 1,
                }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({currency: itemValue})
                }>
                <Picker.Item
                  label="Philippine Peso - PHP"
                  value="Philippine Peso - PHP"
                />
                <Picker.Item label="US Dollar - USD" value="US Dollar - USD" />
              </Picker>
            </View>
            <View style={styles.SelectFulfillmentContainer}>
              <Text
                style={[
                  styles.SelectFulfillmentTextStyle,
                  {fontSize: BasicStyles.standardFontSize},
                ]}>
                Amount
              </Text>
              <FontAwesomeIcon
                icon={faAsterisk}
                size={7}
                style={{paddingLeft: 15, color: '#FF2020'}}
              />
            </View>
            <View style={styles.TextInputContainer}>
              <TextInput
                value={this.state.amount}
                onChangeText={(amount) => {
                  this.handleAmountChange(amount);
                }}
              />
            </View>
            <View style={styles.SelectFulfillmentContainer}>
              <Text
                style={[
                  styles.SelectFulfillmentTextStyle,
                  {fontSize: BasicStyles.standardFontSize},
                ]}>
                Maximum processing charge
              </Text>
              <FontAwesomeIcon
                icon={faAsterisk}
                size={7}
                style={{paddingLeft: 15, color: '#FF2020'}}
              />
            </View>
            <View style={styles.TextInputContainer}>
              <TextInput
                placeholder="Optional"
                style={{textAlign: 'justify'}}
                onChangeText={(maximumProcessingCharge) => {
                  this.handleMaxProcessingChargeChange(maximumProcessingCharge);
                }}
              />
            </View>
            <View style={styles.SelectFulfillmentContainer}>
              <Text
                style={[
                  styles.SelectFulfillmentTextStyle,
                  {fontSize: BasicStyles.standardFontSize},
                ]}>
                Location
              </Text>
              <FontAwesomeIcon
                icon={faAsterisk}
                size={7}
                style={{paddingLeft: 15, color: '#FF2020'}}
              />
            </View>
            <View style={styles.TextInputContainer}>
              <TextInput
                placeholder="Please type meetup address"
                onFocus={() => {
                  this.redirect('addLocationStack');
                }}
              />
            </View>
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
            <View style={[styles.SelectFulfillmentContainer, {paddingTop: 0}]}>
              <Text
                style={[
                  styles.SelectFulfillmentTextStyle,
                  {fontSize: BasicStyles.standardFontSize},
                ]}>
                Details
              </Text>
              <FontAwesomeIcon
                icon={faAsterisk}
                size={7}
                style={{paddingLeft: 15, color: '#FF2020'}}
              />
            </View>
            <View style={[styles.TextInputContainer, {height: 120}]}>
              <TextInput
                value={this.state.details}
                placeholder="Add details here"
                placeholderTextColor="#000000"
                onChangeText={(details) => {
                  this.handleDetailsChange(details);
                }}
              />
            </View>
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
                  PHP
                </Text>
                <Text
                  style={[
                    styles.AmountDetailsStyle,
                    {fontSize: BasicStyles.standardFontSize},
                  ]}>
                  0.00
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
                  <Text style={styles.AmountDetailsStyle}>PHP</Text>
                  <Text style={styles.AmountDetailsStyle}>0.00</Text>
                </View>
              </View>
              <CustomButton
                onPress={this.createRequest}
                buttonColor="#3F0050"
                fontColor="#fffff"
                buttonText="Post"
                width="100%"
              />
            </View>
          </ScrollView>
        </View>
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
