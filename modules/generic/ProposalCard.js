import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import styles from './BalanceCardStyle';
import Currency from 'services/Currency';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import { Color } from 'common';
import Rating from 'components/Rating'
import UserImage from 'components/User';
import Button from 'components/Form/Button';

class ProposalCard extends Component {
  constructor(props) {
    super(props);
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


  _footer = (item) => {
    const {user} = this.props.state;
    const { data } = this.props;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          {user.account_type != 'USER' && (
            <View
              style={{
                width: '100%',
                flexDirection: 'row'
              }}>
              <Button
                title={'View Profile'}
                onClick={() => {this.props.navigation.navigate('viewProfileStack', {
                  data: data,
                  selected: item
                })}}
                style={{
                  width: '45%',
                  marginRight: '5%'
                }}
              />
              <Button
                title={'Accept'}
                onClick={() => {this.props.onAcceptRequest()}}
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
    return (
      <View>
        {
          (data.peers && data.peers.peers) && data.peers.peers.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('requestItemStack', {
                  data: item,
                })
              }>
              {item.account && this._header(item, 'amount')}
              {this._body(item)}
              {this._footer(item)}
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