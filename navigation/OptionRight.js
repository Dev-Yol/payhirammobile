import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, Dimensions, Share } from 'react-native';
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
  faQrcode
} from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { Color, BasicStyles } from 'common';

import { connect } from 'react-redux';
const width = Math.round(Dimensions.get('window').width);
class NavigationDrawerStructureRight extends Component {
  constructor(props) {
    super(props);
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

  onShare = async () => {
    const { user } = this.props.state;
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
      <View style={{ flexDirection: 'row', width: width }}>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            backgroundColor: theme ? theme.primary : Color.primary,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
            marginTop: 10
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
            <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft:  width - 170,
                  marginTop: 10
                }}
                onPress={() => this.onShare()}
                underlayColor={Color.secondary}
                >
                  <FontAwesomeIcon
                    icon={faShare}
                    size={30}
                    style={{ color: Color.gray }}
                  />
              </TouchableOpacity>
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
                  marginLeft:  width - 170,
                  marginTop: 10
                }}
                onPress={() => this.goTo('qrCodeScannerStack')}
                underlayColor={Color.secondary}
                >
                  <FontAwesomeIcon
                    icon={faQrcode}
                    size={30}
                    style={{ color: Color.gray }}
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
            marginLeft: (routeName == 'Circle' || routeName == 'Dashboard') ? 10 : width - 110,
            marginTop: 10
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
                size={30}
                style={{ color: Color.gray }}
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
                      right: 10,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationDrawerStructureRight);
