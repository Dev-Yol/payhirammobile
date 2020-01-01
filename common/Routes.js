import config from 'src/config';
const url = config.IS_DEV;
let apiUrl = url + '/';
export default {
  auth: apiUrl + 'authenticate',
  authUser: apiUrl + 'authenticate/user',
  authRefresh: apiUrl + 'authenticate/refresh',
  authInvalidate: apiUrl + 'authenticate/invalidate',
  accountRetrieve: apiUrl + 'accounts/retrieve',
  notificationsRetrieve: apiUrl + 'notifications/retrieve',
  messagesRetrieve: apiUrl + 'messenger_groups/retrieve_summary_payhiram',
  ledgerSummaryRetrieve: apiUrl + 'ledgers/summary',
  requestRetrieve: apiUrl + 'requests/retrieve',
  requestCreate: apiUrl + 'requests/create',
  bookmarkCreate: apiUrl + 'bookmarks/create',
  requestPeerCreate: apiUrl + 'request_peers/create',
  customMessengerGroupRetrieve: apiUrl + 'custom_messenger_groups/retrieve',
  customMessengerGroupCreate: apiUrl + 'custom_messenger_groups/create',
  messengerMessagesRetrieve: apiUrl + 'messenger_messages/retrieve',
  ratingsCreate: apiUrl + 'ratings/create'
}