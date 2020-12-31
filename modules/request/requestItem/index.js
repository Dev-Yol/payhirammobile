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
import {BasicStyles, Color} from 'common';
import {UserImage, Rating} from 'components';
import RequestCard from 'modules/generic/RequestCard';
import ProposalCard from 'modules/generic/ProposalCard';
import ProposalModal from 'modules/generic/ProposalModal';

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
    };
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

  }

  render() {
    const { data } = this.props.navigation.state.params;
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
            <View style={{alignItems: 'center'}}>
              <RequestCard 
                onConnectRequest={() => this.connectRequest()}
                data={data}
                navigation={this.props.navigation}
                />
            </View>

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
            </View>
          </View>
        </ScrollView>
        <ProposalModal
          visible={connectModal}
          closeModal={() =>
            this.setState({
              connectModal: false,
            })
          }></ProposalModal>
      </View>
    );
  }
}

export default RequestItem;
