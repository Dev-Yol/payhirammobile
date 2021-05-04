import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Color, BasicStyles } from 'common'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faEnvelope, faPhoneAlt, faCalendarAlt, faMapMarkerAlt, faCircle } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-regular-svg-icons';
import styles from './Style';
class PersonalInformationCard extends Component {
  _renderTextIcon = (icon, text, label) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        paddingTop: 15,
        paddingRight: '15%'
      }}>
        <View style={{
          backgroundColor:'#ededed',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 12,
          marginRight: '5%',
          borderRadius: 100
        }}>
          <FontAwesomeIcon icon={icon} size={20} />
        </View>
        <Text style={{
          fontSize: 16,
          marginTop: -15
        }}>{text}</Text>
        <Text style={{
          fontSize: 12,
          position: 'absolute',
          left: 60,
          bottom: -7
        }}>{'\n\n'}{label}</Text>
      </View>
    )
  }
  render() {
    let { _renderTextIcon } = this
    const { user } = this.props
    console.log(user, 'user');
    return (
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start'
        }}>
          <View style={{width: '100%'}}>
            {_renderTextIcon(faUserCircle, user?.first_name + ' ' + user?.last_name || 'No data', 'Full Name')}
            {_renderTextIcon(faEnvelope, user?.email || 'No data', 'Email')}
            {_renderTextIcon(faUserCircle,  user?.sex || 'No data', 'Gender')}
            {_renderTextIcon(faPhoneAlt, user?.cellular_number || 'No data', 'Phone Number')}
            {_renderTextIcon(faCalendarAlt, user?.birth_date || 'No data', 'Birth Date')}
            {_renderTextIcon(faMapMarkerAlt, user?.address || 'No data', 'Address')}
          </View>
        </View>
    )
  }
}

export default PersonalInformationCard;