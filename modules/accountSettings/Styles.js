import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  AccountSettingsContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '7%',
    marginTop: 10,
  },
  UsernameContainer: {},
  EmailAddressContainer: {},
  UpdateEmailButtonContainer: {},
  PasswordContainer: {},
  ConfirmPasswordContainer: {},
  ChangePasswordButtonContainer: {},
  AccountSettingsInputContainer: {
    marginTop: '1%',
    width: '100%',
  },
  InputTitleContainer: {},
  InputTitleTextStyle: {
    fontSize: 15,
  },
  TextInputContainer: {
    height: 60,
    marginTop: '2%',
    justifyContent: 'center',
    // alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
  },
  AccountSettingsButtonContainer: {
    height: 60,
    marginTop: '7%',
    marginBottom: '7%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderRadius: 12,
    width: '100%',
  },
  AccountSettingsButtonTextStyle: {},
});

export default styles;
