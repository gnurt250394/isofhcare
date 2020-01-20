import React, { useState } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import ActivityPanel from '@components/ActivityPanel'
import ScaleImage from 'mainam-react-native-scaleimage';
const { width, height } = Dimensions.get('window')
const DetailServiceScreen = (props) => {
    const item = props.navigation.getParam('item')
    // const [detail,] = useState(item)
    const onSelected = () => {
        let onSelected = props.navigation.getParam('onSelected')
        props.navigation.pop()
        if (onSelected) {
            onSelected(item)
        }
    }
    return (
        <ActivityPanel title="Chi tiết dịch vụ khám">
            <View style={{ paddingLeft: 25, }}>
                <Text style={styles.txtService}>{item.name}</Text>
                <Text style={styles.txtPrice}>Chi phí: {item.monetaryAmount.value.formatPrice()} VNĐ/ lượt</Text>
                <ScaleImage source={require('@images/new/ic_default_service.png')} width={width - 50} />
            </View>
            <ScrollView>
                <View style={styles.containerDetail}>
                    <Text style={styles.txtlabel}>Mô tả chi tiết</Text>
                    <Text>Thạc sĩ.
                         Bác sĩ Huỳnh Khiêm Huy đã có hơn 11 kinh nghiệm làm
                         việc trong lĩnh vực gây mê hồi sức tim mạch;
                          khám, điều trị
                          hồi sức sau mổ các bệnh lý tim mạch người lớn và trẻ em.
                           Bác sĩ Huy nguyên phó trưởng khoa Hồi Sức Ngoại bệnh viện
                           Tim Tâm Đức trước khi là bác sĩ hồi sức tim khoa ngoại tim mạch,
                            Trung tâm tim mạch - Bệnh Viện Đa khoa Quốc tế Vinmec.</Text>

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