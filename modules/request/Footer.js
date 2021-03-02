import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUsers, faUser} from '@fortawesome/free-solid-svg-icons';
import {NavigationActions, StackActions} from 'react-navigation';
import {BasicStyles, Color} from 'common';
import {connect} from 'react-redux';


class Footer extends Component {
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
    const { selected } = this.props;
    return(
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          height: 50,
          zIndex: 0,
          backgroundColor: Color.white,
          borderTopColor: Color.gray,
          borderTopWidth: 0.5
        }}>

          <TouchableOpacity
            onPress={() => this.props.onSelect('public')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
              flexDirection: 'row',
              borderRightColor: Color.gray,
              borderRightWidth: 1
            }}
            >

            <FontAwesomeIcon
              icon={faUsers}
              size={BasicStyles.iconSize}
              style={[
                BasicStyles.iconStyle,
                {
                  color: selected == 'public' ? Color.primary : Color.gray,
                },
              ]}
            />
            <Text style={{
              paddingLeft: 5,
              color: selected == 'public' ? Color.primary : Color.gray,
            }}>Public</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.onSelect('personal')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
              flexDirection: 'row'
            }}
            >
            <FontAwesomeIcon
              icon={faUser}
              size={BasicStyles.iconSize}
              style={[
                BasicStyles.iconStyle,
                {
                  color: selected == 'personal' ? Color.primary : Color.gray,
                },
              ]}
            />
            <Text style={{
              paddingLeft: 5,
              color: selected == 'personal' ? Color.primary : Color.gray,
            }}>Personal</Text>
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
)(Footer);
