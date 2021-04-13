import React, {Component} from 'react';
import {Text, View, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import Modal from "react-native-modal";
import Button from 'components/Form/Button';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import Currency from 'services/Currency';
const height = Math.round(Dimensions.get('window').height);
class AcceptPayment extends Component {
  constructor(props){
    super(props);
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  onAccept(){

  }

  renderSendTo = (user) => {
    return (
      <View style={{
        width: '100%'
      }}>
      {user  && (
        <View>
          <View style={{
            height: 50,
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderBottomColor: Color.lightGray
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: BasicStyles.standardFontSize
            }}>Request from </Text>
          </View>

          <View style={{
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
          </View>



          <View style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%'
            }}>Account Name</Text>

            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              width: '50%',
              textAlign: 'right',
              fontWeight: 'bold'
            }}
            numberOfLines={1}
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
          borderBottomColor: Color.lightGray
        }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: BasicStyles.standardFontSize
          }}>Summary</Text>
        </View>

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
          }}>Sub Total</Text>

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '40%',
            textAlign: 'right'
          }}>{Currency.display(data.amount, data.currency)}</Text>
        </View>


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
          alignItems: 'center',
          backgroundColor: Color.white,
          width: '100%',
          flexDirection: 'row',
          paddingLeft: 20,
          paddingRight: 20
        }}>
          <Button 
            title={'Decline'}
            onClick={() => {
              this.props.setAcceptPayment(null)
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
    const { data } = this.props;
    return (
      <View>
        <Modal isVisible={this.props.visible}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{
              height: height * 0.6,
              borderRadius: 10,
              width: '90%',
              marginLeft: '5%',
              marginRight: '5%',
              paddingLeft: 20,
              paddingRight: 20,
              backgroundColor: Color.white
            }}>
              {data && this.renderSendTo(JSON.parse(data.from_account))}
              {data && this.renderSummary(data)}
              {data && this.footerOptions()}
            </View>
          </View>
        </Modal>
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
