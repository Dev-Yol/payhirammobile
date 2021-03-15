import React, {Component} from 'react';
import styles from './Style.js';
import { View, TouchableOpacity, TouchableHighlight, Text, Dimensions, ScrollView} from 'react-native';
import Modal from "react-native-modal";
import { Color , BasicStyles, Helper} from 'common';
import Config from 'src/config.js';
import {connect} from 'react-redux';
import { SliderPicker } from 'react-native-slider-picker';
import DatePicker from 'components/DateTime/index.js';
import Button from 'components/Form/Button';
const height = Math.round(Dimensions.get('window').height);
class FilterSlider extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: 0,
      showTarget: false,
      showTypes: false,
      target: 'All',
      type: 'All',
      // day: new Date().getDate(),
      // month: new Date().getMonth() + 1,
      // year: new Date().getFullYear(),
      date: 'December 1, 2020',
      filterData: null
    }
  }
  // new Date().getMonth() + 1;
  // var year = new Date().getFullYear();
  action = () => {  
    this.props.action()
  }
  redirect = (route) => {
    this.props.close()
    this.props.navigate(route);
  }

  apply() {
    const { setFilterData } = this.props
    const { target, type, date, value } = this.state
    let parameter = {
      target: target,
      money_type: type,
      date: date,
      amount: value
    }
    setFilterData(parameter)
    console.log('[parameter]', parameter);
  }

  amount = () => {
    const { theme } = this.props.state;
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
        </View>
        <SliderPicker 
          callback={position => {
            this.setState({ value: position })
          }}
          defaultValue={this.state.value}
          labelFontColor={Color.black}
          labelFontWeight={'600'}
          showFill={true}
          fillColor={'red'}
          labelFontWeight={'bold'}
          showNumberScale={true}
          showSeparatorScale={true}
          buttonBackgroundColor={'#fff'}
          buttonBorderColor={theme ? theme.primary : Color.primary}
          buttonBorderWidth={2}
          scaleNumberFontWeight={'300'}
          buttonDimensionsPercentage={6}
          labelFontSize={BasicStyles.standardFontSize}
          heightPercentage={.5}
          widthPercentage={70}
          sliderInnerBackgroundColor={theme ? theme.primary : Color.primary}
          minLabel={'1000'}
          maxLabel={'50000'}
          maxValue={50000}
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
    const { theme } = this.props.state;
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
          }}>{target}</Text>
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
                        backgroundColor: target == item.value ? (theme ? theme.primary : Color.primary) : Color.white,
                        width: index == 0 ? 40 : 80,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 0.5,
                        borderColor: theme ? theme.primary : Color.primary
                      }}
                      textStyle={{
                        color: target == item.value ? Color.white : (theme ? theme.primary : Color.primary),
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
          }}>{type}</Text>
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
                        backgroundColor: type == item.value ? (theme ? theme.primary : Color.primary) : Color.white,
                        width: index == 0 ? 40 : 80,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 0.5,
                        borderColor: theme ? theme.primary : Color.primary
                      }}
                      textStyle={{
                        color: type == item.value ? Color.white : (theme ? theme.primary : Color.primary),
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
        borderBottomColor: Color.lightGray
      }}>
        <Text style={{
          fontSize: BasicStyles.standardFontSize,
          fontWeight: 'bold',
          color: theme ? theme.primary : Color.primary
        }}>Filter</Text>
      </View>
    );
  }

  dateStyle() {

  }

  render(){
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
            <TouchableOpacity style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '20%',
                backgroundColor: 'transparent',
                height: height
              }}
              onPress={() => this.props.close()}
              >
            </TouchableOpacity>
            <View style={{
              width: '80%',
              backgroundColor: Color.white,
              height: height,
              paddingLeft: 10,
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
                placeholder={this.state.date}
                borderColor= {'white'}
                paddingLeft={20}
                onFinish={(date) => {
                  this.setState({
                    date: date.date
                  })
                }} />
              </View>

              {this.amount()}
              <View style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                bottom: 10
              }}>
                <Button 
                  style={{
                    backgroundColor: Color.secondary,
                    width: '90%',
                    marginRight: '5%',
                    marginLeft: '10%'
                  }}
                  title={'Set Filter'}
                  onClick={() => this.apply()}
                />
              </View>
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
    setFilterData: (filterData) => dispatch(actions.setFilterData(filterData))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterSlider);
