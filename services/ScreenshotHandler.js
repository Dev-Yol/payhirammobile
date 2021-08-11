import ReactNativeDisableScreenshot from "react-native-disable-screenshot";
export default {
  disableScreenshot() {
    ReactNativeDisableScreenshot.start();
  },

  enableScreenshot() {
    ReactNativeDisableScreenshot.stop();
  }
}