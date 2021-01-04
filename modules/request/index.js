import React, { Component } from 'react';
import Style from './Style.js';
import {
  TextInput,
  View,
  Image,
  TouchableHighlight,
  Text,
  ScrollView,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import { Picker, FlatList, TouchableOpacity } from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
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
import { connect } from 'react-redux';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Dimensions } from 'react-native';
import RequestOptions from './RequestOptions.js';
import BottomSheet from './bottomsheet/BottomSheet'
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
      limit: 10,
      active: 1,
      activePage: 0,
      isRequestOptions: false,
    };
  }

  componentDidMount() {
    this.retrieve();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    const { user } = this.props.state;
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
    const { setSearchParameter } = this.props;
    const { user, searchParameter } = this.props.state;
    if (flag == false) {
      setSearchParameter(null);
      this.setState({ activePage: 0 });
      setTimeout(() => {
        this.retrieve();
      }, 100);
    } else {
      let searchParameter = {
        column: 'account_id',
        value: user.id,
      };
      this.setState({ activePage: 1 });
      setSearchParameter(searchParameter);
      setTimeout(() => {
        this.retrieve();
      }, 100);
    }
  };

  retrieve = (flag = true) => {
    const { user, searchParameter } = this.props.state;
    const { setUserLedger } = this.props;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      offset: (this.state.active - 1) * this.state.limit,
      limit: this.state.limit,
      sort: {
        column: 'created_at',
        value: 'desc',
      },
      value: searchParameter == null ? '%' : searchParameter.value + '%',
      column: searchParameter == null ? 'created_at' : searchParameter.column,
      type: user.account_type,
    };
    this.setState({ isLoading: true });
    Api.request(
      Routes.requestRetrieve,
      parameter,
      (response) => {
        this.setState({
          isLoading: false,
          size: response.size ? response.size : 0,
        });
        setUserLedger(response.ledger);
        if (flag == true) {
          const { setRequests } = this.props;
          if (response.data != null) {
            console.log('retrieve', response.data)
            setRequests(response.data);
          } else {
            setRequests(null);
          }
        } else {
          const { updateRequests } = this.props;
          // scroll to bottom
          if (response.data != null) {
            updateRequests(response.data);
          }
        }
      },
      (error) => {
        this.setState({ isLoading: false });
      },
    );
  };

  onRefresh = () => {
    const { setSearchParameter } = this.props;
    setSearchParameter(null);
    setTimeout(() => {
      this.retrieve();
    }, 1000);
  };

  search = () => {
    const { setSearchParameter } = this.props;
    let parameter = {
      column: this.state.searchType,
      value: this.state.searchValue,
    };
    setSearchParameter(parameter);
    this.retrieve();
  };

  bookmark = (item) => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      request_id: item.id,
    };
    this.setState({ isLoading: true });
    Api.request(Routes.bookmarkCreate, parameter, (response) => {
      this.retrieve();
    });
  };

  retrieveThread = (id) => {
    const { user } = this.props.state;
    const { setMessengerGroup } = this.props;
    let parameter = {
      condition: [
        {
          value: id,
          column: 'id',
          clause: '=',
        },
      ],
      account_id: user.id,
    };
    Api.request(
      Routes.customMessengerGroupRetrieveByParams,
      parameter,
      (response) => {
        this.setState({ isLoading: true });
        if (response.data != null) {
          setMessengerGroup(response.data);
          this.props.navigation.navigate('messagesStack');
        }
      },
    );
  };

  acceptPeer = (item, request) => {
    const { user } = this.props.state;
    let parameter = {
      id: item.id,
      status: 'approved',
    };
    this.setState({ isLoading: true });
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
    this.setState({
      connectSelected: item,
    });
    setTimeout(() => {
      this.setState({ connectModal: true });
    }, 500);
  };

  connectAction = (flag) => {
    if (flag == false) {
      this.setState({ connectModal: false, connectSelected: null });
    } else {
      // process charges
      this.setState({ connectModal: false, connectSelected: null });
      this.retrieve();
    }
  };

  _search = () => {
    const { searchParameter } = this.props.state;
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
            onValueChange={(searchType) => this.setState({ searchType })}
            style={[
              BasicStyles.pickerStyleCreate,
              {
                width: '40%',
                transform: [{ scaleX: 0.77 }, { scaleY: 0.77 }],
                textAlign: 'left',
                left: -15,
                marginRight: 0,
                paddingRight: 0,
              },
            ]}
            itemStyle={{ fontSize: 11 }}>
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
            onChangeText={(searchValue) => this.setState({ searchValue })}
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

  _peers = (peers, request) => {
    const { user } = this.props.state;
    return (
      <View>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Color.primary,
          }}>
          <Text
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              color: Color.primary,
            }}>
            Peer request list
          </Text>
        </View>
        <View>
          {peers.peers.map((item, index) => {
            return (
              <View>
                {this._header(item, 'rating')}
                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}>
                  <View
                    style={{
                      width: '50%',
                    }}>
                    <Text style={Style.text}>Processing fee</Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: Color.primary,
                      }}>
                      {Currency.display(item.charge, item.currency)}
                    </Text>
                  </View>
                  {peers.status === false && (
                    <View
                      style={{
                        width: '50%',
                        alignItems: 'flex-end',
                      }}>
                      <TouchableHighlight
                        onPress={() => {
                          this.acceptPeer(item, request);
                        }}
                        underlayColor={Color.gray}
                        style={[Style.btn, { backgroundColor: Color.warning }]}>
                        <Text
                          style={{
                            color: Color.white,
                          }}>
                          Accept
                        </Text>
                      </TouchableHighlight>
                    </View>
                  )}
                  {peers.status === false && (
                    <View
                      style={{
                        width: '50%',
                        alignItems: 'flex-end',
                      }}>
                      <TouchableHighlight
                        onPress={() => {
                          this.viewThread(item);
                        }}
                        underlayColor={Color.gray}
                        style={[Style.btn, { backgroundColor: Color.secondary }]}>
                        <Text
                          style={{
                            color: Color.white,
                          }}>
                          View Thread
                        </Text>
                      </TouchableHighlight>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  _footer = (item) => {
    const { isBookmark } = this.state;
    const { user } = this.props.state;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          {isBookmark == true && (
            <View
              style={{
                width: '50%',
              }}>
              <TouchableHighlight
                onPress={() => {
                  this.bookmark(item);
                }}
                style={[Style.btn, { backgroundColor: Color.primary }]}
                underlayColor={Color.gray}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  {item.bookmark == true && (
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{
                        color: Color.white,
                        marginRight: 10,
                      }}
                    />
                  )}
                  <Text
                    style={{
                      color: Color.white,
                    }}>
                    Bookmark
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          )}
          {user.account_type != 'USER' && (
            <View
              style={{
                width: '50%',
              }}>
              <TouchableHighlight
                onPress={() => {
                  this.connectRequest(item);
                }}
                underlayColor={Color.gray}
                style={[Style.btn, { backgroundColor: Color.primary }]}>
                <Text
                  style={{
                    color: Color.white,
                  }}>
                  Connect
                </Text>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </View>
    );
  };

  _body = (item) => {
    return (
      <View>
        <Text
          style={[
            Style.text,
            {
              paddingTop: 10,
              paddingBottom: 10,
              textAlign: 'justify',
            },
          ]}>
          {item.reason}
        </Text>
        {item.images != null && (
          <View>
            {item.images.map((image, imageIndex) => {
              return <View></View>;
            })}
          </View>
        )}
      </View>
    );
  };

  _subHeader = (item) => {
    const { user } = this.props.state;
    return (
      <View>
        <Text
          style={{
            color: Color.primary,
          }}>
          {Helper.showRequestType(item.type)}
        </Text>
        {item.coupon != null && parseInt(item.account_id) == user.id && (
          <Text style={Style.text}>
            {item.coupon.type === 'percentage'
              ? item.coupon.amount + '% '
              : Currency.display(item.coupon.amount, item.coupon.currency) +
              ' '}
            Discount({item.coupon.code})
          </Text>
        )}
        {item.max_charge !== null && item.max_charge > 0 && (
          <Text style={Style.text}>
            Suggested Charge -{' '}
            {Currency.display(item.max_charge, item.currency)}
          </Text>
        )}
        <Text style={Style.text}>Posted on {item.created_at_human}</Text>
        {item.location != null && (
          <Text style={Style.text}>
            {item.location.route +
              ', ' +
              item.location.locality +
              ', ' +
              item.location.country}
          </Text>
        )}
        <Text style={Style.text}>Needed on {item.needed_on_human}</Text>
      </View>
    );
  };

  _header = (item, type) => {
    return (
      <View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <UserImage user={item.account} />
          <Text
            style={{
              color: Color.primary,
              lineHeight: 30,
              paddingLeft: 10,
              width: '40%',
            }}>
            {item.account.username}
          </Text>
          <View
            style={{
              width: '50%',
            }}>
            {type == 'amount' && (
              <Text
                style={{
                  color: Color.primary,
                  fontWeight: 'bold',
                  textAlign: 'right',
                  lineHeight: 30,
                  width: '100%',
                }}>
                {Currency.display(item.amount, item.currency)}
              </Text>
            )}
            {type == 'rating' && (
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-end',
                }}>
                <Rating ratings={item.rating}></Rating>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  FlatListItemSeparator = () => {
    return <View style={Style.Separator} />;
  };

  _flatList = () => {
    const { selected } = this.state;
    const { user, requests } = this.props.state;
    return (
      <View
        style={{
          marginBottom: 100,
        }}>
        {requests != null && user != null && (
          <FlatList
            data={requests}
            extraData={selected}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("requestItemStack", {item:item.id})}>
                {this._header(item, 'amount')}
                {this._subHeader(item)}
                {this._body(item)}
                <View>
                  <Rating ratings={item.rating}></Rating>
                </View>
                {item.account_id != user.id && this._footer(item)}
                {item.account_id == user.id &&
                  item.peers.peers != null &&
                  this._peers(item.peers, item)}
                </TouchableOpacity>
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
    const { requests } = this.props.state;
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
          onScroll={(event) => {
            let scrollingHeight =
              event.nativeEvent.layoutMeasurement.height +
              event.nativeEvent.contentOffset.y;
            let totalHeight = event.nativeEvent.contentSize.height - 20;
            if (event.nativeEvent.contentOffset.y <= 0) {
              if (this.state.isLoading == false) {
                this.setState({ active: 1 });
                setTimeout(() => {
                  this.retrieve();
                }, 10);
              }
            }
            if (scrollingHeight >= totalHeight) {
              let totalPage = this.state.size / this.state.limit;
              let prevActive = this.state.active;
              let newPage =
                this.state.active < totalPage - 1
                  ? this.state.active + 1
                  : this.state.active;
              this.setState({ active: newPage });
              setTimeout(() => {
                if (prevActive < newPage) {
                  this.retrieve(false);
                } else {
                  ToastAndroid.show('Nothing follows!', ToastAndroid.LONG);
                }
              }, 10);
            }
          }}>
          <SystemNotification></SystemNotification>
          <View style={[Style.MainContainer, {marginTop: 60}]}>
            {/* <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => this.setRetrieveParameter(false)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  backgroundColor:
                    this.state.activePage == 0 ? Color.primary : Color.white,
                  borderColor: Color.primary,
                  borderTopLeftRadius: 5,
                  borderWidth: 1,
                  width: '50%',
                }}>
                <Text
                  style={{
                    color:
                      this.state.activePage == 0 ? Color.white : Color.primary,
                    fontSize: 11,
                    textAlign: 'center',
                  }}>
                  All requests
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setRetrieveParameter(true)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  borderTopRightRadius: 5,
                  backgroundColor:
                    this.state.activePage == 1 ? Color.primary : Color.white,
                  borderColor: Color.primary,
                  borderWidth: 1,
                  borderLeftWidth: 0,
                  width: '50%',
                }}>
                <Text
                  style={{
                    color:
                      this.state.activePage == 1 ? Color.white : Color.primary,
                    fontSize: 11,
                    textAlign: 'center',
                  }}>
                  View my requests
                </Text>
              </TouchableOpacity>
            </View> */}
            {this._flatList()}
            {requests == null && isLoading == false && (
              <Empty refresh={true} onRefresh={() => this.onRefresh()} />
            )}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={Style.floatingButton}
          onPress={() => {
            this.props.navigation.navigate('createRequestStack');
          }}>
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              color: Color.white
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
        <BottomSheet visible={connectModal} closeModal={() =>
          this.setState({
            connectModal: false
          })
        }>
        </BottomSheet>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setRequests: (requests) => dispatch(actions.setRequests(requests)),
    updateRequests: (requests) => dispatch(actions.updateRequests(requests)),
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger)),
    setSearchParameter: (searchParameter) =>
      dispatch(actions.setSearchParameter(searchParameter)),
    setMessengerGroup: (messengerGroup) =>
      dispatch(actions.setMessengerGroup(messengerGroup)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
