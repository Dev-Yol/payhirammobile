import {StyleSheet, Dimensions} from 'react-native';
import {BasicStyles} from 'common';
const width = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
  CreateRequestContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '95%',
    height: '100%',
  },
  SelectFulfillmentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
  },
  SelectFulfillmentTextStyle: {
    fontSize: BasicStyles.standardFontSize,
    textAlign: 'left',
  },
  FulfillmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextInputContainer: {
    paddingLeft: 12,
    marginTop: '3%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    borderColor: '#E0E0E0',
    borderRadius: BasicStyles.standardBorderRadius,
  },
  AmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '5%',
    marginBottom: 15,
  },
  AmountTextContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  AmountTextStyle: {
    fontSize: BasicStyles.standardFontSize,
  },
  AmountDetailsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  AmountDetailsStyle: {
    fontSize: BasicStyles.standardFontSize,
    fontWeight: 'bold',
  },
  ChangesContainer: {
    paddingVertical: '5%',
    justifyContent: 'center',
  },
  ChangesTextStyle: {
    fontSize: BasicStyles.standardFontSize,
  },
  TotalContainer: {
    width: '100%',
    borderTopWidth: 0.5,
    borderColor: '#D5D5D5',
    paddingBottom: 10,
  },
  ButtonContainer: {
    height: 50,
    borderRadius: BasicStyles.standardBorderRadius,
    justifyContent: BasicStyles.btn.justifyContent,
    alignItems: BasicStyles.btn.alignItems,
  },
  ButtonTextStyle: {
    fontSize: BasicStyles.titleText.fontSize,
    color: '#ffffff',
    textAlign: 'center',
  }
});

export default styles;
