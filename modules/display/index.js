import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import ThemeSettingTile from 'modules/display/ThemeSettingTile.js';
import { H1 } from 'native-base';
const height = Math.round(Dimensions.get('window').height);

const dummyThemeData = [
  {
    title: 'Increment Mode',
    details: 'Add description here',
    colors: ['#3F0050', '#22B173', '#F2C94C', '#000000'],
  },
  {
    title: 'Beach Model',
    details: 'Add description here',
    // colors: ['#0B62BB', '#529AEC', '#03D5BD', '#000000'],
    colors: ['#0067B3', '#40B0DF', '#FFD53D', '#000000'],
  },
  {
    title: 'Flirty Mode',
    details: 'Add description here',
    colors: ['#2f1387', '#FF5765', '#03D5BD', '#000000'],
  },
  {
    title: 'Concealed Mode',
    details: 'Add description here',
    colors: ['#067d68', '#0fbd83', '#3bfeb8', '#000000'],
  }
];
class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTile: 0,
    };
  }

  selectHandler = (index) => {
    let _theme = dummyThemeData[index].colors
    const {setTheme} = this.props;
    setTheme({
      primary: _theme[0],
      secondary: _theme[1],
      tertiary: _theme[2],
      fourth: _theme[3]
    });
    console.log(_theme)
    this.setState({selectedTile: index});
  };

  displayThemeTiles = () => {
    return dummyThemeData.map((data, index) => {
      return (
        <ThemeSettingTile
          id={index}
          key={index}
          selectedTile={index === this.state.selectedTile ? true : false}
          onSelect={this.selectHandler}
          themeTitle={data.title}
          colors={data.details}
          circles={data.colors}
        />
      );
    });
  };
  render() {
    return (
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View
          style={{
            height: height + 25,
            flex: 1
          }}

          >
            {this.displayThemeTiles()}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setTheme: (theme) => dispatch(actions.setTheme(theme))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Display)