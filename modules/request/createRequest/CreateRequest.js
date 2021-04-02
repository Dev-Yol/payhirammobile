import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Alert} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faAsterisk, faMinusCircle, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import Api from 'services/api/index.js';
import {Spinner} from 'components';
import {NavigationActions, StackActions} from 'react-navigation';
import FulfillmentCard from 'modules/generic/FulfilmentCard';
import TargetCard from 'modules/generic/TargetCard';
import BalanceCard from 'modules/generic/BalanceCard';
import Button from 'components/Form/Button';
import TextInputWithLabel from 'components/Form/TextInputWithLabel';
import LocationTextInput from 'components/Form/LocationTextInput';
import PickerWithLabel from 'components/Form/PickerWithLabel';
import styles from './Styles';
import {BasicStyles, Routes, Helper, Color} from 'common';
import DateTime from 'components/DateTime';
import Currency from 'services/Currency';
import TextInputWithoutLabel from 'components/Form/TextInputWithoutLabel'
import Stepper from 'components/Stepper';
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';

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
      stepLabels: ['Type', 'Location', 'Details', 'Preview']
    };
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    if(params && params.data){
      this.handleSelectFulfillment(params.data)
    }    
  }

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


  footerHandler(action){
    const { currentPosition } = this.state;
    if(action == 'previous' && currentPosition > 0){
      this.setState({
        currentPosition: currentPosition - 1
      })
    }else if(action == 'next' && currentPosition < this.state.stepLabels.length){
      this.setState({
        currentPosition: currentPosition + 1
      })
    }
  }

  footer = (data, margin = null) => {
    const { theme } = this.props.state;
    return(
      <View style={{
        flexDirection: 'row',
        marginTop: 25,
        alignItems: 'space-between'
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
                marginLeft: 'previous' == item.toLowerCase() ? '0%' : margin ? margin : '10%',
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: 'center',
          justifyContent: 'center'
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
                      backgroundColor: shipping == item.toLowerCase() ? (theme ? theme.secondary : Color.secondary) : Color.white,
                      width: '40%',
                      marginRight: '5%',
                      height: 50,
                      borderRadius: 25,
                      borderWidth: 0.5,
                      borderColor: theme ? theme.secondary : Color.secondary
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

            {
              this.footer(['Next'], '60%')
            }
        </View>
      </ScrollView>
    )
  }
  secondStep = () => {
    return(
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {
            this.footer(['Previous', 'Next'])
          }
        </View>
      </ScrollView>
    )
  }

  thirdStep = () => {
    return(
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {
            this.footer(['Previous', 'Next'])
          }
        </View>
      </ScrollView>
    )
  }

  fourthStep = () => {
    return(
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {
            this.footer(['Previous', 'Next'])
          }
        </View>
      </ScrollView>
    )
  }

  render() {
    const { ledger, theme } = this.props.state;
    const { currentPosition } = this.state;
    return (
      <View style={{
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