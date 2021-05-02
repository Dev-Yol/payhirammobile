import Color from './Color.js';
import {
  faEdit,
  faComments,
  faCheck,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillWaveAlt, faCog, faHome, faEnvelope, faUsers, faPalette, faShieldAlt, faHandshake, faTachometerAlt, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faUser, faCertificate, faBuilding, faCity } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
export default {
  company: 'Increment Technologies Inc.',
  APP_NAME: '@Payhiram_',
  APP_NAME_BASIC: 'PayHiram',
  APP_EMAIL: 'support@payhiram.ph',
  APP_WEBSITE: 'www.payhiram.increment.ltd',
  APP_HOST: 'com.payhiram',
  DrawerMenu: [
    {
      title: 'Requests',
      route: 'Requests',
      icon: faMoneyBillWaveAlt
    },
    {
      title: 'Dashboard',
      route: 'Dashboard',
      icon: faTachometerAlt
    },
    // {
    //   title: 'Circle',
    //   route: 'Circle',
    //   icon: faUsers
    // },
    // {
    //   title: 'Messages',
    //   route: 'Messenger',
    //   icon: faComment
    // }, 
    {
      title: 'Settings',
      route: 'Settings',
      icon: faCog
    },
    {
      title: 'Ask for help',
      route: 'Support',
      icon: faHeadset
    }
  ],
  currencyBal: [{
    currency: 'PHP',
    value: 'PHP'
  },
  {
    currency: 'USD',
    value: 'USD'
  }],
  currency: [{
    title: 'Philippine Peso',
    value: 'PHP'
  }],
  shipping: [{
    title: 'Pick-Up',
    value: 0
  }, {
    title: 'Delivery',
    value: 1
  }],
  request: {
    MINIMUM: 1000,
  },
  MAXIMUM_DEPOSIT: 500000,
  MAXIMUM_WITHDRAWAL: 500000,
  MINIMUM: 1000,
  payhiramShare: 0.2,
  partnerShare: 0.8,
  fulfillmentTypes: [
    {
      id: 1,
      type: 'Pera Padala',
      description: 'Send cash and allow our partners to process or deliver the cash to your receiver.',
      money_type: 'cash',
    },
    {
      id: 2,
      type: 'Withdrawal',
      description: 'Withdraw cash from your wallet and let our partners nearby process or deliver the cash to your specified location.',
      money_type: 'cash',
    },
    {
      id: 3,
      type: 'Cash In',
      description: 'Cash In to your wallet and let our nearby partners process or pickup the cash from your specified location.',
      money_type: 'e-wallet',
    },
    {
      id: 4,
      type: 'Bills and Payments',
      description: "Don't have time and want to pay your bills either online or onsite? Our partners will handle your payments",
      money_type: 'cash',
    }
    // {
    //   id: 5,
    //   type: 'Accept Payment',
    //   description: "Accept Payment with 0% charge",
    //   money_type: 'cash',
    // },
  ],
  partner: [
    {
      value: 'BASIC',
      description: `PHP 10, 000 Limit / Day`,
      icon: faUser,
      amount: 10000,
      currency: 'PHP',
      items: [{
        title: 'Service to one location only'
      }, {
        title: 'Process Send Cash'
      }, {
        title: 'Process Cash Ins'
      }, {
        title: 'Process Withdrawals'
      }]
    },
    {
      value: 'STANDARD',
      description: 'PHP 50, 000 Limit / Day',
      icon: faCertificate,
      amount: 50000,
      currency: 'PHP',
      items: [{
        title: 'Service to one location only'
      }, {
        title: 'Process Send Cash'
      }, {
        title: 'Process Cash Ins'
      }, {
        title: 'Process Withdrawals'
      }]
    },
    {
      value: 'BUSINESS',
      description: 'PHP 100, 000 Limit / Day',
      icon: faBuilding,
      amount: 100000,
      currency: 'PHP',
      items: [{
        title: 'Service to one location only'
      }, {
        title: 'Process Send Cash'
      }, {
        title: 'Process Cash Ins'
      }, {
        title: 'Process Withdrawals'
      }]
    },
    {
      value: 'ENTERPRISE',
      description: 'PHP 500, 000 Limit / Day',
      icon: faCity,
      amount: 500000,
      currency: 'PHP',
      items: [{
        title: 'Service to one location only'
      }, {
        title: 'Process Send Cash'
      }, {
        title: 'Process Cash Ins'
      }, {
        title: 'Process Withdrawals'
      }]
    }
  ],
  getPartner(plan, partners){
    return partners.map((item) => {
      if(item.value.toLowerCase() == plan.toLowerCase()){
        return item
      }
    })
  },
  fulfillmentBorrowTypes: [
    {
      value: 101,
      label: 'Loan via Product Fulfilment',
      description:
        'Allow other peer to fulfill your transaction when you want to purchase our products from our partners.',
      money_type: 'Wallet',
    },
    {
      value: 102,
      label: 'Direct Loan(Wallet)',
      description: 'Allow other peer to fulfill your needed money via wallet.',
      money_type: 'Cash',
    },
    {
      value: 103,
      label: 'Direct Loan(Cash)',
      description: 'Allow other peer to fulfill your needed money via cash.',
      money_type: 'Cash',
    },
  ],
  pusher: {
    broadcast_type: 'pusher',
    channel: 'payhiram',
    notifications: 'App\\Events\\Notifications',
    messages: 'App\\Events\\Message',
    messageGroup: 'App\\Events\\MessageGroup',
    systemNotification: 'App\\Events\\SystemNotification',
    typing: 'typing',
  },
  tutorials: [
    {
      key: 1,
      title: 'Welcome to PayHiram!',
      text:
        'Sending cash in a new and convenient way! In Payhiram, we have partners to fulfill your cash needed in any locations you want. Start sending today!',
      icon: null,
      image: require('assets/logo.png'),
      colors: [Color.primary, Color.lightGray],
    },
    {
      key: 2,
      title: 'First, create  or post a request',
      text:
        'To post a request, click the + button at the bottom of requests page.',
      icon: faEdit,
      image: null,
      colors: [Color.primary, Color.lightGray],
    },
    {
      key: 3,
      title: 'Second, use the messenger thread',
      text:
        'Once a different user will connect to your request, a messenger thread notification will pop-up. Click the thread notification to contact with your peer using the messenger. You can ask for the ID, Photo, and Signature (only on mobile app) for confirmation of completion to your request',
      icon: faComments,
      image: null,
      colors: [Color.primary, Color.lightGray],
    },
    {
      key: 4,
      title: 'Lastly, transfer of funds and review',
      text:
        'If your request has been completed, other peer will transfer the funds. You can rate your peer and review transaction.',
      icon: faPaperPlane,
      image: null,
      colors: [Color.primary, Color.lightGray],
    },
    {
      key: 5,
      title: 'Congratulations!',
      text: 'You are good to go! Enjoy your stay!',
      icon: faCheck,
      image: null,
      colors: [Color.primary, Color.lightGray],
    },
  ],
  MessengerMenu: [{
      title: 'Requirements',
      payload: 'same_page',
      payload_value: 'requirements',
      color: Color.black
    },
    {
      title: 'Details',
      payload: 'redirect',
      payload_value: 'requestItemStack',
      color: Color.black
    },
    {
      title: 'Transfer funds',
      payload: 'redirect',
      payload_value: 'transferFundStack',
      color: Color.black
    },
    {
      title: 'Rate',
      payload: 'redirect',
      payload_value: 'reviewsStack',
      color: Color.black
    },
    {
      title: 'Enable Support',
      payload: 'redirect',
      payload_value: 'enableSupport',
      color: Color.black
    },
    {
      title: 'Close',
      payload: 'same_page',
      payload_value: 'close',
      color: Color.danger
    }
  ],
  requirementsMenu: [
    {
      title: 'On App Signature',
      payload: 'same_page',
      payload_value: 'signature',
      color: Color.black
    },
    {
      title: 'Receiver Picture',
      payload: 'redirect',
      payload_value: 'receiver_picture',
      color: Color.black
    },
    {
      title: 'Valid ID',
      payload: 'redirect',
      payload_value: 'valid_id',
      color: Color.black
    },
    {
      title: 'Back',
      payload: 'redirect',
      payload_value: 'back',
      color: Color.danger
    }
  ],
  payments: [
    {
      title: 'UnionBank of the Philippines',
    },
    {
      title: 'Chinabank Corporation',
    },
  ],
  authorize: 'PIN',
  ecommerce: {
    inventoryType: 'inventory',
  },
  checkoutOptions: [
    {
      title: 'POST TO REQUEST',
      description: 'LET OUR PARTNERS PAY FOR YOU, THEN PAY THEM LATER',
      route: 'createRequestStack',
    },
    {
      title: 'PROCEED WITH INSTALLMENT',
      description: 'AGREE THE TERMS OF THE SELLER',
      route: 'Checkout',
    },
    {
      title: 'PROCEED TO CHECKOUT',
      description: 'PURCHASE ITEM(S) DIRECTLY',
      route: 'Checkout',
    },
  ],
  paymentMethods: [
    {
      title: 'COD',
      description: 'Cash on develivery',
    },
    {
      title: 'MY WALLET',
      description: 'Payhiram Wallet',
    },
  ],
  requirementsOptions: [
    {
      title: '1 Valid ID',
      payload: 'id_1',
    },
    {
      title: "2 Valid ID's",
      payload: 'id_2',
    },
    {
      title: 'Credit Card',
      payload: 'credit_card',
    },
  ],
  filter: {
    targets: [{
      value: 'All'
    }, {
      value: 'Partner'
    }, {
      value: 'Public'
    }, {
      value: 'Circle'
    }],
    ships: [{
      value: 'All'
    }, {
      value: 'Pickup'
    }, {
      value: 'Delivery'
    }],
    types: [{
      value: 'All'
    }, {
      value: 'Send Cash'
    }, {
      value: 'Cash In'
    }, {
      value: 'Withdrawals'
    }, {
      value: 'Bills Payments'
    }]
  },
  showRequestType(type) {
    switch (parseInt(type)) {
      case 1:
        return 'Send Cash';
      case 2:
        return 'Withdrawal';
      case 3:
        return 'Cash In';
      case 4:
        return 'Bills and Payments';
      case 5:
        return 'Others';
      case 101:
        return 'Lending';
      case 102:
        return 'Installment';
    }
  },
  getRequestTypeCode(type) {
    switch (type) {
      case 'Send Cash':
        return 1;
      case 'Withdrawals':
        return 2;
      case 'Cash In':
        return 3;
      case 'Bills and Payments':
        return 4;
      case 'Others':
        return 5;
      case 'Lending':
        return 101;
      case 'Installment':
        return 102;
    }
  },
  showStatus(type) {
    switch (parseInt(type)) {
      case 0:
        return 'Pending';
      case 1: 
        return 'On Going';
      case 2:
        return 'Completed';
      default:
        return 'Cancelled';
    }
  },
  validateEmail(email) {
    let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9]*$/;
    if (reg.test(email) === false) {
      return false;
    } else {
      return true;
    }
  },
  checkStatus(user){
    if(user == null){
      return false
    }
    switch(user.status.toLowerCase()){
      case 'not_verified': return 0;break
      case 'verified': return 1;break
      case 'account_verified': return 2; break;
      case 'basic_verified': return 3; break;
      case 'standard_verified': return 4; break;
      case 'business_verified': return 5; break;
      case 'enterprise_verified': return 6; break;
      default: return 7;break
    }
  },
  accountStatus(user){
    if(user == null){
      return false
    }
    switch(user.status.toLowerCase()){
      case 'not_verified': return 'Not Verified';break
      case 'verified': return 'Email Verified';break
      case 'account_verified': return 'Account Verified'; break;
      case 'basic_verified': return 'Basic Verified'; break;
      case 'standard_verified': return 'Standard Verified'; break;
      case 'business_verified': return 'Business Verified'; break;
      case 'enterprise_verified': return 'Enterprise Verified'; break;
      default: return 'Granted';break
    }
  },
  notVerified: 0,
  emailVerified: 1,
  accountVerified: 2,
  basicVerified: 3,
  standardVerified: 4,
  businessVerified: 5,
  enterpriseVerified: 6
};
