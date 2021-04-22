import React, {Component} from 'react';
import Style from './Style.js';
import {
  View,
  Image,
  TouchableHighlight,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {Routes, Color, Helper, BasicStyles} from 'common';
import {connect} from 'react-redux';
import {Dimensions} from 'react-native';
import Footer from 'modules/generic/Footer'
import { Pager, PagerProvider } from '@crowdlinker/react-native-pager';
import Summary from './Summary';
import History from 'modules/transactions';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

const transactionData = []

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRatings: true,
      page: 'summary',
      activeIndex: 0,
      isLoading: false
    };
  }

  render() {
    const { showRatings, isLoading, history, activeIndex } = this.state;
    const { ledger, theme } = this.props.state;
    return (
      <View style={{
        flex: 1
      }}>
        <PagerProvider activeIndex={activeIndex}>
          <Pager panProps={{enabled: false}}>
            <View style={{
              flex: 1,
              minHeight: height,
              width: '100%'
            }}>
              {
                activeIndex == 0 && (
                  <Summary onChange={(value) => this.setState({
                    page: value,
                    activeIndex: value == 'summary' ? 0 : 1
                  })}
                  navigation={this.props.navigation}
                  />
                )
              }
            </View>
            <View style={{
              flex: 1,
              minHeight: height,
              width: '100%'
            }}>
              {
                activeIndex == 1 && (<History />)
              }
            </View>
          </Pager>
        </PagerProvider>     
        <Footer
          {...this.props}
          selected={this.state.page} onSelect={(value) => {
            this.setState({
              page: value,
              activeIndex: value == 'summary' ? 0 : 1
            })
          }}
          from={'dashboard'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
});
const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setLedger: (ledger) => dispatch(actions.setLedger(ledger)),
    setQRCodeModal: (isVisible) => dispatch(actions.setLedger(isVisible))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
