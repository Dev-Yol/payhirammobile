import React, {Component} from 'react';
import { Color } from 'common';
import {Text, View, StyleSheet, ScrollView, Switch, Dimensions} from 'react-native';
import {connect} from 'react-redux';
const height = Math.round(Dimensions.get('window').height);
class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      pin: true
    };
  }

  changeState(ndx){
    if(ndx == 0){
      this.setState({login: this.state.login? false: true})
    }else{
      this.setState({pin: this.state.pin? false: true})
    }
  }

  render() {
    const { theme } = this.props.state;
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={{
            flex: 1,
            height: height + 25
          }}>
            <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.gray, padding: 20}}>
              <View style={{flex: 1}}>
                <Text>Login</Text>
                <Text style={{fontSize: 10}}>Send me an email everytime there's a login with my account.</Text>
              </View>
              <Switch trackColor={{ false: Color.danger, true: theme ? theme.primary : Color.primary }} thumbColor={'white'} onValueChange={() => this.changeState(0)} value={this.state.login}/>
            </View>
            <View style={{flexDirection: 'row', borderBottomWidth: 1, borderColor: Color.gray, padding: 20}}>
              <View style={{flex: 1}}>
                <Text>Account PIN</Text>
                <Text style={{fontSize: 10}}>Receive new PIN from email everytime there's a login with my account.</Text>
              </View>
              <Switch trackColor={{ false: Color.danger, true: theme ? theme.primary : Color.primary }} thumbColor={'white'} onValueChange={() => this.changeState(1)} value={this.state.pin}/>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}


const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettings);