
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './Style';
import {NavigationActions, StackActions} from 'react-navigation';
import {ScrollView, Text, View, Button, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Helper, BasicStyles, Color } from 'common';
import { SliderPicker } from 'react-native-slider-picker';
import DatePicker from 'components/DateTime/index.js'
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBullseye, faMoneyBill, faCalendar, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';

class FilterSlider extends Component {
  constructor(props){
    super(props);
  }
  navigateToScreen = (route) => {
    this.props.navigation.toggleDrawer();
    const navigateAction = NavigationActions.navigate({
      routeName: 'filterStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
            NavigationActions.navigate({routeName: route, params: {
              initialRouteName: route,
              index: 0
            }}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  logoutAction(){
    
    //clear storage
    const { logout, setActiveRoute } = this.props;
    logout();
    // setActiveRoute(null)
    setTimeout(() => {
      // this.navigateToLogin('Login')
      this.props.navigation.navigate('loginStack');
    }, 100)
  }

  render () {
    const { user, theme } = this.props.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={{fontSize: 18, textAlign: 'center', justifyContent: 'center', width: '100%', marginTop: '10%'}}>
              Filter
            </Text>
            <View style={[styles.navSectionStyle, {
              flexDirection: 'row',
              alignItems: 'center'
            }]}>
              <FontAwesomeIcon icon={faBullseye} style={{
                color: theme ? theme.primary : Color.primary,
                marginLeft: 10
              }}/>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToScreen(item.route)}> */}
              <Text style={styles.navItemStyle}>
                Target
              </Text>
            </View>
            <View style={{marginLeft: '5%', marginRight: '5%'}}>
              <Button
                title={'Public'}
                onClick={() => {}}
                style={{
                  width: '70%',
                  marginRight: '30%',
                  marginLeft: '30%',
                  marginBottom: '5%',
                  backgroundColor: Color.danger
                }}
              />
              <Button
                title={'Partner'}
                onClick={() => {}}
                style={{
                  width: '70%',
                  marginRight: '30%',
                  marginLeft: '30%',
                  marginBottom: '5%',
                  backgroundColor: Color.danger
                }}
              />
              <Button
                title={'Circles'}
                onClick={() => {}}
                style={{
                  width: '70%',
                  marginRight: '30%',
                  marginLeft: '30%',
                  backgroundColor: Color.danger
                }}
            />
            </View>
            <View style={[styles.navSectionStyle, {
              flexDirection: 'row',
              alignItems: 'center'
            }]}>
              <FontAwesomeIcon icon={faMoneyBill} style={{
                color: theme ? theme.primary : Color.primary,
                marginLeft: 10
              }}/>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToScreen(item.route)}> */}
              <Text style={styles.navItemStyle}>
                Amount
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: '5%',
              marginRight: '5%'}}>
              <SliderPicker 
                callback={position => {
                  this.setState({ value: position })
                }}
                defaultValue={this.state.value}
                labelFontColor={"#6c7682"}
                labelFontWeight={'600'}
                showFill={true}
                fillColor={'red'}
                labelFontWeight={'bold'}
                showNumberScale={true}
                showSeparatorScale={true}
                buttonBackgroundColor={'#fff'}
                buttonBorderColor={"#6c7682"}
                buttonBorderWidth={2}
                scaleNumberFontWeight={'300'}
                buttonDimensionsPercentage={6}
                buttonBorderColor={'#5842D7'}
                labelFontSize={15}
                heightPercentage={.5}
                widthPercentage={70}
                sliderInnerBackgroundColor={'gray'}
                minLabel={'1000'}
                maxLabel={'50000'}
                maxValue={50000}
              />
            </View>
            <View style={[styles.navSectionStyle, {
              flexDirection: 'row',
              alignItems: 'center'
            }]}>
              <FontAwesomeIcon icon={faCalendar} style={{
                color: theme ? theme.primary : Color.primary,
                marginLeft: 10
              }}/>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToScreen(item.route)}> */}
              <Text style={styles.navItemStyle}>
                Date
              </Text>
            </View>
            <View style={{marginLeft: '5%', marginRight: '5%'}}>
              <DatePicker 
                type={'datetime'}
                placeholder={'Select Date'}
                onFinish={(date) => {
                  this.setState({
                    Date: date.date
                  })
                }}
                style={{
                  marginTop: 5
              }} />
            </View>
            <View style={[styles.navSectionStyle, {
              flexDirection: 'row',
              alignItems: 'center'
            }]}>
              <FontAwesomeIcon icon={faHandHoldingUsd} style={{
                color: theme ? theme.primary : Color.primary,
                marginLeft: 10
              }}/>
              {/* <Text style={styles.navItemStyle} onPress={() => this.navigateToScreen(item.route)}> */}
              <Text style={styles.navItemStyle}>
                Type
              </Text>
            </View>
            <View style={{marginLeft: '5%', marginRight: '5%'}}>
              <Button
                title={'Cash In'}
                onClick={() => {}}
                style={{
                  width: '70%',
                  marginRight: '30%',
                  marginLeft: '30%',
                  marginBottom: '5%',
                  backgroundColor: Color.danger
                }}
              />
              <Button
                title={'Send Cash'}
                onClick={() => {}}
                style={{
                  width: '70%',
                  marginRight: '30%',
                  marginLeft: '30%',
                  marginBottom: '5%',
                  backgroundColor: Color.danger
                }}
              />
              <Button
                title={'Bills and Payment'}
                onClick={() => {}}
                style={{
                  width: '70%',
                  marginRight: '30%',
                  marginLeft: '30%',
                  backgroundColor: Color.danger
                }}
              />
              <Button
                title={'Withdraw'}
                onClick={() => {}}
                style={{
                  width: '70%',
                  marginRight: '30%',
                  marginLeft: '30%',
                  backgroundColor: Color.danger
                }}
              />
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footerContainer}>
          <Text>A product of {Helper.company}</Text>
        </View>
      </View>
    );
  }
}

FilterSlider.propTypes = {
  navigation: PropTypes.object
};

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
    setActiveRoute: (route) => dispatch(actions.setActiveRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterSlider);
