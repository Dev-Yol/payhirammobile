import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { BasicStyles } from 'common'

class UserGuidelines extends Component {

  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={styles.TermsAndConditionsContainer}>

          <View style={[styles.SectionContainer, { marginTop: 10 }]}>
            <View style={styles.SectionTitleContainer}>
              <Text style={styles.SectionTwoTitleTextStyle}>Trainings and Guide</Text>
            </View>
            <View style={styles.SectionDescriptionContainer}>
              <Text style={styles.SectionDescriptionTextStyle}>
              Users will be provided training through video recording set-up with the step-by-step procedures in fulfilling the services offered by Payhiram. {"\n\n"}
A.  Register to Payhiram. The Users who wish to register to Payhiram shall be required to enter personal information e.g., Username, Email Address and must create a unique password in order to continue the registration.{'\n\n'}
B.  Login to Payhiram. Once you’ve logged in to your account, you need to undergo our verification process by submitting your valid IDs. Once submitted, Payhiram Team will conduct a short interview via zoom.{'\n\n'}
C.  Request Transfer. Once you have successfully registered your account, logged in to Payhiram, you may now send a request for money transfer.{'\n\n'}
D.  Express Transfer. This transaction can be done using two options (to be decided by the Users) through (i) Delivery, in which a Partner will be delivering the cash to the location requested. (ii) Pick-up, in which the User will be claiming the money requested to where the Partner is.{'\n\n'}
E.  Domestic Transfer. This transaction can be done using two options (to be decided by the User) through (i) Delivery, in which a Partner will be delivering the cash to the location requested. (ii) Pick-up, in which the User will be claiming the money requested to where the Partner is.{'\n\n'}
F.  Cash Deposit. This transaction can be done by (i) depositing to the Company’s Bank Account that is provided by Payhiram. (ii) create a request to our Partner Outlet in order for you to cash in. {'\n\n'}
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  TermsAndConditionsContainer: {
    width: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '5%',
    marginRight: '5%'
  },
  SectionContainer: {
    width: '100%',
  },
  SectionTitleContainer: {},
  SectionTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
    marginTop: 10
  },
  SectionTwoTitleTextStyle: {
    fontSize: BasicStyles.standardTitleFontSize,
    fontWeight: 'bold',
  },
  SectionDescriptionContainer: {},
  SectionDescriptionTextStyle: {
    textAlign: 'justify',
    fontSize: BasicStyles.standardFontSize
  },
});

export default UserGuidelines;
