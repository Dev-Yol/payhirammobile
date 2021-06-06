import * as React from 'react';
import { View } from 'react-native';
export const navigationRef = React.createRef();
import Button from 'components/Form/Button';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';
import { StackActions } from '@react-navigation/native';


function SecutiryAlert(props) {

  const deAuthenticate = () => {
    props.reset()
    setTimeout(() => {
      navigationRef.current?.dispatch(StackActions.push({
        routeName: 'loginStack',
        index: 0,
        key: null
      }));
    }, 500)
    
  }

  return (
    <View style={{
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'space-between'
    }}>
      <Button
        onClick={() => {
          deAuthenticate()
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
  );
}

const mapStateToProps = state => ({ state: state })
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SecutiryAlert);