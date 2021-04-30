import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Helper } from 'common';
import { connect } from 'react-redux';
import Button from 'components/Form/Button';
import { Spinner } from 'components';

class Plans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount = () => {
    const { user } = this.props.state
  }
 
  render() {
    const { isLoading } = this.state
    const { user, theme } = this.props.state;
    return (
        <ScrollView
          showsVerticalScrollIndicator={false}>
        <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: this.props.paddingTop ? this.props.paddingTop : 0,
            width: '100%'
          }}>
            {
                Helper.partner.map((item, index) => {
                    return (
                    <View
                    style={{
                        width: '100%',
                        marginTop: 35,
                        borderRadius: 12,
                        paddingLeft: 10,
                        paddingRight: 10,
                        padding: 15,
                        backgroundColor: theme ? theme.primary : Color.primary
                        }}
                        key={index}>
                    {/* <View style={{
                      width: '100%',
                      flexDirection: 'row',
                    }}> */}
                        <View style={{
                          width: '100%'
                        }}>
                          <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: '3%'}}>{item.value}</Text>
                        <Text style={{
                          fontSize: BasicStyles.standardFontSize + 20,
                          textAlign: 'justify',
                          color: Color.black,
                          padding: 50,
                          bottom: 5,
                          paddingLeft: 20,
                          paddingRight: 20,
                          marginBottom: 5,
                          marginRight: 30,
                          marginLeft: 30,
                          borderRadius: 5,
                          backgroundColor: Color.white,
                          fontWeight: 'bold'
                        }}>
                          {item.description}
                        </Text>
                        <Image source={require('assets/Partners.png')} style={{
                            height: 150,
                            width: 150,
                            marginRight: '-20%',
                            marginLeft: '45%',
                            position: 'absolute',
                            marginTop: '13%'
                          }}/>
                        
                        <View style={{
                            width: '100%',
                            textAlign: 'center',
                            justifyContent: 'center',
                            marginLeft: '28%'
                        }}>
                            <Button
                            title={'Apply Now'}
                            onClick={() => {
                                this.props.navigation.navigate('locationScopesStack', {item})
                            }}
                            style={{
                                width: '45%',
                                backgroundColor: theme ? theme.secondary : Color.secondary,
                                height: 40,
                                marginTop: 5
                            }}
                            textStyle={{
                                fontSize: BasicStyles.standardFontSize,
                                color: Color.white
                            }}
                            />
                        </View>
                        </View>
                        {/* <View style={{
                        width: '40%',
                        alignItems: 'flex-end'
                        }}>
                        <FontAwesomeIcon icon={faUserShield} style={{
                            color: Color.white
                        }}
                        size={100}
                        />
                        </View> */}
                    </View>
                    )
                })
            }
                  
                  
                {/* </View> */}
          
          </View>
        </ScrollView>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plans);

