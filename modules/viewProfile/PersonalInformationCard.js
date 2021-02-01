import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Color, BasicStyles } from 'common'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faEnvelope, faPhoneAlt, faCalendarAlt, faMapMarkerAlt, faCircle } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-regular-svg-icons';
import styles from './Style';
class PersonalInformationCard extends Component {
  _renderTextIcon = (icon, text) => {
    return (
      <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
          marginLeft: '5%',
          marginRight: '5%',
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray
        }}>
        <FontAwesomeIcon icon={icon} style={{ marginRight: 5 }} size={20} />
        <Text style={{
          fontSize: BasicStyles.standardFontSize
        }}>{text}</Text>
      </View>
    )
  }
  render() {
    let { _renderTextIcon } = this
    const { user } = this.props
    return (
      <View>
        <View style={{
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 10
        }}>
            <Text style={{
              fontWeight: 'bold'
            }}>Personal Information</Text>
        </View>
        {_renderTextIcon(faUserCircle, user.information.first_name)}
        {_renderTextIcon(faEnvelope, user.email)}
        {_renderTextIcon(faCircle,  user.information.sex)}
        {_renderTextIcon(faPhoneAlt, user.information.cellular_number)}
        {_renderTextIcon(faCalendarAlt, user.information.birth_date_human)}
        {_renderTextIcon(faMapMarkerAlt, user.information.address)}
      </View>
    )
  }
}

export default PersonalInformationCard;