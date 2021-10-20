import {StyleSheet, Platform} from 'react-native';
import {Color} from 'common';
export default StyleSheet.create({
  MainContainer: {
    flexGrow: 1,
    marginTop: 60,
  },
  PaymentMethodsContainer: {
    flex: 1,
    padding: 25,
  },
  PaymentTileContainer: {
    flexDirection: 'row',
    borderWidth: 0.4,
    borderRadius: 10,
    marginVertical: 10,
    padding: 20,
  },
  PaymentTileImage: {
    marginRight: 15,
  },
  PaymentTileText: {
    fontWeight: 'bold',
  },
  floatingButton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: Color.primary,
    height: 70,
    width: 70,
    right: 25,
    borderRadius: 100
  },
  textFloatingBtn: {
    color: Color.white,
  },
  ButtonContainer: {
    alignItems: 'center',
    marginTop: '50%',
    left: 130,
  },
  CustomButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 50,
    height: 50,
    backgroundColor: Color.primary,
    color: Color.white,
    borderRadius: 50,
  }
});