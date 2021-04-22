import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native'
import { connect } from 'react-redux';
import { BasicStyles, Color } from 'common';
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
    const { data } = this.props;
    const { user } = this.props.state;
    return(
      <View style={{
      }}>
        <TouchableOpacity 
          style={{
            borderBottomColor: Color.lightGray,
            borderBottomWidth: 1,
            paddingLeft: 5
          }}
          onPress={() => this.onShare()}
          >
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            paddingTop: 10,
            paddingBottom: 10
          }}>Copy link</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{
            borderBottomColor: Color.lightGray,
            borderBottomWidth: 1,
            paddingLeft: 5
          }}
          onPress={() => this.onShare()}
          >
          <Text style={{
            fontSize: BasicStyles.standardFontSize,
            paddingTop: 10,
            paddingBottom: 10
          }}>Share to apps</Text>
        </TouchableOpacity>
        {
          (data && data.account?.code == user.code) && (
            <TouchableOpacity 
              style={{
                borderBottomColor: Color.lightGray,
                borderBottomWidth: 1,
                paddingLeft: 5
              }}
              onPress={() => this.onShare()}
              >
              <Text style={{
                fontSize: BasicStyles.standardFontSize,
                paddingTop: 10,
                paddingBottom: 10,
                color: Color.danger
              }}>Delete</Text>
            </TouchableOpacity>
          )
        }
      </View>
    )
  }


  render() {
    return (
  		<View style={{
        position: 'absolute',
        marginTop: '15%',
        marginLeft: '50%',
        zIndex: 10,
        width: '50%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Color.lightGray
        }}>
          <View>
            {this.body()}
          </View>
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
