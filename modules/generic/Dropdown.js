import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Share } from 'react-native'
import { Color } from 'common';
import { connect } from 'react-redux';

class Dropdown extends Component{
  constructor(props){
    super(props);
    this.state = {
      show: false
    }
  }

  onShare = async () => {
    const { user } = this.props.state;
    if(user == null){
      return
    }
    try {
      const result = await Share.share({
        message: 'https://payhiram.ph/profile/' + user.code
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  body = () => {
    return(
        <View>
            <View style={{
                alignItems: 'center',
                borderColor: Color.lightGray,
                borderWidth: 2,
                padding: 5
                }}>
                <Text>COPY LINK</Text>
            </View>
            <TouchableHighlight 
                style={{
                alignItems: 'center',
                borderColor: Color.lightGray,
                borderWidth: 2,
                padding: 5
                }}
                onPress={() => this.onShare()}
                >
                <Text>SHARE</Text>
            </TouchableHighlight>
            <View style={{
                alignItems: 'center',
                borderColor: Color.lightGray,
                borderWidth: 2,
                padding: 5
                }}>
                <Text>CANCEL</Text>
            </View>
        </View>
    )
  }


  render() {
    return (
		<View style={{
            position: 'absolute',
            marginTop: '15%',
            marginLeft: '70%',
            zIndex: 10,
            backgroundColor: 'white'
        }}>
            {
                this.props.value == true ? (
                    <View>
                        {this.body()}
                    </View>
                ): <View></View>
            }
		</View>
    )
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dropdown);
