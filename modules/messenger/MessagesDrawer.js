import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, TouchableHighlight } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Messages from 'components/Messenger/MessagesV3.js';
import { Color, BasicStyles, Helper } from 'common';
import { UserImage } from 'components';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import Config from 'src/config.js';
import Currency from 'services/Currency.js';

class HeaderOptions extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount = () => {
    if(this.props.navigationProps.state.params !== undefined){
      if(this.props.navigationProps.state.params.con){
        const { setMessengerGroup, setMessagesOnGroup } = this.props
        setMessengerGroup(this.props.navigationProps.state.params)
        setMessagesOnGroup(this.props.navigationProps.state.params)
      }
    }
  }

  back = () => {
    const { setMessagesOnGroup, setMessengerGroup } = this.props;
    setMessagesOnGroup({groupId: null, messages: null});
    setMessengerGroup(null);
    this.props.navigationProps.navigate('drawerStack');
  };

  viewMenu = () => {
    const { viewMenu } = this.props
    viewMenu(!this.props.state.isViewing)
  }

  _card = () => {
    const { theme } = this.props.state;
    const width = Math.round(Dimensions.get('window').width);
    // {Helper.showRequestType(messengerGroup.request.type)} -
    const { data } = this.props.navigationProps.state.params;
    return (
      <View>
        <View style={{
          flexDirection: 'row',
          width: width - 20,
          alignItems: 'center',
          }}>
          {/*<UserImage style={{marginLeft: -20}}  user={messengerGroup?.profile} color={theme ? theme.primary : Color.primary}/>*/}
          <Text style={{
            color: theme ? theme.primary : Color.primary,
            paddingLeft: 1
          }}>{
            // data ? '****' + data.title.substr(data.title.length - 8, data.title.length - 1) : null
            data ? '****' + data.title.substr(data.title.length - 8, data.title.length - 1) + ' - ' + data.currency + ' ' + data.amount: null
          }</Text>
          {Helper.MessengerMenu != null &&
            <TouchableHighlight 
              activeOpacity={0.6}
              underlayColor={Color.lightGray}
              onPress={this.viewMenu.bind(this)} 
              style={
                {
                  position: 'absolute',
                  right: 0,
                  paddingRight: 15,
                  paddingLeft: 15,
                  paddingTop: 15,
                  paddingBottom: 15,
                  marginRight: 15,
                  borderRadius: 50
                }
              }
            >
              <FontAwesomeIcon 
                icon={ faEllipsisV } 
                style={{color: theme ? theme.primary : Color.primary}}
              />
            </TouchableHighlight>
          }
        </View>
      </View>
    );
  }
  
  
  render() {
    const { theme } = this.props.state;
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.back.bind(this)} 
          >
          <FontAwesomeIcon
            icon={ faChevronLeft }
            size={BasicStyles.iconSize}
            style={[BasicStyles.iconStyle, {color: theme ? theme.primary : Color.primary} ]}/>
        </TouchableOpacity>
        {
          this._card()
        }
      </View>
    );
  }
}


const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setMessagesOnGroup: (messagesOnGroup) => dispatch(actions.setMessagesOnGroup(messagesOnGroup)),
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup)),
    viewMenu: (isViewing) => dispatch(actions.viewMenu(isViewing))
  };
};

let HeaderOptionsConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderOptions);

const MessagesStack = createStackNavigator({
  messagesScreen: {
    screen: Messages, 
    navigationOptions: ({ navigation }) => ({
      title: '',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesStack);