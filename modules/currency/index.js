import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { BasicStyles, Color, Routes } from 'common';
import {connect} from 'react-redux';
import Currency from 'services/Currency';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';

class Ledgers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false
    }
  }

  componentDidMount(){
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
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      this.setState({isLoading: false});
      if (response.data != null) {
        this.setState({
          data: response.data
        })
      } else {
        this.setState({
          data: []
        })
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false});
    });
  };

  selectHandler = (item) => {
    const { setLedger } = this.props;
    setLedger(item)
    setTimeout(() => {
      this.props.navigation.pop()
    }, 100)
  };

  render() {
    const { data, isLoading } = this.state;
    const { theme, ledger } = this.props.state;
    return(
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView>
          <View style={{
            width: '100%',
          }}>
          {
            (data && isLoading == false && data.length > 0) && data.map((item) => (
              <TouchableOpacity
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 30,
                  paddingBottom: 30,
                  borderBottomColor: Color.lightGray,
                  borderBottomWidth: 1,
                  backgroundColor: ledger && ledger.currency == item.currency ? (theme ? theme.secondary : Color.secondary) : Color.white
                }}
                onPress={() => {
                  this.selectHandler(item)
                }}>
                <View style={styles.AddressContainer}>
                  <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: BasicStyles.standardFontSize,
                        color: ledger && ledger.currency == item.currency ? Color.white : Color.black
                      }}>
                    {Currency.display(item.available_balance, item.currency)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          }
          {
            isLoading && (<Skeleton size={1} template={'block'} height={50}/>)
          }
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  TermsAndConditionsContainer: {
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '5%',
    marginRight: '5%'
  },
  SectionContainer: {
    width: '100%',
  },
  SectionTitleContainer: {},
  SectionTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
    marginTop: 10
  },
  SectionTwoTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
  },
  SectionDescriptionContainer: {},
  SectionDescriptionTextStyle: {
    textAlign: 'justify',
    fontSize: BasicStyles.standardFontSize
  },
});

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
)(Ledgers);
