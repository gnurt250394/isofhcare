import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import ModalComponent from '@components/modal';
import paymentProvider from '@data-access/payment-provider';
import ScaledImage from 'mainam-react-native-scaleimage';
import ItemPayment from '@components/payment/ItemPayment';
import { withNavigation } from 'react-navigation';
import snackbar from '@utils/snackbar-utils';
const { width, height } = Dimensions.get('window')
const ModalCardNumber = ({ isVisible, onBackdropPress, onSend, navigation }) => {
    const [data, setData] = useState([])
    const [cardNumber, setCardNumber] = useState(null)

    const getData = async () => {
        try {
            let res = await paymentProvider.getListCard()


            setData(res)
        } catch (error) {

        }
    }
    const onCreateSuccess = () => {
        getData()
    }
    const onCreateNewCard = async () => {
       onSend()
    }
    const onSuccess = () => {
        if (!cardNumber) {
            snackbar.show('Vui lòng chọn thẻ để thanh toán', 'danger')
            return
        }
        onSend(cardNumber?.id)
    }
    useEffect(() => {
        getData()
    }, [])
    const onSelectCard = (item) => () => {
        if (!cardNumber)
            setCardNumber(item)
        else
            setCardNumber(null)
    }
    const renderItem = ({ item, index }) => {
        return (
            <ItemPayment item={item} onPress={onSelectCard(item)} isSelected={cardNumber?.id == item?.id} />
        )
    }
    const keyExtractor = (item, index) => index.toString()
    return (
        <ModalComponent
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            backdropOpacity={0.5}
            animationInTiming={500}
            animationOutTiming={500}
            style={styles.containerModal}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={1000}>
            {/* <View style={styles.containerModal}> */}
            <View style={styles.dotsHeader} />
            <View style={styles.container}>
                <Text style={styles.txtLabel}>Chọn thẻ liên kết</Text>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
                <TouchableOpacity
                    onPress={onCreateNewCard}
                    style={styles.buttonAdd}>
                    <ScaledImage source={require("@images/new/covid/ic_add_green.png")} width={15} />
                    <Text style={styles.txtAdd}>Thẻ mới</Text>
                </TouchableOpacity>
                <View style={styles.groupButton}>
                    <TouchableOpacity
                        onPress={onSuccess}
                        style={[
                            styles.buttonOk,
                        ]}>
                        <Text style={styles.txtOk}>Thanh toán</Text>
                    </TouchableOpacity>

                </View>
            </View>
            {/* </View> */}
        </ModalComponent>
    );
};

export default withNavigation(ModalCardNumber);

const styles = StyleSheet.create({
    txtAdd: {
        paddingLeft: 10,
        color: "#00BA99",
        fontWeight: 'bold',
    },
    buttonAdd: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 15,
        paddingBottom: 5
    },
    dotsHeader: {
        backgroundColor: "#FFF",
        height: 10,
        width: 60,
        borderRadius: 5,
        marginBottom: 10,
    },

    containerModal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    txtCancel: {
        color: '#FC4A5F',
    },
    txtOk: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase'
    },
    buttonOk: {
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#00CBA7',
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 15,
    },
    txtLabel: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 20
    },
    container: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        padding: 20,
        width,

    },
});
