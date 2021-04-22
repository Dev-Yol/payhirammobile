import React, {Component} from 'react';
import { View, TouchableOpacity, TouchableHighlight, Text, Dimensions, ScrollView, Platform} from 'react-native';
import Modal from "react-native-modal";
import { Color , BasicStyles, Helper, Routes} from 'common';
import {NavigationActions, StackActions} from 'react-navigation';
import Config from 'src/config.js';
import {connect} from 'react-redux';
import { SliderPicker } from 'react-native-slider-picker';
import PickerWithLabel from 'components/Form/PickerWithLabel';
import DatePicker from 'components/DateTime/index.js';
import Button from 'components/Form/Button';
import Api from 'services/api/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Countries from 'common/Countries';
const height = Math.round(Dimensions.get('window').height);
class FilterSlider extends Component {
  constructor(props){
    super(props);
    this.state = {
      amount: 1000,
      showTarget: false,
      showTypes: false,
      target: 'all',
      type: 'all',
      filterData: null,
      currency: 'PHP',
      showCurrency: false,
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      needed_on: null
    }
    this.setState({needed_on: this.state.month + this.state.day + this.state.year})
  }

  componentDidMount(){
    const { parameter } = this.props.state;
    if(parameter){
      this.setState({
        type: parameter.type,
        target: parameter.target,
        needed_on: parameter.needed_on,
        amount: parameter.amount,
        currency: parameter.currency
      })
    }
  }

  action = () => {  
    this.props.action()
  }

  redirect = (route) => {
    this.props.close()
    this.props.navigate(route);
  }

  navigateToScreen = (route) => {
    const { parameter } = this.props.state
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
            NavigationActions.navigate({routeName: route, params: {
              initialRouteName: route,
              parameter: parameter
            }}),
        ]
      })
    });
    this.props.navigate.dispatch(navigateAction);
  }

  reset(){
    const { setParameter } = this.props
    setParameter(null)
    this.props.close()
    this.navigateToScreen('Requests')
  }
  apply() {
    const { setParameter } = this.props
    const { target, type, needed_on, amount, currency } = this.state
    let parameters = {
      target: target,
      type: type,
      currency: currency,
      amount: amount,
      needed_on: needed_on
    }
    setParameter(parameters)
    this.props.close()
    this.navigateToScreen('Requests')
  }

  amount = () => {
    const { theme } = this.props.state;
    const { amount } = this.state
    return(
      <View style={{
        width: '100%'
      }}>
        <View style={{
            width: '100%',
            justifyContent: 'center',
            height: 50
          }}>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            fontWeight: 'bold',
            width: '100%'
          }}>Amount</Text>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            fontWeight: 'bold',
            width: '100%',
            marginLeft: '90%',
            marginTop: '-6%'
          }}>{amount}</Text>
        </View>
        <SliderPicker 
          callback={position => {
            this.setState({ amount: position })
          }}
          minLabel={'1000'}
          maxLabel={'50000'}
          maxValue={50000}
          minValue={1000}
          defaultValue={this.state.amount}
          labelFontColor={Color.black}
          labelFontWeight={'600'}
          showFill={true}
          fillColor={'white'}
          labelFontWeight={'bold'}
          showNumberScale={true}
          showSeparatorScale={true}
          buttonBorderColor={theme ? theme.primary : Color.primary}
          buttonBorderWidth={2}
          scaleNumberFontWeight={'300'}
          buttonDimensionsPercentage={6}
          labelFontSize={BasicStyles.standardFontSize}
          buttonDimensionsPercentage={6}
          heightPercentage={1}
          widthPercentage={80}
          sliderInnerBackgroundColor={theme ? theme.primary : Color.primary}
          />
      </View>
    )
  } 
  keywords = () => {
    return (
      <View style={{
          width: '100%',
          height: 50,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray,
          flexDirection: 'row'
        }}>
        <Text style={{
          fontSize: BasicStyles.standardFontSize,
          width: '50%',
          fontWeight: 'bold'
        }}>Keywords</Text>

        <Text style={{
          fontSize: BasicStyles.standardFontSize,
          width: '50%',
          textAlign: 'right'
        }}>None</Text>
      </View>
    );
  }

  target = () => {
    const { theme, user } = this.props.state;
    const { showTarget, target } = this.state;
    return (
      <TouchableOpacity style={{
          width: '100%',
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray
        }}
        onPress={() => this.setState({
          showTarget: !this.state.showTarget
        })}
        >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 50,
        }}>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '50%',
            fontWeight: 'bold'
          }}>Target</Text>

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '50%',
            textAlign: 'right'
          }}>{target.toUpperCase()}</Text>
        </View>
        {
          showTarget && (
            <View style={{
              width: '100%',
              flexDirection: 'row',
              marginBottom: 20
            }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {
                  Helper.filter.targets.map((item, index) => (
                  <Button
                    key={index}
                      onClick={() => this.setState({
                        target: item.value
                      })}
                      title={item.value}
                      style={{
                        backgroundColor: target.toLowerCase() == item.value.toLowerCase() ? (theme ? theme.primary : Color.primary) : Color.white,
                        width: index == 0 ? 40 : 80,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 0.5,
                        borderColor: theme ? theme.primary : Color.primary
                      }}
                      textStyle={{
                        color: target.toLowerCase() == item.value.toLowerCase() ? Color.white : (theme ? theme.primary : Color.primary),
                        fontSize: BasicStyles.standardFontSize
                      }}
                    />
                  ))
                }
                </ScrollView>
            </View>
          )
        }

      </TouchableOpacity>
    );
  }


  types = () => {
    const { theme } = this.props.state;
    const { showTypes, type } = this.state;
    return (
      <TouchableOpacity style={{
          width: '100%',
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray,
        }}
        onPress={() => this.setState({
          showTypes: !this.state.showTypes
        })}
        >
        <View style={{
            width: '100%',
            height: 50,
            alignItems: 'center',
            flexDirection: 'row'
          }}>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '50%',
            fontWeight: 'bold'
          }}>Types</Text>

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '50%',
            textAlign: 'right'
          }}>{type.toUpperCase()}</Text>
        </View>
        {
          showTypes && (
            <View style={{
              width: '100%',
              flexDirection: 'row',
              marginBottom: 20
            }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {
                  Helper.filter.types.map((item, index) => (
                  <Button
                    key={index}
                      onClick={() => this.setState({
                        type: item.value
                      })}
                      title={item.value}
                      style={{
                        backgroundColor: type.toLowerCase() == item.value.toLowerCase() ? (theme ? theme.primary : Color.primary) : Color.white,
                        width: index == 0 ? 40 : 80,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 0.5,
                        borderColor: theme ? theme.primary : Color.primary
                      }}
                      textStyle={{
                        color: type.toLowerCase() == item.value.toLowerCase() ? Color.white : (theme ? theme.primary : Color.primary),
                        fontSize: BasicStyles.standardFontSize
                      }}
                    />
                  ))
                }
              </ScrollView>
            </View>
          )
        }
      </TouchableOpacity>
    );
  }

  renderCurrency = () => {
    const { theme } = this.props.state;
    const { showCurrency, currency } = this.state;
    return (
      <TouchableOpacity style={{
          width: '100%',
          borderBottomWidth: 1,
          borderBottomColor: Color.lightGray,
        }}
        onPress={() => this.setState({
          showCurrency: !this.state.showCurrency
        })}
        >
        <View style={{
            width: '100%',
            height: 50,
            alignItems: 'center',
            flexDirection: 'row'
          }}>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '50%',
            fontWeight: 'bold'
          }}>Currency</Text>

          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            width: '50%',
            textAlign: 'right'
          }}>{currency.toUpperCase()}</Text>
        </View>
        {
          showCurrency && (
            <View style={{
              width: '100%',
              flexDirection: 'row',
              marginBottom: 20
            }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {
                  Countries.list.map((item, index) => (
                  <Button
                    key={index}
                      onClick={() => this.setState({
                        currency: item.currency
                      })}
                      title={item.currency}
                      style={{
                        backgroundColor: currency.toLowerCase() == item.currency.toLowerCase() ? (theme ? theme.primary : Color.primary) : Color.white,
                        width: index == 0 ? 40 : 80,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 0.5,
                        borderColor: theme ? theme.primary : Color.primary
                      }}
                      textStyle={{
                        color: currency.toLowerCase() == item.currency.toLowerCase() ? Color.white : (theme ? theme.primary : Color.primary),
                        fontSize: BasicStyles.standardFontSize
                      }}
                    />
                  ))
                }
              </ScrollView>
            </View>
          )
        }
      </TouchableOpacity>
    );
  }


  header(){
    const { theme } = this.props.state;
    return(
      <View style={{
        width: '100%',
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Color.lightGray,
        marginTop: Platform.OS == 'ios' ? 10 : 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <Text style={{
          fontSize: BasicStyles.standardFontSize,
          fontWeight: 'bold',
          height: 50,
          lineHeight: 50,
          color: theme ? theme.primary : Color.primary
        }}>Filter</Text>
        <TouchableOpacity style={{
          width: 50,
          height: 50,
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
        onPress={() => this.props.close()}
        >
          <FontAwesomeIcon icon={faTimes} />
        </TouchableOpacity>
      </View>
    );
  }

  dateStyle() {

  }

  render(){
    const { theme } = this.props.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={this.props.visible}
        style={{
          padding: 0,
          margin: 0
          }}>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            height: height
          }}>
           {/*<TouchableOpacity style={{
                           justifyContent: 'center',
                           alignItems: 'center',
                           width: '20%',
                           backgroundColor: 'transparent',
                           height: height
                         }}
                         onPress={() => this.props.close()}
                         >
                       </TouchableOpacity>*/}
            <View style={{
              width: '100%',
              backgroundColor: Color.white,
              height: height,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20
            }}>
              {this.header()}
              {this.target()}
              {/*this.keywords()*/}
              {this.types()}
              <View style={{
                width: '100%',
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: Color.lightGray
              }}>
                <Text style={{
                  fontSize: BasicStyles.standardFontSize,
                  width: '50%',
                  fontWeight: 'bold'
                }}>Start Date</Text>

                <DatePicker
                type={'date'}
                placeholder={this.state.needed_on}
                borderColor= {'white'}
                height={40}
                style={{
                  borderColor: 0,
                  borderWidth: 0,
                  height: 40,
                  width: '50%',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
                textStyle={{
                  textAlign: 'right',
                  width: '100%',
                  color: Color.black
                }}
                icon={false}
                onFinish={(date) => {
                  this.setState({
                    needed_on: date.date
                  })
                }} />
              </View>

              {this.renderCurrency()}

              {this.amount()}
            </View>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                paddingLeft: 20,
                paddingRight: 20,
                bottom: 20
              }}>
                <Button 
                  style={{
                    backgroundColor: Color.danger,
                    width: '49%',
                    marginRight: '1%',
                  }}
                  title={'Reset'}
                  onClick={() => this.reset()}
                />
                <Button 
                  style={{
                    backgroundColor: theme ? theme.secondary : Color.secondary,
                    width: '49%',
                    marginLeft: '1%',
                  }}
                  title={'Apply'}
                  onClick={() => this.apply()}
                />
              </View>
          </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setDefaultAddress: (defaultAddress) => dispatch(actions.setDefaultAddress(defaultAddress)),
    setParameter: (parameter) => dispatch(actions.setParameter(parameter))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterSlider);
