import React, { useEffect, useState, memo } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { Card } from 'native-base'
import ScaledImage from 'mainam-react-native-scaleimage'
import { useSelector } from 'react-redux'
import dateUtils from "mainam-react-native-date-utils";
import stringUtils from 'mainam-react-native-string-utils';

const AdministrationIsPatient = ({ resultDetail, patientName, result }) => {
    const [state, setstate] = useState({
        isShow: true
    })
    const [isContract, setIsContract] = useState(false)
    const [serviceCheckup, setServiceCheckup] = useState()
    const userApp = useSelector(state => state.userApp)
    useEffect(() => {
        let resultContractCheckup = result?.ResultContractCheckup
        var arrayContractCheckup = Object.entries(resultContractCheckup ? resultContractCheckup : {})
        if (arrayContractCheckup && arrayContractCheckup?.length) {
            setIsContract(true)
            setServiceCheckup((resultDetail?.ListService || []).find(item => item.ServiceType == "CheckUp"))
        } else {
            setServiceCheckup((resultDetail?.ListService || []).filter(item => item.ServiceType == "CheckUp"))
        }
    }, [])
    const setState = (data = {
        isShow: false
    }) => {
        setstate(state => {
            return {
                ...state, ...data
            }
        })
    }
    const onSetShow = () => {
        setState({ isShow: !state.isShow })
    }
    const getSumPrice = () => {
        let price = 0

        if (resultDetail?.items?.length) {
            price = resultDetail?.items.reduce((pre, cur) => {


                return pre + cur.unitPrice
            }, 0)
        }
        return price.formatPrice()
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <TouchableOpacity
                    onPress={onSetShow}
                    style={[styles.buttonShowInfo, state.isShow ? { backgroundColor: '#075BB5' } : {}]}>
                    <ScaledImage source={require('@images/new/ehealth/ic_info_patient.png')} height={19} style={!state.isShow && {
                        tintColor: "#075BB5"
                    }} />
                    <Text style={[styles.txtTitle, state.isShow ? { color: '#FFF' } : {}]}>THÔNG TIN HÀNH CHÍNH</Text>
                    <ScaledImage source={require('@images/new/ehealth/ic_down2.png')} height={10} style={state.isShow ? {
                        tintColor: "#FFF",
                    } : {
                            transform: [{ rotate: '-90deg' }],
                            tintColor: '#075BB5'
                        }} />
                </TouchableOpacity>
                {state.isShow &&
                    <View style={styles.groupInfo}>
                        {resultDetail?.address && <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.fontBold]}>{'Địa chỉ'}</Text>
                            <Text style={[styles.txtPriceService, styles.txRight]}>{resultDetail?.address}</Text>
                        </View> || null}
                        {resultDetail?.information?.insurance?.nINumber && <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.fontBold]}>{'Số thẻ BHYT'}</Text>
                            <Text style={styles.txtPriceService}>{resultDetail?.information?.insurance?.nINumber}</Text>
                        </View> || null}
                        {resultDetail?.information?.insurance?.percentage && <View style={styles.containerServices}>
                            <Text style={styles.servicesName}>{'Tỉ lệ hưởng'}</Text>
                            <Text style={styles.txtPriceService}>{resultDetail?.information?.insurance?.percentage}%</Text>
                        </View> || null}
                        {resultDetail?.information?.insurance?.dateOfIssue && <View style={styles.containerServices}>
                            <Text style={styles.servicesName}>{'Từ ngày'}</Text>
                            <Text style={styles.txtPriceService}>{resultDetail?.information?.insurance?.dateOfIssue?.toDateObject('-').format('dd/MM/yyyy')}</Text>
                        </View> || null}
                        {resultDetail?.information?.insurance?.expiryDate && <View style={styles.containerServices}>
                            <Text style={styles.servicesName}>{'Đến ngày'}</Text>
                            <Text style={styles.txtPriceService}>{resultDetail?.information?.insurance?.expiryDate?.toDateObject('-').format('dd/MM/yyyy')}</Text>
                        </View> || null}
                        <View style={styles.lineHeight}></View>
                        {resultDetail?.information?.department && <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.fontBold]}>{'Khoa'}</Text>
                            <Text style={styles.txtPriceService}>{resultDetail?.information?.department}</Text>
                        </View> || null}
                        {resultDetail?.information?.timeOfHospitalization && <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.fontBold]}>{'Ngày vào viện'}</Text>
                            <Text style={styles.txtPriceService}>{resultDetail?.information?.timeOfHospitalization?.toDateObject('-').format('dd/MM/yyyy')}</Text>
                        </View> || null}
                        {resultDetail?.information?.diagnostic && <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.fontBold]}>{'Chẩn đoán'}</Text>
                            <Text style={[styles.txtPriceService, styles.txRight]}>{resultDetail?.information?.diagnostic}</Text>
                        </View> || null}
                    </View>

                }
            </Card>
        </View>
    )
}

export default memo(AdministrationIsPatient)


const styles = StyleSheet.create({
    fontBold: { fontWeight: 'bold', },
    txtSumPrice: {
        color: '#ED1846',
        fontWeight: 'bold'
        // textDecorationLine: 'line-through'
    },
    txRight: { width: '60%', textAlign: 'right' },
    lineHeight: {
        height: 1,
        width: '100%',
        backgroundColor: '#00000010',
        marginTop: 20,
        marginBottom: 10
    },
    containerSumService: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 15,
        paddingLeft: 25
    },
    txtPriceService: {
        color: '#000000',
        fontSize: 14,
    },
    servicesName: {
        flex: 1,
        paddingHorizontal: 10
    },
    dots: {
        height: 10,
        width: 10,
        backgroundColor: '#ED1846',
        borderRadius: 5,
        marginTop: 5
    },
    containerServices: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        paddingTop: 7
    },
    txtServiceLabel: {
        paddingTop: 10,
        fontStyle: 'italic',
        color: '#00000090',
        paddingBottom: 5
    },
    txtLabel: {
        minWidth: '20%'
    },
    txtTime: {
        color: '#000',
        fontWeight: 'bold',
        flex: 1
    },
    containerTime: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 5
    },
    txtHospital: {
        color: '#ED1846',
        fontWeight: 'bold',
        fontSize: 16,
    },
    groupInfo: {
        paddingRight: 10,
        paddingVertical: 10
    },
    txtTitle: {
        flex: 1,
        paddingHorizontal: 10,
        color: '#075BB5',
        fontWeight: 'bold'
    },
    buttonShowInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    card: {
        borderRadius: 5
    },
    container: {
        paddingHorizontal: 10
    },
})