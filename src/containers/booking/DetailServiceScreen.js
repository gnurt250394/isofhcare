import React, { useState } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import ActivityPanel from '@components/ActivityPanel'
import ScaleImage from 'mainam-react-native-scaleimage';
const { width, height } = Dimensions.get('window')
const DetailServiceScreen = (props) => {
    const item = props.navigation.getParam('item', {})
    console.log('item: ', item);
    // const [detail,] = useState(item)
    const onSelected = () => {
        let onSelected = props.navigation.getParam('onSelected')
        props.navigation.pop()
        if (onSelected) {
            onSelected(item)
        }
    }
    const url = item.image ? { uri: item.image } : require('@images/new/ic_default_service.png')
    return (
        <ActivityPanel title="Chi tiết dịch vụ khám">
            <View style={{ paddingLeft: 25, }}>
                <Text style={styles.txtService}>{item.name}</Text>
                <Text style={styles.txtPrice}>Chi phí: {item.monetaryAmount.value.formatPrice()} VNĐ/ lượt</Text>
                <ScaleImage source={url} width={width - 50} />
            </View>
            <ScrollView>
                <View style={styles.containerDetail}>
                    <Text style={styles.txtlabel}>Mô tả chi tiết</Text>
                    <Text>{item.description}</Text>

                </View>
            </ScrollView>
            <View style={styles.containerButtonSelect}>
                <Text style={styles.txtTitleSelect}>Bạn muốn chọn dịch vụ khám này?</Text>
                <TouchableOpacity
                    onPress={onSelected}
                    style={styles.buttonSelect}>
                    <Text style={styles.txtSelect}>CHỌN</Text>
                </TouchableOpacity>
            </View>
        </ActivityPanel>
    )
}

export default DetailServiceScreen

const styles = StyleSheet.create({
    txtlabel: {
        color: '#000',
        paddingTop: 20,
        fontWeight: 'bold'
    },
    containerDetail: {
        paddingHorizontal: 25,
    },
    txtPrice: {
        color: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 15,
    },
    txtService: {
        color: '#3161AD',
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 6,
        paddingTop: 25,
    },
    txtSelect: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    },
    buttonSelect: {
        backgroundColor: '#00CBA7',
        height: 42,
        alignSelf: 'center',
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        marginBottom: 10
    },
    txtTitleSelect: {
        color: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: 12,
        paddingLeft: 21,
        fontStyle: 'italic'
    },
    containerButtonSelect: {
        backgroundColor: '#FFF',
        borderTopColor: 'rgba(0, 0, 0, 0.05)',
        borderTopWidth: 1,
        paddingVertical: 10
    },
})