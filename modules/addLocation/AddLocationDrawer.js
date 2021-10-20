import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import AddLocation from 'modules/addLocation';
import {connect} from 'react-redux';
import { BasicStyles, Color } from 'common';
class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop();
  };

  componentDidMount(){
    if(this.props.navigationProps?.state?.params?.from == 'request'){
      const { setFrom } = this.props
      setFrom(this.props.navigationProps.state.params.from)
    }
  }

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon icon={faChevronLeft} size={BasicStyles.iconSize} style={[BasicStyles.iconStyle, {
            color: Color.primary
          }]} />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
    setFrom: (location_from) => dispatch(actions.setFrom(location_from))
  };
};

let HeaderOptionsConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderOptions);

const AddLocationStack = createStackNavigator({
  addLocationScreen: {
    screen: AddLocation,
    navigationOptions: ({navigation}) => ({
      title: navigation.state?.params?.payload == 'plans' ? 'Select Service Location' : 'ADDRESS',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddLocationStack);
