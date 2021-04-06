import React, {Component} from 'react';
import Style from './Style.js';
import {
  View,
  Image,
  TouchableHighlight,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Platform,
  TouchableOpacity
} from 'react-native';
import {Routes, Color, Helper, BasicStyles} from 'common';
import {Spinner, Empty, SystemNotification} from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {Dimensions} from 'react-native';
import BalanceCard from 'modules/generic/BalanceCard.js';
import TransactionCard from 'modules/generic/TransactionCard.js';
import QRCodeModal from 'components/Modal/QRCode';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faHandHoldingUsd, faMoneyBillWave, faFileInvoice, faWallet } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import ButtonWithIcon from 'components/Form/ButtonWithIcon';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

const transactionData = []

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      showRatings: true,
      history: []
    };
  }

  componentDidMount() {
    // this.props.setQRCodeModal(false)
    const {user} = this.props.state;
    if (user != null) {
      this.retrieveSummaryLedger();
    }
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  redirectDrawer = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Requests',
    });
    this.props.navigation.dispatch(navigateAction);
  };

  retrieveSummaryLedger = () => {
    const {user} = this.props.state;
    const { setLedger } = this.props;
    if (user == null) {
      return;
    }
    let parameter = {
      account_code: user.code
    };
    this.setState({isLoading: true});
    Api.request(Routes.ledgerDashboard, parameter, (response) => {
      this.setState({isLoading: false});
      if (response != null) {
        setLedger(response.data.ledger);
        this.setState({
          history: response.data.history
        })
      } else {
        setLedger(null);
      }
    }, error => {
      this.setState({isLoading: false});
    });
  };


  retrieveLedgerHistory = () => {
    const {user} = this.props.state;
    if (user == null) {
      return;
    }
    let parameter = {
      account_code: user.code,
      limit: 5
    };
    Api.request(Routes.ledgerHistory, parameter, (response) => {
      if (response != null) {
        this.setState({
          history: response.data
        })
      } else {
        this.setState({
          history: []
        })
      }
    }, error => {
      console.log('response', error)
    });
  };

  withdrawal = () => {
    this.props.navigation.navigate('withdrawalStack');
  };

  deposit = () => {
    this.props.navigation.navigate('depositStack');
  };

  viewRequest = () => {
    console.log('viewRequest');
  };

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  viewLedger = (item) => {
    console.log('notification selected', item);
  };

  FlatListItemSeparator = () => {
    return <View style={BasicStyles.Separator} />;
  };

  test = () => {
    //
  };

  submitRating = (index) => {
    this.setState({
      showRatings: false,
      ratingIndex: index
    })
  }

  rating = () => {
    let stars = []
    for(let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity onPress={() => this.submitRating(i)}>
          <FontAwesomeIcon
          icon={ i <= this.state.ratingIndex ? faStar : faStarRegular}
          size={40}
          style={{
            color: Color.warning
          }}
          key={i}
          />
        </TouchableOpacity>
      )
    }
    return(
      <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row' 
        }}>
        {
          stars
        }
      </View>
    );
  }

  renderTransactionHeader(){
    const {theme} = this.props.state;
    return(
      <View style={{
        flexDirection: 'row',
        paddingBottom: 15,
        paddingTop: 25,
        marginBottom: 10,
        ...BasicStyles.standardContainer
      }}>
        <Text style={{
          fontSize: BasicStyles.standardFontSize,
          fontWeight: 'bold',
          width: '70%'
        }}>
          Transaction History
        </Text>
        <TouchableOpacity
          style={{
            width: '30%'
          }}
          onPress={() => {this.props.onChange("history")
        }}>
          <Text style={{
            width: '100%',
            textAlign: 'right',
            color: theme ? theme.secondary : Color.secondary,
            fontWeight: 'bold'
          }}>View More</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { showRatings, isLoading, history } = this.state;
    const { ledger, theme } = this.props.state;
    return (
      <View>
        <ScrollView 
        showsVerticalScrollIndicator={false}>
          <View style={{
            ...styles.MainContainer,
            marginTop: Platform.OS == 'ios' ? 100 : 60,
            minHeight: height
          }}>

            {
              (ledger != null && ledger.length > 0) && ledger.map((item, index) => (
                <BalanceCard
                  key={index}
                  data={item}
                />
              ))
            }

            <Text style={{
              width: '100%',
              textAlign: 'center',
              paddingTop: 25,
              paddingBottom: 15,
              fontSize: BasicStyles.standardFontSize,
              fontWeight: 'bold'
            }}>
              Start your transaction now
            </Text>

            <View style={{
              flexDirection: 'row',
              width: '90%',
              marginLeft: '5%',
              marginRight: '5%',
              marginTop: 10,
              alignItems: 'center'
            }}>
              <ButtonWithIcon 
                title={'Cash In'}
                onClick={() => {
                  this.props.navigation.navigate('createRequestStack', {
                    data: {
                      type: 'Deposit',
                      description: 'Allow other peers to find your deposits Payhiram',
                      id: 3,
                      money_type: 'e-wallet'
                    }
                  })
                }}
                style={{
                  width: '30%',
                  backgroundColor: theme ? theme.primary : Color.primary,
                }}
                icon={faHandHoldingUsd}
              />   

              <ButtonWithIcon 
                title={'Send Cash'}
                onClick={() => {
                  this.props.navigation.navigate('createRequestStack', {
                    data: {
                      type: 'Send Cash',
                      description: 'Allow other peers to fulfill your transaction when you to send money to your family, friends, or to businesses',
                      id: 1,
                      money_type: 'cash'
                    }
                  })
                }}
                style={{
                  width: '30%',
                  marginLeft: '5%',
                  marginRight: '5%',
                  backgroundColor: theme ? theme.primary : Color.primary,
                }}
                icon={faMoneyBillWave}
              /> 

              <ButtonWithIcon 
                title={'Bills Payment'}
                onClick={() => {
                  this.props.navigation.navigate('createRequestStack', {
                    data: {
                      type: 'Bills and Payment',
                      description: "Don't have time and want to pay your bills? Allow other peers to pay your bills.",
                      id: 4,
                      money_type: 'cash'
                    }
                  })
                }}
                style={{
                  width: '30%',
                  backgroundColor: theme ? theme.primary : Color.primary,
                }}
                icon={faFileInvoice}
              />   
            </View>

            <ButtonWithIcon 
              title={'Send to Wallet(Free)'}
              onClick={() => {
                this.props.navigation.navigate('qrCodeScannerStack', {
                  payload: 'transfer'
                })
              }}
              description={'Transfer money through PayHiram to PayHiram Account'}
              style={{
                width: '90%',
                marginLeft: '5%',
                marginRight: '5%',
                marginTop: 20,
                height: 150,
                backgroundColor: theme ? theme.secondary : Color.secondary,
              }}
              icon={faWallet}
              descriptionStyle={{
                fontSize: BasicStyles.standardFontSize
              }}
            />
            {
              (history && history.length > 0) && this.renderTransactionHeader()
            }

            {
              history && (
                <View style={{
                  ...BasicStyles.standardContainer,
                  marginBottom: 100
                }}>
                  {
                    history.map((item, index) => (
                      <TransactionCard data={item} key={index}/>
                    ))
                  }
                </View>
              )
            }
          </View>
        </ScrollView>
        {isLoading ? <Spinner mode="overlay" /> : null}
        {/* {
          showRatings && (
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 125,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              backgroundColor: theme ? theme.primary : Color.primary,
              width: '100%',
              zIndex: 10
            }}>
              <View style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: theme ? theme.secondary : Color.secondary,
                  fontWeight: 'bold',
                  fontSize: 16,
                  paddingTop: 15,
                  paddingBottom: 15
                }}>RATE YOUR EXPERIENCE</Text>
              </View>

              <View>
                {this.rating()}
              </View>
            </View>
          )
        } */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
});
const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
    setQRCodeModal: (isVisible) => dispatch(actions.setLedger(isVisible))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
