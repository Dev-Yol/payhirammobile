import {StyleSheet, Dimensions} from 'react-native';
import {Color} from 'common';

const width = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  AddressTileContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 70,
    paddingLeft: 20,
    elevation: 1,
    borderBottomWidth: 0.5,
    borderColor: '#E8E8E8',
  },
  AddressTextStyle: {
    fontSize: 17,
  },
  textStyle: {
    color: Color.primaryDark,
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default styles;
