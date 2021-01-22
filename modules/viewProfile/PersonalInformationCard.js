import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Color, BasicStyles } from 'common'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faEnvelope, faPhoneAlt, faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-regular-svg-icons';
import styles from './Style';
class PersonalInformationCard extends Component {
    _renderTextIcon = (icon, text) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <FontAwesomeIcon icon={icon} style={{ marginRight: 5 }} size={20} />
                <Text style={[{ fontWeight: 'bold', margin: 2, fontSize: BasicStyles.standardFontSize }]}>{text}</Text>
            </View>
        )
    }
    render() {
        let { _renderTextIcon } = this
        const { user } = this.props
        return (
            <View>
                <View style={styles.cardHeader}>
                    <Text style={[{ fontSize: BasicStyles.standardFontSize }, styles.cardHeaderText]}>Personal Information</Text>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.rows}>
                        <View style={[styles.col, { paddingLeft: 20 }]}>
                            {_renderTextIcon(faUserCircle, user.information.first_name != null ? user.information.first_name : "---<>---")}
                            {_renderTextIcon(faEnvelope, user.email != null ? user.email : "---<>---")}
                            {_renderTextIcon(faUserCircle,  user.information.sex != null ? user.information.sex : "---<>---")}
                        </View>
                        <View style={[styles.col, { paddingRight: 25 }]}>
                            {_renderTextIcon(faPhoneAlt, user.information.cellular_number != null ? user.information.cellular_number : "---<>---")}
                            {_renderTextIcon(faCalendarAlt, user.information.birth_date_human != null ? user.information.birth_date_human : "---<>---")}
                            {_renderTextIcon(faMapMarkerAlt, user.information.address != null ? user.information.address : "---<>---")}
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default PersonalInformationCard;