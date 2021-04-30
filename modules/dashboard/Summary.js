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
  TouchableOpacity,
  Alert
} from 'react-native';
import {Routes, Color, Helper, BasicStyles} from 'common';
import {Spinner, Empty, SystemNotification} from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import Skeleton from 'components/Loading/Skeleton';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {Dimensions} from 'react-native';
import BalanceCard from 'modules/generic/BalanceCard.js';
import TransactionCard from 'modules/generic/TransactionCard.js';
import QRCodeModal from 'components/Modal/QRCode';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faHandHoldingUsd, faMoneyBillWave, faFileInvoice, faWallet, faQrcode } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import ButtonWithIcon from 'components/Form/ButtonWithIcon';
import Verify from 'modules/generic/Verify'
import BePartner from 'modules/generic/BeAPartner'
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
      history: [],
      currentLedger: null
    };
  }

  componentDidMount() {
    // this.props.setQRCodeModal(false)
    const {user} = this.props.state;
    if (user != null) {
      this.retrieveSummaryLedger();
    }
  }
  
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
      if (response.data != null) {
        // setLedger(response.data.ledger[0]);
        this.setState({
          history: response.data.history,
          currentLedger: response.data.ledger ? response.data.ledger[0] : null
        })
      } else {
        // setLedger(null);
        this.setState({
          history: null,
          currentLedger: null
        })
      }
    }, error => {
      this.setState({isLoading: false, history: null, currentLedger: null});
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

  invalidAcccess(){
    Alert.alert(
      'Message',
      'In order to Create Request, Please Verify your Account.',
      [
        {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
      ],
      { cancelable: false }
    )
  }

  submitRating = (index) => {
    this.setState({
      showRatings: false,
      ratingIndex: index
    })
  }

  alertMessage = () => {
    Alert.alert(
      'Notice',
      'In order to Create Request, Please Verify your Account.',
      [
        {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
      ],
      { cancelable: false }
    )
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
    const { showRatings, isLoading, history, currentLedger } = this.state;
    const { ledger, theme, user } = this.props.state;
    return (
      <View>
        <ScrollView 
        showsVerticalScrollIndicator={false}>
          <View style={{
            ...styles.MainContainer,
            marginTop: Platform.OS == 'ios' ? 60 : 60,
            minHeight: height
          }}>

            {
              (ledger != null && ledger.length > 0) && (
                <BalanceCard
                  data={ledger}
                />
              )
            }
            {
              (currentLedger) && (
                <BalanceCard data={currentLedger}/>
              )
            }
            
            {
              (isLoading) && (
                <Skeleton size={1} template={'block'} height={125}/>
              )
            }

            {
              (isLoading == false) && (
                <TouchableOpacity
                  style={{
                    width: '90%',
                    paddingTop: 20,
                    marginLeft: '5%',
                    marginRight: '5%',
                  }}
                  onPress={() => {this.props.navigation.navigate('currencyStack')
                }}>
                  <Text style={{
                    width: '100%',
                    textAlign: 'center',
                    color: theme ? theme.secondary : Color.secondary,
                    fontWeight: 'bold'
                  }}>View More</Text>
                </TouchableOpacity>
              )
            }

            {
              (user && Helper.checkStatus(user) == false) && 
              (<Verify {...this.props}/>)
            }
            {
              (user && Helper.checkStatus(user) == true && user?.plan == null)&&
              (<BePartner {...this.props} />)
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
                  if(user && Helper.checkStatus(user) == true){
                    this.props.navigation.navigate('createRequestStack', {
                      data: {
                        type: 'Deposit',
                        description: 'Allow other peers to find your deposits Payhiram',
                        id: 3,
                        money_type: 'e-wallet'
                      }
                    })
                  }else{
                    this.invalidAcccess()
                  }
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
                  if(user && Helper.checkStatus(user) == true){
                    this.props.navigation.navigate('createRequestStack', {
                      data: {
                        type: 'Send Cash',
                        description: 'Allow other peers to fulfill your transaction when you to send money to your family, friends, or to businesses',
                        id: 1,
                        money_type: 'cash'
                      }
                    })
                  }else{
                    this.invalidAcccess()
                  }
                  
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
                  if(user && Helper.checkStatus(user) == true){
                    this.props.navigation.navigate('createRequestStack', {
                      data: {
                        type: 'Bills and Payment',
                        description: "Don't have time and want to pay your bills? Allow other peers to pay your bills.",
                        id: 4,
                        money_type: 'cash'
                      }
                    })
                  }else{
                    // alert here
                    this.invalidAcccess()
                  }
                }}
                style={{
                  width: '30%',
                  backgroundColor: theme ? theme.primary : Color.primary,
                }}
                icon={faFileInvoice}
              />   
            </View>

            <View style={{
              flexDirection: 'row',
              width: '90%',
              marginLeft: '5%',
              marginRight: '5%',
              marginTop: 20
            }}>
              <ButtonWithIcon 
                title={'Send to Wallet(FREE)'}
                onClick={() => {
                  this.props.navigation.navigate('qrCodeScannerStack', {
                    payload: 'transfer'
                  })
                }}
                description={'Transfer money through PayHiram to PayHiram Account'}
                style={{
                  width: '49%',
                  marginRight: '1%',
                  height: 150,
                  backgroundColor: theme ? theme.secondary : Color.secondary,
                }}
                icon={faWallet}
                descriptionStyle={{
                  fontSize: BasicStyles.standardFontSize
                }}
              />

              <ButtonWithIcon 
                title={'Scan Payment(FREE)'}
                onClick={() => {
                  this.props.navigation.navigate('qrCodeScannerStack', {
                    payload: 'scan_payment'
                  })
                }}
                description={'Scan qr code from your customer.'}
                style={{
                  width: '49%',
                  marginLeft: '1%',
                  height: 150,
                  backgroundColor: theme ? theme.secondary : Color.secondary,
                }}
                icon={faQrcode}
                descriptionStyle={{
                  fontSize: BasicStyles.standardFontSize
                }}
              />

            </View>
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
              {
                isLoading && (<Skeleton size={2} template={'block'} height={50}/>)
              }
                </View>
              )
            }
          </View>
        </ScrollView>
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
