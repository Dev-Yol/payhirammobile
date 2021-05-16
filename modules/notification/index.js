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
import { color } from 'react-native-reanimated';
const height = Math.round(Dimensions.get('window').height);
class Notifications extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected: null,
      isLoading: false,
      data: []
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={BasicStyles.Separator}/>
    );
  };

  componentDidMount(){
    const { notifications } = this.props.state;
    if(notifications && notifications.length > 0){
      //
    }else{
      this.retrieve()
    }
  }

  async redirect(payload, item, payloadValue, items){
    // console.log('[]')
    const { user } = this.props.state;
    const { setViewField } = this.props;
    if(payload === 'thread'){
      let temp = {
        amount: items?.amount?.amount,
        currency: items?.currency?.currency,
        title: items.route.substring(items.route.lastIndexOf('/') + 1)
      };
      console.log('ITEMS::', temp);
      setViewField(true)
      // temp.amount = items?.amount?.amount
      // temp.currency = items?.currency?.currency
      // temp.title = temp.route.substring(temp.route.lastIndexOf('/') + 1)
      this.props.navigation.navigate('messagesStack', {
        data: temp
      })
    }else if(payload === 'Peer Request'){
      this.props.navigation.navigate('requestItemStack', {
        data: items.request[0],
        from: 'notification'
      })
    }else{
      this.props.navigation.navigate('transactionsStack', {
        from: 'notification'
      })
    }
  }
  

  retrieve = () => {
    const { setNotifications } = this.props;
    const { user } = this.props.state;
    const { setViewField } = this.props;
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
      offset: 0,
      sort: {
        created_at: 'desc'
      }
    }
    // this.setState({isLoading: true})
    setViewField(true)
    console.log('[parameter]',Routes.notificationsRetrieve, parameter)
    Api.request(Routes.notificationsRetrieve, parameter, notifications => {
      console.log("[RESTRIEVE]", notifications.data)
      // this.setState({isLoading: false})
      this.setState({data: notifications.data})
      setNotifications(notifications.size, this.state.data)
    }, error => {
      this.setState({isLoading: false})
    })
  }

  render() {
    const { notifications } = this.props.state;
    console.log('NOTIFICATION', notifications);
    const { selected, isLoading } = this.state;

    return (
      <SafeAreaView style={{
        height: height,
        flex: 1
      }}>
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
          <View style={{
            flex: 1,
            height: height
          }}>
            {notifications == null || (notifications && notifications.notifications == null) && (<Empty refresh={true} onRefresh={() => this.retrieve()}/>)}
            {
              (notifications && notifications.notifications) && notifications.notifications.map((item, index) => (
                <TouchableHighlight
                  onPress={() => this.redirect(item.payload, item.id, item.payload_value, item)}
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
          </View>
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
    setNotifications: (unread, notifications) => dispatch(actions.setNotifications(unread, notifications)),
    setViewField: (view) => dispatch(actions.setViewField(view))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);