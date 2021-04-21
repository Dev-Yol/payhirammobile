import React, {Component} from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faUserCircle, faUpload } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import Currency from 'services/Currency.js'
import Styles from './TransactionCardStyle.js';
import {connect} from 'react-redux';

class TransactionCard extends Component {
  render() {
    const { data } = this.props;
    const { theme } = this.props.state;
    console.log('[data]', data);
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={Styles.MainContainer}>
            {
              data && (
                <TouchableOpacity style={Styles.Card}>
                  <View
                  style={{
                    flexGrow: 1,
                    width: '60%'
                  }}>
                    <Text style={{
                      color: theme ? theme.secondary : Color.secondary,
                      fontSize: BasicStyles.standardFontSize - 1,
                      paddingTop: 10
                    }}>{data.created_at_human}</Text>
                    <Text style={{
                      fontSize: BasicStyles.standardFontSize,
                      paddingTop: 10,
                      paddingBottom: 10
                    }}>{data.description}</Text>
                    {
                      data.code && (
                        <Text style={{
                          fontSize: BasicStyles.standardFontSize,
                          paddingBottom: 10
                        }}>Transaction #: ****{data.code.substr(data.code.length - 8, data.code.length - 1)}</Text>
                      )
                    }
                  </View>
                  <View style={{
                    width: '40%'
                  }}>
                    {
                      data.amount < 0 ? (
                        <Text style={{
                          color: theme ? theme.danger : Color.danger,
                          fontSize: BasicStyles.standardFontSize,
                          fontWeight: 'bold',
                          textAlign: 'right'
                        }}>{Currency.display(data.amount, data.currency)}</Text>
                      )
                      :
                      (
                        <Text style={{
                          color: theme ? theme.secondary : Color.secondary,
                          fontSize: BasicStyles.standardFontSize,
                          fontWeight: 'bold',
                          textAlign: 'right'
                        }}>{Currency.display(data.amount, data.currency)}</Text>
                      )
                    }
                  </View>
                </TouchableOpacity>
              )
            }     
            
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionCard);
