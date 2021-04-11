import React, {Component} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
class AcceptPayment extends Component {
  constructor(props){
    super(props);
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render(){
    return (
      <View>
        <Modal isVisible={this.props.visible}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{
              height: '35%',
              marginTop: '10%',
              borderRadius: 10,
              backgroundColor: Color.white
            }}>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default AcceptPayment;
