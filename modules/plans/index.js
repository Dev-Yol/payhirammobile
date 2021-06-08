import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserShield, faUser, faCheck } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Helper } from 'common';
import { connect } from 'react-redux';
import Button from 'components/Form/Button';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
const height = Math.round(Dimensions.get('window').height);

class Plans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selected: null
    };
  }

  upgradePlan(item){
    const { user } = this.props.state;
    if(user == null || (user?.plan?.status.toLowerCase() == 'pending')){
      Alert.alert(
        'Message',
        'You have pending request, you may upgrade or downgrade account once the request is resolved.',
        [
          {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
        ],
        { cancelable: false }
      )
      return
    }
    let parameter = {
      account_id: user.id,
      plan: item.value,
      amount: item.amount,
      currency: item.currency,
      status: 'pending',
    };
    this.setState({isLoading: true});
    Api.request(Routes.plansCreate, parameter, (response) => {
      this.setState({isLoading: false})
    }, error => {
      this.setState({isLoading: false})
    })
  }

  componentDidMount = () => {
    const { user } = this.props.state
    if(user == null && (user && user.plan == null)){
      return
    }
    console.log('[plan]', user, '[Helper]', Helper.partner)
    let selected = Helper.getPartner(user?.plan?.plan, Helper.partner)
    this.setState({
      selected: selected
    })
  }

  render() {
    const { isLoading, selected } = this.state
    const { user, theme } = this.props.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <View style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: this.props.paddingTop ? this.props.paddingTop : 0,
          width: '100%'
        }}>
          {
            user && user.plan == null && (
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                textAlign: 'justify',
                paddingBottom: 10,
                paddingTop: 10
              }}>
                Hi {user.username}! Be one of our Partners and Grab the chance to earn 80% in every transaction. Enjoy earning! Select the category of partners below and click Apply Now.
              </Text>
            )
          }

          {
            (selected && user && user.plan) && (
              <View
                style={{
                  width: '100%',
                  borderRadius: 12,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: Color.lightGray,
                  marginBottom: 100,
                  marginTop: 25,
                  backgroundColor: theme ? theme.primary : Color.primary
                }}>
                  <View style={{
                    width: '100%'
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FontAwesomeIcon
                        icon={selected.icon} 
                        color={Color.white}
                        />
                      <Text 
                        style={{
                          paddingLeft: 10,
                          color: Color.white
                        }}>
                        {selected.value}
                      </Text>
                    </View>
                    <Text style={{
                      textAlign: 'center',
                      paddingTop: 20,
                      fontWeight: 'bold',
                      color: Color.white,
                      paddingBottom: 10
                    }}>
                      {selected.description}
                    </Text>

                    {
                      selected.items.map((iItem) => (
                        <View style={{
                          flexDirection: 'row',
                          paddingTop: 5,
                          paddingBottom: 5
                        }}>
                          <FontAwesomeIcon icon={faCheck} color={Color.success}/>
                          <Text style={{
                            paddingLeft: 10,
                            color: Color.white
                          }}>{iItem.title}</Text>
                          
                        </View>

                      ))
                    }

                    <View style={{
                        width: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginTop: 10
                      }}>
                        <Button
                          title={user.plan.status.toUpperCase()}
                          onClick={() => {
                          }}
                          style={{
                            width: '35%',
                            backgroundColor: theme ? theme.secondary : Color.secondary,
                            height: 40,
                            marginTop: 5
                          }}
                          textStyle={{
                            fontSize: BasicStyles.standardFontSize,
                            color: Color.white
                          }}
                        />
                    </View>
                  </View>
              </View>
            )
          }
          {
            (user.plan.status === 'approved' && selected && user && user.plan) && (
              <View
                style={{
                  width: '100%',
                  borderRadius: 12,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: Color.lightGray,
                  backgroundColor: theme ? theme.primary : Color.primary,
                  marginTop: '-20%'
                }}>
                  <Text style={{color: Color.white, textAlign: 'center'}}>Message: Do you want to Upgrade or Downgrade your choosen plan? Message us directly at support@payhiram.ph</Text>
              </View>
            )
          }
          {
            (user && user.plan == null) && Helper.partner.map((item, index) => {
              return (
                <View
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: Color.lightGray,
                    marginTop: index == 0 ? 0 : 25,
                    marginBottom: index == (Helper.partner.length - 1) ? 100 : 0 ,
                    backgroundColor: user?.plan?.plan?.toLowerCase() == item.value.toLowerCase() ? (theme ? theme.primary : Color.primary) : Color.white
                  }}
                  key={index}>
                    <View style={{
                      width: '100%'
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FontAwesomeIcon
                          icon={item.icon} 
                          color={user?.plan?.plan?.toLowerCase() == item.value.toLowerCase() ? Color.white : Color.black}
                          />
                        <Text 
                          style={{
                            paddingLeft: 10,
                            color: user?.plan?.plan?.toLowerCase() == item.value.toLowerCase() ? Color.white : Color.black
                          }}>
                          {item.value}
                        </Text>
                      </View>
                      <Text style={{
                        textAlign: 'center',
                        paddingTop: 20,
                        fontWeight: 'bold',
                        color: user?.plan?.plan?.toLowerCase() == item.value.toLowerCase() ? Color.white : Color.black
                      }}>
                        {item.description}
                      </Text>

                      {
                        (user?.plan?.plan?.toLowerCase() == item.value.toLowerCase()) && (
                          <Text style={{
                            color: Color.white,
                            textAlign: 'center',
                            paddingTop: 5,
                          }}>{user?.plan?.status.toUpperCase()}</Text>
                        )
                      }

                      {
                        item.items.map((iItem) => (
                          <View style={{
                            flexDirection: 'row',
                            paddingTop: 5,
                            paddingBottom: 5
                          }}>
                            <FontAwesomeIcon icon={faCheck} color={Color.success}/>
                            <Text style={{
                              paddingLeft: 10,
                              color: user?.plan?.plan?.toLowerCase() == item.value.toLowerCase() ? Color.white : Color.black
                            }}>{iItem.title}</Text>
                            
                          </View>

                        ))
                      }
                      
                      <View style={{
                        width: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                      }}>
                        {
                          (user?.plan?.plan?.toLowerCase() != item.value.toLowerCase()) && (
                            <Button
                              title={'Requirements'}
                              onClick={() => {this.props.navigation.navigate('verificationStack', {type: item.value})}}
                              style={{
                                width: '35%',
                                backgroundColor: theme ? theme.primary : Color.primary,
                                height: 40,
                                marginTop: 5
                              }}
                              textStyle={{
                                fontSize: BasicStyles.standardFontSize,
                                color: Color.white
                              }}
                            />
                          )
                        }
                        
                          {
                            (user.plan == null || user?.plan?.plan?.toLowerCase() != item.value.toLowerCase()) && (
                              <Button
                                title={user?.plan !== null ? (user.plan.amount > item.amount ? 'Downgrade' : 'Upgrade') : 'Apply Now'}
                                onClick={() => {
                                  if(user && user.plan){
                                    this.upgradePlan(item)
                                  }else{
                                    this.props.navigation.navigate('addLocationStack', {
                                      data: item,
                                      payload: 'plans'
                                    })
                                  }
                                }}
                                style={{
                                  width: '35%',
                                  backgroundColor: (user && ((user.plan && user.plan.amount < item.amount) || user.plan == null)) ? (theme ? theme.secondary : Color.secondary) : Color.white,
                                  height: 40,
                                  marginTop: 5,
                                  marginLeft: 5,
                                  borderWidth: (user && ((user.plan && user.plan.amount < item.amount) || user.plan == null)) ? 0 : 1,
                                  borderColor: Color.lightGray
                                }}
                                textStyle={{
                                  fontSize: BasicStyles.standardFontSize,
                                  color: (user && ((user.plan && user.plan.amount < item.amount) || user.plan == null)) ? Color.white : Color.black
                                }}
                              />
                            )
                          }
                      </View>
                    </View>
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plans);

