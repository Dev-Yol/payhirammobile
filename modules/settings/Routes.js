import {
  faUser,
  faEdit,
  faCreditCard,
  faBell,
  faPalette,
  faHandshake,
  faShieldAlt
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
  {
    title: 'Payment Methods',
    route: 'paymentMethodsStack',
    icon: faCreditCard
  },
  {
    title: 'Notifications',
    route: 'notificationSettingsStack',
    icon: faBell
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
];

export default navigation;
