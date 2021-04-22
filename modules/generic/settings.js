import React, { Component } from 'react';
import {
  TextInput,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { Routes, Color, BasicStyles, Helper } from 'common';
import { Spinner, UserImage } from 'components';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImage, faPaperPlane, faLock, faTimes, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ImagePicker from 'react-native-image-picker';
import Style from './settingsStyle.js'
import Modal from 'components/Modal/Sketch';
const DeviceHeight = Math.round(Dimensions.get('window').height);
const DeviceWidth = Math.round(Dimensions.get('window').width);

class MessagesV3 extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      newMessage: null,
      imageModalUrl: null,
      isImageModal: false,
      photo: null,
      keyRefresh: 0,
      isPullingMessages: false,
      offset: 0,
      limit: 10,
      isLock: false,
      settingsMenu: [],
      settingsBreadCrumbs: ['Settings'],
      pictures: [],
      visible: false,
      sender_id: null,
      group: null
    }
  }

  componentDidMount(){
    this.menu(Helper.MessengerMenu)
  }

  closeSketch = () => {
    this.setState({visible: false})
  }

  sendSketch = (result) => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      payload: 'signature',
      payload_value: result
    }
    this.state.pictures.push(parameter)
    this.setState({isLoading: true})
    Api.request(Routes.uploadImage, parameter, response => {
      this.setState({isLoading: false})
      if(response.data !== null) {
        this.settingsRemove();
      }
    })
  }

  uploadPhoto = (payload) => {
    const options = {
      noData: true,
      error: null
    }
    const { user } = this.props.state;
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ photo: null })
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ photo: null })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        this.setState({ photo: null })
      }else {
        if(response.fileSize >= 1000000){
          Alert.alert('Notice', 'File size exceeded to 1MB')
          return
        }
        let parameter = {
          account_id: user.id,
          payload: payload,
          payload_value: response.uri
        }
        this.state.pictures.push(parameter)
        this.setState({isLoading: true})
        Api.request(Routes.uploadImage, parameter, response => {
          this.setState({isLoading: false})
          if(response.data !== null) {
            this.settingsRemove();
          }
          console.log(response, "=====================response upon create");
        })
      }
    })
  }

  addToValidation = () => {
    console.log('add to validation======================');
  }

  cloneMenu() {
    const { viewMenu } = this.props // new
    viewMenu(false) // new
  }

  menu(data) {
    /**
    * returns Settings Menu
    */
    this.setState({settingsMenu: data.map((el, ndx) => {
      return (
        <View key={'msgmenu'+ndx}>
          {el.title == 'Close' && <TouchableOpacity onPress={()=>{this.cloneMenu()}}>
            <View style={Style.settingsTitles}>
              <Text style={{color: Color.danger}}> Cancel </Text>
            </View>
          </TouchableOpacity>}
          <TouchableOpacity onPress={()=>{this.settingsAction(el)}}>
            <View style={Style.settingsTitles}>
              {el.title != 'Close' && <Text style={{color: Color.black}}> {el.title} </Text>}
              {el.button != undefined && this.state.sender_id && this.props.state.user.id === this.state.sender_id && 
                <TouchableOpacity onPress={()=>{this.addToValidation()}}>
                  <View style={[Style.settingsButton, {backgroundColor: el.button.color}]}> 
                    <Text style={{fontSize: BasicStyles.standardFontSize, color: 'white'}}> {el.button.title} </Text>
                  </View>
                </TouchableOpacity>
              }
              {(el.button == undefined && el.title != 'Close') &&
                <FontAwesomeIcon
                  icon={ faChevronRight }
                  size={BasicStyles.iconSize}
                  style={{color: Color.primary}}/>
              }
            </View>
          </TouchableOpacity>
        </View>
      )
    })})
  }

  settingsRemove() {
    /**
    * when x button is click
    */
    if(this.state.settingsBreadCrumbs.length > 1){
      this.state.settingsBreadCrumbs.pop();
    }else{
      this.cloneMenu()
    }
    switch(this.state.settingsBreadCrumbs.length){
      case 1:
        this.menu(Helper.MessengerMenu)
        break;
      case 2:
        this.menu(Helper.requirementsMenu)
        break;
    }
  }

  settingsAction(data) {
    /**
    * When one of the settings menu is clicked
    */
    if(data.payload == 'same_page'){
      switch(data.payload_value){
        case 'requirements':
          let temp = this.state.settingsBreadCrumbs
          temp.push('Requirements')
          this.setState({settingsBreadCrumbs: temp})
          this.menu(Helper.requirementsMenu)
          break;
        case 'signature':
          let sign = this.state.settingsBreadCrumbs
          sign.push('On App Signature')
          this.setState({settingsBreadCrumbs: sign})
          let frame = [
            <View>
              <ScrollView>
                <View style={Style.signatureFrameContainer}>
                {
                    this.state.pictures.map((ndx, el)=>{
                      if(ndx.payload === 'signature') {
                        return (
                          <View style={{
                            height: 100,
                            width: '49%',
                            borderWidth: 1,
                            borderColor: Color.gray,
                            margin: 2
                          }}
                          key={el}>
                            <Image
                              source={{ uri: ndx.payload_value.includes('content') ? ndx.payload_value : `data:image/png;base64,${ndx.payload_value}`}}
                              style={{
                                width: 205,
                                height: 98
                              }}
                            />
                          </View>
                        )
                      }
                    })
                  }
                </View>
              </ScrollView>
              <View style={{paddingTop: 50}}>
                {this.state.sender_id && this.props.state.user.id === this.state.sender_id ?
                  <View style={Style.signatureFrameContainer}>
                  <TouchableOpacity style={[Style.signatureAction, Style.signatureActionDanger, {width: '49%'}]}>
                    <Text style={{color: Color.white}}> Decline </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[Style.signatureAction, Style.signatureActionSuccess]}>
                    <Text style={{color: Color.white}}> Accept </Text>
                  </TouchableOpacity>
                </View>
                : 
                <View style={Style.signatureFrameContainer}>
                  <TouchableOpacity style={[Style.signatureFullSuccess, Style.signatureActionSuccess]}
                  onPress={() => {
                    this.setState({visible: true})
                  }}>
                    <Text style={{color: Color.white}}> Upload </Text>
                  </TouchableOpacity>
                </View>
                }
              </View>
            </View>
          ]
          this.setState({settingsMenu: frame})
      }
    }else if(data.payload === 'redirect') {
      if(data.title.toLowerCase() == 'details'){
        const { messengerGroup } = this.props.state
        console.log('[Details]', this.props.state.messengerGroup)
        console.log('[transfer fund]')
        if(messengerGroup == null){
          return
        }
        this.props.navigation.navigate(data.payload_value, {data: {id: messengerGroup.id}})
      }else if(data.title.toLowerCase() == 'rate'){
        this.props.navigation.navigate(data.payload_value, {data: {data: this.props.state.messengerGroup}})
      }else if(data.title.toLowerCase() == 'Transfer funds'){
        console.log('[transfer fund]')
        this.props.navigation.navigate(data.payload_value)
      }else if(data.title.toLowerCase() == 'receiver picture') {
        let picture = this.state.settingsBreadCrumbs
          picture.push('Receiver Picture')
          this.setState({settingsBreadCrumbs: picture})
          let frame = [
            <View>
              <ScrollView>
                <View style={Style.signatureFrameContainer}>
                  {
                    this.state.pictures.map((ndx, el)=>{
                      if(ndx.payload === 'receiver_sender_picture') {
                        return (
                          <View style={{
                            height: 100,
                            width: '49%',
                            borderWidth: 1,
                            borderColor: Color.gray,
                            margin: 2
                          }}
                          key={el}>
                            <Image
                              source={{ uri: ndx.payload_value}}
                              style={{
                                width: 205,
                                height: 98
                              }}
                            />
                          </View>
                        )
                      }
                    })
                  }
                </View>
              </ScrollView>
              <View style={{paddingTop: 50}}>
              {this.state.sender_id && this.props.state.user.id === this.state.sender_id ?
                <View style={Style.signatureFrameContainer}>
                  <TouchableOpacity style={[Style.signatureAction, Style.signatureActionDanger, {width: '49%'}]}>
                    <Text style={{color: Color.white}}> Decline </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[Style.signatureAction, Style.signatureActionSuccess]}>
                    <Text style={{color: Color.white}}> Accept </Text>
                  </TouchableOpacity>
                </View>
                :
                  <View style={Style.signatureFrameContainer}>
                  <TouchableOpacity
                    style={[Style.signatureFullSuccess, Style.signatureActionSuccess]}
                    onPress={() => {
                      this.uploadPhoto('receiver_sender_picture');
                    }}>
                    <Text style={{color: Color.white}}> Upload </Text>
                  </TouchableOpacity>
                </View>
                }
              </View>
            </View>
          ]
          this.setState({settingsMenu: frame})
      } else if(data.title.toLowerCase() == 'valid id') {
        let picture = this.state.settingsBreadCrumbs
          picture.push('Valid ID')
          this.setState({settingsBreadCrumbs: picture})
          let frame = [
            <View>
              <ScrollView>
                <View style={Style.signatureFrameContainer}>
                  {
                    this.state.pictures.map((ndx, el)=>{
                      if(ndx.payload === 'valid_id') {
                        return (
                          <View style={{
                            height: 100,
                            width: '49%',
                            borderWidth: 1,
                            borderColor: Color.gray,
                            margin: 2
                          }}
                          key={el}>
                            <Image
                              source={{ uri: ndx.payload_value}}
                              style={{
                                width: 205,
                                height: 98
                              }}
                            />
                          </View>
                        )
                      }
                    })
                  }
                </View>
              </ScrollView>
              <View style={{paddingTop: 50}}>
              {this.state.sender_id && this.props.state.user.id === this.state.sender_id ?
                <View style={Style.signatureFrameContainer}>
                <TouchableOpacity style={[Style.signatureAction, Style.signatureActionDanger, {width: '49%'}]}>
                  <Text style={{color: Color.white}}> Decline </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.signatureAction, Style.signatureActionSuccess]}>
                  <Text style={{color: Color.white}}> Accept </Text>
                </TouchableOpacity>
              </View>
              :
              <View style={Style.signatureFrameContainer}>
                <TouchableOpacity
                  style={[Style.signatureFullSuccess, Style.signatureActionSuccess]}
                  onPress={() => {
                    this.uploadPhoto('valid_id');
                  }}>
                  <Text style={{color: Color.white}}> Upload </Text>
                </TouchableOpacity>
              </View>
              }
              </View>
            </View>
          ]
          this.setState({settingsMenu: frame})
      }
    }
  }


  render() {
    const { 
      isLoading,
      keyRefresh,
      isPullingMessages
    } = this.state;
    const { messengerGroup, user, isViewing } = this.props.state;
    return (
      <SafeAreaView>
          <View key={keyRefresh}>
            {isLoading ? <Spinner mode="full"/> : null }
            <ScrollView
              ref={ref => this.scrollView = ref}
              onContentSizeChange={(contentWidth, contentHeight)=>{        
                if (!isPullingMessages) {
                  this.scrollView.scrollToEnd({animated: true});
                }
              }}
              style={[Style.ScrollView, {
                height: isViewing ? '40%' : '100%'
              }]}
              onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
                const isOnBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height
                const isOnTop = contentOffset.y <= 0

                if (isOnTop) {
                  if(this.state.isLoading == false){
                    if (!isPullingMessages) {
                      this.setState({ isPullingMessages: true })
                    }
                    this.retrieveMoreMessages()
                  }
                }
                if (isOnBottom) {
                  if (this.state.isLoading == false && isPullingMessages) {
                    this.setState({ isPullingMessages: false })
                  }
                }
              }}
              >
            </ScrollView>
            {isViewing &&
                <View
                    style={
                    {
                        height: '60%', 
                        paddingBottom: 51, 
                        paddingTop: 0, 
                        borderTopWidth: 1, 
                        borderTopColor: Color.gray
                    }
                    }
                >
                    <View style={Style.settingsTitles}>
                    <Text> {this.state.settingsBreadCrumbs.join(' > ')} </Text>
                    <TouchableOpacity onPress={() => {this.settingsRemove()}}>
                        <FontAwesomeIcon
                        icon={ faTimes }
                        size={20}
                        style={{color: 'red'}}/>
                    </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {this.state.settingsMenu}
                    </ScrollView>
                </View>
            }
            <Modal send={this.sendSketch} close={this.closeSketch} visible={this.state.visible}/>
          </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setMessagesOnGroup: (messagesOnGroup) => dispatch(actions.setMessagesOnGroup(messagesOnGroup)),
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup)),
    updateMessagesOnGroup: (message) => dispatch(actions.updateMessagesOnGroup(message)),
    updateMessageByCode: (message) => dispatch(actions.updateMessageByCode(message)),
    viewMenu: (isViewing) => dispatch(actions.viewMenu(isViewing))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagesV3);