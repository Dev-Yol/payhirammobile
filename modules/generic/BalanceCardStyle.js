import {StyleSheet} from 'react-native';
import { BasicStyles } from 'common';

const styles = StyleSheet.create({
  CardContainer: {
    marginTop: '2%',
    height: 190,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'flex-start',
  },
  AvailableBalanceTextStyle: {
    textAlign: 'center',
    fontSize: BasicStyles.standardFontSize,
    color: '#FFFFFF',
    paddingTop: 10,
  },
  AvailableBalanceContainer: {
  },
  BalanceTextStyle: {
    textAlign: 'center',
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  BalanceContainer: {
    paddingTop: 40,
    paddingBottom: 40
  },
  CurrentBalanceTextStyle: {
    textAlign: 'left',
    fontSize: BasicStyles.standardFontSize,
    color: '#FFFFFF',
    paddingBottom: 10
  },
  CurrentBalanceContainer: {
    paddingBottom: '10%',
    paddingLeft: 18,
  }
});

export default styles;
