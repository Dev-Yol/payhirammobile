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

const transactionData = [{
  id: 1,
  amount: 500,
  via: '****5678',
  description: 'This is a test',
  date: 'August 9, 2020 5:00 PM',
  currency: 'PHP'
}, {
  id: 2,
  amount: 600,
  via: '****5678',
  description: 'This is a test',
  date: 'August 9, 2020 5:00 PM',
  currency: 'PHP'
}]

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      showRatings: true
    };
  }

  // componentDidMount() {
  // const {user} = this.props.state;
  // if (user != null) {
  //   this.retrieveSummaryLedger();
  // }
  // }

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
    const {setLedger, setUserLedger} = this.props;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      offset: 0,
      limit: 5,
      sort: {
        column: 'created_at',
        value: 'desc',
      },
      value: '%',
      column: 'created_at',
    };
    this.setState({isLoading: true});
    Api.request(Routes.ledgerSummaryRetrieve, parameter, (response) => {
      this.setState({isLoading: false});
      if (response != null) {
        setLedger(response);
        setUserLedger(response.ledger.ledger);
      } else {
        setLedger(null);
        setUserLedger(null);
      }
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
          onPress={() => {this.redirect("transactionsStack")
        }}>
          <Text style={{
            width: '100%',
            textAlign: 'right',
            color: Color.secondary,
            fontWeight: 'bold'
          }}>View More</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { showRatings } = this.state;
    return (
      <View>
        <ScrollView 
        showsVerticalScrollIndicator={false}>
          <View style={[styles.MainContainer, {marginTop: 60, height: height}]}>
            <BalanceCard
              data={{
                amount: 500,
                currency: 'PHP',
                current_amount: 2500
              }}
            />

            {
              this.renderTransactionHeader()
            }

            {
              transactionData && (
                <View style={BasicStyles.standardContainer}>
                  {
                    transactionData.map((item, index) => (
                      <TransactionCard data={item} key={index}/>
                    ))
                  }
                </View>
              )
            }

            
            <QRCodeModal redirect={this.redirect} />
          </View>
        </ScrollView>
        {
          showRatings && (
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 125,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              backgroundColor: Color.primary,
              width: '100%',
              zIndex: 10
            }}>
              <View style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: Color.secondary,
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
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
