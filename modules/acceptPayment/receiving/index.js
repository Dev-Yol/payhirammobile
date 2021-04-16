import React, {Component} from 'react';
import {Text, View, TouchableOpacity, TextInput, Dimensions, ScrollView} from 'react-native';
import Modal from "react-native-modal";
import Button from 'components/Form/Button';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import Currency from 'services/Currency';
import Api from 'services/api/index.js';
const height = Math.round(Dimensions.get('window').height);
class AcceptPayment extends Component {
  constructor(props){
    super(props);
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  onAccept(){
    //ledgerAcceptPaymentOnConfirm
    const { acceptPayment } = this.props.state;
    this.props.navigation.navigate('otpStack', {
      data: {
        ...acceptPayment,
        payload: 'acceptPayment'
      }
    })
    // const { setAcceptPayment } = this.props;
    // setAcceptPayment(null)
  }

  renderSendTo = (user, data) => {
    return (
      <View style={{
        width: '100%'
      }}>
      {user  && (
        <View>

          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize + 5,
              width: '100%',
              textAlign: 'center',
              paddingTop: 50,
              fontWeight: 'bold'
            }}>{Currency.display(data.amount, data.currency)}</Text>
          </View>

          {
            data.notes != null && (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: Color.lightGray,
                paddingBottom: 50,
                paddingTop: 15
              }}>
                <Text style={{
                  fontSize: BasicStyles.standardFontSize,
                  width: '100%',
                  textAlign: 'center'
                }}>{'"' + data.notes + '"'}</Text>
              </View>
            )
          }


          <View style={{
            paddingTop: 15,
            justifyContent: 'center',
            width: '100%',
          }}>
            <Text style={{
              textAlign: 'center',
              fontSize: BasicStyles.standardFontSize
            }}>From</Text>
          </View>

          {/*<View style={{
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row'
                    }}>
                      <Text style={{
                        fontSize: BasicStyles.standardFontSize,
                        width: '50%'
                      }}>Account Code</Text>
          
                      <Text style={{
                        fontSize: BasicStyles.standardFontSize,
                        width: '50%',
                        textAlign: 'right',
                        fontWeight: 'bold'
                      }}
                      numberOfLines={1}
                      >****{user.code.substr(user.code.length - 16, user.code.length - 1)}</Text>
                    </View>*/}



          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 15
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '100%',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
            >{user.email}</Text>
          </View>
        </View>
      )}
      </View>
    )
  }

  renderSummary = (data) => {
    return(
      <View style={{
        width: '100%'
      }}>
        <View style={{
          height: 50,
          justifyContent: 'center',
          borderBottomWidth: 1,
          marginTop: 25,
          borderBottomColor: Color.lightGray
        }}>
          <Text style={{
            textAlign: 'center',
            fontSize: BasicStyles.standardFontSize
          }}>Summary</Text>
        </View>

        {/*<View style={{
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: Color.lightGray,
                  flexDirection: 'row'
                }}>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    width: '60%'
                  }}>Sub Total</Text>
        
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    width: '40%',
                    textAlign: 'right'
                  }}>{Currency.display(data.amount, data.currency)}</Text>
                </View>*/}



        <View style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray,
          flexDirection: 'row'
        }}>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '60%'
          }}>Processing fee {data.charge ? ' (Free)' : null}</Text>

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '40%',
            textAlign: 'right'
          }}>{Currency.display(data.charge, data.currency)}</Text>
        </View>



        <View style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '60%',
            fontWeight: 'bold'
          }}>Total</Text>

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '40%',
            fontWeight: 'bold',
            textAlign: 'right'
          }}>{Currency.display((parseFloat(data.amount) - parseFloat(data.charge)), data.currency)}</Text>
        </View>
      </View>
    )
  }

  footerOptions = (data) => {
    const { theme } = this.props.state;
    return (
      <View style={{
          backgroundColor: Color.white,
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          bottom: 10,
          left: 0
        }}>
          <Button 
            title={'Decline'}
            onClick={() => {
              this.props.setAcceptPayment(null)
              this.props.navigation.pop()
            }}
            style={{
              width: '45%',
              marginRight: '5%',
              backgroundColor: Color.danger,
            }}
          />

          <Button 
            title={'Accept'}
            onClick={ () => this.onAccept()}
            style={{
              width: '45%',
              marginLeft: '5%',
              backgroundColor: theme ? theme.secondary : Color.secondary
            }}
          />
        </View>
      );
  }

  render(){
    const { acceptPayment } = this.props.state;
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        
          <ScrollView
            style={{
              width: '100%'
            }}
            showsVerticalScrollIndicator={false}>
              <View style={{
                borderRadius: 10,
                width: '96%',
                marginLeft: '2%',
                marginRight: '2%',
                paddingLeft: 20,
                paddingRight: 20,
                height: height
              }}>
                {acceptPayment && this.renderSendTo(JSON.parse(acceptPayment.from_account), acceptPayment)}
                {acceptPayment && this.renderSummary(acceptPayment)}
              </View>
          </ScrollView>

          {acceptPayment && this.footerOptions()}
      </View>
    );
  }
}

 
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setAcceptPayment: (acceptPayment) => dispatch(actions.setAcceptPayment(acceptPayment))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AcceptPayment);
