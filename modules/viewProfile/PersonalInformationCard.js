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
        paddingTop: 15
      }}>
        <View style={{
          backgroundColor:'#ededed',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          marginRight: '5%',
          borderRadius: 100
        }}>
          <FontAwesomeIcon icon={icon} size={20} />
        </View>
        <Text style={{
          fontSize: 16
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
    return (
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start'
        }}>
          <View style={{width: '100%'}}>
            {_renderTextIcon(faUserCircle, user?.information?.first_name + ' ' + user?.information?.last_name || 'No data', 'Full Name')}
            {_renderTextIcon(faEnvelope, user?.email || 'No data', 'Email')}
            {_renderTextIcon(faUserCircle,  user?.information?.sex || 'No data', 'Gender')}
            {_renderTextIcon(faPhoneAlt, user?.information?.cellular_number || 'No data', 'Phone Number')}
            {_renderTextIcon(faCalendarAlt, user?.information?.birth_date_human || 'No data', 'Birth Date')}
            {_renderTextIcon(faMapMarkerAlt, user?.information?.address || 'No data', 'Address')}
          </View>
        </View>
    )
  }
}

export default PersonalInformationCard;