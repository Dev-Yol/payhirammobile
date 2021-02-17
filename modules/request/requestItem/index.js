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
      peer: null
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
      condition: [{
        value: data.id,
        column: 'id',
        clause: '='
      }],
      type: user.account_type,
      account_id: user.id
    };
    this.setState({isLoading: true});
    Api.request(Routes.requestRetrieveItem, parameter, (response) => {
      this.setState({isLoading: false});
      if (response != null) {
        this.setState({
          data: response.data[0]
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

  viewMessages = () => {
    setTimeout(() => {
      this.props.navigation.navigate('messagesStack', {
        payload: 'request',
        payload_value: this.state.peer.request_id,
        title: this.state.peer.code,
        account_id:  this.state.peer.account_id,
        profile: this.state.peer.account.profile,
        request: this.state.data,
        id: this.state.peer.id,
        con: true
      });
    }, 500)
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
      'Are you sure you want to accept this request?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.viewMessages()},
      ],
      { cancelable: false }
    )
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
            />
        </View>
      </View>
    )
  }



  render() {
    const {user} = this.props.state;
    const { data, isLoading } = this.state;
    const { connectModal } = this.state;
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
              data && (
                <View style={{alignItems: 'center'}}>
                  <RequestCard 
                    onConnectRequest={(item) => this.connectRequest(item)}
                    data={data}
                    navigation={this.props.navigation}
                    />
                </View>
              )
            }

            {
              (data && data.peers && data.peers.peers) && (
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