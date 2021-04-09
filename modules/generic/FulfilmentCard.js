import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './FulfilmentCardStyle.js';
import { BasicStyles, Helper, Color } from 'common';
import {connect} from 'react-redux';

const Data = [{
    type: 'Send Cash',
    description: 'Allow other peers to fulfill your transaction when you to send money to your family, friends, or to businesses',
    id: 1,
    money_type: 'cash'
  }, {
    type: 'Withdrawal',
    description: 'Allow other peers to fulfill your withdrawals from Payhiram',
    id: 2,
    money_type: 'cash'
  }, {
    type: 'Cash In',
    description: 'Allow other peers to find your deposits Payhiram',
    id: 3,
    money_type: 'e-wallet'
  }, {
    type: 'Bills Payment',
    description: "Don't have time and want to pay your bills? Allow other peers to pay your bills.",
    id: 4,
    money_type: 'cash'
  },
];

class FulfilmentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null
    }
  }

  onSelect(item,index){
    this.props.onSelect(item)
    this.setState({
      active: this.active == index ? null : index
    })
  }

  render() {
    const { active } = this.state;
    const { theme } = this.props.state;
    const { selected } = this.props;
    return (
      <View style={{
        flexDirection: 'row',
        marginTop: 10
      }}>
        {
          Helper.fulfillmentTypes && Helper.fulfillmentTypes.map((item, index) => (
           
            <TouchableOpacity
              style={{
                ...styles.CardContainer,
                backgroundColor: (selected && selected.id == item.id) ? (theme ? theme.secondary : Color.secondary) : 'transparent',
                borderWidth: (selected && selected.id == item.id) ? 0 : 1,
                borderColor: theme ? theme.secondary : Color.secondary
              }}
              onPress={() => {
                this.onSelect(item, index);
              }}
              key={index}>
              <View style={styles.title}>
                <Text
                  style={{
                    ...styles.titleText,
                    color: (selected && selected.id == item.id) ? Color.white : Color.black,
                    fontSize: BasicStyles.titleText.fontSize,
                  }}>
                  {item.type}
                </Text>
              </View>
              <View style={[styles.description, {
                paddingBottom: 10
              }]}>
                <Text
                  style={{
                    ...styles.descriptionText,
                    fontSize: BasicStyles.titleText.fontSize,
                    color: (selected && selected.id == item.id) ? Color.white : Color.black
                  }}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
            
          ))
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FulfilmentCard);