import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import ScaledImage from 'mainam-react-native-scaleimage'
const ButtonSelectPaymentMethod = ({
    onPress,
    icon,
    title,
    isSelected
}) => {
    return (
        <TouchableOpacity style={styles.ckeck} onPress={onPress}>
            <ScaledImage source={icon} height={50} />
            <View style={styles.ckeckthanhtoan}>
                <Text style={{
                    opacity: 0.8,
                    fontSize: 16, fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    color: "#000000",
                }}>{title}</Text>
                <Text style={{
                    color: '#00000060',
                    paddingTop: 5
                }}>Mô tả phương thức thanh toán</Text>
            </View>
            <View style={styles.containerBtnSelect}>
                {isSelected &&
                    <View style={styles.isSelected}></View>
                }
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    isSelected: {
        backgroundColor: 'rgb(2,195,154)',
        width: 10,
        height: 10,
        borderRadius: 5
    },
    containerBtnSelect: {
        width: 20,
        height: 20,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgb(2,195,154)'
    },

    ckeck: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 20,
        paddingHorizontal: 10
    },
    ckeckthanhtoan: {

        flex: 1,
        marginLeft: 10
    },
})

export default React.memo(ButtonSelectPaymentMethod)
