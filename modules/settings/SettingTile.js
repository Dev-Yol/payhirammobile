import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import styles from 'modules/settings/Styles.js';
import { BasicStyles, Color } from 'common';
import {connect} from 'react-redux';

class SettingTile extends Component {
  render() {
    const { item } = this.props;
    const { theme } = this.props.state;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.props.onPress(item.route)}>
        <View style={{
          flexDirection: 'row',
          width: '80%'
        }}>
          <FontAwesomeIcon icon={item.icon} size={18} color={theme ? theme.secondary : Color.secondary}/>
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            paddingLeft: 5
          }}>{item.title}</Text>
        </View>
        <View style={{
          width: '20%',
          justifyContent: 'flex-end',
          flexDirection: 'row'
        }}>
          <FontAwesomeIcon icon={faChevronRight} size={18}/>
        </View>
      </TouchableOpacity>
    );
  }
}


const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingTile);

