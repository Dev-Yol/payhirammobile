import React, {Component} from 'react';
import { View, Text, ScrollView, TouchableHighlight, Dimensions } from 'react-native';
const height = Math.round(Dimensions.get('window').height);
import { UserImage, Spinner } from 'components';
import { Rating } from 'components/index.js';
import { Routes, Color } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faTimesCircle, faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
class Circle extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: null,
      isLoading: true
    }
  }

  componentDidMount() {
    const { user } = this.props.state
    this.setState({isLoading: true})
    Api.request(Routes.circleRetrieve, {account_id: user.account_id}, response => {
      this.setState({isLoading: false})
      if(response.data != null){
        this.setState({data: response.data});
      }else{
        this.setState({data: null})
      }
    });
  }


  renderCircles(data) {
    return (
      data.map((item, index) => {
        console.log('item', item.account.status)
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
                  alignItems: 'center'
                }}>
                <Text style={{fontWeight: 'bold'}}>{item.account.username}</Text>
                <Text style={[{margin: 2}]}>{item.account.information.address}</Text>
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
    return (
      <View style={
        {
          marginTop: 70,
          flex: 1
        }
      }>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            height: height
          }}>
            {data && this.renderCircles(data)}
          </View>
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="overlay"/> : null }
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(Circle);
