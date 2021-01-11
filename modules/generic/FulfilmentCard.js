import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './FulfilmentCardStyle.js';
import { BasicStyles, Helper, Color } from 'common';
import {connect} from 'react-redux';

const Data = [{
    type: 'Send',
    description: 'Allow other peers to fulfill your transaction when you to send money to your family, friends, or to businesses',
  }, {
    type: 'Withdrawal',
    description: 'Allow other peers to fulfill your withdrawals from Payhiram',
  }, {
    type: 'Deposit',
    description: 'Allow other peers to find your deposits Payhiram',
  }, {
    type: 'Bills and Payment',
    description: "Don't have time and want to pay your bills? Allow other peers to pay your bills.",
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
    return (
      <View style={{
        flexDirection: 'row',
        marginTop: 10
      }}>
        {
          Data && Data.map((item, index) => (
           
            <TouchableOpacity
              style={[styles.CardContainer, {backgroundColor: index === active ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary)}]}
              onPress={() => {
                this.onSelect(item, index);
              }}>
              <View style={styles.title}>
                <Text
                  style={[
                    styles.titleText,
                    {fontSize: BasicStyles.titleText.fontSize},
                  ]}>
                  {item.type}
                </Text>
              </View>
              <View style={[styles.description, {
                paddingBottom: 10
              }]}>
                <Text
                  style={[
                    styles.descriptionText,
                    {
                      fontSize: BasicStyles.titleText.fontSize
                    },
                  ]}>
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