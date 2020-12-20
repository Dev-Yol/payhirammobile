import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircle, faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import {BasicStyles, Color} from 'common';
import {UserImage, Rating} from 'components';

class RequestItem extends Component {
  render() {
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={{alignItems: 'center', margin: 10}}>
            <View style={[{width: '100%'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <UserImage user={''} style={[{flex: 1}]} />
                <Text style={[{fontWeight: 'bold', margin: 2, flex: 4}]}>
                  Kennette Canales
                </Text>
                <Rating ratings={''} style={[{flex: 2}]}></Rating>
                <TouchableOpacity
                  style={[
                    {marginRight: 10, marginLeft: 10, alignItems: 'center'},
                  ]}>
                  <FontAwesomeIcon
                    icon={faEllipsisH}
                    style={{color: Color.black}}
                    size={BasicStyles.iconSize}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[{margin: 2}]}>
                Cebu South Road, Cebu City, Philippines
              </Text>
              <Text style={[{margin: 2}]}>Needed on: September 25, 2020</Text>
              <Text style={[{margin: 2}]}>THIS IS A TEST.</Text>
              <Text style={[{margin: 2, fontSize: 10}]}>
                September 23, 2020
              </Text>
            </View>
          </View>
          <View>
            <View style={[{flexDirection: 'row', padding: 10}]}>
              <Text style={[{fontWeight: 'bold'}]}>Proposal</Text>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                  },
                ]}>
                <Text>Proccessing fee</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                alignItems: 'center',
              }}>
              <UserImage user={''} style={[{flex: 1}]} />
              <Text style={[{fontWeight: 'bold', margin: 2, flex: 4}]}>
                Kennette Canales
              </Text>
              <Text style={[{fontWeight: 'bold', color: Color.secondary}]}>
                PHP 100.00
              </Text>
            </View>
            <View
              style={[
                {
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  alignItems: 'center',
                },
              ]}>
              <Rating ratings={''} style={[{flex: 2}]}></Rating>
              <FontAwesomeIcon
                icon={faCircle}
                style={{color: Color.secondary, marginHorizontal: 10}}
                size={10}
              />
              <Text>3.5 km</Text>
            </View>
            <View style={{width: '75%', flexDirection: 'row', padding: 10}}>
              <TouchableHighlight
                underlayColor={Color.gray}
                style={[
                  {
                    backgroundColor: Color.primary,
                    width: '35%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    borderRadius: 5,
                  },
                ]}>
                <Text style={{color: Color.white}}>View Profile</Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={Color.gray}
                style={[
                  {
                    backgroundColor: Color.secondary,
                    width: '35%',
                    marginLeft: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    borderRadius: 5,
                  },
                ]}>
                <Text style={{color: Color.white}}>Accept</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                alignItems: 'center',
              }}>
              <UserImage user={''} style={[{flex: 1}]} />
              <Text style={[{fontWeight: 'bold', margin: 2, flex: 4}]}>
                Kennette Canales
              </Text>
              <Text style={[{fontWeight: 'bold', color: Color.secondary}]}>
                PHP 100.00
              </Text>
            </View>
            <View
              style={[
                {
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  alignItems: 'center',
                },
              ]}>
              <Rating ratings={''} style={[{flex: 2}]}></Rating>
              <FontAwesomeIcon
                icon={faCircle}
                style={{color: Color.secondary, marginHorizontal: 10}}
                size={10}
              />
              <Text>3.5 km</Text>
            </View>
            <View style={{width: '75%', flexDirection: 'row', padding: 10}}>
              <TouchableHighlight
                underlayColor={Color.gray}
                style={[
                  {
                    backgroundColor: Color.primary,
                    width: '35%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    borderRadius: 5,
                  },
                ]}>
                <Text style={{color: Color.white}}>View Profile</Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={Color.gray}
                style={[
                  {
                    backgroundColor: Color.secondary,
                    width: '35%',
                    marginLeft: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    borderRadius: 5,
                  },
                ]}>
                <Text style={{color: Color.white}}>Accept</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default RequestItem;
