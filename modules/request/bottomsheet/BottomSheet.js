import React from 'react';
import { Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, View } from 'react-native';
import Modal from 'react-native-modal';
import Style from '../Style'
import Content from './BottomSheetContent';
const BottomSheet = ({ visible, closeModal, children }) => {
    return (
        <Modal onBackdropPress={closeModal}
            transparent={true}
            backdropTransitionInTiming={100}
            backdropTransitionOutTiming={100}
            isVisible={visible}
            style={Style.bottomSheet}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', flexDirection: 'column' }}
                style={{ padding: 0 }}>
                <View style={[Style.bottomSheetContent]}>
                    <Content  {...{closeModal}}/>
                </View>
            </ScrollView>

        </Modal>
    );
}

export default BottomSheet;
