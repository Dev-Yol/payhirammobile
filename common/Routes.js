import config from 'src/config';
const url = config.IS_DEV;
let apiUrl = url + '/';
export default {
  auth: apiUrl + 'authenticate',
  authUser: apiUrl + 'authenticate/user',
  authRefresh: apiUrl + 'authenticate/refresh',
  authInvalidate: apiUrl + 'authenticate/invalidate',
  accountRetrieve: apiUrl + 'accounts/retrieve',
  accountUpdate: apiUrl + 'accounts/update',
  accountCreate: apiUrl + 'accounts/create',
  accountProfileRetrieve: apiUrl + 'account_informations/retrieve_account_info',
  accountUpdatePassword: apiUrl + 'accounts/update_password',
  notificationsRetrieve: apiUrl + 'notifications/retrieve_new',
  notificationUpdate: apiUrl + 'notifications/update',
  messagesRetrieve: apiUrl + 'messenger_groups/retrieve_summary_payhiram',
  ledgerSummary: apiUrl + 'ledger/summary',
  ledgerHistory: apiUrl + 'ledger/history',
  ledgerDashboard: apiUrl + 'ledger/dashboard',
  ledgerDirectTransfer: apiUrl + 'ledger/direct_transfer',
  ledgerAcceptPayment: apiUrl + 'ledger/accept_payment_confirmation',
  ledgerAcceptPaymentOnConfirm: apiUrl + 'ledger/accept_payment_on_confirmed',
  requestRetrieve: apiUrl + 'requests/retrieve',
  requestRetrieveMobile: apiUrl + 'requests/retrieve_mobile',
  requestRetrieveItem: apiUrl + 'requests/retrieve_item',
  requestRetrieveByPayloadValue: apiUrl + 'requests/retrieve_by_payload_value',
  transactionRetrieve: apiUrl + 'ledger/summary_ledger',
  requestCreate: apiUrl + 'requests/create',
  requestDelete: apiUrl + 'requests/delete',
  bookmarkCreate: apiUrl + 'bookmarks/create',
  requestPeerCreate: apiUrl + 'request_peers/create',
  requestPeerRetrieveItem: apiUrl + 'request_peers/retrieve_item',
  requestPeerUpdate: apiUrl + 'request_peers/update',
  requestPeerDelete: apiUrl + 'request_peers/delete',
  requestManageByThread: apiUrl + 'requests/manage_request_by_thread',
  customMessengerGroupRetrieve: apiUrl + 'custom_messenger_groups/retrieve',
  customMessengerGroupCreate: apiUrl + 'custom_messenger_groups/create',
  customMessengerGroupRetrieveByParams:
    apiUrl + 'custom_messenger_groups/retrieve_by_params',
  // customMessengerGroupCreate: apiUrl + 'custom_messenger_groups/create',
  messengerMessagesCreate: apiUrl + 'messenger_messages/create',
  messengerMessagesRetrieve: apiUrl + 'messenger_messages/retrieve',
  messengerMessagesUpdate: apiUrl + 'messenger_messages/update_by_status',
  mmCreateWithImageWithoutPayload:
    apiUrl + 'messenger_messages/create_with_image_without_payload',
  mmCreateWithImage: apiUrl + 'messenger_messages/create_with_images',
  ratingsCreate: apiUrl + 'ratings/create',
  ratingsRetrieve: apiUrl + 'ratings/retrieve',
  notificationSettingsRetrieve: apiUrl + 'notification_settings/retrieve',
  notificationSettingsCreate: apiUrl + 'notification_settings/create',
  notificationSettingsUpdate: apiUrl + 'notification_settings/update',
  notificationSettingOtp: apiUrl + 'notification_settings/update_otp',
  imageUpload: apiUrl + 'images/upload',
  imageRetrieve: apiUrl + 'images/retrieve',
  imageUploadUnLink: apiUrl + 'images/upload_un_link',
  imageUploadBase64: apiUrl + 'images/upload_base64',
  requestValidationCreate: apiUrl + 'request_validations/create',
  requestValidationUpdate: apiUrl + 'request_validations/update',
  requestValidationRetreive: apiUrl + 'request_validations/retrieve',
  requestValidationDelete: apiUrl + 'request_validations/delete',
  depositCreate: apiUrl + 'deposits/create',
  withdrawalCreate: apiUrl + 'withdrawals/create',
  withdrawalRetrieve: apiUrl + 'withdrawals/retrieve',
  transferChargesRetrieve: apiUrl + 'transfer_charges/retrieve',
  accountInformationRetrieve: apiUrl + 'account_informations/retrieve',
  accountInformationUpdate: apiUrl + 'account_informations/update',
  accountProfileCreate: apiUrl + 'account_profiles/create',
  accountProfileUpdate: apiUrl + 'account_profiles/update',
  accountCardsCreate: apiUrl + 'account_cards/create',
  accountCardsUpdate: apiUrl + 'account_cards/update',
  accountProfileRetrieveImage : apiUrl + 'acount_profiles/retrieve',
  investorLocationsRetrieve: apiUrl + 'investor_locations/retrieve',
  systemNotificationRetrieve: apiUrl + 'system_notifications/retrieve',
  couponsValidate: apiUrl + 'coupons/validate',
  productsRetrieve: apiUrl + 'products/retrieve',
  productsRetrieveBasic: apiUrl + 'products/retrieve_basic',
  ticketsRetrieve: apiUrl + 'tickets/retrieve',
  ticketsCreate: apiUrl + 'tickets/create',
  ticketsUpdate: apiUrl + 'tickets/update',
  accountUpdateEmail: apiUrl + 'accounts/update_email',
  circleRetrieve: apiUrl + 'my_circles/retrieve',
  circleCreate: apiUrl + 'my_circles/create',
  educationsRetrieve: apiUrl + 'educations/retrieve',
  circleUpdate: apiUrl + 'my_circle/update',
  circleDelete: apiUrl + 'my_circle/delete',
  retrieveSavedAddresses: apiUrl + 'locations/retrieve',
  addAddress: apiUrl + 'locations/create',
  removeAddress: apiUrl + 'locations/delete',
  uploadImage: apiUrl + 'payloads/create',
  retrieveImage: apiUrl + 'payloads/retrieve',
  transferFund: apiUrl + 'fund_transfer_charges/update',
  enableSupportCreate: apiUrl + 'enable_supports/create',
  commentCreate: apiUrl + 'comments/create',
  commentsRetrieve: apiUrl + 'comments/retrieve',
  replyCreate: apiUrl + 'comment_replies/create'
};
