import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  ScrollView: {
    padding: 10
  },
  MainContainer: {
    flex: 1,
  },
  text: {
    color: Color.normalGray
  },
  btn: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
  },
  Separator: {
    height: 0.5,
    width: width,
    backgroundColor: Color.lightGray
  },
  floatingButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 50,
    backgroundColor: Color.secondary,
    borderRadius: 100,
    color: Color.white
  },
  textFloatingBtn: {
    color: Color.white
  },
  bottomSheetContent: {
    height: height - (height * 0.2),
    backgroundColor: Color.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomSheet: {
    justifyContent: 'flex-end',
    margin: 0,
    width: width,
    padding: 0
  },
  BottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Color.white
  },
}