import {StyleSheet} from 'react-native';
import { BasicStyles } from 'common';

const styles = StyleSheet.create({
  ReviewsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  starContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  textContainer: {
    width: '100%',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: BasicStyles.standardFontSize,
  },
  CommentContainer: {
    height: 80,
    marginTop: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    width: '80%',
  },
  CommentTextStyle: {},
  ButtonContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
  }
});

export default styles;
