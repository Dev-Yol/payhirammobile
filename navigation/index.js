import { createStackNavigator } from 'react-navigation-stack';
import Login from 'modules/basics/Login';
import ForgotPassword from 'modules/basics/ForgotPassword';
import Register from 'modules/basics/Register';
import Drawer from './Drawer';
import NotificationStack from 'modules/notification/Drawer.js';
import MessagesStack from 'components/Messenger/MessagesDrawer.js';
import LedgerStack from 'modules/dashboard/LedgerDrawer.js';
import CreateBorrowRequestStack from 'modules/request/CreateBorrowDrawer.js';
import LocationStack from 'components/Location/Drawer.js';
import RequestStack from 'modules/request/requestUpdated/requestDrawer.js';
import DashboardStack from 'modules/dashboard/DashboardDrawer.js';
import CreateRequestStack from '../modules/request/createRequest/CreateRequestDrawer';
import AccountSettingsStack from 'modules/accountSettings/AccountSettingsDrawer.js';
import SettingsStack from 'modules/settings/SettingsDrawer.js';
import OtpStack from 'modules/otp/OtpDrawer.js';
import RequestItemStack from 'modules/request/requestItem/requestItemDrawer.js';
import EditProfileStack from 'modules/profile/editProfile/editProfileDrawer.js';
import TransactionsStack from 'modules/transactions/Drawer.js';
import NotificationSettingsStack from 'modules/notification/settings/NotificationSettingsDrawer.js';
import CreateTicketStack from 'modules/createTicket/CreateTicketDrawer.js';
import DisplayStack from 'modules/display/DisplayDrawer.js';
import ReviewsStack from 'modules/reviews/ReviewsDrawer.js';
import AddPaymentStack from 'modules/payment/add/AddPaymentDrawer.js';
import ViewProfileStack from 'modules/viewProfile/ViewProfileDrawer.js';
import TermsAndConditionsStack from 'modules/termsAndConditions/TermsAndConditionsDrawer.js';
import QRCodeScannerStack from 'modules/qrCodeScanner/qrCodeScannerDrawer.js';
import PaymentMethodsStack from 'modules/payment/PaymentMethodsDrawer.js';
import AddLocationStack from 'modules/addLocation/AddLocationDrawer.js';
import LocationWithMap from 'components/Location/LocationWithMap';

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
    forgotPasswordStack: {screen: ForgotPasswordStack},
    registerStack: {screen: RegisterStack},
    drawerStack: {screen: Drawer},
    notificationStack: {screen: NotificationStack},
    messagesStack: {screen: MessagesStack},
    ledgerStack: {screen: LedgerStack},
    createRequestStack: {screen: CreateRequestStack},
    locationStack: {screen: LocationStack},
    createBorrowStack: {screen: CreateBorrowRequestStack},
    requestStack: {screen: RequestStack},
    dashboardStack: {screen: DashboardStack},
    accountSettingsStack: {screen: AccountSettingsStack},
    settingsStack: {screen: SettingsStack},
    otpStack: {screen: OtpStack},
    requestItemStack: {screen: RequestItemStack},
    editProfileStack: {screen: EditProfileStack},
    transactionsStack: {screen: TransactionsStack},
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
    paymentMethodsStack: { screen: PaymentMethodsStack },
  },
  {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: 'loginStack',
  },
);

export default PrimaryNav;
