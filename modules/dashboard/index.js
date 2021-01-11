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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

const transactionData = []

class Dashboard extends Component {
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
    const {user} = this.props.state;
    if (user != null) {
      this.retrieveSummaryLedger();
      this.retrieveLedgerHistory();
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
      account_id: user.id,
      account_code: user.code
    };
    this.setState({isLoading: true});
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      this.setState({isLoading: false});
      if (response != null) {
        setLedger(response.data[0]);
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
      account_id: user.id,
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
    const {user, theme} = this.props.state;
    return(
      <View style={{
        flexDirection: 'row',
        paddingBottom: 15,
        paddingTop: 15,
        borderBottomWidth: 1,
        borderBottomColor: Color.lightGray,
        marginBottom: 25,
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
          onPress={() => {this.redirect("transactionsStack", {user: user})
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
          <View style={[styles.MainContainer, {marginTop: 60, height: height}]}>
            {
              ledger && (
                <BalanceCard
                  data={ledger}
                />
              )
            }

            {
              (history && history.length > 0) && this.renderTransactionHeader()
            }

            {
              history && (
                <View style={BasicStyles.standardContainer}>
                  {
                    history.map((item, index) => (
                      <TransactionCard data={item} key={index}/>
                    ))
                  }
                </View>
              )
            }

            <QRCodeModal redirect={this.redirect} />
          </View>
        </ScrollView>
        {isLoading ? <Spinner mode="overlay" /> : null}
        {
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
        }
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
