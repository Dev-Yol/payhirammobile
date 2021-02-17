import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, Dimensions} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faAsterisk} from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import Api from 'services/api/index.js';
import {Spinner} from 'components';
import {NavigationActions, StackActions} from 'react-navigation';
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
      location: null,
      currency: 'PHP',
      neededOn: null,
      fulfillmentType: null,
      amount: 0,
      maximumProcessingCharge: null,
      reason: null,
      money_type: null,
      isLoading: false,
    };
  }
  componentDidMount() {
    console.log('=============================', this.props.state.user)
    this.retrieveSummaryLedger()
  }

  retrieveSummaryLedger = () => {
    const {user} = this.props.state;
    const { setLedger } = this.props;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      account_code: user.code
    };
    this.setState({isLoading: true});
    console.log('parameter', parameter)
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      console.log('response', response)
      this.setState({isLoading: false});
      if (response != null) {
        setLedger(response.data[0]);
      } else {
        setLedger(null);
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false});
    });
  };

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  navigateToDrawer = (route) => {
      const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
            NavigationActions.navigate({routeName: route}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  onDateFinish = (datetime) => {
    this.setState({
      neededOn: datetime.date,
    });
  };


  handleSelectFulfillment = (item) => {
    this.setState({
      fulfillmentType: item,
      money_type: item.money_type,
      type: item.id
    });
  };

  handleAmountChange = (amount) => {
    this.setState({amount: amount});
  };

  handleDetailsChange = (details) => {
    this.setState({reason: details});
  };

  handleMaxProcessingChargeChange = (maximumProcessingCharge) => {
    this.setState({maximumProcessingCharge: maximumProcessingCharge});
  };

  createRequest = async () => {
    const {user, location} = this.props.state;
    if(user == null || location == null){
      return
    }
    let parameters = {
      account_id: user.id,
      amount: this.state.amount,
      comaker: null,
      coupon: null,
      currency: this.state.currency,
      interest: null,
      location_id: location.id,
      max_charge: this.state.maximumProcessingCharge,
      months_payable: null,
      needed_on: this.state.neededOn,
      reason: this.state.reason,
      type: this.state.type,
      money_type: this.state.money_type
    };
    this.props.setRequestInput(parameters);
    this.sendRequest()
    // this.props.navigation.navigate('otpStack', {
    //   performTransaction: this.sendRequest,
    // });
  };

  sendRequest = () => {
    this.setState({isLoading: true});
    console.log('parameters', this.props.state.requestInput)
    Api.request(Routes.requestCreate, this.props.state.requestInput, response => {
        this.setState({isLoading: false});
        this.navigateToDrawer('Requests')
      },
      (error) => {
        console.log('API ERROR', error);
        this.setState({isLoading: false});
      },
    );
  };

  render() {
    const { ledger, theme, location } = this.props.state;
    return (
      <View style={{
        flex: 1
      }}>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            ledger && (
              <BalanceCard
                data={ledger}
              />
            )
          }
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
              variable={location}
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
              onChange={(value) => this.handleAmountChange(value.toString())}
              label={'Amount'}
              keyboardType={'numeric'}
              onError={false}
              required={true}
            />

            <TextInputWithLabel 
              variable={this.state.maximumProcessingCharge}
              onChange={(value) => this.handleMaxProcessingChargeChange(value.toString())}
              label={'Maximum processing charge'}
              onError={false}
              keyboardType={'numeric'}
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
              placeholder="Select date"
              type="date"
            />


            <TextInputWithLabel 
              variable={this.state.reason}
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
                    Currency.display(this.state.amount, 'PHP')
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
                    Currency.display(this.state.amount, 'PHP')
                  }
                  </Text>
                </View>
              </View>
              <Button
                onClick={() => this.createRequest()}
                title={'Post'}
                style={{
                  backgroundColor: theme ? theme.secondary : Color.secondary
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
