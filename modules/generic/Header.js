import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform, Image, Dimensions, PermissionsAndroid} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFilter, faBell, faBars} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab, faYoutube } from '@fortawesome/free-brands-svg-icons'
library.add(fab, faYoutube)
import {NavigationActions, StackActions} from 'react-navigation';
import {BasicStyles, Color, Helper} from 'common';
import {connect} from 'react-redux';
import Filter from 'modules/filter/FilterSlider';
import CurrentLoc from 'components/Location/location.js'
import Youtube from 'modules/generic/youtubeModal.js'

const width = Math.round(Dimensions.get('window').width);
const gray = '#999';
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: false
    }
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

  showFilter(){
    this.setState({
      filter: !this.state.filter
    })
  }

  showYoutube(){
    this.setState({
      youtube: !this.state.youtube
    })
  }

  render (){
    const { selected, from } = this.props;
    const { theme, notifications, location, defaultAddress, user } = this.props.state;
    const { filter, youtube } = this.state;
    return(
      <View
        style={{
          width: width,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: Color.white,
          borderBottomColor: Color.lightGray,
          borderBottomWidth: 1
        }}>
          {filter && (
            <Filter
              navigate={this.props.navigation}
              visible={filter}
              close={() => {
                this.setState({
                  filter: false
                })
              }}
            />
          )}
          {
            youtube && (
              <Youtube />
            )
          }
          <View style={{
            width: width,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={() => {this.props.navigation.toggleDrawer(true)}}
              style={{
                flexDirection: 'row',
                paddingTop: 5,
                width: width - 120,
                alignItems: 'center',
                paddingLeft: 10
              }}
              >
              <FontAwesomeIcon icon={faBars} size={22} color={theme ? theme.primary : Color.primary}/>
              <Text style={{
                fontSize: 20,
                color: theme ? theme.primary : Color.primary,
                fontWeight: 'bold',
                paddingLeft: 5
              }}>{Helper.APP_NAME_BASIC.toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => this.showYoutube()}
              underlayColor={Color.secondary}
              >
              <FontAwesomeIcon icon={faYoutube} size={25} color={theme ? theme.primary : Color.primary}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => this.showFilter()}
              underlayColor={Color.secondary}
              >
              <FontAwesomeIcon icon={faFilter} size={18} color={theme ? theme.primary : Color.primary}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
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
          {
            user?.account_type != 'USER' && (
              <CurrentLoc />
            )
          }
          {
            user?.account_type != 'USER' && (
              <TouchableOpacity
                onPress={() => this.redirect('locationWithMapStack')}
                style={{
                  width: width,
                  marginLeft: 10,
                }}>
                <Text style={{
                  fontSize: BasicStyles.standardFontSize,
                  fontWeight: 'bold',
                  width: width - 40
                }}
                numberOfLines={1}
                >{
                  defaultAddress != null 
                  ? 
                    defaultAddress.route
                  :
                    location != null
                    ? 
                      location.address 
                    : 
                      'Set Location'
                }</Text>
              </TouchableOpacity>
            )
          }
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
