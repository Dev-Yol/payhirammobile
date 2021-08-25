import React, { Component } from 'react';
import { Text, View, TouchableHighlight, ScrollView, TextInput, Dimensions, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAsterisk, faRedo, faShippingFast, faPersonBooth } from '@fortawesome/free-solid-svg-icons';
import { Picker } from '@react-native-community/picker';
import { connect } from 'react-redux';
import BalanceCard from 'modules/generic/BalanceCard';
import Style from './ProposalModalStyle';
import { BasicStyles, Color, Helper, Routes } from 'common'
import TextInputWithLabel from 'components/Form/TextInputWithLabel';
import PickerWithLabel from 'components/Form/PickerWithLabel';
import Button from 'components/Form/Button';
import Modal from 'react-native-modal';
import Currency from 'services/Currency';
import Api from 'services/api/index.js';
import RequestCard from 'modules/generic/RequestCard';
import LocationTextInput from 'components/Form/LocationTextInput';
import { Spinner } from 'components';

const height = Math.round(Dimensions.get('window').height)
class ProposalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'PHP',
      isLoading: false,
      summaryLoading: false,
      data: null,
      deliveryFee: 20,
      distance: 0
    };
  }

  componentDidMount() {
    if (this.props.from == 'update' && this.props.peerRequest != null) {
      const { setDefaultAddress } = this.props;
      this.props.setCharge(this.props.peerRequest.charge)
      this.setState({
        data: this.props.peerRequest
      })
      if (this.props.peerRequest.location) {
        setDefaultAddress(this.props.peerRequest.location)
      }
    } else {
      this.setState({
        data: null
      })
    }
    const { request } = this.props;
    if (request) {
      this.setState({
        currency: request.currency
      })
    }
    if (request && parseInt(request.type) == 3) {
      this.retrieveSummaryLedger()
    }
  }

  retrieveSummaryLedger = () => {
    const { user } = this.props.state;
    const { setLedger } = this.props;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      account_code: user.code
    };
    this.setState({ isLoading: true, summaryLoading: true });
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      this.setState({ isLoading: false, summaryLoading: false });

      if (response != null) {
        setLedger(response.data);
      } else {
        setLedger(null);
      }
    }, error => {
      console.log('response', error)
      this.setState({ isLoading: false, summaryLoading: false });
    });
  };

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  check = () => {
    Alert.alert(
      'Alert',
      'Please fill in all fields.',
      [
        { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
      ],
      { cancelable: false }
    )
  }

  getDistance = (charge, latitudeFrom, longitudeFrom, latitudeTo, longitudeTo) => {
    const { user } = this.props.state;
    if (user == null) {
      return;
    }
    let parameter = {
      latitudeFrom: latitudeFrom,
      longitudeFrom: longitudeFrom,
      latitudeTo: latitudeTo,
      longitudeTo: longitudeTo
    }
    this.setState({ isLoading: true });
    Api.request(Routes.getKilometer, parameter, (response) => {
      this.setState({
        isLoading: false,
        distance: response.data
      });
      let distance = parseFloat(this.props.scope?.minimum_distance) - parseFloat(response.data);
      let char = this.props.state.charge;
      if (parseFloat(distance) < 0) {
        distance = parseFloat(distance) * -1;
        distance = parseFloat(distance) * parseFloat(this.props.scope?.addition_charge_per_distance)
        char = parseFloat(distance) + parseFloat(this.props.state.charge);
      }
      Alert.alert(
        'Message',
        `Your final processing fee is ${(parseFloat(charge) + parseFloat(char)).toFixed(2)}. Would you like to proceed?`,
        [
          {
            text: 'No', onPress: () => {
              return;
            }, style: 'cancel'
          },
          {
            text: 'Proceed', onPress: () => {
              this.proceedSubmit((parseFloat(charge) + parseFloat(char)).toFixed(2));
            }, style: 'cancel'
          }
        ],
        { cancelable: false }
      )
    }, error => {
      console.log('response', error)
      this.setState({ isLoading: false });
    });
  }

  transferCharges = (charge) => {
    const { request } = this.props;
    const { defaultAddress, location } = this.props.state;
    let parameter = {
      condition: [
        {
          value: this.props.scope?.scope,
          column: 'scope',
          clause: '='
        }
      ],
      sort: {
        created_at: 'asc'
      },
      limit: 1,
      offset: 0
    }
    this.setState({
      isLoading: true
    })
    Api.request(Routes.getTransferCharge, parameter, response => {
      this.setState({ isLoading: false })
      if(response.data?.length > 0) {
        let data = response.data[0]
        let char = 0;
        if(data.type === 'percentage') {
          if(charge <= data.maximum_amount && charge >= data.minimum_amount) {
            char = (parseFloat(data.charge)/100) * parseFloat(request?.amount);
          } else {
            char = parseFloat(charge);
          }
        } else {
          char = data.charge;
        }
        if (request?.shipping === 'pickup') {
          Alert.alert(
            'Message',
            `Your final processing fee is ${char}. Would you like to proceed?`,
            [
              {
                text: 'No', onPress: () => {
                  return
                }, style: 'cancel'
              },
              {
                text: 'Proceed', onPress: () => {
                  this.proceedSubmit(char);
                }, style: 'cancel'
              }
            ],
            { cancelable: false }
          )
        } else {
          if(defaultAddress === null && location === null) {
            Alert.alert(
              'Error',
              `You have no default address.`,
              [
                {
                  text: 'Ok', onPress: () => {
                    return
                  }, style: 'cancel'
                }
              ],
              { cancelable: false }
            )
            return
          } else {
            this.getDistance(char, defaultAddress?.latitude || location?.latitude, defaultAddress?.longitude || location?.latitude, this.props.data?.location?.latitude, this.props.data?.location?.longitude);         
          }
        }
      } else {
        Alert.alert(
          'Error',
          `No transfer charges found.`,
          [
            {
              text: 'Ok', onPress: () => {
                return
              }, style: 'cancel'
            }
          ],
          { cancelable: false }
        )
        return
      }
    },
      error => {
        console.log(error);
        this.setState({ isLoading: false })
      }
    );
  }

  submit = () => {
    this.props.setConnectModal(true);
    const { defaultAddress, charge, originalCharge } = this.props.state;
    const { request } = this.props;
    const { data } = this.state;
    if(request?.shipping !== 'pickup') {
      if (charge === null || charge === '' || charge < this.props.scope?.minimum_charge || charge <= 0 || charge < originalCharge?.charge) {
        Alert.alert(
          'Error',
          `Invalid Processing Fee. The minimum charge is ${this.props.scope?.minimum_charge || originalCharge?.charge}.`,
          [
            {
              text: 'Ok', onPress: () => {
                return
              }, style: 'cancel'
            }
          ],
          { cancelable: false }
        )
        return
      }
    }
    if (request?.shipping === 'pickup' && defaultAddress === null) {
      Alert.alert(
        'Error',
        `Address is required.`,
        [
          {
            text: 'Ok', onPress: () => {
              return
            }, style: 'cancel'
          }
        ],
        { cancelable: false }
      )
      return
    }
    if(originalCharge === null) {
      this.transferCharges(charge)
    } else {
      this.proceedSubmit(charge);
    }
  }

  proceedSubmit = (charge) => {
    const { user, ledger, defaultAddress, originalCharge, currentRequest, location } = this.props.state;
    const { request, peerRequest } = this.props;
    const { currency, data } = this.state;
    if (request?.money_type != 'cash' && ledger?.available_balance < request?.amount) {
      Alert.alert(
        'Try Again!',
        'You have insufficient balance.',
        [
          {
            text: 'OK', onPress: () => {

            }
          },
        ],
        { cancelable: false }
      )
      return
    }

    if (originalCharge === null) {
      if (request?.account == null) {
        return
      }
      let parameter = {
        request_id: request?.id,
        currency: currency,
        charge: charge,
        status: 'requesting',
        account_id: user?.id,
        to: request?.account?.code
      }
      parameter['location_id'] = request?.location_id
      this.setState({
        isLoading: true
      })
      Api.request(Routes.requestPeerCreate, parameter, response => {
        console.log('[Send proposal] Success', response.error, response)
        if (response.error == null || response?.error?.length === 0) {
          this.setState({
            isLoading: false
          })
          this.props.setOriginalCharge(null)
          this.props.closeModal();
          this.props.setCharge(0);
          this.props.navigation.navigate('requestItemStack', { data: { ...this.props.data, peer_flag: true }, from: 'request' })
        } else {
          Alert.alert(
            'Proposal already existed!',
            'Do you want to view the existing proposal?',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              {
                text: 'OK', onPress: () => {
                  this.props.setCharge(0);
                  this.props.closeModal()
                  this.props.navigation.navigate('requestItemStack', { data: { ...this.props.data, peer_flag: true } })
                }
              },
            ],
            { cancelable: false }
          )
        }
      }, error => {
        console.log('[error]', error)
        this.setState({
          isLoading: false
        })
      });

    } else {
      console.log('[Update proposal]')
      let parameter = {
        id: originalCharge?.id,
        account_id: originalCharge?.account_id,
        charge: charge,
        request_id: originalCharge?.request_id,
      }
      parameter['location_id'] = request?.location_id
      this.setState({
        isLoading: true
      })
      Api.request(Routes.requestPeerUpdate, parameter, response => {
        this.setState({
          isLoading: false
        })
        if(response.data === true){
          this.props.setOriginalCharge(null)
          this.props.closeModal();
          this.props.setCharge(0);
          this.props.onRetrieve()
          this.props.setConnectModal(false);
        }

      },
        error => {
          console.log(error);
          this.setState({
            isLoading: false
          })
        }
      );
    }
  }

  renderContent() {
    const { ledger, theme, defaultAddress, charge } = this.props.state;
    const { request } = this.props;
    const { data } = this.state;
    return (
      <View style={[Style.CreateRequestContainer, {
        width: '100%',
        height: '100%',
        flex: 1
      }]}>
        <ScrollView style={{
          width: '100%',
          height: '100%',
        }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{
            height: height,
          }}>
            {/*
                (ledger != null && ledger.length > 0) && ledger.map(item => (
                  <BalanceCard
                    data={item}
                  />
                ))
              */}
            {
              request && (
                <View style={{
                  marginTop: 10,
                  paddingLeft: 20,
                  paddingRight: 20
                }}
                >
                  <RequestCard
                    onConnectRequest={(data) => data}
                    data={request}
                    navigation={this.props.navigation}
                    // from={'request'}
                    from={'proposal'}
                  />
                </View>
              )
            }

            {
              request && (
                <View style={{
                  height: 75,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: theme ? theme.primary : Color.primary,
                  flexDirection: 'row'
                }}>
                  <FontAwesomeIcon icon={request.shipping.toLowerCase() == 'pickup' ? faPersonBooth : faShippingFast} color={Color.white} size={36} />
                  <Text style={{
                    fontWeight: 'bold',
                    fontSize: BasicStyles.standardFontSize,
                    color: Color.white,
                    paddingLeft: 10
                  }}>FOR {request.shipping.toUpperCase()}</Text>
                </View>
              )
            }

            <View style={{
              height: height,
              width: '90%',
              marginLeft: '5%',
              marginRight: '5%',
              paddingTop: 20
            }}>
              {/*
                    <TextInputWithLabel 
                      variable={this.state.charge}
                      onChange={(value) => this.setState({charge: value})}
                      label={'Your processing fee'}
                      placeholder={'Amount'}
                      onError={false}
                      required={true}
                      maxLength={4}
                      keyboardType={'numeric'}
                      labelStyle={{
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      style={{
                        width: '50%',
                        marginRight: '25%',
                        marginLeft: '25%'
                      }}
                      inputStyle={{
                        textAlign: 'center',
                        paddingLeft: 0,
                        paddingRight: 0
                      }}
                    />
                  */}

              <TextInputWithLabel
                variable={charge}
                onChange={(value) => this.props.setCharge(value)}
                label={'Your processing fee'}
                placeholder={charge ? charge.toString() : 'Amount'}
                onError={false}
                required={true}
                maxLength={4}
                keyboardType={'numeric'}
              />


              {
                (request && request.shipping.toLowerCase() == 'pickup') && (
                  <LocationTextInput
                    variable={defaultAddress !== null ? defaultAddress.route : null}
                    label={'Your pick up location'}
                    placeholder={'Select Location'}
                    onError={false}
                    required={true}
                    route={'addLocationStack'}
                    closeOnClick={() => this.props.closeModal()}
                    navigation={this.props.navigation}
                    from={'request'}
                  // from={'proposal'}
                  />
                )
              }

              {/* <TextInputWithLabel 
                    variable={this.state.deliveryFee}
                    onChange={(value) => this.setState({deliveryFee: value})}
                    label={'Delivery Fee'}
                    placeholder={'Delivery Fee'}
                    onError={false}
                    editable={false}
                    required={true}
                    /> */}

              <View style={{
                width: '100%',
                flexDirection: 'row',
                paddingTop: 15,
                paddingBottom: 15,
              }}>
                <Text style={{
                  width: '50%',
                  textAlign: 'left',
                  fontSize: BasicStyles.standardFontSize
                }}>
                  Your share
                </Text>
                <Text style={{
                  width: '50%',
                  textAlign: 'right',
                  fontSize: BasicStyles.standardFontSize,
                  fontWeight: 'bold'
                }}>
                  {
                    // Currency.display(parseFloat((this.state.charge + this.state.deliveryFee) * Helper.partnerShare).toFixed(2), 'PHP')
                    Currency.display(parseFloat(this.props.state.charge * Helper.partnerShare).toFixed(2), 'PHP')
                  }
                </Text>
              </View>

              <View style={{
                width: '100%',
                flexDirection: 'row',
                paddingTop: 15,
                paddingBottom: 15,
              }}>
                <Text style={{
                  width: '50%',
                  textAlign: 'left',
                  fontSize: BasicStyles.standardFontSize
                }}>
                  Payhiram's share
                </Text>
                <Text style={{
                  width: '50%',
                  textAlign: 'right',
                  fontSize: BasicStyles.standardFontSize,
                  fontWeight: 'bold'
                }}>
                  {
                    // Currency.display(parseFloat((this.state.charge + this.state.deliveryFee) * Helper.payhiramShare).toFixed(2), 'PHP')
                    Currency.display(parseFloat(this.props.state.charge * Helper.payhiramShare).toFixed(2), 'PHP')
                  }
                </Text>
              </View>


              <View style={{
                width: '100%',
                flexDirection: 'row',
                paddingTop: 15,
                paddingBottom: 15,
                borderBottomWidth: 0.5,
                borderTopWidth: 0.5,
                borderColor: Color.lightGray,
                marginTop: 10
              }}>
                <Text style={{
                  width: '50%',
                  textAlign: 'left',
                  fontSize: BasicStyles.standardFontSize
                }}>
                  Total
                </Text>
                <Text style={{
                  width: '50%',
                  textAlign: 'right',
                  fontSize: BasicStyles.standardFontSize,
                  fontWeight: 'bold',
                  color: theme ? theme.secondary : Color.secondary
                }}>
                  {
                    // Currency.display(this.state.charge + this.state.deliveryFee, 'PHP')
                    Currency.display(this.props.state.charge, 'PHP')
                  }
                </Text>
              </View>

            </View>
          </View>
        </ScrollView>
        <View
          style={Style.BottomContainer}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 5,
            paddingTop: 5
          }}>

            <Button
              title={'Cancel'}
              onClick={() => this.props.closeModal()}
              style={{
                width: '45%',
                marginRight: '5%',
                backgroundColor: Color.danger,
              }}
            />


            <Button
              title={data ? 'Update' : 'Submit'}
              onClick={() => this.submit()}
              style={{
                width: '45%',
                marginLeft: '5%',
                backgroundColor: theme ? theme.secondary : Color.secondary
              }}
            />

          </View>
        </View>
      </View >
    );
  }

  renderError() {
    return (
      <View style={[Style.CreateRequestContainer, {
        width: '100%',
        height: '100%',
        flex: 1
      }]}>
        <ScrollView style={{
          width: '100%',
          height: '100%',
        }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{
            width: '100%',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center'
          }}>
            <Text>Invalid Accessed, please refresh!</Text>
            <TouchableHighlight
              onPress={() => this.retrieveSummaryLedger()}>
              <FontAwesomeIcon icon={faRedo} size={32} />
            </TouchableHighlight>
          </View>
        </ScrollView>
        <View
          style={Style.BottomContainer}>

          <Button
            title={'Close'}
            onClick={() => this.props.closeModal()}
            style={{
              width: '90%',
              marginRight: '5%',
              marginLeft: '5%',
              backgroundColor: Color.danger,
            }}
          />
        </View>
      </View>
    )
  }

  render() {
    const { closeModal, visible, request } = this.props;
    const { ledger } = this.props.state;
    const { isLoading, summaryLoading } = this.state;
    return (
      <Modal onBackdropPress={closeModal}
        transparent={true}
        backdropTransitionInTiming={100}
        backdropTransitionOutTiming={100}
        isVisible={visible}
        style={Style.modalContainer}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', flexDirection: 'column' }}
          style={{ padding: 0 }}>
          <View style={[Style.container]}>
            {this.renderContent()}
            {(isLoading == false && (!ledger || (ledger && ledger.length == 0)) && (request && request.type == 3)) && (
              this.renderError()
            )}
          </View>

          {isLoading ? <Spinner mode="overlay" /> : null}
        </ScrollView>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
    setDefaultAddress: (address) => dispatch(actions.setDefaultAddress(address)),
    setConnectModal: (connectModal) => dispatch(actions.setConnectModal(connectModal)),
    setCharge: (charge) => dispatch(actions.setCharge(charge)),
    setOriginalCharge: (originalCharge) => dispatch(actions.setOriginalCharge(originalCharge))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposalModal);
