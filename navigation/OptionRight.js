import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, Dimensions, Share, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope,
  faBell,
  faMoneyBillWave,
  faStoreAlt,
  faPlay,
  faCaretSquareRight,
  faBars,
  faShare,
  faQrcode,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { Color, BasicStyles } from 'common';
import Circle from 'modules/circle/index.js';
import { connect } from 'react-redux';
const width = Math.round(Dimensions.get('window').width);
class NavigationDrawerStructureRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null
    }
  }
  goTo = (screen) => {
    this.props.navigationProps.navigate(screen);
  };

  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigationProps.dispatch(navigateAction);
  };

  searchHandler = (value) => {
   this.setState({search: value});
  }

  onShare = async () => {
    const { user } = this.props.state;
    console.log("[SHARE]", user);
    if(user == null){
      return
    }
    try {
      const result = await Share.share({
        message: 'https://payhiram.ph/profile/' + user.code
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  render() {
    const { messenger, notifications, theme } = this.props.state;
    const { routeName } = this.props.navigationProps.state;
    return (
      <View style={{ flexDirection: 'row', width: width, alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            backgroundColor: theme ? theme.primary : Color.primary,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}
          onPress={this.toggleDrawer.bind(this)}
          underlayColor={Color.secondary}
          >
            <FontAwesomeIcon
              icon={faBars}
              size={20}
              style={{ color: '#FFFFFF' }}
            />
        </TouchableOpacity>
        {
          routeName == 'Circle' && (
            <View style={{
              justifyContent: 'center'
            }}>
              <View style={{
                height: 40,
                borderColor: Color.gray,
                borderWidth: 1,
                borderRadius: 25,
                width: '80%',
                position: 'absolute',
                marginLeft: '3%',
                justifyContent: 'center'
              }}>
                <TextInput
                  style={{
                    height: 45,
                    width: '80%'
                  }}
                  onSubmitEditing={() => {this.props.setCircleSearch(this.state.search)}}
                  onChangeText={text => this.searchHandler(text)}
                  value={this.state.search}
                  placeholder='Search circle...'
                />
              </View>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft:  width - 170
                }}
                onPress={() => this.onShare()}
                underlayColor={Color.secondary}
                >
                  <FontAwesomeIcon
                    icon={faShare}
                    size={22}
                    style={{ color: theme ? theme.primary : Color.primary }}
                  />
              </TouchableOpacity>
            </View>
          )
        }
        {
          routeName == 'Dashboard' && (
            <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft:  width - 170
                }}
                onPress={() => this.goTo('qrCodeScannerStack')}
                underlayColor={Color.secondary}
                >
                  <FontAwesomeIcon
                    icon={faQrcode}
                    size={22}
                    style={{ color: theme ? theme.primary : Color.primary }}
                  />
              </TouchableOpacity>
          )
        }
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: (routeName == 'Circle' || routeName == 'Dashboard') ? 10 : width - 110
          }}
          onPress={() => this.props.navigationProps.navigate('notificationStack')}
          underlayColor={Color.secondary}
          >
            <View style={{
              width: '100%',
              flexDirection: 'row',
              position: 'relative'
            }}>
              <FontAwesomeIcon
                icon={faBell}
                size={22}
                style={{ color: theme ? theme.primary : Color.primary }}
              />
              {
                (notifications && notifications.unread > 0) && (
                  <View style={{
                      backgroundColor: Color.danger,
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      zIndex: 1,
                      right: 15,
                      bottom: 1
                    }}>
                      <Text style={{
                        color: Color.white,
                        fontSize: 9
                      }}>{notifications.unread}</Text>
                  </View>
                )
              }
            </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    removeProduct: () => dispatch(actions.removeProduct()),
    setCircleSearch: (circleSearch) => dispatch(actions.setCircleSearch(circleSearch))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationDrawerStructureRight);
