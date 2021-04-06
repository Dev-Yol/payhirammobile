import React, { Component } from 'react';
import { ScrollView, View
  , TouchableOpacity } from 'react-native';
import { BasicStyles } from 'common'
import styles from './Styles';
import { RadioButton, Text } from 'react-native-paper';

class UserGuidelines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'PHP'
    };
  }

  render() {
    return (
        <ScrollView>
          <View style={styles.PaymentMethodsContainer}>
          <RadioButton.Group onValueChange={value => this.setState({value})}>
            <View>
              <Text>PHP</Text>
              <RadioButton value="PHP" />
            </View>
            <View>
              <Text>USD</Text>
              <RadioButton value="USD" />
            </View>
          </RadioButton.Group>
          </View>
        </ScrollView>
    );
  }
}

export default UserGuidelines;
