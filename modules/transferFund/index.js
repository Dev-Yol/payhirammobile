import React, {Component} from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import Api from 'services/api/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faUserCircle, faUpload } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes} from 'common';
import Currency from 'services/Currency.js'
import Styles from './Style.js'
import { connect } from 'react-redux';
import TransferFundCard from 'modules/generic/TransferFundCard.js';


class TransferFundDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  render() {
    const { data } = this.state;
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={Styles.MainContainer}>
                <TransferFundCard />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferFundDrawer);
