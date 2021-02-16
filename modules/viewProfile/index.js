import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';
import { BasicStyles, Color, Routes } from 'common';
import UserImage from 'components/User/Image.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faCheckCircle, faUserCircle, faChevronLeft, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular, faAddressCard as faAddressCardOutline, faSmile as empty } from '@fortawesome/free-regular-svg-icons';
import styles from './Style';
import Config from 'src/config';
import EducationalBackgroundCard from './EducationalBackgroundCard';
import PersonalInformationCard from './PersonalInformationCard';
import Button from 'components/Form/Button';
import { connect } from 'react-redux';
import { Rating } from 'components';
import Api from 'services/api/index.js';
import { Spinner } from 'components';

const height = Math.round(Dimensions.get('window').height);
class ViewProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      educationalBackground: null,
      user: null,
      isLoading: false
    };
  }
  componentDidMount() {
    this.retrieveAccount();
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  retrieveAccount = () => {
    console.log(this.props.navigation.state.params.user.account.code, "=========");
    let parameter = {
      condition: [{
        value: this.props.navigation.state.params.code ? this.props.navigation.state.params.code : this.props.navigation.state.params.user.account.code,
        clause: '=',
        column: 'code'
      }]
    }
    console.log(parameter, "=====");
    this.setState({ isLoading: true });
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.retrieveEducationalBackground(response.data[0].id);
        this.setState({ user: response.data[0] })
      } else {
        this.setState({ user: null })
      }
    });
  }

  retrieveEducationalBackground = (id) => {
    let parameter = {
      condition: [{
        value: id,
        clause: '=',
        column: 'account_id'
      }]
    }
    this.setState({ isLoading: true });
    Api.request(Routes.educationsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ educationalBackground: response.data[0] })
      } else {
        this.setState({ educationalBackground: null })
      }
    });
  }

  render() {
    const { user } = this.state
    const { theme } = this.props.state;
    return (
      <View>
        <View>
          <ScrollView >
            <View style={styles.container}>
              <View style={{
                height: height / 3,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme ? theme.primary : Color.primary
              }}>
                {user && (
                  <View>
                    <View>
                      <UserImage 
                        user={{profile: user.account_profile}}
                        color={Color.white} style={{
                        width: 100,
                        height: 100,
                        borderRadius: 100
                      }}
                        size={100}
                      />
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 15
                    }}>
                      <Text style={{
                        marginLeft: 5,
                        color: Color.white
                      }}>{user.username}</Text>
                    </View>
                  </View>
                )}

                {user && user.rating && (
                  <View>
                    <Rating ratings={rating} label={null}></Rating>
                  </View>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size={16}
                    style={{
                      backgroundColor: Color.white,
                      color: Color.info,
                      borderRadius: 20,
                    }}
                  />
                  <Text style={{ color: Color.white, fontStyle: 'italic' }}>  Verified</Text>
                </View>

              </View>
              {
                user && user.account_information && (
                  <View>
                    <Text
                      style={{
                        borderBottomWidth: 1,
                        padding: 15,
                        fontWeight: 'bold',
                        borderColor: Color.gray,
                      }}>
                      PERSONAL INFORMATION
                    </Text>
                    <PersonalInformationCard user={user} />
                  </View>
                )
              }
              {this.state.isLoading ? <Spinner mode="overlay" /> : null}

              {
                this.state.educationalBackground && (
                <View>
                  <Text
                    style={{
                      borderBottomWidth: 1,
                      padding: 15,
                      fontWeight: 'bold',
                      borderColor: Color.gray,
                    }}>
                    EDUCATIONAL BACKGROUND
                  </Text>
                      <EducationalBackgroundCard user={this.state.educationalBackground} />
                </View>
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
              style={{
                flexDirection: 'row'
              }}>
              <Button
                title={'Send Request'}
                onClick={() => { }}
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
      </View>
    );
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
