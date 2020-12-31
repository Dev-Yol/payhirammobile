import { Color, BasicStyles } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  Card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Color.lightGray,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginBottom: 10
  },
  text: {
    color: Color.normalGray
  },
}