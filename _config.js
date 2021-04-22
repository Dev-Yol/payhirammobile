let LIVE_BACKEND_URL = 'https://api.payhiram.ph/public/increment/v1'
let DEV_BACKEND_URL = 'http://192.168.254.102/project123/api/public/increment/v1'
let isDev = true
let BACKEND_URL = isDev ? DEV_BACKEND_URL : LIVE_BACKEND_URL
export default{
  IS_DEV: BACKEND_URL,
  BACKEND_URL: BACKEND_URL,
  TEST: false,
  GOOGLE: {
    API_KEY: 'YOUR_API_KEY'
  },
  PUSHER: {
    appId: 'your_pusher_id',
    key: 'your_pusher_key',
    secret: 'your_pusher_secret',
    cluster: 'ap1',
    encrypted: true
  }
}