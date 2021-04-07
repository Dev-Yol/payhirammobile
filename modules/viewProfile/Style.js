import { Color } from 'common';
import { Dimensions, StyleSheet } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default StyleSheet.create({
  container: {
    height: height,
    marginBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  }
});