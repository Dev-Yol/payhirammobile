import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
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
import ConfirmationModal from 'components/Modal/ConfirmationModal.js';

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
      isConfirmationModal: false,
      isConfirm: false,
      data: null
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
    console.log('parameter', parameter)
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

  confirm = () => {
    this.setState({isConfirmationModal: true})
  }

  viewMessages = () => {
    this.closeModal()
    const { setMessengerGroup } = this.props;
    setMessengerGroup();
    setTimeout(() => {
      this.props.navigation.navigate('messagesStack');
    }, 500)
  }

  closeModal = () => {
    this.setState({isConfirmationModal: false})
  }

  connectRequest = () => {
    const { data } = this.props.navigation.state.params;
    this.setState({
      connectSelected: data,
    });
    setTimeout(() => {
      this.setState({connectModal: true});
    }, 500);
  };

  acceptRequest = () => {
    this.confirm()
  }


  renderProposals = (data) => {
    const { isConfirmationModal } = this.state;
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
            onAcceptRequest={() => this.acceptRequest()}
            navigation={this.props.navigation}
            />
            {isConfirmationModal ?
            <ConfirmationModal
              visible={isConfirmationModal}
              title={'Confirmation'}
              message={'Are you sure you want to accept this request?'}
              onCLose={() => {
                this.closeModal()
              }}
              onConfirm={() => {
                // this.closeModal()
                this.viewMessages()
              }}
            /> : null }
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
                    onConnectRequest={() => this.connectRequest()}
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
      </View>
    );
  }
}
const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setMessengerGroup: (messengerGroup) => dispatch(actions.setMessengerGroup(messengerGroup))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestItem);