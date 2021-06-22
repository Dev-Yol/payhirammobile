import React, {Component} from 'react';
import Style from './Style.js';
import {
  View,
  Alert,
  ScrollView,
  BackHandler,
  SafeAreaView,
  FlatList, 
  TouchableOpacity, 
  Modal,
  Text,
  Image
} from 'react-native';
import {Routes, Color, Helper, BasicStyles} from 'common';
import Skeleton from 'components/Loading/Skeleton';
import Message from 'components/Message/index.js'
import Api from 'services/api/index.js';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {Dimensions} from 'react-native';
import ProposalModal from 'modules/generic/ProposalModal';
import Button from 'components/Form/Button';
import RequestCard from 'modules/generic/RequestCard';
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';
import Config from 'src/config.js';
import _ from 'lodash';
import Footer from 'modules/generic/Footer'
import MessageAlert from 'modules/generic/MessageAlert'
import BePartner from 'modules/generic/BeAPartner'
import DeviceInfo from 'react-native-device-info';
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
      activeIndex: 0,
      messageEmpty: null,
      numberOfPages: 0,
      showModal: false
    };
  }

  onFocusFunction = () => {
    const{deepLinkRoute} = this.props.state;
    console.log(':::REDIRECTING::: ', deepLinkRoute)
    if(deepLinkRoute !== null) {
      this.props.navigation.navigate('viewProfileStack', {
        code: deepLinkRoute.split('/')[2]
      })
    }else {
      this.retrieve(false, true);
    }
  }

  componentDidMount() {
    const { user } = this.props.state;
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
    this.setState({messageEmpty: `Hi ${user?.username}!` + ' ' + (user?.account_type != 'USER' ? 'Create any requests and let our trusted partners process your requests . Click the button below to get started.' : 'Create any requests and let our trusted partners process your requests . Click the button below to get started.')})
    if(this.state.isLoading == false){
      this.retrieve(false, true)
    }
  }

  componentWillUnmount() {
    this.backHandler.remove();
    this.focusListener.remove()
  }

  handleBackPress = () => {
    return true
  };

  authorize = () => {
    const { user } = this.props.state;
    if(user == null){
      return
    }
    console.log('[user]', user.device_info)
    let deviceId = DeviceInfo.getDeviceId();
    let model = DeviceInfo.getModel();
    let uniqueId = DeviceInfo.getUniqueId();
    DeviceInfo.getManufacturer().then((manufacturer) => {
      this.setState({manufacturers: manufacturer})
      console.log('[device]s', deviceId, '[model]', model, '[uniqueId]', uniqueId, '[manufacturer]', this.state.manufacturers, '[os]', Platform.OS)
      if(user.device_info == null){
        console.log('[primary]')
        let parameters = {
          account_id: user.id,
          model: model,
          unique_code: uniqueId,
          details: JSON.stringify({manufacturer: this.state.manufacturers, os: Platform.OS, deviceId: deviceId}),
          status: 'primary'
        }
        console.log('[primary]', parameters)
        Api.request(Routes.deviceCreate, parameters, response => {
          console.log('[ressssssssssssspnse]', response)
        }, error => {
          console.log('[device error: ]', error)
        })
      }else{
        console.log('[F]')
        let parameter = {
          account_id: user.id,
          model: model,
          unique_code: uniqueId,
          details: JSON.stringify({manufacturer: this.state.manufacturers, os: Platform.OS, deviceId: deviceId}),
          status: 'secondary'
        }
        console.log('[secondary]', parameter)
        Api.request(Routes.deviceCreate, parameter, response => {
          console.log('[responseeeeeeeeeee]', response)
        }, error => {
          console.log('[device errors: ]', error)
        })
      }
    });
  }

  logout = () => {
    //clear storage
    const { logout, setActiveRoute } = this.props;
    logout();
    // setActiveRoute(null)
    setTimeout(() => {
      // this.navigateToLogin('Login')
      this.props.navigation.navigate('loginStack');
    }, 100)
  }

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
      target: 'all',
      shipping: 'all'
    }
    if(page == 'personal' || user.account_type == 'USER'){
      parameters['request_account_id'] = user.id
    }
    if(parameter && parameter.target.toLowerCase() != 'all'){
      parameters['target'] = parameter.target
    }
    if(parameter && parameter.shipping.toLowerCase() != 'all'){
      parameters['shipping'] = parameter.shipping
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
    if(page == 'onNegotiation'){
      parameters['status'] = 0
      parameters['peer_status'] = 'requesting'
    }
    if(page == 'onDelivery'){
      parameters['status'] = 1
      parameters['peer_status'] = 'approved'
    }
    if(page == 'history'){
      parameters['status'] = 2
      parameters['peer_status'] = 'approved'
    }
    if(page == 'history' || page == 'onNegotiation' || page == 'onDelivery'){
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

    console.log('parameters', parameters)
    this.setState({isLoading: (loading == false) ? false : true});
    Api.request(Routes.requestRetrieveMobile, parameters, response => {
      this.setState({
        // size: response.size ? response.size : 0,
        isLoading: false
      });
      if(response.data.length > 0){
        this.setState({
          // data: flag == false ? response.data : response.data,
          messageEmpty: null,
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          numberOfPages: parseInt(response.size / this.state.limit) + (response.size % this.state.limit ? 1 : 0),
          offset: flag == false ? 1 : (this.state.offset + 1)
        })
      }else{
        this.setState({
          data: flag == false ? [] : this.state.data,
          numberOfPages: null,
          offset: flag == false ? 0 : this.state.offset
        })
        if(page == 'personal'){
          this.setState({messageEmpty: `Hi ${user.username}!` + ' ' + (user.account_type != 'USER' ? 'Create any requests and let our trusted partners process your requests . Click the button below to get started.' : 'Create any requests and let our trusted partners process your requests . Click the button below to get started.')})
        }
        if(page == 'public'){
          this.setState({messageEmpty: `Hi ${user.username}!` + ' ' + (user.account_type == 'USER' ? 'Create any requests and let our trusted partners process your requests . Click the button below to get started.' :'Grab the chance to process requests and the great chance to earn. Click the button below to get started.')})
        }
        if(page == 'onNegotiation'){
          this.setState({messageEmpty: `Hi ${user.username}!` + ' ' + 'Seems like you do not make any proposals yet. Go to public page and make proposals.'})
        }
        if(page == 'onDelivery'){
          this.setState({messageEmpty: `Hi ${user.username}!` + ' ' + 'Seems like you do not have ongoing transaction yet. Click the button below to get started.'})
        }
        if(page == 'history'){
          this.setState({messageEmpty: `Hi ${user.username}!` + ' ' + 'Seems like you do not have completed transaction. Click the button below to get started.'})
        }
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
    const { user } = this.props.state
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
          <View style={{
            ...Style.MainContainer,
            minHeight: height + 400,
            marginTop: 70
          }}> 
            <MessageAlert from={'request'}/>
            {
              (user && Helper.checkStatus(user) == Helper.accountVerified && user?.plan == null) && 
              (
                <BePartner {...this.props} paddingTop={0} />
              )
            }
          
            {data.length == 0 && isLoading == false && (
              <View style={{
                paddingLeft: 20,
                paddingRight: 20,
                width: '100%'
              }}>
                <Message page={this.state.page} message={this.state.messageEmpty} navigation={this.props.navigation}/>
              </View>
            )}
            {
              (data && data.length > 0) && data.map((item, index) => (
                <View style={{
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
      activeIndex,
      showModal
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
            bottom: user?.account_type != 'USER' ? 70 : 25
          }]}
          onPress={() => {
            {
              (Helper.checkStatus(user) >= Helper.accountVerified) ? 
              this.props.navigation.navigate('createRequestStack') : this.validate()
            }
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
        {
          user?.account_type != 'USER' && (
            <Footer
              {...this.props}
              selected={this.state.page} onSelect={async (value, index) => {
                await this.setState({
                  page: value,
                  activeIndex: index,
                  offset: 0,
                  data: [],
                  isLoading: true
                })
                setTimeout(() => {
                  this.retrieve(false, false, true)
                }, 1000)
              }}
              from={'request'}
            />  
          )
        }
        {
            (showModal && user) && (
              <Modal
                visible={showModal}
                animationType={'slide'}
                transparent={true}>
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  flex: 1
                }}>
                  <View style={{
                    minHeight: 100,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 20,
                    paddingBottom: 20,
                    borderRadius: 12,
                    width: '80%',
                    marginRight: '10%',
                    marginLeft: '10%',
                    backgroundColor: 'white'
                  }}>

                      <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        paddingTop: 10,
                        textAlign: 'center',
                      }}>
                        OTP CODE
                      </Text>

                      <Text style={{
                        fontSize: 15,
                        // paddingTop: '10%',
                        textAlign: 'center',
                        padding: 5,
                        color: 'gray'
                      }}>
                        Check your notifications, we have sent you a code to your primary device, please enter it below and press 'Verify'.
                      </Text>

                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'space-between',
                        width: '100%',
                        marginTop: 10,
                        padding: 10
                      }}>
                        <Button
                          onClick={() => this.logout()}
                          title={'Logout'}
                          style={{
                            borderColor: Color.danger,
                            borderWidth: 1,
                            width: '45%',
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: 'transparent'
                          }}
                          textStyle={{
                            color: Color.danger,
                            fontSize: BasicStyles.standardFontSize
                          }}
                        />
                        <Button
                          onClick={() => this.authorize()}
                          title={'Authorize'}
                          style={{
                            backgroundColor: theme ? theme.secondary : Color.secondary,
                            width: '50%',
                            borderRadius: 25
                          }}
                        />
                      </View>
                  </View>
                </View>

              </Modal>
            )

            // SECONDARY DEVICE  LOGOUT AND AUTHORIZE
            // (showModal && user) && (
            //   <Modal
            //     visible={showModal}
            //     animationType={'slide'}
            //     transparent={true}>
            //     <View style={{
            //       alignItems: 'center',
            //       justifyContent: 'center',
            //       backgroundColor: 'rgba(0, 0, 0, 0.5)',
            //       flex: 1
            //     }}>
            //       <View style={{
            //         minHeight: 100,
            //         paddingLeft: 10,
            //         paddingRight: 10,
            //         paddingTop: 20,
            //         paddingBottom: 20,
            //         borderRadius: 12,
            //         width: '80%',
            //         marginRight: '10%',
            //         marginLeft: '10%',
            //         backgroundColor: 'white'
            //       }}>

            //           {
            //             /*Action buttons*/
            //           }

            //           <Text style={{
            //             fontSize: 16,
            //             fontWeight: 'bold',
            //             paddingTop: 10,
            //             textAlign: 'center',
            //           }}>
            //             WELCOME TO PAYHIRAM.PH
            //           </Text>

            //           <Text style={{
            //             fontSize: 15,
            //             paddingTop: 3,
            //             textAlign: 'center',
            //             marginBottom: '10%'
            //           }}>
            //             Your Transfer of Choice
            //           </Text>

            //           <View style={{
            //             width: '100%',
            //             alignItems: 'center'
            //           }}>
            //             <Image source={require('assets/Device.png')} style={{
            //               height: 100,
            //               width: 100
            //             }}/>
            //           </View>

            //           <Text style={{
            //             fontSize: 14,
            //             paddingTop: '10%',
            //             textAlign: 'center',
            //             padding: 10,
            //             color: 'gray',
            //             fontStyle: 'italic'
            //           }}>
            //             You are seeing this because you are loggin in to this device for the first time or you have reached the maximum number of trusted devices that can be added. Click 'Authorize' button to link this device.
            //           </Text>

            //           <View style={{
            //             flexDirection: 'row',
            //             justifyContent: 'space-between',
            //             alignItems: 'space-between',
            //             width: '100%',
            //             marginTop: 10,
            //             padding: 10
            //           }}>
            //             <Button
            //               onClick={() => this.logout()}
            //               title={'Logout'}
            //               style={{
            //                 borderColor: Color.danger,
            //                 borderWidth: 1,
            //                 width: '45%',
            //                 height: 50,
            //                 borderRadius: 25,
            //                 backgroundColor: 'transparent'
            //               }}
            //               textStyle={{
            //                 color: Color.danger,
            //                 fontSize: BasicStyles.standardFontSize
            //               }}
            //             />
            //             <Button
            //               onClick={() => this.authorize()}
            //               title={'Authorize'}
            //               style={{
            //                 backgroundColor: theme ? theme.secondary : Color.secondary,
            //                 width: '50%',
            //                 borderRadius: 25
            //               }}
            //             />
            //           </View>
            //       </View>
            //     </View>

            //   </Modal>
            // )

            // AUTHORIZE MODAL

            // (showModal && user) && (
            //   <Modal
            //     visible={showModal}
            //     animationType={'slide'}
            //     transparent={true}>
            //     <View style={{
            //       alignItems: 'center',
            //       justifyContent: 'center',
            //       backgroundColor: 'rgba(0, 0, 0, 0.5)',
            //       flex: 1
            //     }}>
            //       <View style={{
            //         minHeight: 100,
            //         paddingLeft: 10,
            //         paddingRight: 10,
            //         paddingTop: 20,
            //         paddingBottom: 20,
            //         borderRadius: 12,
            //         width: '80%',
            //         marginRight: '10%',
            //         marginLeft: '10%',
            //         backgroundColor: 'white'
            //       }}>

            //           <Text style={{
            //             fontSize: 16,
            //             fontWeight: 'bold',
            //             paddingTop: 10,
            //             textAlign: 'center',
            //           }}>
            //             WELCOME TO PAYHIRAM.PH
            //           </Text>

            //           <Text style={{
            //             fontSize: 15,
            //             paddingTop: 3,
            //             textAlign: 'center',
            //             marginBottom: '10%'
            //           }}>
            //             Your Transfer of Choice
            //           </Text>

            //           <View style={{
            //             width: '100%',
            //             alignItems: 'center'
            //           }}>
            //             <Image source={require('assets/Device.png')} style={{
            //               height: 100,
            //               width: 100
            //             }}/>
            //           </View>

            //           <Text style={{
            //             fontSize: 14,
            //             paddingTop: '10%',
            //             textAlign: 'center',
            //             padding: 10,
            //             color: 'gray',
            //             fontStyle: 'italic'
            //           }}>
            //             Use this device as your primary device and receive security notifications once there's an activity of your account.
            //           </Text>

            //           <View style={{
            //             width: '100%',
            //             alignItems: 'center',
            //             marginTop: 5
            //           }}>
            //             <Button
            //               onClick={() => this.authorize()}
            //               title={'Authorize'}
            //               style={{
            //                 backgroundColor: theme ? theme.secondary : Color.secondary,
            //                 width: '50%',
            //                 borderRadius: 25
            //               }}
            //             />
            //           </View>
            //       </View>
            //     </View>

            //   </Modal>
            // )
          }
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