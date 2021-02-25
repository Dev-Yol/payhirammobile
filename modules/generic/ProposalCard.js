import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import styles from './BalanceCardStyle';
import Currency from 'services/Currency';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import { Color, Routes } from 'common';
import Rating from 'components/Rating'
import UserImage from 'components/User';
import Button from 'components/Form/Button';
import Api from 'services/api/index.js';

class ProposalCard extends Component {
  constructor(props) {
    super(props);
  }


  withdrawAlert(item){
    Alert.alert(
      'Confirmation Message!',
      "You're attempting to withdraw your proposal, do you want to continue this action?",
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          // delete here
          let parameter = {
            id: item.id
          }
          this.props.onLoading(true)
          Api.request(Routes.requestPeerDelete, parameter, response => {
            this.props.onLoading(false)
            this.props.onRetrieve()
          }, 
            error => {
              this.props.onLoading(false)
              //
            });
        }},
      ],
      { cancelable: false }
    )
  }

  change(item){
    this.props.onChangeTerms(item)
  }


  _header = (item, type) => {
    console.log('item', item)
    return (
      <View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <UserImage user={item.account} />
          <Text
            style={{
              color: Color.primary,
              lineHeight: 30,
              paddingLeft: 10,
              width: '40%',
            }}>
            {item?.account?.username}
          </Text>
          <View
            style={{
              width: '50%',
            }}>
            {type == 'amount' && (
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  lineHeight: 30,
                  width: '100%',
                }}>
                {Currency.display(item.charge, item.currency)}
              </Text>
            )}
            {type == 'rating' && (
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-end',
                }}>
                <Rating ratings={item.rating}></Rating>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  _body = (item) => {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{
          width: '70%',
          justifyContent: 'center',
        }}>
          <Rating ratings={''} style={[{flex: 2}]}></Rating>
        </View>
        
        <View style={{
          width: '30%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <FontAwesomeIcon
            icon={faCircle}
            style={{color: Color.secondary, marginHorizontal: 10}}
            size={10}
          />
          <Text>{item.distance}</Text>
        </View>
      </View>
    );
  };


  _footer = (item, index) => {
    const {user} = this.props.state;
    const { data, request } = this.props;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
            {
              (request && request.status == 0) && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row'
                  }}>
                  <Button
                    title={'View Profile'}
                    onClick={() => {this.props.navigation.navigate('viewProfileStack', {
                      user: item.account,
                      rating: item.rating
                    })}}
                    style={{
                      width: '45%',
                      marginRight: '5%'
                    }}
                  />
                  <Button
                    title={'Accept'}
                    onClick={() => {this.props.onAcceptRequest(item)}}
                    style={{
                      width: '45%',
                      marginLeft: '5%',
                      backgroundColor: Color.secondary
                    }}
                  />
                </View>
              )
            }
            {
              (item.status == 'approved') && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row'
                  }}>
                  <Button
                    title={'Approved'}
                    onClick={() => {}}
                    style={{
                      width: '45%',
                      backgroundColor: Color.white,
                      borderColor: Color.lightGray,
                      borderWidth: 1,
                      marginRight: '5%'
                    }}
                    textStyle={{
                      color: Color.black
                    }}
                  />

                  <Button
                    title={'View Profile'}
                    onClick={() => {this.props.navigation.navigate('viewProfileStack', {
                      user: item.account,
                      rating: item.rating
                    })}}
                    style={{
                      width: '45%',
                      marginRight: '5%'
                    }}
                  />
                </View>
              )
            }

        </View>
      </View>
    );
  };

  _myFooter = (item, index) => {
    const {user} = this.props.state;
    const { data, request } = this.props;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          {(user.account_type != 'USER' && request.status == 0) && (
            <View
              style={{
                width: '100%',
                flexDirection: 'row'
              }}>
              <Button
                title={'Withdraw Proposal'}
                onClick={() => {this.withdrawAlert(item)}}
                style={{
                  width: '45%',
                  marginRight: '5%',
                  backgroundColor: Color.danger
                }}
              />
              <Button
                title={'Change Terms'}
                onClick={() => {this.change(item)}}
                style={{
                  width: '45%',
                  marginLeft: '5%',
                  backgroundColor: Color.secondary
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  render() {
    const { data } = this.props;
    const { user } = this.props.state;
    return (
      <View>
        {
          (data) && data.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('requestItemStack', {
                  data: item,
                  from: 'request'
                })
              }>
              {item.account && this._header(item, 'amount')}
              {this._body(item)}
              {(item.account_id != user.id) && this._footer(item, index)}
              {(item.account_id == user.id) && this._myFooter(item, index)}
            </TouchableOpacity>
          ))
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposalCard);