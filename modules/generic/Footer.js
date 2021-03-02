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
    const { selected, from } = this.props;
    const { theme } = this.props.state;
    return(
      <View
        style={{          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          height: 60,
          zIndex: 0,
          backgroundColor: theme ? theme.primary : Color.primary,
          borderTopLeftRadius: BasicStyles.standardBorderRadius,
          borderTopRightRadius: BasicStyles.standardBorderRadius,
          ...BasicStyles.standardShadow
        }}>

        {
          from == 'request' && (
              <View style={{
                flexDirection: 'row',
              }}>
                <TouchableOpacity
                  onPress={() => this.props.onSelect('public')}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                    flexDirection: 'row'
                  }}
                  >

                  <FontAwesomeIcon
                    icon={faUsers}
                    size={BasicStyles.iconSize}
                    style={[
                      BasicStyles.iconStyle,
                      {
                        color: selected == 'public' ? Color.white : Color.gray,
                      },
                    ]}
                  />
                  <Text style={{
                    paddingLeft: 5,
                    color: selected == 'public' ? Color.white : Color.gray,
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
                        color: selected == 'personal' ? Color.white : Color.gray,
                      },
                    ]}
                  />
                  <Text style={{
                    paddingLeft: 5,
                    color: selected == 'personal' ? Color.white : Color.gray,
                  }}>Personal</Text>
                </TouchableOpacity>
              </View>
            )
        }
        
        {
          from == 'dashboard' && (
            <View style={{
              flexDirection: 'row',
            }}>
              <TouchableOpacity
                onPress={() => this.props.onSelect('summary')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '50%',
                  flexDirection: 'row'
                }}
                >
                <FontAwesomeIcon
                  icon={faUsers}
                  size={BasicStyles.iconSize}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: selected == 'summary' ? Color.white : Color.gray,
                    },
                  ]}
                />
                <Text style={{
                  paddingLeft: 5,
                  color: selected == 'summary' ? Color.white : Color.gray,
                }}>Summary</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.onSelect('history')}
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
                      color: selected == 'history' ? Color.white : Color.gray,
                    },
                  ]}
                />
                <Text style={{
                  paddingLeft: 5,
                  color: selected == 'history' ? Color.white : Color.gray,
                }}>History</Text>
              </TouchableOpacity>
            </View>
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
)(Footer);
