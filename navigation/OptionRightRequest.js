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
  faQrcode,
  faMapMarkerAlt,
  faFilter
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
    const { messenger, notifications, theme, location } = this.props.state;
    const { routeName } = this.props.navigationProps.state;
    return (
      <View style={{
        flexDirection: 'row',
        width: width
      }}>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            backgroundColor: theme ? theme.primary : Color.primary,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10
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
        <TouchableOpacity
          style={{
            width: width - 130,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}
          onPress={() => {
            this.props.navigationProps.navigate('addLocationStack')
          }}>
          <FontAwesomeIcon icon={faMapMarkerAlt} color={theme ? theme.primary : Color.primary} size={20}/>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            paddingLeft: 10
          }}>{location ? location.route + ', ' + location.locality : 'Select Location'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {}}
          underlayColor={Color.secondary}
          >
            <View style={{
              width: '100%',
              flexDirection: 'row',
              position: 'relative'
            }}>
              <FontAwesomeIcon
                icon={faFilter}
                size={20}
                style={{ color: theme ? theme.primary : Color.primary }}
              />
            </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center'
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
                size={20}
                style={{ color: theme ? theme.primary : Color.primary }}
              />
              {
                (notifications && notifications.unread > 0) && (
                  <View style={{
                      backgroundColor: Color.danger,
                      height: 15,
                      width: 15,
                      borderRadius: 7.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      zIndex: 1,
                      right: 10,
                      bottom: 1
                    }}>
                      <Text style={{
                        color: Color.white,
                        fontSize: 8
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
