import React, { Component } from 'react';
import { Text, View, TouchableHighlight, ScrollView, TextInput, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { Picker } from '@react-native-community/picker';
import { connect } from 'react-redux';
import BalanceCard from 'modules/generic/BalanceCard';
import Style from './ProposalModalStyle';
import { BasicStyles, Color, Helper } from 'common'
import TextInputWithLabel from 'components/Form/TextInputWithLabel';
import PickerWithLabel from 'components/Form/PickerWithLabel';
import Button from 'components/Form/Button';
import Modal from 'react-native-modal';
import Currency from 'services/Currency';

const height = Math.round(Dimensions.get('window').height)
class ProposalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currency: 'Philippine Peso - PHP',
        processingFee: 0
    };
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  renderContent() {
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
            <BalanceCard
              data={{
                amount: 500,
                currency: 'PHP',
                current_amount: 2500
              }}
            />

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
                    variable={this.state.processingFee}
                    onChange={(value) => this.setState({processingFee: value})}
                    label={'Amount'}
                    onError={false}
                    required={true}
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
                        Currency.display(0.00, 'PHP')
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
                        Currency.display(0.00, 'PHP')
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
                        color: Color.secondary
                      }}>
                      {
                        Currency.display(0.00, 'PHP')
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
                onClick={() => {}}
                style={{
                  width: '45%',
                  marginLeft: '5%',
                  backgroundColor: Color.secondary
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
