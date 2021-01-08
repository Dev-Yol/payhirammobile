import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { BasicStyles, Color } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faCheckCircle, faUserCircle, faChevronLeft, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular, faAddressCard as faAddressCardOutline, faSmile as empty } from '@fortawesome/free-regular-svg-icons';
import styles from './Style';
import Config from 'src/config';
import PersonalInformationCard from './PersonalInformationCard';
import EducationalBackgroundCard from './EducationalBackgroundCard';
const width = Math.round(Dimensions.get('window').width);
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
  renderID(cards) {
    return (
      cards != null || cards != undefined ?
        cards.map(el => {
          return (
            <View style={
              {
                width: (width / 2) - 4,
                borderWidth: 1,
                borderColor: Color.gray,
                alignItems: 'center',
                margin: 2
              }
            }>
              <FontAwesomeIcon
                icon={faAddressCardOutline}
                size={100}
                style={{
                  color: Color.normalGray
                }}
              />
              <Text
                style={{
                  fontSize: BasicStyles.standardFontSize
                }}
              > {el.title.replace("_", " ").toUpperCase()} </Text>
            </View>
          )
        })
      :
        <View style={
          {
            width: (width - 4),
            borderWidth: 1,
            borderColor: Color.gray,
            alignItems: 'center',
            margin: 2,
            paddingTop: 30,
            paddingBottom: 30
          }
        }>
          <FontAwesomeIcon
            icon={empty}
            size={100}
            style={{
              color: Color.danger
            }}
          />
          <Text
            style={{
              fontSize: BasicStyles.standardFontSize
            }}
          > Nothing to show </Text>
        </View>
    )
  }
  render() {
    const {user} = this.props.navigation.state.params
    const { cards } = user.account
    const ratings = { stars: user.rating.stars }
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
              <View 
                style={[
                  styles.sectionHeadingStyle,
                  {
                    paddingTop: 30
                  }
                ]}
              >
                {
                 user &&  user.account.profile != null && user.account.profile.url != null && (
                    <Image
                      source={{ uri: Config.BACKEND_URL + user.account.profile.url }}
                      style={[
                        styles.image, 
                        {
                          borderRadius: 70,
                          marginTop: 10
                        }
                      ]} />
                    )
                } 
                {
                  // && user.account_profile == null || (user.account_profile != null && user.account_profile.url == null)
                  (user.account.profile == null || user.account.profile.url == null) && (
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      size={100}
                      style={{
                        color: Color.white,
                        marginTop: 30
                      }}
                    />
                  )
                }
              </View>
              <Text style={styles.username}>{user.account.username}</Text>
              <View style={[styles.ratings, { flexDirection: 'row', alignItems: 'center', alignContent: 'center' }]}>
                  { stars}
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
          <PersonalInformationCard user={user}/>
          {/* <EducationalBackgroundCard user={user}/> */}

          <View style={styles.cardHeader}>
            <Text style={[{ fontSize: BasicStyles.standardFontSize }, styles.cardHeaderText]}>ID's</Text>
          </View>

          <View style={
            { 
              flexDirection: 'row',
              flex: 1,
              flexWrap: 'wrap',
              alignItems: 'flex-start'
            }
          }>
            {/*<View>
              <FontAwesomeIcon
                icon={faAddressCard}
                size={100}
                style={{ marginHorizontal: 25 }}
              />
            </View>*/}
            {
              this.renderID(cards)
            }
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
