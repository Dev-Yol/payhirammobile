import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform, Image, Dimensions} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFilter, faBell} from '@fortawesome/free-solid-svg-icons';
import {NavigationActions, StackActions} from 'react-navigation';
import {BasicStyles, Color, Helper} from 'common';
import {connect} from 'react-redux';

const width = Math.round(Dimensions.get('window').width);
const gray = '#999';
class Header extends Component {
  constructor(props) {
    super(props);
  }

  redirect(route, layer){
    this.props.navigation.navigate(route)
  }

  navigateToScreen = (route) => {
    this.props.navigation.toggleDrawer();
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
            NavigationActions.navigate({routeName: route, params: {
              initialRouteName: route,
              index: 0
            }}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render (){
    const { selected, from } = this.props;
    const { theme, notifications, location } = this.props.state;
    return(
      <View
        style={{
          width: width,
          position: 'absolute',
          top: 0,
          zIndex: 0,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: Color.white,
          borderBottomColor: Color.lightGray,
          borderBottomWidth: 1
        }}>
          <View style={{
            width: width,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.toggleDrawer()}
              style={{
                flexDirection: 'row',
                paddingTop: 5,
                width: width - 100
              }}
              >
              <Image source={require('assets/logo.png')} style={{
                width: 30,
                height: 30,
                marginLeft: 10
              }}/>
              <Text style={{
                fontSize: 20,
                color: theme ? theme.primary : Color.primary,
                fontWeight: 'bold',
                paddingLeft: 5
              }}>{Helper.APP_NAME_BASIC.toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => {}}
              underlayColor={Color.secondary}
              >
              <FontAwesomeIcon icon={faFilter} size={18} color={theme ? theme.primary : Color.primary}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => this.redirect('notificationStack')}
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
          <TouchableOpacity
            onPress={() => this.redirect('addLocationStack')}
            style={{
              width: width,
              marginLeft: 10,
              marginTop: 5,
            }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              fontWeight: 'bold',
              color: theme ? theme.primary : Color.white
            }}>{location ? 'Location: ' + location.route + ', ' + location.locality + ', ' + location.country : 'Current location'}</Text>
          </TouchableOpacity>
      </View>
        
    )
  }
};

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
