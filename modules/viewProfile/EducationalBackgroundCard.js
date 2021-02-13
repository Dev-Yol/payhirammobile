import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Color, BasicStyles } from 'common'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGraduationCap , faUniversity , faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-regular-svg-icons';
import styles from './Style';
class PersonalInformationCard extends Component {
    _renderTextIcon = (icon, text, subtitle) => {
        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <FontAwesomeIcon icon={icon} style={{ marginRight: 5 }} size={20} />
                    <Text style={[{ fontWeight: 'bold', margin: 2, fontSize: BasicStyles.standardFontSize }]}>{text}</Text>
                </View>
                <View style={{ flex: 1,  }}>
                    <Text style={{ marginLeft:30, maxWidth: "80%", fontSize: BasicStyles.standardFontSize }}>{subtitle}</Text>
                </View>
            </View>
        )
    }
    render() {
        let { _renderTextIcon } = this
        return (
            <View style={{marginBottom:20}}>
                <View style={styles.rowContainer}>
                    <View >
                        <View style={[{ paddingLeft: 20, padding:20 }]}>
                            <Text style={[{ fontWeight: 'bold', margin: 2, fontSize: BasicStyles.standardFontSize }]}>Tertiary</Text>
                            {_renderTextIcon(faGraduationCap, 'Bachelor of Science and Information Technology', 'University of San Carlos • Talamban, Cebu City 2015 - 2019')}
                        </View>
                        <View style={[{ paddingLeft: 20, padding:30 }]}>
                            <Text style={[{ fontWeight: 'bold', margin: 2, fontSize: BasicStyles.standardFontSize }]}>Tertiary</Text>
                            {_renderTextIcon(faUniversity, 'University of San Carlos', '2011-2015 • Talamban, Cebu City')}
                        </View>
                        <View style={[{ paddingLeft: 20, padding:20 }]}>
                            <Text style={[{ fontWeight: 'bold', margin: 2, fontSize: BasicStyles.standardFontSize }]}>Tertiary</Text>
                            {_renderTextIcon(faUserGraduate, 'University of San Carlos', '2005-2011 • Talamban, Cebu City')}
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}




export default PersonalInformationCard;