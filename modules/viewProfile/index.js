import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { BasicStyles, Color } from 'common';
import UserImage  from 'components/User/Image.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faCheckCircle, faUserCircle, faChevronLeft, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular, faAddressCard as faAddressCardOutline, faSmile as empty } from '@fortawesome/free-regular-svg-icons';
import styles from './Style';
import Config from 'src/config';
import PersonalInformationCard from './PersonalInformationCard';
import Button from 'components/Form/Button';
import {connect} from 'react-redux';
import { Rating } from 'components';

const height = Math.round(Dimensions.get('window').height);
class ViewProfile extends Component {
  state = {
    accepted: false
  }
  goBack = () => {
    this.props.navigation.pop();
  };

  render() {
    const { user, rating } = this.props.navigation.state.params
    const { cards } = user
    const { theme } = this.props.state;
    return (
      <View>
        <ScrollView >
          <View style={styles.container}>
            <View style={{
              height: height / 3,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme ? theme.primary : Color.primary
            }}>
              <View style={{
              }}>
                <UserImage user={user} color={Color.white} style={{
                  width: 100,
                  height: 100
                }}
                size={100}
                />
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size={16}
                  style={{
                    backgroundColor: Color.white,
                    color: Color.info,
                    borderRadius: 20,
                  }}
                />
                <Text style={{
                  marginLeft: 5,
                  color: Color.white
                }}>{user.username}</Text>
              </View>

              <View>
                <Rating ratings={rating} label={null}></Rating>
              </View>

            </View>
            
            {
              user.information && (
                <PersonalInformationCard user={user}/>
              )
            }

          </View>

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
      </View>
    );
  }
}
const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
