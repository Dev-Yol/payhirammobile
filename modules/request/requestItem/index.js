import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Dimensions
} from 'react-native';
import {BasicStyles, Color, Routes} from 'common';
import {UserImage, Rating, Spinner} from 'components';
import Skeleton from 'components/Loading/Skeleton';
import Button from 'components/Form/Button.js';
import RequestCard from 'modules/generic/RequestCard';
import ProposalCard from 'modules/generic/ProposalCard';
import ProposalModal from 'modules/generic/ProposalModal';
import {NavigationActions, StackActions} from 'react-navigation';
import Api from 'services/api/index.js';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
import {connect} from 'react-redux';

class RequestItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      connectSelected: null,
      connectModal: false,
      peers: null,
      peer: null,
      modalStatus: 'create',
      peerRequest: null
    }
  }
  
  componentDidMount() {
    this.retrieve()
  }

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({routeName: route, params: {
            initialRouteName: route,
            index: 0
          }}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  retrieve(){
    const { user } = this.props.state;
    const { data } = this.props.navigation.state.params;

    if(user == null || data == null){
      return
    }
    let parameter = {
      request_id: data.id,
      account_code: user.code,
      account_request_code: data.account.code
    };
    this.setState({isLoading: true});
    Api.request(Routes.requestPeerRetrieveItem, parameter, (response) => {
      this.setState({isLoading: false});
      if (response.data.length > 0) {
        this.setState({
          peers: response.data
        })
      } else {
        this.setState({
          peers: null
        })
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false, peers: null});
    });
  }

  createThread = (account) => {
    const { user } = this.props.state;
    const { data } = this.props.navigation.state.params;
    if(user == null || account == null || data == null){
      return
    }
    this.setState({isLoading: true});
    let parameter = {
      member: account.account_id,
      creator: user.id,
      title: data.code,
      payload: 'request'
    }
    console.log('parameter', parameter)
    Api.request(Routes.customMessengerGroupCreate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.error == null) {
        this.props.navigation.navigate('messagesStack', {
          data: {
            id: response.data,
            title: data.code,
            payload: 'request',
            account_id: user.id,
            request: data,
            currency: data.currency,
            amount: data.amount,
            status: 1
            // location: data.location
          }
        })
      }else{
        this.props.navigation.navigate('messagesStack', {
          data: {
            id: response.data,
            title: data.code,
            payload: 'request',
            account_id: user.id,
            request: data,
            currency: data.currency,
            amount: data.amount,
            status: 1
            // location: data.location
          }
        });
      }
    }, error => {
      this.setState({ isLoading: false })
      console.log({ messenger_groups_error: error })
    })
  }
  
  connectRequest = (item) => {
    const { data } = this.props.navigation.state.params;
    const {setRequest} = this.props;
    this.setState({
      connectSelected: item,
    });
    setRequest(item)
    setTimeout(() => {
      this.setState({connectModal: true});
    }, 500);
  };
  
  acceptRequest = (data) => {
    this.setState({peer: data})
    Alert.alert(
      'Confirmation',
      'Are you sure you want to accept this proposal?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.createThread(data)},
      ],
      { cancelable: false }
    )
  }

  onChangeTerms(item){
    this.setState({
      modalStatus: 'update',
      peerRequest: item
    })
    setTimeout(() => {
      this.setState({
        connectModal: true
      })
    }, 100)
  }

  delete(data){
    let parameter = {
      id: data.id,
    }
    this.setState({isLoading: true})
    Api.request(Routes.requestDelete, parameter, response => {
      this.setState({isLoading: false})
      this.navigateToScreen('Requests')
    });
  }

  deleteRequest(data){
    Alert.alert(
      'Confirmation',
      'Are you sure you want to cancel this request?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.delete(data)},
      ],
      { cancelable: false }
    )
  }

  renderProposals = (data) => {
    return (
      <View style={{
        paddingLeft: 20,
        paddingRight: 20
      }}>
        <View style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Color.lightGray
          }}>
          <Text style={{
            textAlign: 'left',
            paddingTop: 10,
            paddingBottom: 10,
            fontWeight: 'bold'
          }}>Proposals</Text>
        </View>
        <View style={{

        }}>
          <ProposalCard
            data={data}
            navigation={this.props.navigation}
            onAcceptRequest={this.acceptRequest}
            onChangeTerms={(params) => this.onChangeTerms(params)}
            onLoading={(flag) => this.setState({
              isLoading: flag
            })}
            onRetrieve={() => this.retrieve()}
            request={this.props.navigation.state.params.data}
            />
        </View>
      </View>
    )
  }


  render() {
    const {user, theme} = this.props.state;
    const { peers, isLoading } = this.state;
    const { connectModal, modalStatus } = this.state;
    const { data } = this.props.navigation.state.params;
    // this.state.peers = data
    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            height: height + 25,
            width: '100%'
          }}>
            {
              data && (
                <View style={{
                  alignItems: 'center',
                  borderBottomWidth: 10,
                  borderBottomColor: Color.lightGray,
                  paddingLeft: 20,
                  paddingRight: 20
                }}>
                  <RequestCard 
                    onConnectRequest={(item) => this.connectRequest(item)}
                    data={data}
                    navigation={this.props.navigation}
                    from={'request_item'}
                    />
                </View>
              )
            }

            {
              (peers) && (
                this.renderProposals(peers)
              )
            }
            {
              (data.status > 0) && (
                <View style={{
                  width: '100%',
                  backgroundColor: Color.danger,
                  height: 70,
                  position: 'absolute',
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    color: Color.white
                  }}>Proposals to this request was closed.</Text>
                </View>
              )
            }
            {
              isLoading && (<Skeleton size={1}/>)
            }
            </View>
        </ScrollView>
        {
          (user.username == data.account.username) && (data.status == 0) && (
            <View style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              bottom: 5
            }}>
              <Button 
                style={{
                  backgroundColor: Color.danger,
                  width: '90%',
                  marginRight: '5%',
                  marginLeft: '5%'
                }}
                title={'Cancel'}
                onClick={() => this.deleteRequest(data)}
              />
            </View>
          )
        }
        {/* {
          (user.username == data.account.username) && (data.status > 0) && (
            <View style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              bottom: 5
            }}>
              <Button 
                style={{
                  backgroundColor: Color.secondary,
                  width: '90%',
                  marginRight: '5%',
                  marginLeft: '5%'
                }}
                title={'See Conversation'}
                onClick={() => this.retrieveThread(data)}
              />
            </View>
          )
        } */}
        {/*isLoading ? <Spinner mode="overlay" /> : null*/}
        {
          connectModal && (
            <ProposalModal
              visible={connectModal}
              loading={(flag) => this.setState({
                isLoading: flag
              })}
              data = {this.state.connectSelected}
              navigation={this.props.navigation}
              from={modalStatus}
              peerRequest={this.state.peerRequest}
              request={data}
              onRetrieve={() => this.retrieve()}
              closeModal={() =>
                this.setState({
                  connectModal: false,
                })
              }></ProposalModal>
            )
        }
      </View>
    );
  }
}
const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup)),
    setRequest: (request) => dispatch(actions.setRequest(request))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestItem);