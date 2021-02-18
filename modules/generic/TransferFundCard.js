import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faStar as Solid } from '@fortawesome/free-solid-svg-icons';
import {faStar as Regular} from '@fortawesome/free-regular-svg-icons';
import styles from './TransferFundStyle.js';
import {connect} from 'react-redux';
import {BasicStyles, Color} from 'common';

class TransferFundCard extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedStar: null
    }
  }
  
  renderStars = () => {
    const starsNumber = [1, 2, 3, 4, 5];
    return starsNumber.map((star, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({selectedStar: index + 1});
          }}
          key={index}
          style={styles.StarContainer}>
          <FontAwesomeIcon
            color={'#FFCC00'}
            icon={Solid}
            size={BasicStyles.iconSize}
            style={{
              color: '#FFCC00',
            }}
          />
        </TouchableOpacity>
      )
    })
  }

  render() {
    const {user, theme} = this.props.state
    return (
      <SafeAreaView>
        <View
          style={[
            {
              paddingTop: 20,
              paddingBottom: 20,
              alignItems: 'center'
            }
          ]}
        >
         {
            user.profile != null && user.profile.url != null && (
              <Image
                source={{uri: Config.BACKEND_URL  + user.profile.url}}
                style={BasicStyles.profileImageSize}/>
            )
          }
          {
            (user.profile == null || (user.profile != null && user.profile.url == null)) && (
              <FontAwesomeIcon
                icon={faUserCircle}
                size={BasicStyles.profileIconSize + 30}
                style={{
                  color: theme ? theme.primary : Color.primary
                }}
              />
            )
          }
          <Text style={{
            marginTop: 10,
            color: theme ? theme.primary : Color.primary
          }}> {user} </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center'
          }}
        >
          {
            this.renderStars()
          }
        </View>
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <TouchableHighlight>
            <Text>
              CANCEL
            </Text>
          </TouchableHighlight>
          <TouchableHighlight>
            <Text>
              CONTINUE
            </Text>
          </TouchableHighlight>
        </View>
        <Text>Informations about Request and Charges</Text>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransferFundCard);
