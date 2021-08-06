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
  faMobileAlt,
  faMapMarkerAlt,
  faShippingFast
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
    title: 'Table of Charges',
    route: 'chargesStack',
    icon: faShippingFast
  },
  {
    title: 'Available Locations',
    route: 'availableLocationStack',
    icon: faMapMarkerAlt
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
