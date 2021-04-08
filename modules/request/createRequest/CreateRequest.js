import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Alert, KeyboardAvoidingView} from 'react-native';
import {connect} from 'react-redux';
import Api from 'services/api/index.js';
import FulfillmentCard from 'modules/generic/FulfilmentCard';
import TargetCard from 'modules/generic/TargetCard';
import Button from 'components/Form/Button';
import {BasicStyles, Routes, Helper, Color} from 'common';
import DatePicker from 'components/DateTime/index.js';
import Currency from 'services/Currency';
import TextInputWithoutLabel from 'components/Form/TextInputWithoutLabel'
import Stepper from 'components/Stepper';
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';
import MapViewer from 'components/Location/MapViewer';
import RequestCard from 'modules/generic/RequestCard';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import AmountInput from 'modules/generic/AmountInput'

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
const shippingButtons = ['Pickup', 'Deliver'];
const actionsFooterButtons = ['Previous', 'Next'];

class CreateRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      currency: 'PHP',
      shipping: 'pickup',
      neededOn: null,
      fulfillmentType: null,
      amount: 0,
      maximumProcessingCharge: null,
      reason: null,
      money_type: null,
      isLoading: false,
      target: 'partners',
      currentDate: null,
      edited: false,
      currentPosition: 0,
      stepLabels: ['Type', 'Location', 'Details', 'Preview'],
      errorMessage: null
    };
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    if(params && params.data){
      this.handleSelectFulfillment(params.data)
    }
    this.retrieveSummaryLedger()
    let date = new Date()
    this.setState({
      currentDate: date.setDate(date.getDate())
    })
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
    setLedger(null)
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      this.setState({isLoading: false});
      if (response != null) {
        setLedger(response.data[0]);
      } else {
        setLedger(null);
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false});
      setLedger(null)
    });
  };
  

  handleTarget = (item) => {
    this.setState({
      target: item.payload
    })
  }



  handleSelectFulfillment = (item) => {
    console.log('[item]', item);
    this.setState({
      fulfillmentType: item,
      money_type: item.money_type,
      type: item.id
    });
  };

  onDateFinish = (datetime) => {
    console.log('[Selected Date]', datetime)
    this.setState({
      neededOn: datetime.date,
    });
  };

  footerHandler(action){
    const { ledger, defaultAddress } = this.props.state;
    const { currentPosition, fulfillmentType, location } = this.state;
    const { amount, neededOn, reason, type } = this.state;
    this.setState({
      errorMessage: null
    })
    if(action == 'previous' && currentPosition > 0){
      this.setState({
        currentPosition: currentPosition - 1
      })
    }else if(action == 'next' && currentPosition < this.state.stepLabels.length){
      if(currentPosition == 0 && fulfillmentType == null){
        this.setState({
          errorMessage: 'Fulfilment type is required'
        })
        return
      }
      if(currentPosition == 1 && defaultAddress == null){
        this.setState({
          errorMessage: 'Location is required'
        })
        return
      }
      if(currentPosition == 2){
        if(ledger == null && type != 3){
          this.setState({
            errorMessage: 'Insufficient Balance'
          })
          return
        }
        if(ledger && amount > ledger.available_balance){
          this.setState({
            errorMessage: 'Insufficient Balance'
          })
          return
        }
        if(neededOn == null){
          this.setState({
            errorMessage: 'Needed on is required'
          })
          return
        }
        if(reason == null){
          this.setState({
            errorMessage: 'Additional information is required.'
          })
          return
        }
        if(amount < Helper.MINIMUM){
          this.setState({
            errorMessage: Helper.MINIMUM + ' is the minimum transaction'
          })
          return
        }
      }
      if(currentPosition == 3){
        this.createRequest()
      }
      this.setState({
        currentPosition: currentPosition + 1
      })
    }
  }



  createRequest = () => {
    const {user, defaultAddress} = this.props.state;
    if(user == null){
      return
    }else if(this.state.target == null || this.state.type == null || this.state.money_type == null || this.state.amount == null ||  this.state.amount == "" || this.state.neededOn == null || this.state.reason == null || this.state.reason == "" || defaultAddress == null || this.state.target == null) {
      Alert.alert(
        'Error Message',
        'All fields with (*) are required.',
        [
          {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }else if(parseInt(this.state.amount) < 1000){
      Alert.alert(
        'Error Message',
        'Amount must not be less than 1000',
        [
          {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }
    let parameters = {
      account_id: user.id,
      amount: this.state.amount,
      comaker: null,
      coupon: null,
      currency: this.state.currency,
      interest: null,
      location_id: defaultAddress.id,
      max_charge: this.state.maximumProcessingCharge,
      months_payable: null,
      needed_on: this.state.neededOn,
      reason: this.state.reason,
      shipping: this.state.shipping,
      type: this.state.type,
      money_type: this.state.money_type,
      target: this.state.target
    };
    console.log('[Create Requests] Create parameters', parameters)
    // this.props.setRequestInput(parameters);
    // this.sendRequest()
    this.props.navigation.navigate('otpStack', {
      data: {
        payload: 'createRequest',
        data: parameters
      }
    });
  };

  footer = (data) => {
    const { theme } = this.props.state;
    return(
      <View style={{
        flexDirection: 'row',
        bottom: 20,
        right: 0,
        paddingLeft: 20,
        paddingRight: 20,
        position: 'absolute',
        width: '100%'
      }}>
        {
          data.map((item) => (
            <Button
              onClick={() => {
                this.footerHandler(item.toLowerCase())
              }}
              title={item}
              style={{
                backgroundColor: 'previous' == item.toLowerCase() ? Color.danger : (theme ? theme.secondary : Color.secondary),
                width: '40%',
                height: 50,
                borderRadius: 25,
                marginLeft: 'previous' == item.toLowerCase() ? '0%' : data.length == 1 ? '60%' : '10%',
                marginRight: 'previous' == item.toLowerCase() ? '10%' : '0%',
              }}
              textStyle={{
                color: Color.white,
                fontSize: BasicStyles.standardFontSize
              }}
            />
          ))
        }
      </View>

    )
  }

  firstStep = () => {
    const { theme } = this.props.state;
    const { shipping, target, fulfillmentType } = this.state;
    return(
        <View style={{
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: 'center',
          height: height
        }}>
            <View style={{
              flexDirection: 'row',
            }}>
              {
                shippingButtons.map((item) => (
                  <Button
                    onClick={() => {
                      this.setState({
                        shipping: item.toLowerCase()
                      })
                    }}
                    title={item}
                    style={{
                      backgroundColor: shipping == item.toLowerCase() ? (theme ? theme.primary : Color.primary) : Color.white,
                      width: '40%',
                      marginRight: '5%',
                      height: 50,
                      borderRadius: 25,
                      borderWidth: 0.5,
                      borderColor: theme ? theme.primary : Color.primary
                    }}
                    textStyle={{
                      color: shipping == item.toLowerCase() ? Color.white : Color.black,
                      fontSize: BasicStyles.standardFontSize
                    }}
                  />
                ))
              }
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: 40,
            }}>
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                width: '50%',
                fontWeight: 'bold'
              }}>Available to *</Text>

              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                width: '50%',
                textAlign: 'right'
              }}>{target.toUpperCase()}</Text>
            </View>

            <View style={{width: '100%'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <TargetCard
                  onSelect={(item) => this.handleTarget(item)}
                  selected={this.state.target}
                  />
              </ScrollView>
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              minHeight: 40,
            }}>
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                width: '50%',
                fontWeight: 'bold'
              }}>Fulfilment type *</Text>

              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                width: '50%',
                textAlign: 'right'
              }}>{fulfillmentType?.type?.toUpperCase()}</Text>
            </View>

            <View style={{width: '100%'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <FulfillmentCard
                  onSelect={(item) => this.handleSelectFulfillment(item)}
                  selected={this.state.fulfillmentType}
                  />
              </ScrollView>
            </View>

        </View>
    )
  }

  secondStep = () => {
    const { location } = this.state;
    const { defaultAddress } = this.props.state;
    return(
        <View style={{
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: 'center',
          height: height
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%',
              fontWeight: 'bold'
            }}>Location *</Text>

            <TouchableOpacity
              style={{
                width: '50%'
              }}
              onPress={() => {
                this.props.navigation.navigate('addLocationStack')
              }}
              >
              { defaultAddress != null ?
              <Text></Text> :  <FontAwesomeIcon icon={faMapMarkerAlt} size={BasicStyles.standardFontSize} color={Color.black} style={{marginLeft: '45%', marginTop: '3%'}}/>}
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                width: '100%',
                textAlign: 'right',
                marginTop: '-8%'
              }}>{defaultAddress ? defaultAddress.route : 'Select Location'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{
            width: '100%',
            height: height * 0.5,
            borderRadius: BasicStyles.standardBorderRadius
          }}>
            {
              defaultAddress && (
                <MapViewer data={defaultAddress}/>
              )
            }
          </View>
        </View>
    )
  }

  thirdStep = () => {
    const { ledger } = this.props.state;
    console.log('[ledger]', ledger)
    return(
        <View style={{
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: 'center',
          height: height
        }}>
        
        <AmountInput
          onChange={(amount, currency) => this.setState({
            amount: amount,
            currency: currency
          })}
          />

          {/*<TextInput
                      value={this.state.amount}
                      keyboardType={'numeric'}
                      onChangeText={(input) => {
                        if(ledger && ledger.available_balance < input){
                          this.setState({
                            errorMessage: 'Insufficient Balance!'
                          })
                        }else{
                          this.setState({
                            amount: input
                          })  
                        }
                      }}
                      style={{
                        alignItems: 'center',
                        fontSize: 52
                      }}
                      placeholder={'0.00'}
                    />*/}
          
          {/*
            ledger && (
              <TouchableOpacity style={{
                width: '100%',
                paddingBottom: 20
              }}
              onPress={() => {
                this.props.navigation.navigate('currencyStack')
              }}
              >
                <View style={{
                  width: '100%',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    paddingTop: 5,
                    paddingBottom: 5
                  }}>{Currency.display(ledger.available_balance, ledger?.currency ? ledger.currency : 'PHP') +  '  >'}</Text>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    color: Color.gray
                  }}>Available Balance</Text>
                </View>
              </TouchableOpacity>
            )
          */}

          <View style={{
            width: '100%',
            flexDirection: 'row',
            height: 50,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: Color.lightGray
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%',
              fontWeight: 'bold'
            }}>Needed on *</Text>

            <DatePicker
              type={'date'}
              placeholder={this.state.needed_on}
              borderColor= {'white'}
              minimumDate={this.state.currentDate}
              height={40}
              style={{
                borderColor: 0,
                borderWidth: 0,
                height: 40,
                width: '50%',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
              textStyle={{
                textAlign: 'right',
                width: '100%',
                color: Color.black
              }}
              icon={false}
              onFinish={this.onDateFinish}
            />
          </View>

          <View style={{
            width: '100%',
            height: 50,
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              fontWeight: 'bold'
            }}>Additional information *</Text>
          </View>


          <TextInputWithoutLabel
            variable={this.state.reason}
            multiline={true}
            onChange={(value) => this.setState({
              reason: value
            })}
            numberOfLines={10}
            placeholder={'Type the details here ...'}
          />

        </View>
    )
  }

  fourthStep = () => {
    const { user, defaultAddress } = this.props.state;
    return(
        <View style={{
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          height: height
        }}>
        {
          (defaultAddress && user) && (
            <RequestCard 
              onConnectRequest={(item) => {

              }}
              data={{
                account_id: user.id,
                amount: this.state.amount,
                comaker: null,
                coupon: null,
                currency: this.state.currency,
                interest: null,
                location_id: defaultAddress.id,
                location: defaultAddress,
                max_charge: this.state.maximumProcessingCharge,
                months_payable: null,
                needed_on: this.state.neededOn,
                reason: this.state.reason,
                shipping: this.state.shipping,
                type: this.state.type,
                money_type: this.state.money_type,
                target: this.state.target,
                status: 0,
                account: user,
                needed_on_human: this.state.neededOn,
                ratings: {
                  size: 0,
                  avg: 0,
                  stars: 0,
                  total: 0
                },
                initial_amount: this.state.amount,
                distance: '0 Km',
                peer_flag: true,
                accepted: true
              }}
              navigation={this.props.navigation}
              from={'create_request'}
            />
          )
        }
        </View>
    )
  }

  render() {
    const { ledger, theme } = this.props.state;
    const { currentPosition, errorMessage } = this.state;
    return (
      <KeyboardAvoidingView
      style={{
        flex: 1
      }}
      behavior={'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            height: height,
            flex: 1
          }}>
            <View style={{
              paddingTop: 25,
              paddingBottom: 25
            }}>
              <Stepper 
                labels={this.state.stepLabels}
                currentPosition={currentPosition}
                stepCount={4}
              />
            </View>
            {
              errorMessage && (
                <View style={{
                  width: '100%',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    paddingTop: 10,
                    paddingBottom: 10,
                    color: Color.danger
                  }}>{errorMessage}</Text>
                </View>
              )
            }
            <PagerProvider activeIndex={currentPosition}>
              <Pager panProps={{enabled: false}}>
                <View style={{
                  flex: 1,
                  minHeight: height,
                  width: '100%'
                }}>
                  {this.firstStep()}
                </View>
                <View style={{
                  flex: 1,
                  minHeight: height,
                  width: '100%'
                }}>
                  {this.secondStep()}
                </View>
                <View style={{
                  flex: 1,
                  minHeight: height,
                  width: '100%'
                }}>
                  {this.thirdStep()}
                </View>
                <View style={{
                  flex: 1,
                  minHeight: height,
                  width: '100%'
                }}>
                  {this.fourthStep()}
                </View>
              </Pager>
            </PagerProvider> 
          </View>
        </ScrollView>
        {
          this.footer(currentPosition  == 0 ? ['Next'] : ['Previous', 'Next'])
        }
      </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    // updateUser: (user) => dispatch(actions.updateUser(user)),
    setRequestInput: (requestInput) => dispatch(actions.setRequestInput(requestInput)),
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateRequest);