import { Color, BasicStyles } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  MainContainer: {
    flex: 1,
    marginTop: 25,
    height: height + 25,
    marginBottom: 100,
    width: '90%',
    marginRight: '5%',
    marginLeft: '5%',
  }
}