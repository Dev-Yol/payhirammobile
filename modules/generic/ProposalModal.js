import React, { Component } from 'react';
import { Text, View, TouchableHighlight, ScrollView, TextInput, Dimensions, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { Picker } from '@react-native-community/picker';
import { connect } from 'react-redux';
import BalanceCard from 'modules/generic/BalanceCard';
import Style from './ProposalModalStyle';
import { BasicStyles, Color, Helper, Routes } from 'common'
import TextInputWithLabel from 'components/Form/TextInputWithLabel';
import PickerWithLabel from 'components/Form/PickerWithLabel';
import Button from 'components/Form/Button';
import Modal from 'react-native-modal';
import Currency from 'services/Currency';
import Api from 'services/api/index.js';

const height = Math.round(Dimensions.get('window').height)
class ProposalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currency: 'PHP',
        charge: 0
    };
  }
  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  check = () => {
    Alert.alert(
      'Alert',
      'Please fill in all fields.',
      [
        {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
      ],
      { cancelable: false }
    )
  } 

  submit(){
    const { user, ledger, request } = this.props.state;
    const { charge, currency } = this.state;
    if(user == null || ledger == null || request == null){
      return
    }
    if(charge <= 0 || currency == null){
      return
    }
    let parameter = {
      request_id: request.id,
      currency: currency,
      charge: charge,
      status: 'requesting',
      account_id: user.id
    }
    this.props.loading(true)
    Api.request(Routes.requestPeerCreate, parameter, (response) => {
      this.props.loading(false)
      this.props.closeModal()
      this.props.navigation.navigate('requestItemStack', {data: this.props.data})
    },
    error => {
      this.props.loading(false)
    }
    );
  }

  renderContent() {
    const { ledger, theme } = this.props.state;
    return (
      <View style={[Style.CreateRequestContainer, {
          width: '100%',
          height: '100%',
          flex: 1
      }]}>
        <ScrollView style={{
            width: '100%',
            height: '100%',
          }}
          showsVerticalScrollIndicator={false}
          >
          <View style={{
            height: height,
          }}>
            {
              ledger && (
                <BalanceCard
                  data={ledger}
                />
              )
            }
            

              <View style={{
                height: height,
                width: '90%',
                marginLeft: '5%',
                marginRight: '5%'
              }}>
                  <PickerWithLabel
                    label={'Select Currency'}
                    data={Helper.currency}
                    placeholder={'Click to select'}
                    onChange={(value) => this.setState({
                      currency: value
                    })}
                    required={true}
                    onError={false}
                  />

                    <TextInputWithLabel 
                    variable={this.state.charge}
                    onChange={(value) => this.setState({charge: value})}
                    label={'Amount'}
                    placeholder={'Amount'}
                    onError={false}
                    required={true}
                    keyboardType={'numeric'}
                    />

                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    paddingTop: 15,
                    paddingBottom: 15,
                  }}>
                    <Text style={{
                      width: '50%',
                      textAlign: 'left',
                      fontSize: BasicStyles.standardFontSize
                    }}>
                      Your share
                    </Text>
                    <Text style={{
                        width: '50%',
                        textAlign: 'right',
                        fontSize: BasicStyles.standardFontSize,
                        fontWeight: 'bold'
                      }}>
                      {
                        Currency.display(parseFloat(this.state.charge * Helper.partnerShare).toFixed(2), 'PHP')
                      }
                    </Text>
                  </View>

                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    paddingTop: 15,
                    paddingBottom: 15,
                  }}>
                    <Text style={{
                      width: '50%',
                      textAlign: 'left',
                      fontSize: BasicStyles.standardFontSize
                    }}>
                      Payhiram's share
                    </Text>
                    <Text style={{
                        width: '50%',
                        textAlign: 'right',
                        fontSize: BasicStyles.standardFontSize,
                        fontWeight: 'bold'
                      }}>
                      {
                        Currency.display(parseFloat(this.state.charge * Helper.payhiramShare).toFixed(2), 'PHP')
                      }
                    </Text>
                  </View>


                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    paddingTop: 15,
                    paddingBottom: 15,
                    borderBottomWidth: 0.5,
                    borderTopWidth: 0.5,
                    borderColor: Color.lightGray,
                    marginTop: 10
                  }}>
                    <Text style={{
                      width: '50%',
                      textAlign: 'left',
                      fontSize: BasicStyles.standardFontSize
                    }}>
                      Total
                    </Text>
                    <Text style={{
                        width: '50%',
                        textAlign: 'right',
                        fontSize: BasicStyles.standardFontSize,
                        fontWeight: 'bold',
                        color: theme ? theme.secondary : Color.secondary
                      }}>
                      {
                        Currency.display(this.state.charge, 'PHP')
                      }
                    </Text>
                  </View>

              </View>
            </View>
          </ScrollView>
          <View
            style={Style.BottomContainer}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 5,
              paddingTop: 5
            }}>

              <Button 
                title={'Cancel'}
                onClick={() => this.props.closeModal()}
                style={{
                  width: '45%',
                  marginRight: '5%',
                  backgroundColor: Color.danger,
                }}
              />


              <Button 
                title={'Continue'}
                onClick={() => {this.state.charge != 0 || this.state.charge != '' ? this.submit() : this.check()}}
                style={{
                  width: '45%',
                  marginLeft: '5%',
                  backgroundColor: theme ? theme.secondary : Color.secondary
                }}
              />

            </View>
          </View>
      </View >
    );
  }

  render(){
    const { closeModal, visible } = this.props;
    return(
      <Modal onBackdropPress={closeModal}
        transparent={true}
        backdropTransitionInTiming={100}
        backdropTransitionOutTiming={100}
        isVisible={visible}
        style={Style.modalContainer}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', flexDirection: 'column' }}
            style={{ padding: 0 }}>
            <View style={[Style.container]}>
                {this.renderContent()}
            </View>
        </ScrollView>

    </Modal>

    );
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposalModal);
