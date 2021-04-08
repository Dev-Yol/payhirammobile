import React, {Component} from 'react';
import Style from './Style.js';
import {
  TextInput,
  View,
  Image,
  TouchableHighlight,
  Text,
  Alert,
  ScrollView,
  BackHandler,
  ToastAndroid,
  Platform,
  SafeAreaView
} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-community/picker';
import {Routes, Color, Helper, BasicStyles} from 'common';
import Skeleton from 'components/Loading/Skeleton';
import {
  Spinner,
  Rating,
  CustomModal,
  Empty,
  UserImage,
  SystemNotification,
} from 'components';
import Api from 'services/api/index.js';
import Currency from 'services/Currency.js';
import {connect} from 'react-redux';
import Config from 'src/config.js';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faPlus, faSearch} from '@fortawesome/free-solid-svg-icons';
import {Dimensions} from 'react-native';
import ProposalModal from 'modules/generic/ProposalModal';
import RequestCard from 'modules/generic/RequestCard';
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';
import _ from 'lodash';
import Footer from 'modules/generic/Footer'
import Header from 'modules/generic/Header'
const height = Math.round(Dimensions.get('window').height);
class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selected: null,
      connectModal: false,
      connectSelected: null,
      searchValue: null,
      searchType: null,
      requestItemData: [],
      size: 0,
      filterOptions: [
        {
          title: 'Amount',
          value: 'amount',
        },
        {
          title: 'Location',
          value: 'location',
        },
      ],
      isBookmark: false,
      limit: 5,
      active: 1,
      activePage: 0,
      offset: 0,
      tempData: [],
      data: [],
      page: 'public',
      unReadPeerRequests: [],
      unReadRequests: [],
      activeIndex: 0
    };
  }

  componentDidMount() {
    this.retrieve(false, true);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    const {user} = this.props.state;
    console.log('back button');
    if (user) {
      return true;
    } else {
      return false;
    }
  };

  retrieve = (scroll, flag, loading = true) => {
    const { setParameter } = this.props
    const {user, searchParameter, parameter, location, defaultAddress} = this.props.state;
    const { data, tempData, page } = this.state;
    if (user == null) {
      return;
    }
    let parameters = {
      account_id: user.id,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset,
      limit: this.state.limit,
      sort: {
        column: 'created_at',
        order: 'desc'
      },
      mode: 'all',
      target: 'all'
    }
    if(page == 'personal'){
      parameters['request_account_id'] = user.id
    }
    if(parameter && parameter.target.toLowerCase() != 'all'){
      parameters['target'] = parameter.target
    }
    if(parameter && parameter.type.toLowerCase() != 'all'){
      parameters['type'] = Helper.getRequestTypeCode(parameter.type)
    }
    if(parameter && parameter.currency != 'all'){
      parameters['currency'] = parameter.currency
    }
    if(parameter && parameter.amount > 0){
      parameters['amount'] = parameter.amount
    }
    if(parameter && parameter.needed_on != null){
      parameters['needed_on'] = parameter.needed_on
    }
    if(page == 'public'){
      parameters['status'] = 0
    }
    if(page == 'history'){
      parameters['mode'] = 'history'
    }
    if(user.scope_location != null){
      parameters['scope'] = user.scope_location
    }

    if(defaultAddress && defaultAddress.longitude && defaultAddress.latitude){
      parameters['location'] = defaultAddress;
    }

    if(!defaultAddress && location && location.longitude && location.latitude){
      parameters['location'] = location;
    }

    console.log('paramddeters', parameters)
    this.setState({isLoading: (loading == false) ? false : true});
    Api.request(Routes.requestRetrieveMobile, parameters, response => {
      console.log('response in Requests', response)
      response.data.forEach(element => {
        console.log('[rating]', element.rating)
      });
      this.setState({
        // size: response.size ? response.size : 0,
        isLoading: false
      });
        if(response.data.length > 0){
          this.setState({
            // data: flag == false ? response.data : response.data,
            data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'code'),
            numberOfPages: parseInt(response.size / this.state.limit) + (response.size % this.state.limit ? 1 : 0),
            offset: flag == false ? 1 : (this.state.offset + 1)
          })
        }else{
          this.setState({
            data: flag == false ? [] : this.state.data,
            numberOfPages: null,
            offset: flag == false ? 0 : this.state.offset
          })
        }
      },
      (error) => {
        console.log('error', error)
        this.setState({isLoading: false});
      }
    ); 
  };

  onRefresh = () => {
    const {setSearchParameter} = this.props;
    setSearchParameter(null);
    setTimeout(() => {
      this.retrieve(false, true);
    }, 1000);
  };

  search = () => {
    const {setSearchParameter} = this.props;
    let parameter = {
      column: this.state.searchType,
      value: this.state.searchValue,
    };
    setSearchParameter(parameter);
    this.retrieve(false, true);
  };

  bookmark = (item) => {
    const {user} = this.props.state;
    let parameter = {
      account_id: user.id,
      request_id: item.id,
    };
    this.setState({isLoading: true});
    Api.request(Routes.bookmarkCreate, parameter, (response) => {
      this.retrieve(false, true);
    });
  };


  acceptPeer = (item, request) => {
    const {user} = this.props.state;
    let parameter = {
      id: item.id,
      status: 'approved',
    };
    this.setState({isLoading: true});
    Api.request(Routes.requestPeerUpdate, parameter, (response) => {
      if (response.data) {
        // create a thread
        let messengerParams = {
          member: item.account_id,
          title: request.code,
          payload: request.id,
          creator: user.id,
        };
        Api.request(
          Routes.customMessengerGroupCreate,
          messengerParams,
          (messengerResponse) => {
            if (messengerResponse.data > 0) {
              this.retrieveThread(messengerResponse.data);
            }
          },
        );
      }
    });
  };

  connectRequest = (item) => {
    const { setRequest } = this.props;
    this.setState({
      connectSelected: item,
    });
    setRequest(item)
    setTimeout(() => {
      this.setState({connectModal: true});
    }, 500);
  };

  validate = () => {
    Alert.alert(
      'Message',
      'In order to Create Request, Please Verify your Account.',
      [
        {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
      ],
      { cancelable: false }
    )
  }

  FlatListItemSeparator = () => {
    return <View style={Style.Separator} />;
  };

  _flatList = () => {
    const {selected, isLoading, data} = this.state;
    const {user} = this.props.state;
    return (
      <View
        style={{
          marginBottom: 100,
        }}>
        {data != null && user != null && (
          <FlatList
            data={data}
            extraData={selected}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({item, index}) => (
              <View style={{
                marginTop: (index == 0) ? 70 : 0,
                border
              }}>
                <RequestCard 
                  onConnectRequest={(item) => {this.connectRequest(item)}}
                  data={item}
                  navigation={this.props.navigation}
                  from={'request'}
                  />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    );
  };

  renderData(){
    const { isLoading, data } = this.state;
    return(
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => {
          let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
          let totalHeight = event.nativeEvent.contentSize.height
          if(event.nativeEvent.contentOffset.y <= 0) {
            if(isLoading == false){
              // this.retrieve(false)
            }
          }
          if(Math.round(scrollingHeight) >= Math.round(totalHeight)) {
            if(isLoading == false){
              this.retrieve(true, true, true)
            }
          }
        }}>
          <View style={Style.MainContainer}>  
            {
              (data && data.length > 0) && data.map((item, index) => (
                <View style={{
                  marginTop: (index == 0) ? 70 : 0,
                  marginBottom: (index == data.length - 1 && isLoading == false) ? 100 : 0,
                  borderBottomWidth: 10,
                  borderBottomColor: Color.lightGray,
                  paddingLeft: 20,
                  paddingRight: 20
                }}
                  key={index}
                  >
                  <RequestCard 
                    onConnectRequest={(item) => {this.connectRequest(item)}}
                    data={item}
                    navigation={this.props.navigation}
                    from={'request'}
                    />
                </View>
              ))
            }
            {data.length == 0 && isLoading == false && (
              <View style={{
                marginTop: 100,
                paddingLeft: 10,
                paddingRight: 10
              }}>
                <Empty refresh={true} onRefresh={() => this.onRefresh()} />
              </View>
            )}
            {
              isLoading && (<Skeleton size={2}/>)
            }
          </View>
      </ScrollView>
    )
  }

  render() {
    const {
      isLoading,
      connectModal,
      connectSelected,
      activeIndex
    } = this.state;
    const {theme, user} = this.props.state;
    const { data } = this.state;
    return (
      <SafeAreaView style={{
        flex: 1
      }}>
        

        <PagerProvider activeIndex={activeIndex}>
          <Pager panProps={{enabled: false}}>
            <View>
              {this.renderData()}
            </View>
            <View>
              {this.renderData()}
            </View>
            <View>
              {this.renderData()}
            </View>
          </Pager>
        </PagerProvider>

        <TouchableOpacity
          style={[Style.floatingButton, {
            backgroundColor: theme ? theme.secondary : Color.secondary,
            height: 60,
            width: 60,
            borderRadius: 30,
            bottom: 70
          }]}
          onPress={() => {
            // {
            //   user.status == 'verified' ? 
            //   this.props.navigation.navigate('createRequestStack') : this.validate()
            // }
              this.props.navigation.navigate('createRequestStack')
          }}>
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              color: Color.white,
            }}
            size={16}
          />
        </TouchableOpacity>

        {/* {isLoading ? <Spinner mode="overlay" /> : null} */}
        {
          connectModal && (
            <ProposalModal
              visible={connectModal}
              data = {this.state.connectSelected}
              navigation={this.props.navigation}
              loading={(flag) => this.setState({
                isLoading: flag
              })}
              peerRequest={null}
              onRetrieve={() => {}}
              request={connectSelected}
              from={'update'}
              closeModal={() =>
                this.setState({
                  connectModal: false,
                })
            }></ProposalModal>
          )
        }
        <Footer
          {...this.props}
          selected={this.state.page} onSelect={async (value, index) => {
            await this.setState({
              page: value,
              activeIndex: index,
              offset: 0,
              data: []
            })
            this.retrieve(false, false, true)
          }}
          from={'request'}
        />  
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    updateRequests: (requests) => dispatch(actions.updateRequests(requests)),
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger)),
    setSearchParameter: (searchParameter) =>
      dispatch(actions.setSearchParameter(searchParameter)),
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
    setRequest: (request) => dispatch(actions.setRequest(request)),
    setParameter: (parameter) => dispatch(actions.setParameter(parameter))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);