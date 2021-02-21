import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import Style from './RequestCardStyle';
import Currency from 'services/Currency';
import { Helper, Color, BasicStyles } from 'common';
import Rating from 'components/Rating'
import UserImage from 'components/User';
import {connect} from 'react-redux';

class RequestCard extends Component {
  constructor(props) {
    super(props);
  }

  _header = (item, type) => {
    const { theme } = this.props.state;
    return (
      <View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <UserImage user={item.account} color={theme ? theme.primary : Color.primary}/>
          <Text
            style={{
              color: theme ? theme.primary : Color.primary,
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
                  color: theme ? theme.secondary : Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  lineHeight: 30,
                  width: '100%',
                }}>
                {Currency.display(item.amount, item.currency)}
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

  _subHeader = (item) => {
    const {user, theme} = this.props.state;
    return (
      <View>
        <Text
          style={{
            color: theme ? theme.primary : Color.primary,
          }}>
          {Helper.showRequestType(item.type)}
        </Text>
        {item.coupon != null && parseInt(item.account_id) == user.id && (
          <Text style={Style.text}>
            {item.coupon.type === 'percentage'
              ? item.coupon.amount + '% '
              : Currency.display(item.coupon.amount, item.coupon.currency) +
                ' '}
            Discount({item.coupon.code})
          </Text>
        )}
        {item.max_charge !== null && item.max_charge > 0 && (
          <Text style={Style.text}>
            Suggested Charge -{' '}
            {Currency.display(item.max_charge, item.currency)}
          </Text>
        )}
        <Text style={Style.text}>Posted on {item.created_at_human}</Text>
        {item.location != null && (
          <Text style={Style.text}>
            {item.location.route +
              ', ' +
              item.location.locality +
              ', ' +
              item.location.country}
          </Text>
        )}
        <Text style={Style.text}>Needed on {item.needed_on_human}</Text>
      </View>
    );
  };

  _body = (item) => {
    return (
      <View>
        <Text
          style={[
            Style.text,
            {
              paddingTop: 10,
              paddingBottom: 10,
              textAlign: 'justify',
            },
          ]}>
          {item.reason}
        </Text>
        {item.images != null && (
          <View>
            {item.images.map((image, imageIndex) => {
              return <View></View>;
            })}
          </View>
        )}
      </View>
    );
  };

  _footer = (item) => {
    const {user, theme} = this.props.state;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          {(user.account_type != 'USER') && (
            <View
              style={{
                width: '50%',
                marginLeft: '50%'
              }}>
              <TouchableHighlight
                onPress={() => {
                  if(item.peer_flag == false){
                    this.props.onConnectRequest(item);
                  }else{
                    this.props.navigation.navigate('requestItemStack', {
                      data: item,
                    })
                  }
                }}
                underlayColor={Color.gray}
                style={[BasicStyles.standardButton, 
                  {
                    backgroundColor: theme ? (item.peer_flag == true ? theme.primary : theme.secondary) : (item.peer_flag == true ? Color.primary : Color.secondary)
                  }]}>
                <Text
                  style={{
                    color: Color.white,
                  }}>
                  {item.peer_flag == true ? 'View Proposal' : 'Send Proposal'}
                </Text>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </View>
    );
  };


  _footerRequestItem = (item) => {
    const {user, theme} = this.props.state;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          {(user.account_type != 'USER' && item.peer_flag == false) && (
            <View
              style={{
                width: '50%',
                marginLeft: '50%'
              }}>
              <TouchableHighlight
                onPress={() => {
                  if(item.peer_flag == false){
                    this.props.onConnectRequest(item);
                  }else{
                    this.props.navigation.navigate('requestItemStack', {
                      data: item,
                    })
                  }
                }}
                underlayColor={Color.gray}
                style={[BasicStyles.standardButton, 
                  {
                    backgroundColor: theme ? (item.peer_flag == true ? theme.primary : theme.secondary) : (item.peer_flag == true ? Color.primary : Color.secondary)
                  }]}>
                <Text
                  style={{
                    color: Color.white,
                  }}>
                  {item.peer_flag == true ? 'View Proposal' : 'Send Proposal'}
                </Text>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </View>
    );
  };
  render() {
    const { data } = this.props;
    console.log('[request card]', data)
    const { user } = this.props.state;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('requestItemStack', {
            data: data,
          })
        }>
        {this._header(data, 'amount')}
        {this._subHeader(data)}
        {this._body(data)}
        <View>
          <Rating ratings={data.rating}></Rating>
        </View>
        {(data.account.code != user.code && this.props.from == 'request') && this._footer(data)}
        {(data.account.code != user.code && this.props.from == 'request_item') && this._footerRequestItem(data)}
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestCard);

