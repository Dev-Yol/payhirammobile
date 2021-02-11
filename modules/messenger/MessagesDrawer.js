import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, TouchableHighlight } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Messages from 'modules/messenger/Messages.js';
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
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', this.props.navigationProps.state.params);
    const { payload } = this.props.navigationProps.state.params
    const { payload_value } = this.props.navigationProps.state.params
    const { title } = this.props.navigationProps.state.params
    const { setMessengerGroup } = this.props
    setMessengerGroup(title, payload, payload_value)
    console.log(payload_value, payload, title)
  }

  back = () => {
    const { setMessagesOnGroup, setMessengerGroup } = this.props;
    setMessagesOnGroup({groupId: null, messages: null});
    setMessengerGroup(null);
    this.props.navigationProps.navigate('drawerStack');
  };

  viewMenu = () => {
    const { viewMenu } = this.props // new
    viewMenu(!this.props.state.isViewing) // new
  }

  _card = () => {
    const { messengerGroup, theme } = this.props.state;
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', messengerGroup)
    const width = Math.round(Dimensions.get('window').width);
    // {Helper.showRequestType(messengerGroup.request.type)} -
    return (
      <View>
        {
          messengerGroup != null && (
          <View style={{
            flexDirection: 'row',
            width: width - 20,
            alignItems: 'center'
            }}>
            <UserImage  user={messengerGroup.title} color={'white'}/>
            <Text style={{
              color: 'white',
              lineHeight: 30,
              paddingLeft: 1,
              // width: '30%'
            }}>{messengerGroup.title.length > 29 && messengerGroup.request != null ? ' *****' + messengerGroup.title.substr(28, 32) + ' - ' + messengerGroup.request.currency + ' ' + messengerGroup.request.amount : messengerGroup.title}</Text>
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
                  style={{color: 'white'}}
                />
              </TouchableHighlight>
            }
          </View>
        )}
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
            style={[BasicStyles.iconStyle, {color: 'white'} ]}/>
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
      title: 'Messages',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesStack);