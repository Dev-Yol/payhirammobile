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
} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-community/picker';
import {Routes, Color, Helper, BasicStyles} from 'common';
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
import RequestOptions from './RequestOptions.js';
import ProposalModal from 'modules/generic/ProposalModal';
import RequestCard from 'modules/generic/RequestCard';
import _ from 'lodash';

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
      isRequestOptions: false,
      offset: 0,
      tempData: [],
      data: []
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    this.retrieve(false, true);
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

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  setRetrieveParameter = (flag) => {
    const {setSearchParameter} = this.props;
    const {user, searchParameter} = this.props.state;
    if (flag == false) {
      setSearchParameter(null);
      this.setState({activePage: 0});
      setTimeout(() => {
        this.retrieve(false, true);
      }, 100);
    } else {
      let searchParameter = {
        column: 'account_id',
        value: user.id,
      };
      this.setState({activePage: 1});
      setSearchParameter(searchParameter);
      setTimeout(() => {
        this.retrieve(false, true);
      }, 100);
    }
  };

  retrieve = (scroll, flag, backgroundFlag = false) => {
    console.log("[Request Retrieve] On Sending Request")
    const {user, searchParameter} = this.props.state;
    const { data, tempData } = this.state;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      offset: backgroundFlag == false ? this.state.offset * this.state.limit : (this.state.offset + 1) * this.state.limit,
      limit: this.state.limit,
      sort: {
        column: 'created_at',
        value: 'desc',
      },
      value: searchParameter == null ? '%' : searchParameter.value + '%',
      column: searchParameter == null ? 'created_at' : searchParameter.column,
      type: user.account_type,
    };
    this.setState({isLoading: backgroundFlag == false && data.length > 0 ? false : true}); 
    if(tempData.length > 0){
      console.log("[Request Retrieve] with existing data")
      this.manageData(scroll, flag, backgroundFlag, tempData)
    }else{
      console.log("[Request Retrieve] parameter", parameter)
      Api.request( Routes.requestRetrieve, parameter, (response) => {
        this.setState({
          size: response.size ? response.size : 0,
        });
        this.manageData(scroll, flag, backgroundFlag, response)
      },
      (error) => {
        this.setState({isLoading: false});
      },
    ); 
    }
  };

  manageData(scroll, flag, backgroundFlag, response){
    console.log("[Retrieve Request] Manage Data")
    const { tempData, data } = this.state;
    this.setState({
      isLoading: false
    })

    if(response.data.length > 0){
      this.setState({
        data: scroll == false ? response.data : _.uniqBy([...data, ...response.data], 'id'),
        offset: scroll == false ? 1 : (this.state.offset + 1)
      })
    }else{
      this.setState({
        data: flag == false ? [] : data,
        numberOfPages: null,
        offset: flag == false ? 0 : this.state.offset
      })
    }
  }

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

  connectAction = (flag) => {
    if (flag == false) {
      this.setState({connectModal: false, connectSelected: null});
    } else {
      // process charges
      this.setState({connectModal: false, connectSelected: null});
      this.retrieve(false, true);
    }
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

  _search = () => {
    const {searchParameter} = this.props.state;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: Color.primary,
            borderBottomWidth: 1,
          }}>
          <Picker
            selectedValue={this.state.searchType}
            onValueChange={(searchType) => this.setState({searchType})}
            style={[
              BasicStyles.pickerStyleCreate,
              {
                width: '40%',
                transform: [{scaleX: 0.77}, {scaleY: 0.77}],
                textAlign: 'left',
                left: -15,
                marginRight: 0,
                paddingRight: 0,
              },
            ]}
            itemStyle={{fontSize: 11}}>
            {this.state.filterOptions.map((item, index) => {
              return (
                <Picker.Item
                  key={index}
                  label={item.title}
                  value={item.value}
                />
              );
            })}
          </Picker>
          <TextInput
            style={{
              height: 50,
              width: '50%',
              marginLeft: 0,
              paddingLeft: 0,
              left: -30,
            }}
            onChangeText={(searchValue) => this.setState({searchValue})}
            value={this.state.searchValue}
            placeholder={'Find something here...'}
          />
          <TouchableOpacity
            onPress={() => this.search()}
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              width: '10%',
            }}>
            <FontAwesomeIcon
              icon={faSearch}
              size={BasicStyles.iconSize}
              style={{
                color: Color.primary,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };


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
              <View>
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

  render() {
    const {
      isLoading,
      connectModal,
      connectSelected,
      isRequestOptions,
    } = this.state;
    const {theme, user} = this.props.state;
    const { data } = this.state;
    return (
      <View style={Style.MainContainer}>
        {isRequestOptions && (
          <RequestOptions
            visible={isRequestOptions}
            navigate={(route) => this.redirect(route)}
            close={() =>
              this.setState({
                isRequestOptions: false,
              })
            }
          />
        )}
        {/*this._search()*/}
        <ScrollView
          style={Style.ScrollView}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if(event.nativeEvent.contentOffset.y <= 0) {
              if(isLoading == false){
                // this.retrieve(false)
              }
            }
            if(scrollingHeight >= (totalHeight)) {
              if(isLoading == false){
                this.retrieve(true, true, false)
              }
            }
          }}>
          <SystemNotification></SystemNotification>
          <View style={[Style.MainContainer, {marginTop: 60}]}>
            
            {this._flatList()}
            {data.length == 0 && isLoading == false && (
              <Empty refresh={true} onRefresh={() => this.onRefresh()} />
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[Style.floatingButton, {
            backgroundColor: theme ? theme.secondary : Color.secondary,
            height: 70,
            width: 70,
            borderRadius: 35
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

        {isLoading ? <Spinner mode="overlay" /> : null}
        {/* <CustomModal
          visible={connectModal}
          title={'Charges'}
          payload={'charges'}
          actionLabel={{
            yes: 'Continue',
            no: 'Cancel',
          }}
          data={connectSelected}
          action={(flag) => this.connectAction(flag)}></CustomModal> */}

        {
          connectModal && (
            <ProposalModal
              visible={connectModal}
              data = {this.state.connectSelected}
              navigation={this.props.navigation}
              loading={(flag) => this.setState({
                isLoading: flag
              })}
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
    updateRequests: (requests) => dispatch(actions.updateRequests(requests)),
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger)),
    setSearchParameter: (searchParameter) =>
      dispatch(actions.setSearchParameter(searchParameter)),
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
    setRequest: (request) => dispatch(actions.setRequest(request)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);