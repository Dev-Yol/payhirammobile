import React, {Component} from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';

class TicketButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity
        style={[
          styles.CustomButtonContainer,
          {
            backgroundColor: this.props.buttonColor,
            width: this.props.buttonWidth,
            height: this.props.buttonHeight,
          },
        ]}
        onPress={() => {
          this.props.onPress();
        }}>
        <View style={styles.ButtonTextContainer}>
          <Text
            style={[
              styles.ButtonTextStyle,
              {fontSize: this.props.fontSize, color: this.props.textColor},
            ]}>
            {this.props.buttonText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  CustomButtonContainer: {
    borderRadius: 10,
  },
  ButtonTextContainer: {
    paddingVertical: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonTextStyle: {
    textAlign: 'center',
  },
});

export default TicketButton;
