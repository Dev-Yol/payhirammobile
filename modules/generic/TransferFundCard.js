import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './TransferFundStyle.js';
import {connect} from 'react-redux';
import {BasicStyles} from 'common';

class TransferFundCard extends Component {
  
  render() {
    console.log('\n\n=============================================================', this.props.state.user, '\n\n===============================================================')
    const {user} = this.props.state
    return (
      <SafeAreaView>
        <View
          style={[
            {
              borderColor: 'black',
              borderWidth: 1,
              paddingTop: 20,
              paddingBottom: 20,
              alignItems: 'center'
            }
          ]}
        >
         {/* {
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
                size={BasicStyles.profileIconSize}
                style={{
                  color: this.props.color ? this.props.color : Color.primary
                }}
              />
            )
          } */}
          <Text> Full Name </Text>
        </View>
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
