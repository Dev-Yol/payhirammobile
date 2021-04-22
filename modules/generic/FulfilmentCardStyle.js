import {StyleSheet, Dimensions} from 'react-native';
import {BasicStyles} from 'common';
const width = Math.round(Dimensions.get('window').width);
export default {
  CardContainer: {
    width: width / 2,
    borderRadius: BasicStyles.standardBorderRadius,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '40%',
    paddingBottom: '10%',
  },
  titleText: {
    fontSize: BasicStyles.standardFontSize,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  description: {
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  descriptionText: {
    fontSize: BasicStyles.standardFontSize,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#FFFFFF',
  },
}

