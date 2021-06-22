import * as React from 'react';
import { View } from 'react-native';
export const navigationRef = React.createRef();
import Button from 'components/Form/Button';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';


function AuthorizedModal(props) {
  console.log('[prooooooooops]', props.params)
  return (
    <View style={{
      width: '100%'
    }}>
    {
      props.params == 'recover' && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'space-between',
          width: '100%'
        }}>
          <Button
            onClick={() => {
              props.reset()
            }}
            title={'Logout'}
            style={{
              borderColor: Color.danger,
              borderWidth: 1,
              width: '45%',
              height: 50,
              borderRadius: 25,
              backgroundColor: 'transparent'
            }}
            textStyle={{
              color: Color.danger,
              fontSize: BasicStyles.standardFontSize
            }}
          />

          <Button
          onClick={() => {
            props.resetInactivityTimeout()
          }}
          title={"Continue using"}
          style={{
            backgroundColor: props.theme ? props.theme.secondary : Color.secondary,
            width: '45%',
            height: 50,
            borderRadius: 25,
          }}
          textStyle={{
            color: Color.white,
            fontSize: BasicStyles.standardFontSize
          }}
        />
        </View>
      )
    }
    {
      props.params == 'auto' && (
        <View style={{
          width: '100%',
          alignItems: 'center'
        }}>
          <Button
            onClick={() => {
              props.reset()
            }}
            title={'Logout'}
            style={{
              borderColor: Color.danger,
              borderWidth: 1,
              width: '45%',
              height: 50,
              borderRadius: 25,
              backgroundColor: 'transparent'
            }}
            textStyle={{
              color: Color.danger,
              fontSize: BasicStyles.standardFontSize
            }}
          />
        </View>
      )
    }
    </View>
  );
}

const mapStateToProps = state => ({ state: state })
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizedModal);