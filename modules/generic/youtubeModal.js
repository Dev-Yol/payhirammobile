import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';
import { View, Modal, Text, ActivityIndicator, StyleSheet, AppState, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';


class AuthorizedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {        
      this.setState({appState: nextAppState});
  }

  IndicatorLoadingView() {
    return (
      <ActivityIndicator
        color="#3235fd"
        size="large"
        style={styles.IndicatorStyle}
      />
    );
  }

  render() {
    const { user, theme } = this.props.state;
    return (
      <View style={{
        width: '100%'
      }}>
        <Modal
          visible={this.props.showModal}
          animationType={'slide'}
          transparent={true}>
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: '100%'
          }}>
            <View style={{
              height: '60%',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 20,
              paddingBottom: 20,
              borderRadius: 12,
              width: '80%',
              marginRight: '10%',
              marginLeft: '10%',
              backgroundColor: 'white'
            }}>

              <TouchableOpacity
                onPress={() => {
                  this.props.showModal = false
                  console.log('[asdfasdf]')
                }}>
                <FontAwesomeIcon
                icon={faTimes}
                style={{
                  color: 'red',
                  marginLeft: '93%',
                  marginBottom: '-5%'
                }}
                size={16}
              />
              </TouchableOpacity>


              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                paddingTop: 10,
                paddingBottom: 10,
                textAlign: 'center',
              }}>
                WHAT IS PAYHIRAM?
              </Text>


              {this.state.appState == 'active' &&
                <WebView 
                source={{ uri: 'https://www.youtube.com/embed/dS7DRqxRdyo?rel=0&autoplay=0&showinfo=0&controls=0' }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                mediaPlaybackRequiresUserAction={true}
                renderLoading={this.IndicatorLoadingView}
                scalesPageToFit={true}
                startInLoadingState={true} />
              }
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state })
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout())
  };
};

const styles = StyleSheet.create({
  IndicatorStyle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizedModal);
