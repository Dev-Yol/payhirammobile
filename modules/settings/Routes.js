import {
  faUser,
  faEdit,
  faCreditCard,
  faBell,
  faPalette,
  faHandshake,
  faShieldAlt,
  faBookOpen,
  faLock,
  faMobileAlt
} from '@fortawesome/free-solid-svg-icons';
const navigation = [
  {
    title: 'Account Settings',
    route: 'accountSettingsStack',
    icon: faUser
  },
  {
    title: 'Edit Profile',
    route: 'editProfileStack',
    icon: faEdit
  },
  // {
  //   title: 'Payment Methods',
  //   route: 'paymentMethodsStack',
  //   icon: faCreditCard
  // },
  {
    title: 'Security',
    route: 'notificationSettingsStack',
    icon: faLock
  },
  {
    title: 'Devices',
    route: 'devicesStack',
    icon: faMobileAlt
  },
  {
    title: 'Display',
    route: 'displayStackStack',
    icon: faPalette
  },
  {
    title: 'Terms & Conditions',
    route: 'termsAndConditionsStack',
    icon: faHandshake
  },
  {
    title: 'Privacy Policies',
    route: 'privacyStack',
    icon: faShieldAlt
  },
  {
    title: 'Guidelines',
    route: 'guidelinesStack',
    icon: faBookOpen
  },
];

export default navigation;
