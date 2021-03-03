import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, TouchableHighlight, Dimensions, ScrollView, TextInput, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faStar as Solid } from '@fortawesome/free-solid-svg-icons';
import {faStar as Regular} from '@fortawesome/free-regular-svg-icons';
import Button from 'components/Form/Button';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import {BasicStyles, Color, Routes} from 'common';
import Api from 'services/api/index.js';
import {NavigationActions, StackActions} from 'react-navigation';
import BalanceCard from 'modules/generic/BalanceCard';import {
  Spinner
} from 'components';
import TextInputWithoutLabel from 'components/Form/TextInputWithoutLabel'

const height = Math.round(Dimensions.get('window').height);
class DirectTransfer extends Component {
  constructor(props){
    super(props)
    this.state = {
      charge: 0,
      selectedLedger: null,
      amount: 0,
      isLoading: false,
      notes: null,
      scannedUser: null
    }
  }
  
  componentDidMount = () => {
    this.retrieveSummaryLedger()
    this.retrieveAccount();
  }

  retrieveAccount = () => {
    let parameter = {
      condition: [{
        value: this.props.navigation.state.params.code,
        clause: '=',
        column: 'code'
      }]
    }
    this.setState({ isLoading: true });
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ scannedUser: response.data[0] })
      } else {
        this.setState({ scannedUser: null })
      }
    });
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
    this.setState({isLoading: true, summaryLoading: true});
    console.log('parameter', parameter)
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      console.log('response', response)
      this.setState({isLoading: false, summaryLoading: false});

      if (response != null) {
        setLedger(response.data);
        this.setState({
          selectedLedger: response.data[0]
        })
      } else {
        setLedger(null);
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false, summaryLoading: false});
    });
  };


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
            onClick={ () => this.state.amount > 0 ?
              this.props.navigation.navigate('otpStack', {
                data: {
                  payload: 'directTransfer',
                  data: data
                }
              })
            :
              Alert.alert(
                "Opps",
                "Invalid amount!",
                [
                  { text: "OK"}
                ],
                { cancelable: false }
              )
            }
            style={{
              width: '45%',
              marginLeft: '5%',
              backgroundColor: theme ? theme.secondary : Color.secondary
            }}
          />
        </View>
      );
  }


  renderInput = () => {
    const { selectedLedger } = this.state;
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

        <TextInput
            value={this.state.amount}
            maxLength={7}
            keyboardType={'numeric'}
            onChangeText={(input) => {
              this.setState({
                amount: input
              })
            }}
            style={{
              alignItems: 'center',
              width: '60%',
              textAlign: 'center',
              marginLeft: '20%',
              marginRight: '20%',
              fontSize: 40
            }}
            placeholder={selectedLedger.currency + ' 0.00'}
          />
          
          <TextInputWithoutLabel
            variable={this.state.notes}
            multiline={true}
            onChange={(value) => this.setState({
              notes: value
            })}
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
            }}>Send to </Text>
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



          <View style={{
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
          </View>
        </View>
      )}
      </View>
    )
  }

  renderSummary = (selectedLedger) => {
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
          }}>{Currency.display(amount, selectedLedger.currency)}</Text>
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
          }}>{Currency.display(charge, selectedLedger.currency)}</Text>
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
          }}>{Currency.display((parseFloat(amount) - parseFloat(charge)), selectedLedger.currency)}</Text>
        </View>
      </View>
    )
  }

  render() {
    const { ledger, user } = this.props.state
    const { data } = this.props.navigation.state.params;
    const { selectedLedger, amount, isLoading } = this.state;
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
                (ledger != null && ledger.length > 0) && ledger.map(item => (
                  <BalanceCard
                    data={item}
                  />
                ))
              }

              {
                (selectedLedger ) && this.renderInput()
              }
              {
                (selectedLedger && user ) && this.renderSendTo(user)
              }
              {
                selectedLedger && this.renderSummary(selectedLedger)
              }
            </View>

        </ScrollView>
        {
          this.footerOptions(data)
        }

        {isLoading ? <Spinner mode="overlay" /> : null}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectTransfer);