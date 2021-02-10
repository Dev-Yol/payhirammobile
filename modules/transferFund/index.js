import React, {Component} from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import Styles from './Style.js'
import TransferFundCard from 'modules/generic/TransferFundCard.js';


class TransferFundDrawer extends Component {

  render() {
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

export default TransferFundDrawer;
