import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { BasicStyles, Color, Routes } from 'common';
import {connect} from 'react-redux';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faCheckCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Button from 'components/Form/Button';

class Location extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      loc: null,
      id: null
    }
  }

  componentDidMount(){
    this.retrieveLocationScopes()
    const { part } = this.props.state
  }

  retrieveLocationScopes = () => {
    const {user} = this.props.state;
    if (user == null) {
      return;
    }
    this.setState({isLoading: true});
    Api.request(Routes.retrievelocationScopes, {}, (response) => {
      console.log(response.data.index)
      this.setState({isLoading: false});
      if (response.data != null) {
        this.setState({
          data: response.data,
          id: response.data
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

  selectHandler = (item, index) => {
    this.setState({loc: item})
  };

  setAppoint = () => {
    const { part } = this.props.state
    if(this.state.loc == null){
      return
    }
    const {user} = this.props.state;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      amount: parseFloat(part.item.description.replace(/[^\d\.]/g,'')),
      currency: 'PHP',
      status: 'pending',
      plan:  part.item.value
    };
    console.log('[asdfasd]', parameter)
    this.setState({isLoading: true});
    Api.request(Routes.plansCreate, parameter, (response) => {
      this.setState({isLoading: false});
      if(response.data != null){
        Linking.openURL('https://calendly.com/payhiramph/shortdiscussion')
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false});
    });
  }

  render() {
    const { data, isLoading } = this.state;
    const { theme } = this.props.state;
    return(
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView>
          <View style={{
            width: '100%',
          }}>
            <Text style={{marginTop: '1%', backgroundColor: Color.danger, color: 'white', textAlign: 'center'}}>1. Please select your preferred location to conduct transaction.</Text>
            <Text style={{backgroundColor: Color.danger, color: 'white', textAlign: 'center'}}>2. Click the button below to set an appointment.</Text>
          {
            (data && isLoading == false && data.length > 0) && data.map((item, index) => (
              <TouchableOpacity
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 30,
                  paddingBottom: 30,
                  borderBottomColor: Color.lightGray,
                  borderBottomWidth: 1,
                  backgroundColor: Color.yellow
                }}
                onPress={() => {
                  this.selectHandler(item, index)
                }}
                key={index}>
                <View style={styles.AddressContainer}>
                  <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: BasicStyles.standardFontSize,
                        color: Color.black
                        // color: location && location.currency == item.currency ? Color.white : Color.black
                      }}>
                    {item.route + ', ' + item.city + ', ' + item.region + ', ' + item.country}
                  </Text>
                  {
                    (item.id == this.state.loc?.id) ? (
                      <FontAwesomeIcon style={{
                        borderColor: Color.primary,
                        marginLeft: '90%',
                        top: '90%',
                        marginTop: '-8%'
                      }}
                      icon={faCheck}
                      size={20}
                      color={Color.primary}
                      />
                      ):
                      <FontAwesomeIcon style={{
                        borderColor: Color.white,
                        marginLeft: '90%',
                        top: '90%',
                        marginTop: '-8%'
                      }}
                      icon={faCheck}
                      size={20}
                      color={Color.white}
                      />
                  }
                </View>
              </TouchableOpacity>
            ))
          }
          {
            isLoading && (
              <Skeleton size={2} template={'block'} height={50}/>
            )
          }
          </View>
        </ScrollView>
        <Button
          onClick={() => this.setAppoint()}
          title={'Set an Appointment'}
          style={{
            backgroundColor: theme ? theme.secondary : Color.secondary,
            position: 'absolute',
            bottom: 10,
            left: '5%',
            right: '5%',
            width: '90%'
          }}
        />
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
)(Location);
