import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircle, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Routes, BasicStyles, Color } from 'common';
import { Spinner, UserImage, Rating } from 'components';
import ConfirmationModal from 'components/Modal/ConfirmationModal.js';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';

class RequestItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmationModal: false,
      isConfirm: false,
      isLoading: false,
      data: null
    }
  }
  confirm = () => {
    this.setState({ isConfirmationModal: true })
  }

  closeModal = () => {
    this.setState({ isConfirmationModal: false })
  }

  componentDidMount() {
    const params = this.props.navigation.state.params;
    this.retrieve()
  }

  retrieveData(value){
    this.setState({data: value});
  }

  retrieve = () => {
    const params = this.props.navigation.state.params;
    const { user, searchParameter } = this.props.state;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      offset: 0,
      limit: 1,
      sort: {
        column: 'created_at',
        value: 'desc',
      },
      value: searchParameter == null ? '%' : searchParameter.value + '%',
      column: searchParameter == null ? 'created_at' : searchParameter.column,
      type: user.account_type,
      route_params: params
    };
    this.setState({ isLoading: true });
    Api.request(Routes.requestRetrieve, parameter, response => {
      this.setState({
        isLoading: false
      });
      if(response.data !== null){
        this.retrieveData(response.data[0])
        console.log(this.state.data, 'uhgbkhg');
        console.log('response', this.state.data.account.username)
      }else{
        this.setState({data: null});
      }
    },
    (error) => {
        this.setState({ isLoading: false });
      },
    );
  };

  render() {
    const { isConfirmationModal } = this.state;
    return (
      <View style={{ marginTop: 60 }}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={{ alignItems: 'center', margin: 10 }}>
            <View style={[{ width: '100%' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <UserImage user={""} style={[{ flex: 1 }]} />
                <Text style={[{ fontWeight: 'bold', margin: 2, flex: 4 }]}>test</Text>
                <Rating ratings={""} style={[{ flex: 2 }]} ></Rating>
                <TouchableOpacity style={[{ marginRight: 10, marginLeft: 10, alignItems: 'center' }]}>
                  <FontAwesomeIcon icon={faEllipsisH} style={{ color: Color.black }} size={BasicStyles.iconSize} />
                </TouchableOpacity>
              </View>
              <Text style={[{ margin: 2 }]}>Cebu South Road, Cebu City, Philippines</Text>
              <Text style={[{ margin: 2 }]}>Needed on: September 25, 2020</Text>
              <Text style={[{ margin: 2 }]}>THIS IS A TEST.</Text>
              <Text style={[{ margin: 2, fontSize: 10 }]}>September 23, 2020</Text>
            </View>
          </View>
          <View>
            {/* PROPOSAL */}
            <View style={[{ flexDirection: "row", padding: 10 }]}>
              <Text style={[{ fontWeight: 'bold' }]}>Proposal</Text>
              <View style={[{ flexDirection: "row", flexGrow: 1, justifyContent: 'flex-end' }]}>
                <Text>Proccessing fee</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
              <UserImage user={""} style={[{ flex: 1 }]} />
              <Text style={[{ fontWeight: 'bold', margin: 2, flex: 4 }]}>Kennette Canales</Text>
              <Text style={[{ fontWeight: 'bold', color: Color.secondary }]}>PHP 100.00</Text>
            </View>
            <View style={[{ flexDirection: "row", paddingHorizontal: 10, alignItems: 'center' }]}>
              <Rating ratings={""} style={[{ flex: 2 }]} ></Rating>
              <FontAwesomeIcon icon={faCircle} style={{ color: Color.secondary, marginHorizontal: 10 }} size={10} />
              <Text>3.5 km</Text>
            </View>
            <View style={{ width: '75%', flexDirection: 'row', padding: 10 }}>
              <TouchableHighlight underlayColor={Color.gray} style={[{ backgroundColor: Color.primary, width: '35%', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 5, }]}>
                <Text style={{ color: Color.white }}>View Profile</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => { this.confirm() }} underlayColor={Color.gray} style={[{ backgroundColor: Color.secondary, width: '35%', marginLeft: 5, alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 5, }]}>
                <Text style={{ color: Color.white }}>Accept</Text>
              </TouchableHighlight>
              {isConfirmationModal ?
                <ConfirmationModal
                  visible={isConfirmationModal}
                  title={'Confirmation Message'}
                  message={'Are you sure you want to accept this request?'}
                  onCLose={() => {
                    this.closeModal()
                  }}
                  onConfirm={() => {
                    this.closeModal()
                    this.props.navigation.navigate("transactionsStack")
                  }}
                /> : null}
            </View>
          </View>
        </ScrollView>
      </View>
    );
          {/* <View>
            <View style={{flexDirection: 'row', paddingHorizontal:10, alignItems: 'center'}}>
              <UserImage user={""} style={[{flex: 1}]} />
              <Text style={[{fontWeight: 'bold', margin: 2, flex: 4}]}>Kennette Canales</Text>
              <Text style={[{fontWeight: 'bold', color: Color.secondary}]}>PHP 100.00</Text>
            </View>
            <View style={[{flexDirection: "row", paddingHorizontal:10, alignItems: 'center'}]}>
              <Rating ratings={""} style={[{flex: 2}]} ></Rating>
              <FontAwesomeIcon icon={ faCircle } style={{color: Color.secondary, marginHorizontal: 10}} size={10} />
              <Text>3.5 km</Text>
            </View>
            <View style={{width: '75%', flexDirection: 'row', padding:10}}>
              <TouchableHighlight underlayColor={Color.gray} style={[{backgroundColor: Color.primary, width: '35%', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 5,}]}>
                <Text style={{ color: Color.white}}>View Profile</Text>
              </TouchableHighlight>
              <TouchableHighlight underlayColor={Color.gray} style={[{backgroundColor: Color.secondary, width: '35%', marginLeft: 5, alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 5,}]}>
                <Text style={{ color: Color.white}}>Accept</Text>
              </TouchableHighlight>
            </View>
          </View>      */}
        
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestItem);
