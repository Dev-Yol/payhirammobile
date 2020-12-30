import React, { Component } from 'react';
import { Text, View, TouchableHighlight, ScrollView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { Picker } from '@react-native-community/picker';
import { connect } from 'react-redux';
import BalanceCard from 'modules/generic/BalanceCard';
import styles from '../createRequest/Styles';
import { BasicStyles, Color } from 'common'

class BottomSheetContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 'Philippine Peso - PHP',
            processingFee: null
        };
    }

    redirect = (route) => {
        this.props.navigation.navigate(route);
    };

    render() {
        return (
            <View style={[styles.CreateRequestContainer, {
                paddingHorizontal: 0, width: '100%',
                height: '100%',
            }]}>
                <BalanceCard
                  data={{
                    amount: 500,
                    currency: 'PHP',
                    current_amount: 2500
                  }}
                />
                <ScrollView>
                    <View
                        style={[
                            styles.SelectFullfilmentContainer,
                            { paddingLeft: '1%', paddingRight: '60%', paddingTop: '5%' },
                        ]}>
                        <Text style={styles.SelectFullfilmentTextStyle}>
                            Select Currency
                        </Text>
                        <FontAwesomeIcon
                            icon={faAsterisk}
                            size={7}
                            style={{ paddingLeft: 15, color: '#FF2020' }}
                        />
                    </View>
                    <View style={[styles.TextInputContainer, {
                        marginLeft: '2.5%',
                        width: '95%',

                    }]}>
                        <Picker
                            selectedValue={this.state.language}
                            style={{
                                height: 60,
                                width: '100%',
                                borderRadius: 5,
                                borderColor: '#EOEOEO',
                                borderWidth: 1,
                            }}
                            onValueChange={(itemValue) =>
                                this.setState({ currency: itemValue })
                            }>
                            <Picker.Item
                                label="Philippine Peso - PHP"
                                value="Philippine Peso - PHP"
                            />
                            <Picker.Item label="US Dollar - USD" value="US Dollar - USD" />
                        </Picker>
                    </View>
                    <View
                        style={[
                            styles.SelectFullfilmentContainer,
                            {
                                paddingLeft: '1%', paddingRight: '60%', paddingTop: '5%', marginLeft: '2.5%',
                                width: '95%',
                            },
                        ]}>
                        <Text
                            style={styles.SelectFullfilmentTextStyle}>
                            Processing fee
                        </Text>
                        <FontAwesomeIcon
                            icon={faAsterisk}
                            size={7}
                            style={{ paddingLeft: 15, color: '#FF2020' }}
                        />
                    </View>
                    <View style={[styles.TextInputContainer, { marginLeft: "2.5%", width: '95%', }]}>
                        <TextInput
                            keyboardType='number-pad'
                            value={this.state.processingFee || ''}
                            onChangeText={(val) => {
                                if (/^\d+$/.test(val.toString()) || val == '') {
                                    this.setState({
                                        processingFee: val
                                    })
                                }
                            }}
                            style={{
                                height: 60,
                            }} />
                    </View>
                    <View style={{ marginTop: 20, paddingLeft: '2.5%' }}>
                        <Text style={[styles.SelectFullfilmentTextStyle, {
                            fontWeight: 'bold'
                        }]}>
                            Income Breakdown
                        </Text>
                        {/* Income breakdown */}
                        {[
                            { title: 'Payhiram', rate: 0.2 },
                            { title: 'Your net income', rate: 0.8 }
                        ].map((txt, id) => {
                            return (
                                <View key={id} style={{ flex: 2, flexDirection: "row", flexWrap: 'wrap' }}>
                                    <View style={{ flex: 1, marginHorizontal: 5, marginVertical: 5, }}>
                                        <Text style={[styles.SelectFullfilmentTextStyle, {
                                        }]}>
                                            {txt.title}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 5, marginVertical: 5, }}>
                                        <Text style={[styles.SelectFullfilmentTextStyle, {
                                            textAlign: 'right',
                                            fontWeight: 'bold',
                                            marginRight: 25
                                        }]}>
                                            {this.state.processingFee ? `PHP ${(this.state.processingFee * txt.rate)}` : `${(txt.rate * 100)}%`}
                                        </Text>
                                    </View>
                                </View>
                            )

                        })}


                    </View>
                </ScrollView>
                <View
                    style={styles.BottomContainer}>
                    <View style={{ marginVertical: 10 }} />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 5,
                        paddingTop: 5
                    }}>
                        <TouchableHighlight
                            onPress={() => this.props.closeModal()}
                            style={[BasicStyles.btn, BasicStyles.btnDanger, { width: '45%' }]}
                            underlayColor={Color.gray}>
                            <Text style={BasicStyles.textWhite}>
                                Cancel
                        </Text>
                        </TouchableHighlight>
                        <View style={{ width: "2%" }}></View>
                        <TouchableHighlight
                            onPress={() => alert("test")}
                            style={[BasicStyles.btn, BasicStyles.btnSecondary, { width: '45%' }]}
                            underlayColor={Color.gray}>
                            <Text style={BasicStyles.textWhite}>
                                Continue
                        </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View >
        );
    }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
    const { actions } = require('@redux');
    return {
        // updateUser: (user) => dispatch(actions.updateUser(user)),
        setLocation: (location) => dispatch(actions.setLocation(location)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomSheetContent);
