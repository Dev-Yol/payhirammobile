import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import styles from './TransferFundStyle.js'

class TransferFundCard extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    value={'This is a test.'}
                />
            </View>
        )
    }
}
export default TransferFundCard;
