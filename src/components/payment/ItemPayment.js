import CustomMenu from '@components/CustomMenu'
import ScaledImage from 'mainam-react-native-scaleimage'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
const ItemPayment = ({ item, onPress, isSelected, onDelete }) => {
    return (
        <View style={styles.containerItem}>
            <TouchableOpacity
                disabled={!onPress}
                onPress={onPress}
                style={styles.buttonItem}>
                <LinearGradient
                    start={{ x: 0.0, y: 0.25 }}
                    end={{ x: 0.5, y: 1.0 }}
                    locations={[0, 0.5, 0.6]}
                    colors={['#F05F57', '#eb1f14', '#d31c12']}
                    // colors={['#9090ee', '#6565e7', '#5151E5']}
                    style={styles.linearGradient}
                >
                    <View>
                        <Text style={styles.txtName}>{item.cardHolderName}</Text>
                        <Text style={styles.txtCardNumber}>{item.cardNumber}</Text>
                        <Text style={styles.txtBankName}>{item.bankCode}</Text>
                    </View>
                    <Image source={require("@images/new/ic_logo.png")} style={styles.iconLogo} />
                </LinearGradient>
            </TouchableOpacity>
            {onPress ?
                (isSelected ? <ScaledImage source={require("@images/new/booking/ic_checked.png")} width={17} /> :
                    <ScaledImage source={require("@images/new/booking/ic_uncheck.png")} width={17} />)
                :
                <CustomMenu
                    MenuSelectOption={
                        <View style={styles.buttonMenu}>
                            <ScaledImage
                                source={require('@images/new/ic_more.png')}
                                height={12}
                                style={{ resizeMode: 'contain' }}
                            />
                        </View>
                    }
                    options={[{ value: 'Xoá', id: 1 }]}
                    onSelected={onDelete}
                />
            }

        </View>
    )
}

export default ItemPayment
const styles = StyleSheet.create({
    buttonMenu: {
        padding: 5
    },
    buttonItem: {
        flex: 1,
        marginRight: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        elevation: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 10
    },
    iconLogo: {
        width: '40%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'stretch',
        bottom: 0,
    },
    txtBankName: {
        color: "#FFF",
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'right'
    },
    txtCardNumber: {
        color: "#FFF",
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop: 6,
        paddingBottom: 20
    },
    txtName: {
        color: "#FFF",
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase'
    },
    containerItem: {

        paddingVertical: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 5
    },
    linearGradient: {
        borderRadius: 10,
        padding: 10,
        paddingVertical: 20,
        backgroundColor: 'transparent',
        flex: 1
    },
});