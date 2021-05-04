import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { BasicStyles, Color } from 'common'
import { connect } from 'react-redux';
const height = Math.round(Dimensions.get('window').height);

class Verification extends Component {

  render() {
    const { theme, typePlan } = this.props.state
    console.log('[typed]', typePlan);
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={[styles.TermsAndConditionsContainer]}>

          <View style={[styles.SectionContainer, { marginTop: 10, backgroundColor: theme ? theme.secondary : Color.secondary, color: Color.white, borderRadius: 20  }]}>
            <View style={styles.SectionTitleContainer}>
              <Text style={[styles.SectionTwoTitleTextStyle, { color: Color.white, padding: 10, textAlign: 'center' }]}>(2) Valid IDs any of the following: </Text>
            </View>
            <View style={styles.SectionDescriptionContainer}>
              <Text style={[styles.SectionDescriptionTextStyle, {color: Color.white, padding: 10}]}>
                1. Driver’s License {"\n\n"}
                2. Social Security System (SSS) UMID Card {"\n\n"}
                3. Voter’s ID {"\n\n"}
                4. Postal Id {"\n\n"}
                5. Passport {"\n\n"}
                6. Philhealth ID {"\n\n"}
                7. Alien Certification of Registration (ACR) / Immigrant Certificate of Registration {"\n\n"}
                8. Home Development Mutual Fund (HDMF) ID {"\n\n"}
                9. Professional Regulation Commission (PRC) ID {"\n\n"}
                10. Government Office and Government-Owned and Controlled Corporation (GOCC) ID (e.g., Armed forces of the Philippines (AFP) ID) {"\n\n"}
              </Text>
              {
                (typePlan == 'BUSINESS') && (
                  <View style={styles.SectionTitleContainer}>
                    <Text style={[styles.SectionTwoTitleTextStyle, { color: Color.white, paddingHorizontal: 10, textAlign: 'center' }]}>Submit (1) Additional requirement for choosing Business membership, any of the following: </Text>
                  </View>
                )
              }
              {
                (typePlan == 'ENTERPRISE') && (
                  <View style={styles.SectionTitleContainer}>
                    <Text style={[styles.SectionTwoTitleTextStyle, { color: Color.white, paddingHorizontal: 10, textAlign: 'center' }]}>Submit (2) Additional requirement for choosing Enterprise membership, any of the following: </Text>
                  </View>
                )
              }
              
              {
                (typePlan == 'BUSINESS' || typePlan == 'ENTERPRISE') &&
                (
                  <Text style={[styles.SectionDescriptionTextStyle, {color: Color.white, padding: 10}]}>
                    1. Certificate of Registration issued by DTI{"\n\n"}
                    2. Proof of Bank Account (e.g. Pass Book){"\n\n"}
                    3. Certificate of Registration issued by SEC{"\n\n"}
                    4. Certificate of Registration issued by BIR{"\n\n"}
                    5. Mayor’s Permit{"\n\n"}
                    6. Articles of Incorporation and By Laws{"\n\n"}
                  </Text>
                )
              }
              <Image source={require('assets/banner.png')} style={{
                height: 200,
                width: 300,
                marginLeft: '3%',
                marginBottom: '5%' 
              }}/>
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
    fontSize: BasicStyles.standardTitleFontSize + 2,
    fontWeight: 'bold',
  },
  SectionDescriptionContainer: {},
  SectionDescriptionTextStyle: {
    textAlign: 'justify',
    fontSize: BasicStyles.standardFontSize + 2
  },
});


const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Verification);
