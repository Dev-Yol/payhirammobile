import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, TouchableHighlight, Dimensions, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faStar as Solid } from '@fortawesome/free-solid-svg-icons';
import {faStar as Regular} from '@fortawesome/free-regular-svg-icons';
import Button from 'components/Form/Button';
import styles from './TransferFundStyle.js';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import {BasicStyles, Color, Routes} from 'common';
import Api from 'services/api/index.js';
import RequestCard from 'modules/generic/RequestCard';

const height = Math.round(Dimensions.get('window').height);
class TransferFundCard extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedStar: null,
      peer: null
    }
  }
  
  componentDidMount = () => {
    this.retrieve()
  }

  retrieve(){
    const { user } = this.props.state;
    const { messengerGroup } = this.props.state;
    if(user == null || messengerGroup == null){
      return
    }
    let parameter = {
      request_id: messengerGroup.id,
      account_code: user.code,
      account_request_code: messengerGroup.account_id
    };
    this.setState({isLoading: true});
    console.log('[RequestItem] Retrieve parameter', parameter)
    Api.request(Routes.requestPeerRetrieveItem, parameter, (response) => {
      this.setState({isLoading: false});
      console.log('response', response.data.account)
      if (response.data.length > 0) {
        this.setState({
          peer: response.data
        })
      } else {
        this.setState({
          peer: null
        })
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false, peer: null});
    });
  }

  renderStars = () => {
    const starsNumber = [1, 2, 3, 4, 5];
    return starsNumber.map((star, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({selectedStar: index + 1});
          }}
          key={index}
          style={styles.StarContainer}>
          <FontAwesomeIcon
            color={'#FFCC00'}
            icon={Solid}
            size={BasicStyles.iconSize}
            style={{
              color: '#FFCC00',
            }}
          />
        </TouchableOpacity>
      )
    })
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  render() {
    const {user, theme, messengerGroup} = this.props.state
    const { data } = this.props.navigation.state.params;
    return (
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}>
            <View style={{alignItems: 'center'}}>
              {
                (data) && (<RequestCard 
                  data={data}
                  navigation={this.props.navigation}
                />)
              }
            </View>

        </ScrollView>
        <View style={{
            alignItems: 'center',
            backgroundColor: Color.white,
            width: '100%',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 10,
            left: 0
          }}>

            <Button 
              title={'Cancel'}
              onClick={() => console.log('Cancel')}
              style={{
                width: '45%',
                marginRight: '5%',
                backgroundColor: Color.danger,
              }}
            />

            <Button 
              title={'Continue'}
              onClick={() => this.props.navigation.navigate('otpStack', {
                data: {
                  payload: 'transferFund',
                  data: messengerGroup
                }
              })}
              style={{
                width: '45%',
                marginLeft: '5%',
                backgroundColor: theme ? theme.secondary : Color.secondary
              }}
            />
          </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransferFundCard);
