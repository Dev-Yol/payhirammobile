import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { BasicStyles, Color } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faCheckCircle, faUserCircle, faChevronLeft, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular, faAddressCard as faAddressCardOutline } from '@fortawesome/free-regular-svg-icons';
import styles from './Style';
import Config from 'src/config';
import PersonalInformationCard from './PersonalInformationCard';
import EducationalBackgroundCard from './EducationalBackgroundCard';
class ViewProfile extends Component {
    state = {
        accepted: false
    }
    goBack = () => {
        this.props.navigation.pop();
    };
    toggle = () => {
        let status = this.state.accepted
        this.setState({ accepted: !status })
    }
    render() {
        const { user } = this.props.navigation.state.params
        {console.log("---user props--- ", user)}
        const ratings = { stars: user.rating }
        let stars = []
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    icon={(ratings.stars > i) ? faStar : faStarRegular}
                    size={20}
                    style={{
                        color: Color.warning,
                        marginTop: 5,
                        marginHorizontal: 5
                    }}
                    key={i}
                />
            )
        }
        const removeButton = () => {
            return <View style={{ alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginBottom: 5, paddingTop: 20 }}>
                <TouchableHighlight
                    onPress={this.toggle}
                    style={[BasicStyles.btn, BasicStyles.btnDanger]}
                    underlayColor={Color.gray}>
                    <Text style={BasicStyles.textWhite}>
                        Remove
                    </Text>
                </TouchableHighlight>
            </View>
        }
        return (
            <>
                <View style={[styles.headerButton ,{zIndex:1000}]}>
                    <TouchableOpacity onPress={this.goBack}>
                        <FontAwesomeIcon icon={faChevronLeft} color={Color.white} size={BasicStyles.iconSize} />
                    </TouchableOpacity>
                </View>
                <ScrollView >
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>

                            <View style={styles.imageContainer}>
                            </View>
                            <View style={styles.sectionHeadingStyle}>
                                {/* {
                               user &&  user.account_profile != null && user.account_profile.url != null && (
                                    <Image
                                        source={{ uri: Config.BACKEND_URL + user.account_profile.url }}
                                        style={[styles.image, {
                                            borderRadius: 70
                                        }]} />
                                )
                            } */}
                                {
                                    // && user.account_profile == null || (user.account_profile != null && user.account_profile.url == null)
                                    ((!user)) && (
                                        <FontAwesomeIcon
                                            icon={faUserCircle}
                                            size={100}
                                            style={{
                                                color: Color.white
                                            }}
                                        />
                                    )
                                }
                            </View>
                            <Text style={styles.username}>Kennette Canales</Text>
                            <View style={[styles.ratings, { flexDirection: 'row', alignItems: 'center', alignContent: 'center' }]}>
                                {stars}
                            </View>
                            <View style={[styles.verifiedContainer, { marginRight: 20, }]}>
                                <Text style={styles.verifiedText}>
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        size={16}
                                        style={{
                                            backgroundColor: Color.white,
                                            color: Color.info,
                                            borderRadius: 20,

                                        }}
                                    />
                                    <Text style={{ fontSize: 16 }}>{' '}Verified</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    <PersonalInformationCard />
                    <EducationalBackgroundCard />
                    <View style={styles.cardHeader}>
                        <Text style={[{ fontSize: BasicStyles.standardFontSize }, styles.cardHeaderText]}>ID's</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20, paddingTop: 20 }}>
                        <View>
                            <FontAwesomeIcon
                                icon={faAddressCard}
                                size={100}
                                style={{ marginHorizontal: 25 }}
                            />
                        </View>
                        <View>
                            <FontAwesomeIcon
                                icon={faAddressCardOutline}
                                size={100}
                                style={{ marginHorizontal: 25 }}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={{ borderTopColor: Color.lightGray, borderTopWidth: 1 }}>
                    {
                        this.state.accepted ? removeButton() :

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5, paddingTop: 20 }}>
                                <TouchableHighlight
                                    onPress={this.toggle}
                                    style={[BasicStyles.btn, BasicStyles.btnDanger, { width: '45%' }]}
                                    underlayColor={Color.gray}>
                                    <Text style={BasicStyles.textWhite}>
                                        Decline
                 </Text>
                                </TouchableHighlight>
                                <View style={{ width: "2%" }}></View>
                                <TouchableHighlight
                                    onPress={this.toggle}
                                    style={[BasicStyles.btn, BasicStyles.btnSecondary, { width: '45%' }]}
                                    underlayColor={Color.gray}>
                                    <Text style={BasicStyles.textWhite}>
                                        Accept
                 </Text>
                                </TouchableHighlight>
                            </View>
                    }
                </View>
            </>
        );
    }
}

export default ViewProfile
