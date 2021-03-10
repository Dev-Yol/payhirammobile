import React, {Component} from 'react';
import { View, Text, ScrollView, TouchableHighlight, Dimensions, Alert, Share, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
const height = Math.round(Dimensions.get('window').height);
import { UserImage, Spinner, Empty } from 'components';
// import Share from 'components/Share'
import { Rating } from 'components/index.js';
import { Routes, Color, BasicStyles } from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import _ from 'lodash';
import Button from 'components/Form/Button';
import Footer from 'modules/generic/Footer'
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';
// import { TouchableOpacity } from 'react-native-gesture-handler';
class Circle extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: [],
      limit: 10,
      offset: 0,
      isLoading: false,
      page: 'circle',
      activeIndex: 0,
      status: false,
      d: []
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
      console.log('parameter', response.data)
      this.setState({
        isLoading: false,
        status: true
      })
      if (response != null) {
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1),
          d: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id')
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset,
          d: flag == false ? [] : this.state.data
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
          width: '100%',
          marginTop: 10
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
            item.account_id !== user.id && item.status === 'accepted' && (
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
            item.account_id != user.id && item.status === 'pending' && (
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


  renderCircles(data, status) {
    const { user } = this.props.state;
    console.log('[data]', data, this.props.state.circleSearch);
    return (
      data.map((item, index) => {
        return (
          <View>
            {(this.props.state.circleSearch === null || this.props.state.circleSearch === '') ?
            <View>
            {status === 'circle' && (item.status === 'accepted' || item.status === 'pending') && (
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
                  <Text style={{
                    marginTop: 10,
                    fontSize: BasicStyles.standardFontSize
                  }}>{item.account.information.address}</Text>
                {
                  item.status == 'pending' || item.status === 'accepted' && this.action(item)
                }
                </View>
              </View>
            </TouchableHighlight>
            )}
            {status === 'invitation' && user.id !== item.account_id && item.status === 'pending' && (
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
                  <Text style={{
                    marginTop: 10,
                    fontSize: BasicStyles.standardFontSize
                  }}>{item.account.information.address}</Text>
                {
                  item.status == 'pending' && this.action(item)
                }
                </View>
              </View>
            </TouchableHighlight>
            )}
            </View>
          : <View>
            {item.account && item.account.information && item.account.information.first_name && item.account.information.last_name && (item.account.information.first_name + ' ' + item.account.information.last_name).toLowerCase().includes(this.props.state.circleSearch && this.props.state.circleSearch.toLowerCase()) === true
             && (
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
                  <Text style={{
                    marginTop: 10,
                    fontSize: BasicStyles.standardFontSize
                  }}>{item.account.information.address}</Text>
                {
                  this.action(item)
                }
                </View>
              </View>
            </TouchableHighlight>
            )}
          </View>  
        }</View>
        )
      })
    )
  }

  redirect = (user) => {
    this.props.navigation.push("viewProfileStack", { user })
  }
  renderContent(status) {
    const { data } = this.state;
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
            {data.length < 1 && (<Text style={{
              marginTop: '10%',
              marginLeft: 20,
              color: Color.gray
            }}>No data.</Text>)}
            {(data && user) && this.renderCircles(data, status)}
          </View>
        </ScrollView>
        {/* {data.length < 1 && this.state.isLoading == false && status === true && (<Empty refresh={true} onRefresh={() => this.retrieve(true)} />)} */}
        {this.state.isLoading ? <Spinner mode="overlay"/> : null }
      </View>
    );
  }

  render() {
    const { activeIndex, data } = this.state;
    const { user } = this.props.state;
    return (
      <View style={{
        flex: 1
      }}>
        <PagerProvider activeIndex={activeIndex}>
          <Pager panProps={{enabled: false}}>
            <View style={{
              flex: 1,
              minHeight: height,
              width: '100%'
            }}>
              {this.renderContent('circle')}
            </View>
            <View style={{
              flex: 1,
              minHeight: height,
              width: '100%'
            }}>
              {this.renderContent('invitation')}
            </View>
          </Pager>
        </PagerProvider>     
        <Footer
          {...this.props}
          selected={this.state.page} onSelect={(value) => {
            this.setState({
              page: value,
              activeIndex: value == 'circle' ? 0 : 1
            })
          }}
          from={'circle'}
        />  
      </View>
    );
  }

}
const mapStateToProps = state => ({ state: state });

export default connect(mapStateToProps)(Circle);
