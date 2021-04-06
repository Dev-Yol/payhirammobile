import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import Style from './RequestCardStyle';
import Currency from 'services/Currency';
import { Helper, Color, BasicStyles } from 'common';
import Rating from 'components/Rating'
import UserImage from 'components/User/Image';
import Options from 'modules/generic/Dropdown.js';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt, faCalendar, faCircle, faEllipsisH, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Button from 'components/Form/Button';
const width = Math.round(Dimensions.get('window').width);
class RequestCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: false
    }
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  getWidth= () => {
    return (width - 40) * 0.15;
  }

  _header = (item, type) => {
    const { theme, user } = this.props.state;
    return (
      <View>
        <View style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'center',
          marginBottom: 10
        }}>
          <View style={{
            width: '15%',
            justifyContent: 'center'
          }}>
            <UserImage
              user={item.account}
              color={theme ? theme.primary : Color.primary}
              style={{
                width: this.getWidth() - 10,
                height: this.getWidth() - 10,
                borderRadius: ((this.getWidth() - 10) / 2)
              }}
            /> 
          </View>
          <View style={{
            width: '85%'
          }}>
            <View style={{
              flexDirection: 'row',
              width: '100%'
            }}>
              <Text
                style={{
                  color: Color.normalGray,
                  fontWeight: 'bold',
                  fontSize: BasicStyles.standardFontSize,
                  width: '70%'
                }}>
                {item.account?.information ? item.account.information.first_name + ' ' + item.account.information.last_name : item.account.username}
              </Text>
              <View style={{
                width: '30%',
                flexDirection: 'row'
              }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'right',
                    paddingRight: (user && item.account?.code != user.code && item.status == 0) ? 10 : 0,
                    width: (user && item.account?.code != user.code && item.status == 0) ? 'auto' : '100%',
                    fontSize: BasicStyles.standardFontSize
                  }}>
                  {Currency.display(item.amount, item.currency)}
                </Text>
                {
                  (user && item.account?.code != user.code && item.status == 0) && (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({option : !this.state.option})
                      }}
                      style={{
                        paddingTop: 2,
                        width: 30
                      }}
                      >
                      <FontAwesomeIcon icon={faEllipsisV} size={BasicStyles.standardFontSize} color={Color.black}/>
                    </TouchableOpacity>
                  )
                }

              </View>
            </View>

            <Text
              style={{
                ...Style.text,
                fontSize: BasicStyles.standardFontSize - 1,
                color: Color.primary,
                width: '100%'
              }}
              > 
              {Helper.showRequestType(item.type) + ' - FOR ' + item.shipping.toUpperCase()}
            </Text>
            
            <View
              style={{
                width: '100%',
                flexDirection: 'row'
              }}>
                <FontAwesomeIcon icon={faCalendar} size={BasicStyles.standardFontSize} color={Color.gray}/>
                <Text
                  style={{
                    color: Color.normalGray,
                    width: '100%',
                    textAlign: 'left',
                    paddingLeft: 5,
                    fontSize: BasicStyles.standardFontSize - 1
                  }}>
                  {item.needed_on_human}
                </Text>
            </View>
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
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingTop: 2,
                alignItems: 'center',
                width: '100%',
                paddingBottom: '5%'
              }}
              onPress={() => {this.props.navigation.navigate('locationWithMapViewerStack', {data:{latitude: item.location.latitude, longitude: item.location.longitude}})}}
              >
                <View style={{
                  flexDirection: 'row',
                  width: '70%'
                }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} color={Color.gray} />
                  <Text style={{
                    ...Style.text,
                    paddingLeft: 5,
                    fontStyle: 'italic',
                    fontSize: BasicStyles.standardFontSize,
                    width: '90%',
                  }}
                  numberOfLines={1}
                  >
                    {item.location.route}
                  </Text>
                </View>

                <View style={{
                  width: '30%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  <FontAwesomeIcon
                    icon={faCircle}
                    style={{color: theme ? theme.secondary : Color.secondary}}
                    size={6}
                  />
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    ...Style.text,
                    paddingLeft: 5,
                    paddingRight: 0,
                    marginLeft: '0%'
                  }}>
                    {item.distance}
                  </Text>
                </View>
              </TouchableOpacity>
            // </View>
          )
        }
        
      </View>
    );
  };

  _body = (item) => {
    return (
      <View style={{
        paddingTop: 10,
        paddingBottom: 20,
        justifyContent: 'center'
      }}>
        <Text
          style={[
            Style.text,
            {
              textAlign: 'justify',
            }
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
              {
                item.approved == true && (
                  <Button
                    onClick={() => {
                      this.props.navigation.navigate('messagesStack', {
                        data: {
                          id: item.id,
                          title: item.code,
                          payload: 'request',
                          account_id: user.id,
                          request: item,
                          currency: item.currency,
                          amount: item.amount,
                          status: item.status
                        }
                      });
                    }}
                    title={'See transaction'}
                    style={{
                      backgroundColor: theme ? theme.secondary : Color.secondary,
                      width: '60%',
                      marginLeft: '40%',
                      height: 40,
                      borderRadius: 20
                    }}
                    textStyle={{
                      color: Color.white,
                      fontSize: BasicStyles.standardFontSize
                    }}
                  />
                )
              }
              {
                item.approved == false && (
                  <Button
                    onClick={() => {
                      if(item.peer_flag == false){
                        this.props.onConnectRequest(item);
                      }else{
                        this.props.navigation.navigate('requestItemStack', {
                          data: item,
                          from: 'request'
                        })
                      }
                    }}
                    title={item.peer_flag == true ? 'View Proposal' : 'Send Proposal'}
                    style={{
                      backgroundColor: item.peer_flag == true ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary),
                      width: '60%',
                      marginLeft: '40%',
                      height: 40,
                      borderRadius: 20
                    }}
                    textStyle={{
                      color: Color.white,
                      fontSize: BasicStyles.standardFontSize
                    }}
                  />
                )
              }

            </View>
          )}
        </View>
      </View>
    );
  };


  _myFooter = (item) => {
    const {user, theme} = this.props.state;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            marginTop: 10
          }}>
          <View
            style={{
              width: '100%'
            }}>

              <Button
                onClick={() => {
                  if(item.status > 0){
                    this.props.navigation.navigate('messagesStack', {
                      data: {
                        id: item.id,
                        title: item.code,
                        payload: 'request',
                        account_id: user.id,
                        request: item,
                        currency: item.currency,
                        amount: item.amount,
                        status: item.status
                      }
                    });
                  }else{
                    this.props.navigation.navigate('requestItemStack', {
                      data: item,
                      from: 'request'
                    })
                  }
                }}
                title={item.status == 0 ? 'See proposals' : 'See transaction'}
                style={{
                  backgroundColor: item.status == 0 ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary),
                  width: '60%',
                  marginLeft: '40%',
                  height: 40,
                  borderRadius: 20
                }}
                textStyle={{
                  color: Color.white,
                  fontSize: BasicStyles.standardFontSize
                }}
              />
          </View>
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
              {
                item.approved == true && (
                  <Button
                    onClick={() => {
                      this.props.navigation.navigate('messagesStack', {
                        data: {
                          id: item.id,
                          title: item.code,
                          payload: 'request',
                          account_id: user.id,
                          request: item,
                          currency: item.currency,
                          amount: item.amount,
                          status: item.status
                        }
                      });
                    }}
                    title={'See transaction'}
                    style={{
                      backgroundColor: theme ? theme.secondary : Color.secondary,
                      width: '60%',
                      marginLeft: '40%',
                      height: 40,
                      borderRadius: 20
                    }}
                    textStyle={{
                      color: Color.white,
                      fontSize: BasicStyles.standardFontSize
                    }}
                  />
                )
              }
              {
                item.approved == false && (
                  <Button
                    onClick={() => {
                      if(item.peer_flag == false){
                        this.props.onConnectRequest(item);
                      }else{
                        this.props.navigation.navigate('requestItemStack', {
                          data: item,
                          from: 'request'
                        })
                      }
                    }}
                    title={item.peer_flag == true ? 'View Proposal' : 'Send Proposal'}
                    style={{
                      backgroundColor: item.peer_flag == true ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary),
                      width: '60%',
                      marginLeft: '40%',
                      height: 40,
                      borderRadius: 20
                    }}
                    textStyle={{
                      color: Color.white,
                      fontSize: BasicStyles.standardFontSize
                    }}
                  />
                )
              }
            </View>
          )}
        </View>
      </View>
    );
  };
  render() {
    const { data } = this.props;
    console.log('[ratings]', data.rating);
    const { user } = this.props.state;
    const { option } = this.state;
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
        {this._body(data)}
        {this._subHeader(data)}
        {
          option && (
            <Options data={data}></Options>
          )
        }
        
        <View style={{
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: Color.lightGray
        }}>
          <View style={{
            width: '50%',
            height: 60,
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
            {(user && data.account.code == user.code && this.props.from == 'request') && this._myFooter(data)}
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