import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import Style from './RequestCardStyle';
import Currency from 'services/Currency';
import { Helper, Color, BasicStyles } from 'common';
import Rating from 'components/Rating'
import UserImage from 'components/User';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt, faCalendar, faCircle } from '@fortawesome/free-solid-svg-icons';
const width = Math.round(Dimensions.get('window').width);
class RequestCard extends Component {
  constructor(props) {
    super(props);
  }

  _header = (item, type) => {
    const { theme } = this.props.state;
    return (
      <View>
        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center', marginBottom: 10}}>
          <View style={{
            width: '50%',
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            <View style={{
              width: '10%',
              justifyContent: 'center'
            }}>
              <UserImage
                user={item.account}
                color={theme ? theme.primary : Color.primary}
                style={{
                  width: 22,
                  height: 22
                }}
            />
            </View>
            <View style={{
              width: '90%'
            }}>
              <Text
                style={{
                  color: Color.normalGray,
                  paddingLeft: 10,
                  fontWeight: 'bold',
                  fontSize: BasicStyles.standardFontSize
                }}>
                {item.account?.information ? item.account.information.first_name + ' ' + item.account.information.last_name : item.account.username}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10,
              }}>
                <FontAwesomeIcon icon={faCalendar} size={BasicStyles.standardFontSize} color={Color.gray}/>
                <Text
                  style={{
                    ...Style.text,
                    paddingLeft: 10,
                    fontSize: BasicStyles.standardFontSize - 1,
                    paddingTop: 2,
                  }}
                  >
                  {item.needed_on_human}
                </Text>
              </View>
              
            </View>
          </View>
          <View
            style={{
              width: '50%'
            }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'right',
                  width: '100%',
                  fontSize: BasicStyles.standardFontSize
                }}>
                {Currency.display(item.amount, item.currency)}
              </Text>
              <Text
                style={{
                  color: Color.normalGray,
                  width: '100%',
                  textAlign: 'right',
                  paddingTop: 2,
                  fontSize: BasicStyles.standardFontSize - 1
                }}>
                {Helper.showRequestType(item.type) + '(' + item.shipping.toUpperCase() +') - ' + Helper.showStatus(item.status)}
              </Text>
          </View>
        </View>
      </View>
    );
  };

  _subHeader = (item) => {
    const {user, theme} = this.props.state;
    return (
      <View>
        {item.coupon != null && parseInt(item.account_id) == user.id && (
          <Text style={{
            ...Style.text,
            fontSize: BasicStyles.standardFontSize
          }}>
            {item.coupon.type === 'percentage'
              ? item.coupon.amount + '% '
              : Currency.display(item.coupon.amount, item.coupon.currency) +
                ' '}
            Discount({item.coupon.code})
          </Text>
        )}
        {item.max_charge !== null && item.max_charge > 0 && (
          <Text style={{
            ...Style.text,
            fontSize: BasicStyles.standardFontSize
            }}>
            Suggested Charge -{' '}
            {Currency.display(item.max_charge, item.currency)}
          </Text>
        )}
        {/*<Text style={Style.text}>Posted on {item.created_at_human}</Text>*/}
        {
          item.location != null && (
            <View style={{
              flexDirection: 'row',
              paddingTop: 2,
              alignItems: 'center',
              width: '100%'
            }}>
              <FontAwesomeIcon
                icon={faCircle}
                style={{color: theme ? theme.secondary : Color.secondary}}
                size={10}
              />
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                ...Style.text,
                paddingLeft: 5,
                paddingRight: 5
              }}>
                {item.distance}
              </Text>
              <FontAwesomeIcon icon={faMapMarkerAlt} color={Color.gray} />
              <Text style={{
                ...Style.text,
                paddingLeft: 5,
                fontStyle: 'italic',
                fontSize: BasicStyles.standardFontSize,
                width: '75%'
              }}
              numberOfLines={1}
              >
                {item.location.route}
              </Text>
            </View>
          )
        }
        
      </View>
    );
  };

  _body = (item) => {
    return (
      <View style={{
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'center'
      }}>
        <Text
          style={[
            Style.text,
            {
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
            marginTop: 10
          }}>
          {(user.account_type != 'USER') && (
            <View
              style={{
                width: '100%'
              }}>
              <TouchableHighlight
                onPress={() => {
                  if(item.peer_flag == false){
                    this.props.onConnectRequest(item);
                  }else{
                    this.props.navigation.navigate('requestItemStack', {
                      data: item,
                      from: 'request'
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
                    fontSize: BasicStyles.standardFontSize
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
            marginTop: 10
          }}>
          {(user.account_type != 'USER' && item.peer_flag == false) && (
            <View
              style={{
                width: '100%'
              }}>
              <TouchableHighlight
                onPress={() => {
                  if(item.peer_flag == false){
                    this.props.onConnectRequest(item);
                  }else{
                    this.props.navigation.navigate('requestItemStack', {
                      data: item,
                      from: 'request'
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
    const { user } = this.props.state;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('requestItemStack', {
            data: data,
            from: 'request'
          })
        }
        >
        {this._header(data, 'amount')}
        {this._subHeader(data)}
        {this._body(data)}
        <View style={{
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: Color.lightGray
        }}>
          <View style={{
            width: '50%',
            height: 70,
            justifyContent: 'center'
          }}>
          {
            data.rating != null ? (
              <Rating ratings={data?.rating}></Rating>
            ):(
              <View></View>
            )
          }
          </View>
          <View style={{
            width: '50%'
          }}>
            {(user && data.account.code != user.code && this.props.from == 'request') && this._footer(data)}
            {(user && data.account.code != user.code && this.props.from == 'request_item') && this._footerRequestItem(data)}
          </View>
        </View>
        
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