import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform, Image, Dimensions} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFilter, faBell, faBars} from '@fortawesome/free-solid-svg-icons';
import {NavigationActions, StackActions} from 'react-navigation';
import {BasicStyles, Color, Helper} from 'common';
import {connect} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import Filter from 'modules/filter/FilterSlider';

const width = Math.round(Dimensions.get('window').width);
const gray = '#999';
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        formatted_address: null,
      },
      pinnedLocation: false,
      address: null
    }
  }

  getCurrentLocation = () => {
    Geocoder.init('AIzaSyAxT8ShiwiI7AUlmRdmDp5Wg_QtaGMpTjg');
    let watchID = Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        const currentLocation = {
          longitude: currentLongitude,
          latitude: currentLatitude,
        };
        this.setState({
          region: {
            ...this.state.region,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          pinnedLocation: true,
          address: null,
        });
        // this.onRegionChange(this.state.region);
        console.log('-------------------------------------------TESTING----------------------------------------------', position)
      },
      error => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    )
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
    console.log('[Filter]')
    this.setState({
      filter: !this.state.filter
    })
  }

  render (){
    const { selected, from, setDeviceLocation } = this.props;
    const { theme, notifications, location, deviceLocation } = this.props.state;
    console.log('[TogglerDrawer]', this.props.navigation.toggleDrawer);
    const { filter } = this.state;
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
                width: width - 100,
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
                width: 50,
                height: 50,
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
            // onPress={() => this.redirect('locationWithMapStack')}
            style={{
              width: width,
              marginLeft: 10,
            }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              fontWeight: 'bold',
              width: width - 40,
              color: theme ? theme.primary : Color.primary
            }}
            numberOfLines={1}
            >Click here to set Location</Text>
            {/* >{deviceLocation ? deviceLocation.address + ', ' + deviceLocation.locality + ', ' + deviceLocation.country : 'Click here to set Location.'}</Text> */}
            {/* {defaultAddress ? defaultAddress.route + ', ' + defaultAddress.locality + ', ' + defaultAddress.country : 'Default: ' + location.route + ', ' + location.locality + ', ' + location.country}</Text> */}
            {/* }}>{location ? 'Location: ' + location.route + ', ' + location.locality + ', ' + location.country : 'Current location'}</Text> */}
          </TouchableOpacity>
      </View>
        
    )
  }
};

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setDeviceLocation: (deviceLocation) => dispatch(actions.setDeviceLocation(deviceLocation))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
