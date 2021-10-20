import React, {Component} from 'react';
import { View, Modal, Text, Image } from 'react-native';
import Button from 'components/Form/Button';
import { Color, BasicStyles } from 'common';
import Otp from './Otp.js'
import { connect } from 'react-redux';
import { navigationRef } from 'modules/generic/SecurityAlert';


class AuthorizedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  logout(){
    const { logout } = this.props;
    logout();
    setTimeout(() => {
      // this.props.navigation.navigate('loginStack');
      navigationRef.current?._navigation.navigate('loginStack')
    }, 100)
  }

  render() {
    const { user, theme } = this.props.state;
    return (
      <View style={{
        width: '100%'
      }}>
      {
        (this.props.showModal && user) && (
          <Modal
            visible={this.props.showModal}
            animationType={'slide'}
            transparent={true}>
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              flex: 1
            }}>
              <View style={{
                minHeight: 100,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 20,
                paddingBottom: 20,
                borderRadius: 12,
                width: '80%',
                marginRight: '10%',
                marginLeft: '10%',
                backgroundColor: 'white'
              }}>

                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    paddingTop: 10,
                    textAlign: 'center',
                  }}>
                    WELCOME TO PAYHIRAM.PH
                  </Text>

                  <Text style={{
                    fontSize: 15,
                    paddingTop: 3,
                    textAlign: 'center',
                    marginBottom: '10%'
                  }}>
                    Your Transfer of Choice
                  </Text>

                  <View style={{
                    width: '100%',
                    alignItems: 'center'
                  }}>
                    <Image source={require('assets/Device.png')} style={{
                      height: 100,
                      width: 100
                    }}/>
                  </View>

                  <Text style={{
                    fontSize: 14,
                    paddingTop: '10%',
                    textAlign: 'center',
                    padding: 10,
                    color: 'gray',
                    fontStyle: 'italic'
                  }}>
                    {this.props.title}
                  </Text>
                  {
                    this.props.auths == true && (
                    <View style={{
                      width: '100%',
                      alignItems: 'center',
                      marginTop: 5
                    }}>
                      <Button
                        onClick={() => this.props.authorize()}
                        title={'Authorize'}
                        style={{
                          backgroundColor: theme ? theme.secondary : Color.secondary,
                          width: '50%',
                          borderRadius: 25
                        }}
                      />
                    </View>
                    )
                  }
                  {
                    (this.props.secondary == true) && (
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'space-between',
                        width: '100%',
                        marginTop: 10,
                        padding: 10
                      }}>
                        <Button
                          onClick={() => this.logout()}
                          title={'Logout'}
                          style={{
                            borderColor: Color.danger,
                            borderWidth: 1,
                            width: '45%',
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: 'transparent'
                          }}
                          textStyle={{
                            color: Color.danger,
                            fontSize: BasicStyles.standardFontSize
                          }}
                        />
                        <Button
                          onClick={() => this.props.authorized()}
                          title={'Authorize'}
                          style={{
                            backgroundColor: theme ? theme.secondary : Color.secondary,
                            width: '50%',
                            borderRadius: 25
                          }}
                        />
                      </View>
                    )
                  }
              </View>
            </View>

          </Modal>
        )
      }
      {
        (this.props.showModals && user) && (
        <Modal
          visible={this.props.showModals}
          animationType={'slide'}
          transparent={true}>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1
          }}>
            <View style={{
              minHeight: 100,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 20,
              paddingBottom: 20,
              borderRadius: 12,
              width: '80%',
              marginRight: '10%',
              marginLeft: '10%',
              backgroundColor: 'white'
            }}>

                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  paddingTop: 10,
                  textAlign: 'center',
                }}>
                  OTP CODE
                </Text>

                <Text style={{
                  fontSize: 14,
                  // paddingTop: '10%',
                  textAlign: 'center',
                  padding: 5,
                  color: 'gray',
                  marginBottom: 25,
                  fontStyle: 'italic'
                }}>
                  {this.props.title}
                </Text>
                <Otp
                blockedFlag={false}
                back={() => {this.props.back()}}
                verify={() => {this.props.authorize()}}
                />
            </View>
          </View>

        </Modal>
      )
      }
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state })
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizedModal);