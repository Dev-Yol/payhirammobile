import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft, faBars} from '@fortawesome/free-solid-svg-icons';
import VerificationID from 'modules/verificationID';
import {NavigationActions} from 'react-navigation';
import {BasicStyles, Color} from 'common';
import {connect} from 'react-redux';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const { setType } = this.props
    if(this.props.navigationProps.state.params != undefined){
      //store
      console.log('ty', this.props.navigationProps.state.params)
      setType(this.props.navigationProps.state.params.type)
    }
  }

  back = () => {
    this.props.navigationProps.pop()
  };

  render() {
    const { theme } = this.props.state;
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{color: theme ? theme.primary : Color.primary }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    setType: (typePlan) => dispatch(actions.setType(typePlan)),
  };
};
let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const VerificationStack = createStackNavigator({
  guidelinesScreen: {
    screen: VerificationID,
    navigationOptions: ({navigation}) => ({
      title: 'Requirements',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerificationStack);
