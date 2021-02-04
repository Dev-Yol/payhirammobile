import React, { Component } from 'react';
import { View, Picker, Text, ScrollView, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import TicketButton from 'modules/createTicket/TicketButton.js';
import styles from 'modules/createTicket/Styles.js';
import Api from 'services/api/index.js';
import { Routes, BasicStyles } from 'common';
import Dropdown from 'components/InputField/Dropdown'
import { Spinner } from 'components';
import { Card } from 'react-native-elements'
import ImagePicker from '@react-native-community/picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import Color from 'common/Color';
class CreateTicket extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      type: null,
      isLoading: false,
      imageModalUrl: null,
      photo: null,
      isImageModal: false,
      images: [],
    };
  }

  selectedValue = value => {
    this.setState({ type: value });
  };

  create = () => {
    let account_id = this.props.navigation.state.params.user.account_information.account_id
    let parameter = {
      account_id: account_id,
      content: this.state.title,
      status: 'pending',
      type: this.state.type,
      images: this.state.images.join(' ')
    }
    this.setState({ isLoading: true })
    Api.request(Routes.ticketsCreate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data != null) {
        this.props.navigation.push('supportStack');
      }
    })
  }

  choosePhoto = () => {
    const options = {
      noData: false,
    }
    ImagePicker.launchImageLibrary(options, response => {
      console.log(response, "=======");
      if (response.uri) {
        let images = this.state.images;
        images.push(`data:image/png;base64,${response.data}`);
        this.setState({ images: images });
      } else {
        this.setState({ photo: null });
      }
    })
  }


  setImage = (url) => {
    this.setState({ imageModalUrl: url })
    setTimeout(() => {
      this.setState({ isImageModal: true })
    }, 500)
  }

  render() {
    let data = [{ title: 'Bug', value: 'bug' }, { title: 'Question', value: 'question' }, { title: 'Enhancement', value: 'enhancement' }, { title: 'Invalid', value: 'invalid' }, { title: 'Duplicate', value: 'duplicate' }, { title: 'Help wanted', value: 'help wanted' }]
    return (
      <View style={styles.CreateTicketContainer}>
        <ScrollView>
          <View>
            <View style={styles.InputContainer}>
              <Text style={styles.TicketInputTitleContainer}>Title</Text>
              <TextInput
                style={BasicStyles.formControl}
                onChangeText={(title) => this.setState({ title })}
                value={this.state.title}
                placeholder={'Title'}
              />
            </View>
            <View style={styles.InputContainer}>
              <Text style={styles.TicketInputTitleContainer}>Description</Text>
              <TextInput
                style={BasicStyles.formControl}
                onChangeText={(description) => this.setState({ description })}
                value={this.state.description}
                placeholder={'Description'}
              />
            </View>
            <View style={styles.InputContainer}>
              <Text>Type</Text>
              <Dropdown selectedValue={this.state.type} onChange={this.selectedValue} data={data}></Dropdown>
            </View>
            {this.state.isLoading ? <Spinner mode="overlay" /> : null}
            <View style={{flexDirection: 'row', padding: 15, width: '90%'}}>
              <TouchableOpacity
                style={{marginBottom: 25, padding: 15}}
                onPress={() => {
                  this.choosePhoto();
                }}>
                <FontAwesomeIcon
                  icon={faImages}
                  style={{
                    color: Color.gray, marginRight: 5
                  }}
                  size={50}
                />
              </TouchableOpacity>
              <ScrollView horizontal={true}>
                {this.state.images.map((u, i) => {
                  return (
                    <View key={i}>
                      <Image
                        source={{ uri: u }}
                        style={styles.Image}
                      />
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>
          <View style={styles.TicketButtonContainer}>
          <TicketButton
            buttonColor="#22B173"
            buttonWidth={350}
            buttonHeight={50}
            fontSize={14}
            textColor="#FFFFFF"
            buttonText="Create Ticket"
            onPress={this.create.bind(this)}
          />
          </View>
        </ScrollView>
        
      </View>
    );
  }
}

export default CreateTicket;
