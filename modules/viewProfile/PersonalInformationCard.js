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
          paddingTop: 12,
          paddingBottom: 12,
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
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start'
        }}>
          <View style={{width: '50%'}}>
            {_renderTextIcon(faUserCircle, user.information.first_name || 'No data')}
            {_renderTextIcon(faEnvelope, user.email || 'No data')}
            {_renderTextIcon(faUserCircle,  user.information.sex || 'No data')}
          </View>
          <View style={{width: '50%'}}>
            {_renderTextIcon(faPhoneAlt, user.information.cellular_number || 'No data')}
            {_renderTextIcon(faCalendarAlt, user.information.birth_date_human || 'No data')}
            {_renderTextIcon(faMapMarkerAlt, user.information.address || 'No data')}
          </View>
        </View>
    )
  }
}

export default PersonalInformationCard;