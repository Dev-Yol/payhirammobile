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
import Button from 'components/Form/Button';

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
  
  render() {
    const { user } = this.props.navigation.state.params
    const { cards } = user
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
                 user &&  user.profile != null && user.profile.url != null && (
                    <Image
                      source={{ uri: Config.BACKEND_URL + user.profile.url }}
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
                  (user.profile == null || user.profile.url == null) && (
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
              <Text style={styles.username}>{user.username}</Text>
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

        </ScrollView>
        <View style={{ 
          position: 'absolute',
          bottom: 5,
          left: 0,
          width: '100%'
        }}>
            <View
              style={{ flexDirection: 'row'
              }}>
              <Button
                title={'Send Request'}
                onClick={() => {}}
                style={{
                  width: '90%',
                  marginRight: '5%',
                  marginLeft: '5%',
                  backgroundColor: Color.secondary
                }}
              />
            </View>
        </View> 
      </>     
    );
  }
}

export default ViewProfile
