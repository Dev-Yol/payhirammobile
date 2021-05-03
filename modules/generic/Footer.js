import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUsers, faUser, faClock, faTachometerAlt, faPaperPlane, faMoneyBillWave, faHandshake, faWalking, faHistory, faCogs} from '@fortawesome/free-solid-svg-icons';
import {NavigationActions, StackActions} from 'react-navigation';
import {BasicStyles, Color} from 'common';
import {connect} from 'react-redux';

const gray = '#999';
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
    const { theme, user } = this.props.state;
    return(
      <View
        style={{          
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          height: 50,
          zIndex: 0,
          backgroundColor: theme ? theme.primary : Color.primary,
          borderTopLeftRadius: BasicStyles.standardBorderRadius,
          borderTopRightRadius: BasicStyles.standardBorderRadius
        }}>

        {
          from == 'request' && (
              <View style={{
                flexDirection: 'row',
              }}>
                <TouchableOpacity
                  onPress={() => this.props.onSelect('public', 0)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20%',
                    flexDirection: 'row'
                  }}
                  >

                  <FontAwesomeIcon
                    icon={faUsers}
                    size={18}
                    style={[
                      BasicStyles.iconStyle,
                      {
                        color: selected == 'public' ? Color.white : gray,
                      },
                    ]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.onSelect('personal', 1)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20%',
                    flexDirection: 'row'
                  }}
                  >
                  <FontAwesomeIcon
                    icon={faUser}
                    size={18}
                    style={[
                      BasicStyles.iconStyle,
                      {
                        color: selected == 'personal' ? Color.white : gray,
                      },
                    ]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.onSelect('onNegotiation', 2)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20%',
                    flexDirection: 'row'
                  }}
                  >
                  <FontAwesomeIcon
                    icon={faHandshake}
                    size={18}
                    style={[
                      BasicStyles.iconStyle,
                      {
                        color: selected == 'onNegotiation' ? Color.white : gray,
                      },
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.onSelect('onDelivery', 3)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20%',
                    flexDirection: 'row'
                  }}
                  >
                  <FontAwesomeIcon
                    icon={faWalking}
                    size={18}
                    style={[
                      BasicStyles.iconStyle,
                      {
                        color: selected == 'onDelivery' ? Color.white : gray,
                      },
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.onSelect('history', 4)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '20%',
                    flexDirection: 'row'
                  }}
                  >
                  <FontAwesomeIcon
                    icon={faHistory}
                    size={18}
                    style={[
                      BasicStyles.iconStyle,
                      {
                        color: selected == 'history' ? Color.white : gray,
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            )
        }

        {
          from == 'requestUser' && (
              <View style={{
                flexDirection: 'row',
              }}>
                <TouchableOpacity
                  onPress={() => this.props.onSelect('public', 0)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                    flexDirection: 'row'
                  }}
                  >

                  <FontAwesomeIcon
                    icon={faUsers}
                    size={18}
                    style={[
                      BasicStyles.iconStyle,
                      {
                        color: selected == 'public' ? Color.white : gray,
                      },
                    ]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.onSelect('personal', 1)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                    flexDirection: 'row'
                  }}
                  >
                  <FontAwesomeIcon
                    icon={faUser}
                    size={18}
                    style={[
                      BasicStyles.iconStyle,
                      {
                        color: selected == 'personal' ? Color.white : gray,
                      },
                    ]}
                    />
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
                  icon={faTachometerAlt}
                  size={18}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: selected == 'summary' ? Color.white : gray,
                    },
                  ]}
                />
                <Text style={{
                  paddingLeft: 5,
                  color: selected == 'summary' ? Color.white : gray,
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
                  icon={faClock}
                  size={18}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: selected == 'history' ? Color.white : gray,
                    },
                  ]}
                />
                <Text style={{
                  paddingLeft: 5,
                  color: selected == 'history' ? Color.white : gray,
                }}>History</Text>
              </TouchableOpacity>
            </View>
          )
        }
        {
          from == 'circle' && (
            <View style={{
              flexDirection: 'row',
            }}>
              <TouchableOpacity
                onPress={() => this.props.onSelect('circle')}
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
                      color: selected == 'circle' ? Color.white : gray,
                    },
                  ]}
                />
                <Text style={{
                  paddingLeft: 5,
                  color: selected == 'circle' ? Color.white : gray,
                }}>Circle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.onSelect('invitation')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '50%',
                  flexDirection: 'row'
                }}
                >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  size={BasicStyles.iconSize}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: selected == 'invitation' ? Color.white : gray,
                    },
                  ]}
                />
                <Text style={{
                  paddingLeft: 5,
                  color: selected == 'invitation' ? Color.white : gray,
                }}>Invitation</Text>
              </TouchableOpacity>
            </View>
          )
        }
         
        {
          from == 'settings' && (
            <View style={{
              flexDirection: 'row',
            }}>
              <TouchableOpacity
                onPress={() => this.navigateToScreen('Requests')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '33%',
                  flexDirection: 'row'
                }}
                >
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  size={BasicStyles.iconSize}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: Color.white,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.navigateToScreen('Dashboard')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '34%',
                  flexDirection: 'row'
                }}
                >
                <FontAwesomeIcon
                  icon={faTachometerAlt}
                  size={18}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: Color.white,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.navigateToScreen('Support')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '33%',
                  flexDirection: 'row'
                }}
                >
                <FontAwesomeIcon
                  icon={faUsers}
                  size={18}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: Color.white,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          )
        }

        {
          from == 'support' && (
            <View style={{
              flexDirection: 'row',
            }}>
              <TouchableOpacity
                onPress={() => this.navigateToScreen('Requests')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '33%',
                  flexDirection: 'row'
                }}
                >
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  size={BasicStyles.iconSize}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: Color.white,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.navigateToScreen('Dashboard')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '34%',
                  flexDirection: 'row'
                }}
                >
                <FontAwesomeIcon
                  icon={faTachometerAlt}
                  size={18}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: Color.white,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.navigateToScreen('Settings')}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '33%',
                  flexDirection: 'row'
                }}
                >
                <FontAwesomeIcon
                  icon={faCogs}
                  size={18}
                  style={[
                    BasicStyles.iconStyle,
                    {
                      color: Color.white,
                    },
                  ]}
                />
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
