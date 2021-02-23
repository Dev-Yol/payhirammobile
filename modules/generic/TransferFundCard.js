import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, TouchableHighlight } from 'react-native';
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
    const {peer} = this.state
    return (
      <SafeAreaView>
        <View style={{alignItems: 'center'}}>
          <RequestCard 
            data={peer}
            navigation={this.props.navigation}
            />
        </View>
        {/* <View style={{flexDirection: 'row', marginTop: 10}}> */}
          {/* <UserImage user={item.account} color={theme ? theme.primary : Color.primary}/> */}
          {/* <Text
            style={{
              color: theme ? theme.primary : Color.primary,
              lineHeight: 30,
              paddingLeft: 10,
              width: '40%',
            }}>
            {messengerGroup?.username}
          </Text>
          <View
            style={{
              width: '50%',
            }}> */}
            {/* {type == 'amount' && ( */}
              {/* <Text
                style={{
                  color: theme ? theme.secondary : Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  lineHeight: 30,
                  width: '100%',
                }}>
                {Currency.display(messengerGroup.amount, messengerGroup.currency)}
              </Text> */}
            {/* )} */}
            {/* {type == 'rating' && (
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-end',
                }}> */}
                {/* <Rating ratings={item.rating}></Rating> */}
              {/* </View> */}
            {/* )} */}
          {/* </View>
        </View> */}
        <View
          style={[
            {
              paddingTop: 20,
              paddingBottom: 20,
              alignItems: 'center'
            }
          ]}
        >
         {
            user.profile != null && user.profile.url != null && (
              <Image
                source={{uri: Config.BACKEND_URL  + user.profile.url}}
                style={BasicStyles.profileImageSize}/>
            )
          }
          {
            (user.profile == null || (user.profile != null && user.profile.url == null)) && (
              <FontAwesomeIcon
                icon={faUserCircle}
                size={BasicStyles.profileIconSize + 30}
                style={{
                  color: theme ? theme.primary : Color.primary
                }}
              />
            )
          }
          <Text style={{
            marginTop: 10,
            color: theme ? theme.primary : Color.primary
          }}> {user.username} </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center'
          }}
        >
          {
            this.renderStars()
          }
        </View>
          {/* <Text style={{justifyContent: 'center', marginTop: 20, textAlign: 'center', fontWeight: 'bold'}}>Are you sure you want to Transfer?</Text> */}
          <View style={{flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginTop: 70}}>
            <View style={{width: 100, height: 50, marginLeft: 40}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Currency</Text>
            </View>
            <View style={{width: 100, height: 50, marginLeft: 40}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Amount</Text>
            </View>
          </View>
          <View style={{flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end'}}>
            <View style={{width: 100, height: 50}}>
              <Text>{this.props.state.messengerGroup.currency}</Text>
            </View>
            <View style={{width: 100, height: 50}}>
              <Text>{this.props.state.messengerGroup.amount}</Text>
            </View>
          </View>
          <View style={{
            alignItems: 'center',
            backgroundColor: Color.white,
            width: '90%',
            marginLeft: '5%',
            marginRight: '5%',
            marginTop: '100%'
          }}>

            <Button 
              title={'Cancel'}
              onClick={() => console.log('Cancel')}
              style={{
                width: '45%',
                marginRight: '50%',
                backgroundColor: Color.danger,
              }}
            />

            <Button 
              title={'Continue'}
              onClick={() => this.props.nav.navigate('otpStack', {
                data: {
                  payload: 'transferFund',
                  data: messengerGroup
                }
              })}
              style={{
                marginTop: -50,
                width: '45%',
                marginLeft: '50%',
                backgroundColor: theme ? theme.secondary : Color.secondary
              }}
            />
          </View>
      </SafeAreaView>
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
