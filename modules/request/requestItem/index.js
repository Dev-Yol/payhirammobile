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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircle, faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import {BasicStyles, Color, Routes} from 'common';
import {UserImage, Rating, Spinner} from 'components';
import RequestCard from 'modules/generic/RequestCard';
import ProposalCard from 'modules/generic/ProposalCard';
import ProposalModal from 'modules/generic/ProposalModal';
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
      data: null,
      peer: null,
      modalStatus: 'create',
      peerRequest: null
    }
  }
  
  componentDidMount() {
    this.retrieve()
  }

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
    console.log('[RequestItem] Retrieve parameter', parameter)
    Api.request(Routes.requestPeerRetrieveItem, parameter, (response) => {
      this.setState({isLoading: false});
      console.log('response', response)
      if (response.data.length > 0) {
        this.setState({
          data: response.data
        })
      } else {
        this.setState({
          data: null
        })
      }
    }, error => {
      console.log('response', error)
      this.setState({isLoading: false, data: null});
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

    console.log('[Create Messenger Thread] parameter', parameter)
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
          }
        });
      }else{
        Alert.alert(
          'Thread already existed!',
          'Do you want to view the existing thread?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => {
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
                }
              });
            }},
          ],
          { cancelable: false }
        )
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


  renderProposals = (data) => {
    return (
      <View>
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
    const {user} = this.props.state;
    const { data, isLoading } = this.state;
    const { connectModal, modalStatus } = this.state;
    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            height: height + 25,
            width: '90%',
            marginLeft: '5%',
            marginRight: '5%'
          }}>
            {
              this.props.navigation.state.params.data && (
                <View style={{alignItems: 'center'}}>
                  <RequestCard 
                    onConnectRequest={(item) => this.connectRequest(item)}
                    data={this.props.navigation.state.params.data}
                    navigation={this.props.navigation}
                    from={'request_item'}
                    />
                </View>
              )
            }

            {
              (data) && (
                this.renderProposals(data)
              )
            }
            </View>
        </ScrollView>
        {isLoading ? <Spinner mode="overlay" /> : null}
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
              request={this.props.navigation.state.params.data}
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