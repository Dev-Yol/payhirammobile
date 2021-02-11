import React, {Component} from 'react';
import { View, Text, ScrollView, TouchableHighlight, Dimensions, Alert } from 'react-native';
const height = Math.round(Dimensions.get('window').height);
import { UserImage, Spinner } from 'components';
import { Rating } from 'components/index.js';
import { Routes, Color } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faTimesCircle, faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import _ from 'lodash';
import Button from 'components/Form/Button';
class Circle extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: null,
      isLoading: true,
      limit: 10,
      offset: 0,
      isLoading: false,
    }
  }

  componentDidMount() {
    this.retrieve(false)
  }

  retrieve(flag){
    const { user } = this.props.state
    if(user == null){
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }, {
        value: user.id,
        column: 'account',
        clause: 'or'
      }],
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
    }
    console.log('parameter', parameter)
    this.setState({isLoading: true})
    Api.request(Routes.circleRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if (response != null) {
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    });
  }

  submit = (status, item) => {
    Alert.alert(
      "Confirmation Message",
      'Are you sure you want to ' + (status == 'accepted' ? 'accept' : 'decline') + ' ' + item.account.information.first_name + ' ' + item.account.information.last_name + '?',
      [
        { text: "Cancel", onPress: () => {
        }},
        { text: "Ok", onPress: () => {
          let parameter = {
            id: item.id,
            status: status
          }
          this.setState({isLoading: true})
          Api.request(Routes.circleUpdate, parameter, response => {
            this.setState({isLoading: false})
            this.retrieve(false)
          });
        }}
      ],
      { cancelable: false }
    );

  }

  removeItem(item){
    Alert.alert(
      "Confirmation Message",
      'Are you sure you want to cancel your request to ' + item.account.information.first_name + ' ' + item.account.information.last_name + '?',
      [
        { text: "Cancel", onPress: () => {
        }},
        { text: "Ok", onPress: () => {
          let parameter = {
            id: item.id
          }
          this.setState({isLoading: true})
          Api.request(Routes.circleDelete, parameter, response => {
            this.setState({isLoading: false})
            this.retrieve(false)
          });
        }}
      ],
      { cancelable: false }
    );
  }

  action = (item) => {
    const { user } = this.props.state;
    return (
        <View style={{
          flexDirection: 'row',
          width: '100%'
        }}>
          {
            item.account_id == user.id && (
                <Button 
                  style={{
                    backgroundColor: Color.lightGray,
                    width: 120,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 5
                  }}
                  textStyle = {{
                    color: Color.black
                  }}
                  title={'Cancel'}
                  onClick={() => {this.removeItem(item)}}/>
              )
          }
          {
            item.account_id != user.id && (
              <View style={{
                flexDirection: 'row'
              }}>
                <Button 
                style={{
                  backgroundColor: Color.lightGray,
                  width: 120,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 5
                }}
                textStyle = {{
                  color: Color.black
                }}
                title={'Decline'}
                onClick={() => {this.submit('declined', item)}}/>

                <Button 
                  style={{
                    backgroundColor: Color.lightGray,
                    width: 120,
                    height: 40,
                    borderRadius: 20
                  }}
                  textStyle = {{
                    color: Color.black
                  }}
                  title={'Accept'}
                  onClick={() => {this.submit('accepted', item)}}/>
              </View>
            )
          }

        </View>
      )
  }


  renderCircles(data) {
    return (
      data.map((item, index) => {
        return (
          <TouchableHighlight 
            onPress={() => {
              this.redirect(item)
            }}
            underlayColor={Color.gray}
            key={index}
          >
            <View style={{
              flexDirection: 'row',
              paddingTop: 10,
              paddingBottom: 10,
              width: '90%',
              marginLeft: '5%',
              maginRight: '5%',
              alignItems: 'center'
            }}>
              <UserImage user={item.account}/>
              <View style={{
                  marginLeft: 5,
                  width: '90%'
                }}>
                <Text style={{fontWeight: 'bold'}}>{item.account.information.first_name + ' ' + item.account.information.last_name}</Text>
                <Text style={[{margin: 2}]}>{item.account.information.address?.toUpperCase()}</Text>
              {
                item.status == 'pending' && this.action(item)
              }
              </View>
            </View>
          </TouchableHighlight>
        )
      })
    )
  }

  redirect = (user) => {
    this.props.navigation.push("viewProfileStack", { user })
  }
  render() {
    const { data} = this.state;
    const { user } = this.props.state;
    return (
      <View style={
        {
          marginTop: 70,
          flex: 1
        }
      }>
        <ScrollView 
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if(event.nativeEvent.contentOffset.y <= 0) {
              if(this.state.loading == false){
                // this.retrieve(false)
              }
            }
            console.log(scrollingHeight, totalHeight);
            if(scrollingHeight >= (totalHeight)) {
              if(this.state.loading == false){
                this.retrieve(true)
              }
            }
          }}
          showsVerticalScrollIndicator={false}>
          <View style={{
            height: height
          }}>
            {(data && user) && this.renderCircles(data)}
          </View>
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="overlay"/> : null }
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(Circle);
