import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, TouchableHighlight, Dimensions, ScrollView, TextInput, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faStar as Solid } from '@fortawesome/free-solid-svg-icons';
import {faStar as Regular} from '@fortawesome/free-regular-svg-icons';
import Button from 'components/Form/Button';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import {BasicStyles, Color, Routes, Helper} from 'common';
import Api from 'services/api/index.js';
import {NavigationActions, StackActions} from 'react-navigation';
import {
  Spinner
} from 'components';
import TextInputWithoutLabel from 'components/Form/TextInputWithoutLabel'
import AmountInput from 'modules/generic/AmountInput'
import Modal from 'react-native-modal';

const height = Math.round(Dimensions.get('window').height);
class AcceptPaymentStack extends Component {
  constructor(props){
    super(props)
    this.state = {
      charge: 0,
      amount: 0,
      isLoading: false,
      notes: null,
      scannedUser: null,
      currency: 'PHP'
    }
  }
  
  componentDidMount = () => {
    const { data } = this.props.navigation.state.params;
    if(data.success == true){
      this.setState({
        amount: data.amount,
        currency: data.currency,
        selectedLedger: data.selectedLedger,
        scannedUser: data.to,
        charge: data.charge,
        notes: data.notes
      })
    }else{
      this.retrieveAccount();
    }
  }

  retrieveAccount = () => {
    const { data } = this.props.navigation.state.params;
    let parameter = {
      condition: [{
        value: data.code,
        clause: '=',
        column: 'code'
      }]
    }
    this.setState({ isLoading: true });
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ scannedUser: response.data[0] })
        // this.retrieveSummaryLedger(response.data[0])
      } else {
        this.setState({ scannedUser: null })
      }
    }, error => {
      console.log('error')
      this.setState({
        isLoading: false
      })
    });
  }

  retrieveSummaryLedger = (user) => {
    const { setLedger } = this.props;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      account_code: user.code
    };
    setLedger(null)
    this.setState({isLoading: true, summaryLoading: true});
    console.log('parameter', parameter)
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      console.log('response', response)
      this.setState({isLoading: false, summaryLoading: false});

      if (response.data.length > 0) {
        setLedger(response.data[0]);
      } else {
        setLedger(null);
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false, summaryLoading: false});
      setLedger(null)
    });
  };

  navigateToScreen = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({routeName: 'Dashboard', params: {
              initialRouteName: 'Dashboard',
              index: 0
          }}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  errorAlert(message){
    Alert.alert(
      'Error',
      message,
      [
        {text: 'OK', onPress: () => {
        }},
      ],
      { cancelable: false }
    )
  }
  onContinue = () => {
    const { user, ledger } = this.props.state
    if(user == null){
      this.errorAlert('Invalid Sender Account')
      return
    }
    const { scannedUser } = this.state;
    if(scannedUser == null){
      this.errorAlert('Invalid Receiver Account')
      return
    }

    const { amount, charge, notes, currency} = this.state;
    // if(ledger == null){
    //   this.errorAlert('Invalid Account')
    //   return 
    // }

    if(amount == 0){
      this.errorAlert('Amount is required')
      return    
    }

    // if(amount > ledger.available_balance){
    //   this.errorAlert('Issuficient Balance')
    //   return    
    // }

    if(notes == null || notes == ''){
      this.errorAlert('Notes is required')
      return
    }


    if(amount > Helper.transactionLimit){
      this.errorAlert('Greater than transaction limit')
      return
    }
    let parameter = {
      to_code: scannedUser.code,
      to_email: scannedUser.email,
      from_code: user.code,
      from_email: user.email,
      amount: amount,
      currency: currency,
      notes: notes,
      charge: charge
    }
    this.setState({
      isLoading: true
    })
    console.log('parameter', parameter)
    Api.request(Routes.ledgerAcceptPayment, parameter, (response) => {
      console.log('response', response)
      const { setPaymentConfirmation } = this.props;
      setPaymentConfirmation(true)
      this.setState({isLoading: false, summaryLoading: false});
    }, error => {
      console.log('error', error)
      this.setState({isLoading: false, summaryLoading: false});
    });
  }

  footerOptions = (data) => {
    const { theme } = this.props.state;
    return (
      <View style={{
          alignItems: 'center',
          backgroundColor: Color.white,
          width: '100%',
          flexDirection: 'row',
          position: 'absolute',
          bottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          left: 0
        }}>
          <Button 
            title={'Cancel'}
            onClick={() => this.props.navigation.pop()}
            style={{
              width: '45%',
              marginRight: '5%',
              backgroundColor: Color.danger,
            }}
          />

          <Button 
            title={'Continue'}
            onClick={ () => this.onContinue()}
            style={{
              width: '45%',
              marginLeft: '5%',
              backgroundColor: theme ? theme.secondary : Color.secondary
            }}
          />
        </View>
      );
  }

  footerOptionsComplete = (data) => {
    const { theme } = this.props.state;
    return (
      <View style={{
          alignItems: 'center',
          backgroundColor: Color.white,
          width: '100%',
          flexDirection: 'row',
          position: 'absolute',
          bottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          left: 0
        }}>

          <Button 
            title={'Go to Dashboard'}
            onClick={ () => this.navigateToScreen()}
            style={{
              width: '100%',
              backgroundColor: theme ? theme.secondary : Color.secondary
            }}
          />
        </View>
      );
  }


  renderInput = () => {
    const { ledger } = this.props.state;
    const { data } = this.props.navigation.state.params;
    return (
      <View>
        <View style={{
          height: 50,
          marginTop: 20,
          justifyContent: 'center',
        }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: BasicStyles.standardTitleFontSize,
            textAlign: 'center',
          }}>Amount </Text>
        </View>

        <AmountInput
          onChange={(amount, currency) => this.setState({
              amount: amount,
              currency: currency
            })
          }
          navigation={this.props.navigation}
          disableRedirect={true}
          />
          {/*<TextInput
            value={this.state.amount}
            maxLength={7}
            keyboardType={'numeric'}
            onChangeText={(input) => {
              this.setState({
                amount: input
              })
            }}
            editable={data.success ? false : true}
            style={{
              alignItems: 'center',
              width: '60%',
              textAlign: 'center',
              marginLeft: '20%',
              marginRight: '20%',
              fontSize: 40
            }}
            placeholder={ledger.currency + ' 0.00'}
          />*/}
          
          <TextInputWithoutLabel
            variable={this.state.notes}
            multiline={true}
            onChange={(value) => this.setState({
              notes: value
            })}
            editable={data.success ? false : true}
            numberOfLines={5}
            placeholder={'Add notes here (Optional) ...'}
            style={{
              marginTop: 10
            }}
          />
      </View>
    );
  }
  renderSendTo = (user) => {
    const { scannedUser } = this.state;
    return (
      <View>
      {scannedUser && (
        <View>
          <View style={{
            height: 50,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: Color.lightGray
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: BasicStyles.standardFontSize
            }}>Credit from </Text>
          </View>

          <View style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%'
            }}>Account Code</Text>

            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%',
              textAlign: 'right',
              fontWeight: 'bold'
            }}
            numberOfLines={1}
            >****{scannedUser.code.substr(scannedUser.code.length - 16, scannedUser.code.length - 1)}</Text>
          </View>



          <View style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%'
            }}>Account Name</Text>

            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%',
              textAlign: 'right',
              fontWeight: 'bold'
            }}
            numberOfLines={1}
            >{scannedUser.information ? scannedUser.information.first_name + ' ' + scannedUser.information.last_name : scannedUser.username}</Text>
          </View>



          {/*<View style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%'
            }}>Account Email</Text>

            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%',
              textAlign: 'right',
              fontWeight: 'bold'
            }}
            numberOfLines={1}
            >{scannedUser.email}</Text>
          </View>*/}
        </View>
      )}
      </View>
    )
  }

  renderSummary = () => {
    const { amount, charge } = this.state;
    return(
      <View style={{
      }}>
        <View style={{
          height: 50,
          justifyContent: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray
        }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: BasicStyles.standardFontSize
          }}>Summary</Text>
        </View>

        <View style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray,
          flexDirection: 'row'
        }}>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '60%'
          }}>Sub Total</Text>

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '40%',
            textAlign: 'right'
          }}>{Currency.display(amount, this.state.currency)}</Text>
        </View>


        <View style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray,
          flexDirection: 'row'
        }}>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '60%'
          }}>Processing fee {charge ? ' (Free)' : null}</Text>

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '40%',
            textAlign: 'right'
          }}>{Currency.display(charge, this.state.currency)}</Text>
        </View>



        <View style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '60%',
            fontWeight: 'bold'
          }}>Total</Text>

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '40%',
            fontWeight: 'bold',
            textAlign: 'right'
          }}>{Currency.display((parseFloat(amount) - parseFloat(charge)), 'PHP')}</Text>
        </View>
      </View>
    )
  }

  render() {
    const { ledger, user, acceptPayment, paymentConfirmation  } = this.props.state
    const { data } = this.props.navigation.state.params;
    const { amount, isLoading } = this.state;
    return (
      <SafeAreaView key={data}>
        <ScrollView
          showsVerticalScrollIndicator={false}>

            <View style={{
              minHeight: height,
              width: '90%',
              marginRight: '5%',
              marginLeft: '5%',
              marginBottom: 100
            }}>

              {
                (data && data.success == false) && this.renderInput()
              }
              {
                (user ) && this.renderSendTo(user)
              }
              {
                this.renderSummary()
              }
            </View>

        </ScrollView>
        {
          (data && data.success == false) && this.footerOptions(data)
        }

        {
          (data.success == true) && this.footerOptionsComplete(data)
        }

        {isLoading ? <Spinner mode="overlay" /> : null}

        {
          paymentConfirmation && (
            <Modal
              onBackdropPress={() => {}}
              transparent={true}
              backdropTransitionInTiming={100}
              backdropTransitionOutTiming={100}
              isVisible={true}>
              <View style={{
                width: '100%',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ActivityIndicator
                  size={100}
                  color={Color.white}
                />
                <Text style={{
                  color: Color.white,
                  fontWeight: 'bold'
                }}>Waiting for approval ...</Text>
                
                <Button 
                  title={'Cancel'}
                  onClick={() => this.props.navigation.pop()}
                  style={{
                    width: '50%',
                    marginRight: '25%',
                    marginLeft: '25%',
                    marginTop: 25,
                    backgroundColor: Color.white,
                  }}
                  textStyle={{
                    color: Color.black
                  }}
                />
              </View>
            </Modal>
          )
        }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
    setPaymentConfirmation: (flag) => dispatch(actions.setPaymentConfirmation(flag)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AcceptPaymentStack);