import { createStackNavigator } from 'react-navigation-stack';
import Login from 'modules/basics/rounded/LoginWithFingerPrint';
import FingerprintScan from '../modules/basics/FingerPrintScanner';
import ForgotPassword from 'modules/basics/rounded/ForgotPassword';
import Register from 'modules/basics/rounded/Register';
import Drawer from './Drawer';
import NotificationStack from 'modules/notification/Drawer.js';
import MessagesStack from 'modules/messenger/MessagesDrawer.js';
import CreateBorrowRequestStack from 'modules/request/CreateBorrowDrawer.js';
import LocationStack from 'components/Location/Drawer.js';
import DashboardStack from 'modules/dashboard/DashboardDrawer.js';
import CreateRequestStack from '../modules/request/createRequest/CreateRequestDrawer';
import AccountSettingsStack from 'modules/accountSettings/AccountSettingsDrawer.js';
import SettingsStack from 'modules/settings/SettingsDrawer.js';
import OtpStack from 'modules/otp/OtpDrawer.js';
// import RequestItemStack from 'modules/otp/OtpDrawer.js';
import RequestItemStack from 'modules/request/requestItem/requestItemDrawer.js';
import EditProfileStack from 'modules/profile/editProfile/editProfileDrawer.js';
import TransactionsStack from 'modules/transactions/Drawer.js';
import TransferFundStack from 'modules/transferFund/TransferFundDrawer.js';
import DirectTransferStack from 'modules/transferFund/DirectTransferDrawer.js';
import NotificationSettingsStack from 'modules/notification/settings/NotificationSettingsDrawer.js';
import CreateTicketStack from 'components/Support/createTicket/CreateTicketDrawer.js';
import DisplayStack from 'modules/display/DisplayDrawer.js';
import ReviewsStack from 'modules/reviews/ReviewsDrawer.js';
import AddPaymentStack from 'modules/payment/add/AddPaymentDrawer.js';
import ViewProfileStack from 'modules/viewProfile/ViewProfileDrawer.js';
import TermsAndConditionsStack from 'modules/termsAndConditions/TermsAndConditionsDrawer.js';
import QRCodeScannerStack from 'modules/qrCodeScanner/qrCodeScannerDrawer.js';
import PaymentMethodsStack from 'modules/payment/PaymentMethodsDrawer.js';
import AddLocationStack from 'modules/addLocation/AddLocationDrawer.js';
import LocationWithMap from 'components/Location/LocationWithMap';
import SupportStack from 'components/Support/SupportDrawer.js';
import UpdateTicketStack from 'components/Support/UpdateTicket/UpdateTicketDrawer.js';
import PrivacyStack from 'modules/privacy/Drawer';
import GuidelinesStack from 'modules/guidelines/GuidelinesDrawer';
import LocationWithMapViewerStack from 'components/Location/LocationViewerDrawer.js';

// login stack
const LoginStack = createStackNavigator(
  {
    loginScreen: { screen: Login },
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// FingerPrint stack
const FingerPrintStack = createStackNavigator(
  {
    fingerPrintScreen: { screen: FingerprintScan },
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Forgot Password stack
const ForgotPasswordStack = createStackNavigator(
  {
    forgotPasswordScreen: { screen: ForgotPassword },
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Forgot Password stack
const RegisterStack = createStackNavigator(
  {
    registerScreen: { screen: Register },
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);
const LocationWithMapStack = createStackNavigator(
  {
    LocationWithMapScreen: {screen: LocationWithMap},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);
// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    loginStack: {screen: LoginStack},
    fingerPrintStack: {screen: FingerPrintStack},
    forgotPasswordStack: {screen: ForgotPasswordStack},
    registerStack: {screen: RegisterStack},
    drawerStack: {screen: Drawer},
    notificationStack: {screen: NotificationStack},
    messagesStack: {screen: MessagesStack},
    createRequestStack: {screen: CreateRequestStack},
    locationStack: {screen: LocationStack},
    createBorrowStack: {screen: CreateBorrowRequestStack},
    dashboardStack: {screen: DashboardStack},
    accountSettingsStack: {screen: AccountSettingsStack},
    settingsStack: {screen: SettingsStack},
    otpStack: {screen: OtpStack},
    requestItemStack: {screen: RequestItemStack},
    editProfileStack: {screen: EditProfileStack},
    transactionsStack: {screen: TransactionsStack},
    transferFundStack: {screen: TransferFundStack},
    notificationSettingsStack: {screen: NotificationSettingsStack},
    createTicketStack: {screen: CreateTicketStack},
    displayStackStack: {screen: DisplayStack},
    reviewsStack: {screen: ReviewsStack},
    addPaymentStack: {screen: AddPaymentStack},
    viewProfileStack: {screen: ViewProfileStack},
    termsAndConditionsStack: {screen: TermsAndConditionsStack},
    qrCodeScannerStack: {screen: QRCodeScannerStack},
    addLocationStack: {screen: AddLocationStack},
    locationWithMapStack: {screen: LocationWithMapStack},
    locationWithMapViewerStack: {screen: LocationWithMapViewerStack},
    paymentMethodsStack: { screen: PaymentMethodsStack },
    supportStack: { screen: SupportStack },
    updateTicketStack: { screen: UpdateTicketStack },
    paymentMethodsStack: { screen: PaymentMethodsStack },
    privacyStack: { screen: PrivacyStack},
    guidelinesStack: { screen: GuidelinesStack},
    directTransferDrawer: { screen: DirectTransferStack }
  },
  {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: 'loginStack',
  },
);

export default PrimaryNav;
