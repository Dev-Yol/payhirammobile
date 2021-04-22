import React, {Component} from 'react';
import Style from 'modules/messenger/Style.js';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {BasicStyles, Color, Routes} from 'common';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import Sketch from 'components/Modal/Sketch.js';
import ImagePicker from 'react-native-image-picker';
import Api from 'services/api/index.js';
const width = Math.round(Dimensions.get('window').width);
class SendRequirements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sketchModal: false,
      signatureId: 0
    }
  }

  componentDidMount = () => {
    const { messengerGroup, user } = this.props.state;
    console.log('======================', messengerGroup, '+++++++++++++++++++++++++++++++++', user)
  }
  
  sendImageWithPayload = (url, id) => {
    const { messengerGroup, user } = this.props.state;
    let parameter = {
      messenger_group_id: messengerGroup.id,
      message: null,
      account_id: user.id,
      status: 0,
      payload: 'image',
      payload_value: id,
      url: url
    }
    Api.request(Routes.mmCreateWithImage, parameter, response => {
      this.props.onLoading(false)
      this.props.onFinished()
    })
  }

  uploadBase64 = (result) => {
    const { user } = this.props.state;
    let formData = new FormData();
    formData.append('file_base64', result);
    formData.append('account_id', user.id);
    this.props.onLoading(true)
    Api.upload(Routes.imageUploadBase64, formData, response => {
      this.sendImageWithPayload(response.data.data, this.state.signatureId)
    })
  }

  addFakeMessage = (uri, id) => {
    const { user, messengerGroup, messagesOnGroup } = this.props.state;
    let parameter = {
      messenger_group_id: messengerGroup.id,
      message: null,
      account_id: user.id,
      status: 0,
      payload: 'image',
      payload_value: null,
      url: uri,
      code: messagesOnGroup.messages.length + 1
    }
    let newMessageTemp = {
      ...parameter,
      account: user,
      created_at_human: null,
      sending_flag: true,
      files: [{
        url: uri
      }],
      error: null
    }
    const { updateMessagesOnGroup } = this.props;
    updateMessagesOnGroup(newMessageTemp);
  }

  handleChoosePhoto = (id) => {
    const { user } = this.props.state;
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        let formData = new FormData();
        let uri = Platform.OS == "android" ? response.uri : response.uri.replace("file://", "")
        formData.append("file", {
          name: response.fileName,
          type: response.type,
          uri: uri
        });
        this.addFakeMessage(uri, id)
        formData.append('file_url', response.fileName);
        formData.append('account_id', user.id);
        this.props.onLoading(true)
        Api.upload(Routes.imageUploadUnLink, formData, imageResponse => {
          // add message
          if(imageResponse.data.data != null){
            this.sendImageWithPayload(imageResponse.data.data, id)
          }
        })
      }else{
        this.setState({ photo: null })
      }
    })
  }
  render(){
    const { user, messengerGroup } = this.props.state;
    const { sketchModal } = this.state;
    return (
      <View style={{
        marginBottom: 50
      }}>
        <View>
          <Text style={Style.templateText}>Hi {user.username}! You are now messaging with </Text>
        </View>
        <ScrollView horizontal={true} style={[Style.ScrollView, {
          marginBottom: 50
        }]}>
          <View style={{
            flexDirection: 'row'
          }}>
          {/* {
            messengerGroup.validations.requirements.map((item, index) => {
              if(item.validations != null){
                return (
                  <View style={{
                      width: (width / 2) - 20,
                      height: 50,
                      marginRight: 10
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        if(item.payload == 'signature'){
                          this.setState({sketchModal: true, signatureId: item.validations.id})
                        }else{
                          this.handleChoosePhoto(item.validations.id)
                        }
                      }} 
                      style={[Style.templateBtn, {
                        width: '100%',
                        height: 50,
                        marginBottom: 50
                      }]}
                      key={index}
                      >
                      <Text style={Style.templateText}>{item.title}</Text>
                    </TouchableOpacity>
                  </View>
                )
              }
            })
          } */}
          </View>
        </ScrollView>
        <Sketch
          visible={sketchModal}
          close={() => this.setState({sketchModal: false})}
          send={(result) => this.uploadBase64(result)}
        ></Sketch>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    updateMessagesOnGroup: (message) => dispatch(actions.updateMessagesOnGroup(message)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendRequirements);
