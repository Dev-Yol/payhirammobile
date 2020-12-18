import React, {Component} from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, TouchableHighlight, Image, Picker } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faUserCircle, faUpload } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import { Rating, DateTime} from 'components';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: 1,
      school: 1
    };
  }
  onChange(item, type){
    if(type == 'gender'){
      this.setState({gender: item});
    }else{
      this.setState({school: item});
    }
  }

  render() {
    const { data } = [{
      title: 'Male',
      value: 'male'
    },{
      title: 'Female',
      value: 'female'
    }];
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false}>           
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', flex: 1, borderWidth: 1, borderColor: Color.gray, borderRadius: 5, padding: 10, margin: 10, alignItems: 'center'}}>
            <View style={{flexGrow: 1}}>
              <Text>August 9, 2020 5:00 PM</Text>
              <Text style={{fontSize: 20}}>This is a test</Text>
              <Text>via ****561</Text>
            </View>
            <View>
              <Text style={{color: Color.secondary, fontSize: 25, fontWeight: 'bold'}}>+ PHP 200.00</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}


export default Transactions;
