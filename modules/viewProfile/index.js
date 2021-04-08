import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TouchableHighlight, Dimensions, Alert } from 'react-native';
import { BasicStyles, Color, Routes } from 'common';
import UserImage from 'components/User/Image.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faCheckCircle, faUserCircle, faChevronLeft, faAddressCard, faWallet } from '@fortawesome/free-solid-svg-icons';
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
import { TouchableHighlightBase } from 'react-native';

const height = Math.round(Dimensions.get('window').height);
class ViewProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      educationalBackground: null,
      user: null,
      isLoading: false,
      connection: null,
      title: 'Send Request',
      status: false,
      connections: []
    };
  }
  componentDidMount() {
    this.retrieveAccount();
  }

  retrieveConnections() {
    let parameter = {
      condition: [{
        value: this.props.state.user.id,
        column: "account",
        clause: "or"
      }, {
        value: this.props.state.user.id,
        column: "account_id",
        clause: "="
      }, {
        value: 'declined',
        column: "status",
        clause: "!="
      }],
      offset: 0
    }
    this.setState({isLoading: true})
    Api.request(Routes.circleRetrieve, parameter, response => {
      this.setState({isLoading: false})
      this.setState({ connections: response.data })
      if(response.data.length > 0) {
        this.checkStatus(response.data)
      }
    });
  }

  checkStatus = (array) => {
    const { user } = this.state
    array.map((item, index) => {
      if(item.account.id === user.id) {
        this.setState({connection: item})
      }
    })
  }

  goBack = () => {
    this.props.navigation.pop();
  };

  updateRequest = (status, user) => {
    Alert.alert(
      "Confirmation Message",
      'Are you sure you want to ' + (status == 'accepted' ? 'accept' : 'decline') + ' this request?',
      [
        { text: "Cancel", onPress: () => {
        }},
        { text: "Ok", onPress: () => {
          let parameter = {
            id: user.id,
            status: status
          }
          this.setState({isLoading: true})
          Api.request(Routes.circleUpdate, parameter, response => {
            this.setState({isLoading: false})
            this.retrieveAccount();
          });
        }}
      ],
      { cancelable: false }
    );
  }

  removeRequest = (id) => {
    let parameter = {
      id: id
    }
    this.setState({isLoading: true})
    Api.request(Routes.circleDelete, parameter, response => {
      this.setState({isLoading: false})
      console.log(response, "remove request response");
      if(response.data !== null) {
        this.props.navigation.goBack(null)
      }
    });
  }

  sendRequest = () => {
    let parameter = {
      account_id: this.props.state.user.id,
      to_email: this.state.user && this.state.user.email,
      content: "Sending you an invitation to join my circle."
    }
    this.setState({ isLoading: true });
    Api.request(Routes.circleCreate, parameter, response => {
      this.setState({ isLoading: false })
      console.log(response, "================response upon sending request,===============");
      this.retrieveAccount();
      
    });
  }

  retrieveAccount = () => {
    let parameter = {
      condition: [{
        value: this.props.navigation.state.params.user ? this.props.navigation.state.params.user.account.code : this.props.navigation.state.params.code,
        clause: '=',
        column: 'code'
      }]
    }
    this.setState({ isLoading: true });
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      this.retrieveConnections();
      if (response.data.length > 0) {
        this.retrieveEducationalBackground(response.data[0].id);
        this.setState({ user: this.props.navigation.state.params.user ? this.props.navigation.state.params.user : response.data[0] })
        this.setState({status: true});
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
    console.log(user && user, 'hey');
    return (
      <View>
        <View>
          <ScrollView >
            <View style={styles.container}>
              <View style={{
                height: '35%',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {user && (
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <View>
                      <UserImage
                        user={{ profile: user.profile ? user.profile : user?.account?.profile }}
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
                      }}>{this.props.navigation.state.params.user? user.account.username : user.username}</Text>
                    </View>
                  </View>
                )}

                {user && user.rating && (
                  <View>
                    <Rating ratings={user.rating} label={null}></Rating>
                  </View>
                )}
                { this.state.status === true && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 15 }}>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size={16}
                    style={{
                      backgroundColor: Color.white,
                      color: Color.info,
                      borderRadius: 20, 
                    }}
                  />
                  <Text style={{ fontStyle: 'italic' }}>  Verified</Text>
                </View>)}
                { this.state.status === true && (
                <View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('directTransferDrawer', {
                    data: {
                      payload: 'transfer',
                      code: this.props.navigation.state.params.user ? this.props.navigation.state.params.user.account.code : this.props.navigation.state.params.code,
                      success: false
                    }
                  })}
                  style={{
                    flexDirection: 'row',
                    width: '90%',
                    backgroundColor: theme ? theme.secondary : Color.secondary,
                    marginTop: 5,
                    borderRadius: 45,
                    padding: 13
                  }}
                >
                  <FontAwesomeIcon
                    icon={faWallet}
                    size={16}
                    style={{
                      color: Color.white,
                      borderRadius: 20,
                    }}
                  />
                  <Text style={{color: Color.white}}>   Send To Wallet (Free)</Text>
                </TouchableOpacity>
              </View>)}

              </View>
              {
                user && (
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
                    <PersonalInformationCard user={this.props.navigation.state.params.user ? user.account : this.state.status === true && this.state.connection ? this.state.connection.account : user} />
                  </View>
                )
              }
              {this.state.isLoading ? <Spinner mode="overlay" /> : null}
            </View>

          </ScrollView>
          <View style={{
            position: 'absolute',
            bottom: 5,
            left: 0,
            width: '100%'
          }}>
            { this.state.status === true && user && this.props.state.user && user.account_id === this.props.state.user.id && user.status === 'pending' && (<View
                style={{
                  flexDirection: 'row'
                }}>
                <Button
                  title={'Cancel Request'}
                  onClick={() => this.removeRequest(user.id)}
                  style={{
                    width: '90%',
                    marginRight: '1%',
                    marginLeft: '5%',
                    backgroundColor: Color.danger
                  }}
                />
              </View>)}
              {/* { this.state.status === true && user && this.props.state.user && user.account_id === this.props.state.user.id && user.status === 'accepted' && (<View
                style={{
                  flexDirection: 'row'
                }}>
                <Button
                  title={'Remove From Circle'}
                  onClick={() => this.removeRequest(user.id)}
                  style={{
                    width: '90%',
                    marginRight: '1%',
                    marginLeft: '5%',
                    backgroundColor: Color.danger
                  }}
                />
              </View>)} */}
              { this.state.status === true && user && this.props.state.user && user.account_id !== this.props.state.user.id && user.status === 'accepted' && (<View
                style={{
                  flexDirection: 'row'
                }}>
                <Button
                  title={'Remove From Circle'}
                  onClick={() => this.removeRequest(user.id)}
                  style={{
                    width: '90%',
                    marginRight: '1%',
                    marginLeft: '5%',
                    backgroundColor: Color.danger
                  }}
                />
              </View>)}
             {this.state.status === true && user && this.props.state.user && user.account_id !== this.props.state.user.id && (user.status === 'pending') && (
              <View
                style={{
                  flexDirection: 'row'
                }}>
                <Button
                  title={'Decline Request'}
                  style={{
                    width: '45%',
                    marginRight: '1%',
                    marginLeft: '5%',
                    backgroundColor: Color.danger
                  }}
                  onClick={() => this.updateRequest('declined', user)}
                />
                <Button
                  title={'Accept Request'}
                  style={{
                    width: '45%',
                    marginRight: '5%',
                    backgroundColor: theme ? theme.secondary : Color.secondary
                  }}
                  onClick={() => this.updateRequest('accepted', user)}
                />
              </View>
            )}
            { this.state.status === true && this.props.state.user && this.state.connection && this.state.connection.account_id === this.props.state.user.id && this.state.connection.status === 'pending' && (
            <View
                style={{
                  flexDirection: 'row'
                }}>
                <Button
                  title={'Cancel Request'}
                  onClick={() => this.removeRequest(this.state.connection.id)}
                  style={{
                    width: '90%',
                    marginRight: '1%',
                    marginLeft: '5%',
                    backgroundColor: Color.danger
                  }}
                />
              </View>)}
              { this.state.status === true && this.props.state.user && this.state.connection && this.state.connection.account_id === this.props.state.user.id && this.state.connection.status === 'accepted' && (
            <View
                style={{
                  flexDirection: 'row'
                }}>
                <Button
                  title={'Remove From Circle'}
                  onClick={() => this.removeRequest(this.state.connection.id)}
                  style={{
                    width: '90%',
                    marginRight: '1%',
                    marginLeft: '5%',
                    backgroundColor: Color.danger
                  }}
                />
              </View>)}
              {/* { this.state.status === true && this.props.state.user && this.state.connection && this.state.connection.account_id !== this.props.state.user.id && this.state.connection.status === 'accepted' && (
            <View
                style={{
                  flexDirection: 'row'
                }}>
                <Button
                  title={'Remove From Circle'}
                  onClick={() => this.removeRequest(this.state.connection.id)}
                  style={{
                    width: '90%',
                    marginRight: '1%',
                    marginLeft: '5%',
                    backgroundColor: Color.danger
                  }}
                />
              </View>)} */}
             {this.state.status === true && this.props.state.user && this.state.connection && this.state.connection.account_id !== this.props.state.user.id && (this.state.connection.status === 'pending') && (
              <View
                style={{
                  flexDirection: 'row'
                }}>
                  <Button
                  title={'Decline Request'}
                  style={{
                    width: '45%',
                    marginRight: '1%',
                    marginLeft: '5%',
                    backgroundColor: Color.danger
                  }}
                  onClick={() => this.updateRequest('declined', this.state.connection)}
                />
                <Button
                  title={'Accept Request'}
                  style={{
                    width: '45%',
                    marginRight: '5%',
                    backgroundColor: theme ? theme.secondary : Color.secondary
                  }}
                  onClick={() => this.updateRequest('accepted', this.state.connection)}
                />
              </View>
            )}
            { this.state.status === true && !this.props.navigation.state.params.code === false && this.state.connection === null && user.id !== this.props.state.user.id   && (
              <View
                style={{
                  flexDirection: 'row'
                }}>
                <Button
                  title={'Send Request'}
                  onClick={this.sendRequest}
                  style={{
                    width: '90%',
                    marginRight: '1%',
                    marginLeft: '5%',
                    backgroundColor: Color.secondary
                  }}
                />
              </View>)}
          </View>
        </View>
      </View >
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
