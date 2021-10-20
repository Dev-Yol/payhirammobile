import React, { Component } from 'react';
import { Color, Routes } from 'common';
import { Text, View, Alert, ScrollView, Switch, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Spinner } from 'components';
const height = Math.round(Dimensions.get('window').height);
class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: []
    };
  }

  componentDidMount() {
    let varc = this.props.navigation.addListener('didFocus', () => {
      this.retrieve();
    })
  }

  retrieve = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }]
    };
    this.setState({ isLoading: true })
    Api.request(Routes.deviceRetrieve, parameter, response => {
      console.log('[response Device]', response)
      this.setState({ isLoading: false })
      if(response.data.length > 0) {
        this.setState({ data: response.data})
      } else {
        this.setState({ data: [] })
      }
    })
  }

  update = (item) => {
    let parameter = {
      account_id: this.props.state.user.id,
      id: item.id,
      status: 'primary'
    }
    this.setState({ isLoading: true })
    Api.request(Routes.deviceUpdate, parameter, response => {
      this.setState({ isLoading: false })
      if(response.data > 0){
        this.retrieve()
      }
    })
  }

  changeState(item) {
    if (item.status === 'primary') {
      Alert.alert(
        'Message',
        'Action not allowed, there must be only one primary device. ',
        [
          {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
        ],
        { cancelable: false }
      )
    } else {
      this.update(item)
    }
  }

  render() {
    const { theme } = this.props.state;
    const { isLoading, data } = this.state;
    return (
      <View>
        {isLoading ? <Spinner mode="overlay" /> : null}
        <Text style={{ padding: 10 }}>Switched on device as primary.</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}>
            <View style={{
              flex: 1,
              height: height + 25
            }}>
              {
              (data && data.length > 0) && data.map((item, index) => (
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.gray, padding: 20 }} key={index}>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      paddingBottom: 10
                    }}>{item.model}</Text>
                    <Text style={{
                      fontSize: 11,
                      color: Color.gray
                    }}>{item.unique_code}</Text>
                  </View>
                  <Switch
                    trackColor={{ false: Color.danger, true: theme ? theme.primary : Color.primary }}
                    thumbColor={'white'} onValueChange={() => this.changeState(item)} value={item.status === 'primary' ? true : false}
                    ios_backgroundColor={Color.danger}
                  />
                </View>
                ))
              }
              </View>
        </ScrollView>
      </View>
    );
  }
}


const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setEnableFingerPrint(isEnable) {
      dispatch(actions.setEnableFingerPrint(isEnable));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);