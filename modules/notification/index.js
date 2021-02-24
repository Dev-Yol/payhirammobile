import React, { Component } from 'react';
import Style from './Style.js';
import { View, Text, ScrollView, FlatList, TouchableHighlight, SafeAreaView} from 'react-native';
import {NavigationActions} from 'react-navigation';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner } from 'components';
import { connect } from 'react-redux';
import { Empty } from 'components';
import Api from 'services/api/index.js';
import { Dimensions } from 'react-native';
const height = Math.round(Dimensions.get('window').height);
class Notifications extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected: null,
      isLoading: false
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={BasicStyles.Separator}/>
    );
  };

  componentDidMount(){
    this.retrieve()
  }

  retrieve = () => {
    const { setNotifications } = this.props;
    const { user } = this.props.state;
    if(user == null){
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'to'
      }],
      limit: 10,
      offset: 0
    }
    this.setState({isLoading: true})
    Api.request(Routes.notificationsRetrieve, parameter, notifications => {
      this.setState({isLoading: false})
      console.log(notifications.data.length)
      setNotifications(notifications.size, notifications.data)
    }, error => {
      this.setState({isLoading: false})
    })
  }

  render() {
    const { notifications } = this.props.state;
    const { selected, isLoading } = this.state;

    return (
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if(event.nativeEvent.contentOffset.y <= 0) {
              if(isLoading == false){
                // this.retrieve(false)
              }
            }
            if(scrollingHeight >= (totalHeight + 20)) {
              if(isLoading == false){
                this.retrieve()
              }
            }
          }}
          >
          {notifications == null || (notifications != null && notifications.notifications == null) && (<Empty refresh={true} onRefresh={() => this.retrieve()}/>)}
          {
            notifications && notifications.notifications.map((item, index) => (
              <TouchableHighlight
                onPress={() => {}}
                underlayColor={Color.gray}
                style={{
                  borderBottomColor: Color.lightGray,
                  borderBottomWidth: 1
                }}
                >
                <View style={{
                  backgroundColor: notifications.unread > index ? Color.lightGray : Color.white,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10
                }}>
                  <Text
                    style={{
                      fontSize: BasicStyles.standardFontSize,
                      fontWeight: 'bold'
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: BasicStyles.standardFontSize
                    }}>
                    {item.message}
                  </Text>
                  <Text
                    style={{
                      fontSize: BasicStyles.standardFontSize,
                      color: Color.gray
                    }}>
                    {item.date}
                  </Text>
                </View>
              </TouchableHighlight>
            ))
          }
        </ScrollView>
        {isLoading ? <Spinner mode="overlay"/> : null }  
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setRequests: (requests) => dispatch(actions.setRequests(requests)),
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger)),
    setSearchParameter: (searchParameter) => dispatch(actions.setSearchParameter(searchParameter)),
    setNotifications: (unread, notifications) => dispatch(actions.setNotifications(unread, notifications))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);