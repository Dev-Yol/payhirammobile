import React, {Component} from 'react';
import { View, Text, ScrollView, TouchableHighlight } from 'react-native';
import { UserImage, Rating, Spinner } from 'components';
import { Routes, Color } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
class Circle extends Component{
  constructor(props){
    super(props);
    this.state = {
      circles: [],
      isLoading: true,
      user: {}
    }
  }

  componentDidMount() {
    const { user } = this.props.state
    // console.log("u s e r ---- > ", user)
    this.setState({isLoading: true})
    Api.request(Routes.circleRetrieve, {account_id: user.account_id}, response => {
      this.setState({isLoading: false})
      if(response.data != null){
        console.log("r e s p o n s e --- > ", JSON.stringify(response.data))
        this.setState({circles: response.data});
        this.state.circles.map((el) => {
          console.log(el)
        })
      }
    });
  }

  renderCircles() {
    return (
      this.state.circles.map((el, ndx) => {
        return (
          <TouchableHighlight 
            onPress={() => {
              this.setState({user: el})
              this.redirect()
            }} 
            underlayColor={Color.gray}
          >
            <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
              <UserImage user={""} style={[{flex: 3}]}/>
              <View style={[{flex: 3, marginLeft: 5}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FontAwesomeIcon icon={ faCheckCircle } style={{color: 'blue', marginRight: 5}} size={15} />
                  <Text style={[{fontWeight: 'bold', margin: 2}]}>{el.account.username}</Text>
                </View>
                <Text style={[{margin: 2}]}>{el.account.information.address != null ? el.account.information.address : "Nothing to show."}</Text>
              </View>
              <Rating ratings={el.rating} style={[{flex: 3}]}></Rating>
            </View>
          </TouchableHighlight>
        )
      })
    )
  }

  redirect = () => {
    const { user } = this.state
    // console.log("u s e r ---- > ", user)
    this.props.navigation.push("viewProfileStack", { user })
  }
  render() {
    return (
      <View style={
        {
          paddingTop: 70,
          minHeight: '100%'
        }
      }>
        <ScrollView showsHorizontalScrollIndicator={false}>
          {this.renderCircles()}
          
        </ScrollView>
        {this.state.isLoading ? <Spinner mode="overlay"/> : null }
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(Circle);
