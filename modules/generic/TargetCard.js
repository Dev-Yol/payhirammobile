import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import styles from './FulfilmentCardStyle.js';
import { BasicStyles, Helper, Color } from 'common';
import {connect} from 'react-redux';

const width = Math.round(Dimensions.get('window').width);

const Data = [{
  title: 'Partners',
  payload: 'partners',
  description: 'Your request will be visible only to partners in selected location and can be process on by the partner assigned to the selected location.'
}, {
  title: 'Circle',
  payload: 'circle',
  description: 'Your request will be visible only to your circles and can be process on by your circle.'
}, {
  title: 'Public',
  payload: 'public',
  description: 'All can process your request.'
}]


class TargetCard extends Component {
  constructor(props) {
    super(props);
  }

  onSelect(item,index){
    this.props.onSelect(item)
  }

  render() {
    const { theme } = this.props.state;
    const { selected } = this.props;
    return (
      <View style={{
        flexDirection: 'row',
        marginTop: 10
      }}>
        {
          Data && Data.map((item, index) => (
           
            <TouchableOpacity
              style={{
                width: width / 2,
                backgroundColor: (selected && selected == item.payload) ? (theme ? theme.primary : Color.primary) : (theme ? theme.secondary : Color.secondary),
                borderRadius: BasicStyles.standardBorderRadius,
                marginRight: 10,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 20,
                paddingRight: 20
              }}
              onPress={() => {
                this.onSelect(item, index);
              }}
              key={index}>
              <View style={{
                width: '100%',
                alignItems: 'center'
              }}>
                <Text
                  style={{
                    ...styles.titleText,
                    paddingBottom: 10,
                    fontSize: BasicStyles.titleText.fontSize
                  }}>
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: BasicStyles.standardFontSize,
                    textAlign: 'center',
                    color: Color.white
                  }}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
            
          ))
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TargetCard);