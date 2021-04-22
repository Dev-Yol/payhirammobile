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
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
    width: width,
    padding: 0
  },
  container: {
    height: height - (height * 0.2),
    backgroundColor: Color.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  CreateRequestContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
  BottomContainer: {
    alignItems: 'center',
    backgroundColor: Color.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%'
  },
}