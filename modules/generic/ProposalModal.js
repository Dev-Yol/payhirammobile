import React, { Component } from 'react';
import { Text, View, TouchableHighlight, ScrollView, TextInput, Dimensions, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAsterisk, faRedo } from '@fortawesome/free-solid-svg-icons';
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
import {
  Spinner
} from 'components';

const height = Math.round(Dimensions.get('window').height)
class ProposalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currency: 'PHP',
        charge: 0,
        isLoading: false,
        summaryLoading: false,
        data: null,
        deliveryFee: 20
    };
  }

  componentDidMount(){
    this.retrieveSummaryLedger()
    if(this.props.from == 'update' && this.props.peerRequest != null){
      this.setState({
        data: this.props.peerRequest,
        charge: this.props.peerRequest.charge
      })
    }else{
      this.setState({
        data: null,
        charge: 0
      })
    }
  }

  retrieveSummaryLedger = () => {
    const {user} = this.props.state;
    const { setLedger } = this.props;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      account_code: user.code
    };
    this.setState({isLoading: true, summaryLoading: true});
    console.log('parameter', parameter)
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      console.log('response', response)
      this.setState({isLoading: false, summaryLoading: false});

      if (response != null) {
        setLedger(response.data);
      } else {
        setLedger(null);
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false, summaryLoading: false});
    });
  };

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
    const { user, ledger } = this.props.state;
    const { request } = this.props;
    const { charge, currency, data } = this.state;

    console.log('[send proposal] request', request)
    if(user == null || request == null || ledger == null){
      return
    }
    if(charge <= 0 || currency == null){
      this.check()
      return
    }

    if(request.money_type != 'cash' && ledger.available_balance < request.amount){
      Alert.alert(
        'Error Message!',
        'You have insufficient balance.',
        [
          {text: 'OK', onPress: () => {
            
          }},
        ],
        { cancelable: false }
      )
      return
    }

    console.log('[Send proposal] data', data)
    console.log('[Send proposal] request', request)
    if(data == null){
      if(request.account == null){
        return
      }
      let parameter = {
        request_id: request.id,
        currency: currency,
        charge: charge,
        status: 'requesting',
        account_id: user.id,
        to: request.account.code
      }
      console.log('[send proposal] parameter', parameter)
      this.setState({
        isLoading: true
      })
      Api.request(Routes.requestPeerCreate, parameter, response => {
        console.log('[Send proposal] Success', response)
        if(response.error == null){
          this.setState({
            isLoading: false
          })
          this.props.closeModal()
          this.props.navigation.navigate('requestItemStack', {data: {...this.props.data, peer_flag: true}, from: 'request'})
        }else{
          Alert.alert(
            'Proposal already existed!',
            'Do you want to view the existing proposal?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => {
                this.props.closeModal()
                this.props.navigation.navigate('requestItemStack', {data: {...this.props.data, peer_flag: true}})
              }},
            ],
            { cancelable: false }
          )
        }
      }, error => {
        this.setState({
          isLoading: false
        })
      });
     
    }else{
      let parameter = {
        id: data.id,
        charge: charge
      }
      console.log('[Update proposal]', parameter)
      this.setState({
        isLoading: true
      })
      Api.request(Routes.requestPeerUpdate, parameter, (response) => {
        this.setState({
          isLoading: false
        })
        setTimeout(() => {
          this.props.closeModal()
          this.props.onRetrieve()
        }, 1000)
        
      },
      error => {
        this.setState({
          isLoading: false
        })
      }
      );
    }
  }

  renderContent() {
    const { ledger, theme } = this.props.state;
    const { data } = this.state; 
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
                (ledger != null && ledger.length > 0) && ledger.map(item => (
                  <BalanceCard
                    data={item}
                  />
                ))
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
                    maxLength={4}
                    keyboardType={'numeric'}
                    />


                    {/* <TextInputWithLabel 
                    variable={this.state.deliveryFee}
                    onChange={(value) => this.setState({deliveryFee: value})}
                    label={'Delivery Fee'}
                    placeholder={'Delivery Fee'}
                    onError={false}
                    editable={false}
                    required={true}
                    /> */}

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
                        // Currency.display(parseFloat((this.state.charge + this.state.deliveryFee) * Helper.partnerShare).toFixed(2), 'PHP')
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
                        // Currency.display(parseFloat((this.state.charge + this.state.deliveryFee) * Helper.payhiramShare).toFixed(2), 'PHP')
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
                        // Currency.display(this.state.charge + this.state.deliveryFee, 'PHP')
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
                title={data ? 'Update' : 'Submit'}
                onClick={() => this.submit()}
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

  renderError(){
    return(
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
              width: '100%',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center'
            }}>
              <Text>Invalid Accessed, please refresh!</Text>
              <TouchableHighlight
                onPress={() => this.retrieveSummaryLedger()}>
                <FontAwesomeIcon icon={faRedo} size={32}/>
              </TouchableHighlight>
            </View>
          </ScrollView>
          <View
            style={Style.BottomContainer}>
              
            <Button 
              title={'Close'}
              onClick={() => this.props.closeModal()}
              style={{
                width: '90%',
                marginRight: '5%',
                marginLeft: '5%',
                backgroundColor: Color.danger,
              }}
            />
          </View>
      </View>
    )
  }

  render(){
    const { closeModal, visible } = this.props;
    const { ledger } = this.props.state;
    const { isLoading, summaryLoading } = this.state;
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
                {(ledger && summaryLoading == false) && this.renderContent()}
                {(isLoading == false && (!ledger || (ledger && ledger.length == 0))) && (
                  this.renderError()
                )}
            </View>

        {isLoading ? <Spinner mode="overlay" /> : null}
        </ScrollView>
    </Modal>

    );
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposalModal);
