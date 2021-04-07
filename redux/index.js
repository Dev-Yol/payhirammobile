import AsyncStorage from '@react-native-community/async-storage';
import Data from 'services/Data';
import {Helper, Color} from 'common';
import {Routes} from 'common';
import Api from '../services/api';

const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  UPDATE_USER: 'UPDATE_USER',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  UPDATE_NOTIFICATIONS: 'UPDATE_NOTIFICATIONS',
  SET_MESSAGES: 'SET_MESSAGES',
  SET_LEDGER: 'SET_LEDGER',
  SET_USER_LEDGER: 'SET_USER_LEDGER',
  SET_MESSENGER_GROUP: 'SET_MESSENGER_GROUP',
  UPDATE_MESSENGER_GROUP: 'UPDATE_MESSENGER_GROUP',
  SET_MESSAGES_ON_GROUP: 'SET_MESSAGES_ON_GROUP',
  UPDATE_MESSAGES_ON_GROUP: 'UPDATE_MESSAGES_ON_GROUP',
  UPDATE_MESSAGE_BY_CODE: 'UPDATE_MESSAGE_BY_CODE',
  UPDATE_MESSAGES_ON_GROUP_BY_PAYLOAD: 'UPDATE_MESSAGES_ON_GROUP_BY_PAYLOAD',
  SET_LOCATION: 'SET_LOCATION',
  SET_SEARCH_PARAMETER: 'SET_SEARCH_PARAMETER',
  SET_REQUESTS: 'SET_REQUESTS',
  UPDATE_REQUESTS: 'UPDATE_REQUESTS',
  SET_UNREAD_REQUESTS: 'SET_UNREAD_REQUESTS',
  SET_PIN_FLAG: 'SET_PIN_FLAG',
  SET_SYSTEM_NOTIFICATION: 'SET_SYSTEM_NOTIFICATION',
  SET_SELECTED_PRODUCT_ID: 'SET_SELECTED_PRODUCT_ID',
  SET_PRODUCT: 'SET_PRODUCT',
  nav: null,
  QRCODE_MODAL: 'QRCODE_MODAL',
  SET_THEME: 'SET_THEME',
  SET_REQUEST_INPUT: 'SET_REQUEST_INPUT',
  SET_VALIDATE_OTP: 'SET_VALIDATE_OTP',
  VIEW_MENU: 'VIEW_MENU',
  VIEW_SHARE: 'VIEW_SHARE',
  SET_REQUEST: 'SET_REQUEST',
  SET_DEFAULT_ADDRESS: 'SET_DEFAULT_ADDRESS',
  SET_UNREAD_MESSAGES: 'SET_UNREAD_MESSAGES',
  SET_UNREAD_PEER_REQUEST: 'SET_UNREAD_PEER_REQUEST',
  SET_CIRCLE_SEARCH: 'SET_CIRCLE_SEARCH',
  SET_FILTER_DATA: 'SET_FILTER_DATA',
  SET_DEVICE_LOCATION: 'SET_DEVICE_LOCATION',
  SET_PARAMETER: 'SET_PARAMETER',
  SET_DEEPLINK_ROUTE: 'SET_DEEPLINK_ROUTE'
};

export const actions = {
  login: (user, token) => {
    return {type: types.LOGIN, user, token};
  },
  logout() {
    return {type: types.LOGOUT};
  },
  updateUser: (user) => {
    return {type: types.UPDATE_USER, user};
  },
  setNotifications(unread, notifications) {
    return {type: types.SET_NOTIFICATIONS, unread, notifications};
  },
  setMessenger(unread, messages) {
    return {type: types.SET_MESSAGES, unread, messages};
  },
  setLedger(ledger) {
    return {type: types.SET_LEDGER, ledger};
  },
  setUserLedger(userLedger) {
    return {type: types.SET_USER_LEDGER, userLedger};
  },
  setMessengerGroup(messengerGroup) {
    return {type: types.SET_MESSENGER_GROUP, messengerGroup};
  },
  updateMessengerGroup(messengerGroup) {
    return {type: types.UPDATE_MESSENGER_GROUP, messengerGroup};
  },
  updateMessagesOnGroupByPayload(messages) {
    return {type: types.UPDATE_MESSAGES_ON_GROUP_BY_PAYLOAD, messages};
  },
  setMessagesOnGroup(messagesOnGroup) {
    return {type: types.SET_MESSAGES_ON_GROUP, messagesOnGroup};
  },
  updateMessagesOnGroup(message) {
    return {type: types.UPDATE_MESSAGES_ON_GROUP, message};
  },
  updateMessageByCode(message) {
    return {type: types.UPDATE_MESSAGE_BY_CODE, message};
  },
  setLocation(location) {
    return {type: types.SET_LOCATION, location};
  },
  updateNotifications(unread, notification) {
    return {type: types.UPDATE_NOTIFICATIONS, unread, notification};
  },
  setSearchParameter(searchParameter) {
    return {type: types.SET_SEARCH_PARAMETER, searchParameter};
  },
  setRequests(requests) {
    return {type: types.SET_REQUESTS, requests};
  },
  setRequest(request) {
    return {type: types.SET_REQUEST, request};
  },
  updateRequests(request) {
    return {type: types.UPDATE_REQUESTS, request};
  },
  setPinFlag(pinFlag) {
    return {type: types.SET_PIN_FLAG, pinFlag};
  },
  setSystemNotification(systemNotification) {
    return {type: types.SET_SYSTEM_NOTIFICATION, systemNotification};
  },
  setProduct(product) {
    return {type: types.SET_PRODUCT, product};
  },
  setSelectedProductId(productId) {
    return {
      type: types.SET_SELECTED_PRODUCT_ID,
      productId,
    };
  },
  setQRCodeModal(isVisible) {
    return {type: types.QRCODE_MODAL, isVisible};
  },
  setTheme(theme) {
    return {type: types.SET_THEME, theme};
  },
  setRequestInput(requestInput) {
    return {type: types.SET_REQUEST_INPUT, requestInput};
  },
  setIsValidOtp(isValidOtp) {
    return {type: types.SET_VALIDATE_OTP, isValidOtp};
  },
  viewMenu(isViewing){
    return {type: types.VIEW_MENU, isViewing}
  },
  viewShare(isShow){
    return {type: types.VIEW_SHARE, isShow}
  },
  setDefaultAddress(defaultAddress) {
    return {type: types.SET_DEFAULT_ADDRESS, defaultAddress}
  },
  setUnReadMessages(messages) {
    return {type: types.SET_UNREAD_MESSAGES, messages}
  },
  setUnReadPeerRequest(message) {
    return {type: types.SET_UNREAD_PEER_REQUEST, messages}
  },
  setUnReadRequests(requests) {
    return {type: types.SET_UNREAD_REQUESTS, requests}
  },
  setCircleSearch(circleSearch) {
    return {type: types.SET_CIRCLE_SEARCH, circleSearch}
  },
  setFilterData(filterData) {
    return {type: types.SET_FILTER_DATA, filterData}
  },
  setDeviceLocation(deviceLocation) {
    return {type: types.SET_DEVICE_LOCATION, deviceLocation}
  },
  setParameter(parameter) {
    return {type: types.SET_PARAMETER, parameter}
  },
  setDeepLinkRoute(deepLinkRoute) {
    return {type: types.SET_DEEPLINK_ROUTE, deepLinkRoute}
  }
};

const date = new Date()
const initialState = {
  token: null,
  user: null,
  notifications: null,
  messenger: null,
  ledger: null,
  userLedger: null,
  messengerGroup: null,
  messagesOnGroup: {
    groupId: null,
    messages: null,
  },
  unReadMessages: [],
  searchParameter: null,
  parameter: null,
  location: {
    id: 1,
    account_id: 1,
    latitude: '10.373264655881858',
    latitude: '123.94052113182192',
    route: 'test',
    locality: 'test',
    region: 'test',
    country: 'test'
  },
  requests: [],
  request: null,
  nav: null,
  pinFlag: false,
  systemNotification: null,
  product: null,
  productId: null,
  qrCodeModal: false,
  requestInput: null,
  isValidOtp: false,
  isViewing: false,
  isShow: false,
  defaultAddress: null,
  unReadPeerRequest: [],
  unReadRequests: [],
  circleSearch: null,
  filterData: null,
  deviceLocation: null,
  deepLinkRoute: null
};

storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(`${Helper.APP_NAME}${key}`, value);
  } catch (e) {
    // saving error
  }
};

// removeData = async (item) => {
//   try{
//     await AsyncStorage.removeItem(item)
//   }catch (e){

//   }
// }

const reducer = (state = initialState, action) => {
  const {type, user, token} = action;
  const {messages, unread, message} = action;
  const {messengerGroup, messagesOnGroup} = action;
  const {location, notification} = action;
  const {searchParameter, requests} = action;
  const {systemNotification} = action;
  const {product, productId} = action;
  const {isVisible, isShow} = action;
  const {theme} = action;
  const {requestInput} = action;
  const {isValidOtp} = action;
  const { isViewing, request, defaultAddress } = action;
  const { circleSearch } = action;
  const { filterData } = action;
  const { deviceLocation } = action;
  const { parameter, deepLinkRoute } = action;
  switch (type) {
    case types.LOGOUT:
      storeData('token', '');
      // AsyncStorage.clear()
      console.log("[LOGOUT]");
      return Object.assign({}, initialState);
    case types.LOGIN:
      storeData('token', token);
      console.log('LOGIN', true);
      Data.setToken(token);
      return {...state, user, token};
    case types.UPDATE_USER:
      return {
        ...state,
        user,
      };
    case types.SET_NOTIFICATIONS:
      let notifications = {
        unread,
        notifications: action.notifications,
      };
      console.log('notifications', true);
      return {
        ...state,
        notifications,
      };
    case types.UPDATE_NOTIFICATIONS:
      let updatedNotifications = null;
      if (state.notifications == null) {
        let temp = [];
        temp.push(notification);
        updatedNotifications = {
          unread,
          notifications: temp,
        };
      } else {
        let oldNotif = state.notifications;
        if (oldNotif.notifications == null) {
          let temp = [];
          temp.push(notification);
          updatedNotifications = {
            unread,
            notifications: temp,
          };
        } else {
          if (
            parseInt(notification.id) !=
            parseInt(
              oldNotif.notifications[oldNotif.notifications.length - 1].id,
            )
          ) {
            oldNotif.notifications.unshift(notification);
            updatedNotifications = {
              unread: oldNotif.unread + unread,
              notifications: oldNotif.notifications,
            };
          } else {
            updatedNotifications = {
              unread: oldNotif.unread + unread,
              notifications: oldNotif.notifications,
            };
          }
        }
      }
      return {
        ...state,
        notifications: updatedNotifications,
      };
    case types.SET_MESSAGES:
      let messenger = {
        unread,
        messages,
      };
      console.log('messenger', true);
      return {
        ...state,
        messenger,
      };
    case types.SET_USER_LEDGER:
      let userLedger = {
        currency: 'PHP',
        amount: action.userLedger,
      };
      return {
        ...state,
        userLedger,
      };
    case types.SET_LEDGER:
      return {
        ...state,
        ledger: action.ledger,
      };
    case types.SET_MESSENGER_GROUP:
      return {
        ...state,
        messengerGroup,
      };
    case types.UPDATE_MESSENGER_GROUP:
      return {
        ...state,
        messengerGroup: {
          ...state.messengerGroup,
          created_at_human: messengerGroup.created_at_human,
          rating: messengerGroup.rating,
          status: parseInt(messengerGroup.status),
          validations: messengerGroup.validations,
        },
      };
    case types.SET_MESSAGES_ON_GROUP:
      return {
        ...state,
        messagesOnGroup,
      };
    case types.UPDATE_MESSAGES_ON_GROUP:
      let updatedMessagesOnGroup = null;
      if (state.messagesOnGroup != null) {
        let oldMessages = state.messagesOnGroup.messages;
        if (oldMessages == null) {
          let temp = [];
          temp.push(message);
          updatedMessagesOnGroup = {
            ...state.messagesOnGroup,
            messages: temp,
          };
        } else {
          if (
            parseInt(message.id) !=
            parseInt(oldMessages[oldMessages.length - 1].id)
          ) {
            updatedMessagesOnGroup = {
              ...state.messagesOnGroup,
              messages: oldMessages.push(message),
            };
          } else {
            updatedMessagesOnGroup = {
              ...state.messagesOnGroup,
            };
          }
        }
      } else {
        let temp = [];
        temp.push(message);
        updatedMessagesOnGroup = {
          groupId: parseInt(message.messenger_group_id),
          messages: temp,
        };
      }
      return {
        ...state,
        updatedMessagesOnGroup,
      };
    case types.UPDATE_MESSAGE_BY_CODE:
      let newMessagesOnGroup = state.messagesOnGroup.messages.map(
        (item, index) => {
          if (
            typeof item.code != undefined ||
            typeof item.code != 'undefined'
          ) {
            if (parseInt(item.code) == parseInt(message.code)) {
              return message;
            }
          }
          return item;
        },
      );
      return {
        ...state,
        messagesOnGroup: {
          ...state.messagesOnGroup,
          messages: newMessagesOnGroup,
        },
      };
    case types.UPDATE_MESSAGES_ON_GROUP_BY_PAYLOAD:
      let tempMessages = state.messagesOnGroup.messages.map((item, index) => {
        if (
          parseInt(item.id) == parseInt(action.messages[index].id) &&
          item.payload_value != null
        ) {
          return action.messages[index];
        }
        return item;
      });
      return {
        ...state,
        messagesOnGroup: {
          ...state.messagesOnGroup,
          messages: tempMessages,
        },
      };
    case types.SET_LOCATION:
      return {
        ...state,
        location,
      };
    case types.SET_SEARCH_PARAMETER:
      return {
        ...state,
        searchParameter,
      };
    case types.SET_REQUESTS:
      return {
        ...state,
        requests,
      };
    case types.SET_REQUEST:
      return {
        ...state,
        request
      };
    case types.UPDATE_REQUESTS:
      let newRequests = state.requests.map((item, index) => {
        if(item.code == request.code){
          return {
            ...item,
            status: request.status
          }
        }
        return
      })
      return {
        ...state,
        requests: newRequests,
      };
    case types.SET_PIN_FLAG:
      return {
        ...state,
        pinFlag: action.pinFlag,
      };
    case types.SET_SYSTEM_NOTIFICATION:
      return {
        ...state,
        systemNotification,
      };
    case types.SET_PRODUCT:
      return {
        ...state,
        product,
      };
    case types.SET_SELECTED_PRODUCT_ID:
      return {
        ...state,
        productId,
      };
    case types.QRCODE_MODAL:
      return {
        ...state,
        qrCodeModal: isVisible.isVisible,
      };
    case types.SET_THEME:
      console.log('tertiary', theme.tertiary);
      storeData('primary', theme.primary);
      storeData('secondary', theme.secondary);
      storeData('tertiary', theme.tertiary);
      storeData('fourth', theme.fourth);
      storeData('index', '' + theme.index);
      Color.setPrimary(theme.primary);
      Color.setSecondary(theme.secondary);
      Color.setTertiary(theme.tertiary);  
      Color.setFourth(theme.fourth);
      return {
        ...state,
        theme,
      };
    case types.SET_REQUEST_INPUT:
      console.log('REQUEST INPUT', requestInput);
      return {
        ...state,
        requestInput,
      };
    case types.SET_VALIDATE_OTP:
      console.log('IS VALID OTP', isValidOtp);
      return {
        ...state,
        isValidOtp,
      };
    case types.VIEW_MENU:
      return {
        ...state,
        isViewing,
      };
    case types.SET_DEFAULT_ADDRESS: 
      return {
        ...state,
        defaultAddress
      }
    case types.SET_UNREAD_MESSAGES: 
      let newUnread = []
      if(messages.length == null){
        newUnread = []
      }else{
        newUnread = state.unReadMessages.push(messages)
      }
      return {
        ...state,
        unReadMessages: newUnread
      }
    case types.VIEW_SHARE:
      return {
        ...state,
        isShow,
      };
    case types.SET_UNREAD_PEER_REQUEST: 
      let newUnreadPeerRequest = []
      if(messages == null){
        newUnreadPeerRequest = []
      }else{
        newUnreadPeerRequest = state.unReadPeerRequest.push(messages)
      }
      return {
        ...state,
        unReadPeerRequest: newUnreadPeerRequest
      }
    case types.SET_UNREAD_REQUESTS:
      return {
        ...state,
        unReadRequests: requests,
      };
    case types.SET_CIRCLE_SEARCH:
      return {
        ...state,
        circleSearch
      };
    case types.SET_FILTER_DATA:
      return {
        ...state,
        filterData,
      };
    case types.SET_DEVICE_LOCATION:
      return {
        ...state,
        deviceLocation,
      };
    case types.SET_PARAMETER:
      return {
        ...state,
        parameter,
      };
    case types.SET_SELECTED_LEDGER:
      return {
        ...state,
        ledger,
      };
    case types.SET_DEEPLINK_ROUTE:
      return {
        ...state,
        deepLinkRoute,
      }
    default:
      return {...state, nav: state.nav};
  }
};
export default reducer;
