import React, { useEffect, useState, memo } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native'
import { Card } from 'native-base'
import ScaledImage from 'mainam-react-native-scaleimage'
import { useSelector } from 'react-redux'
import WebView from 'react-native-webview'
import NavigationService from '@navigators/NavigationService'
import resultUtils from '../../containers/ehealth/utils/result-utils';
import dateUtils from "mainam-react-native-date-utils";
import stringUtils from 'mainam-react-native-string-utils';

const PriceIsPatient = ({ resultDetail, result, patientHistoryId, }) => {
    const [state, setstate] = useState({
        isShow: true
    })
    const [isLoading, setLoading] = useState(false)
    const [isContract, setIsContract] = useState(false)
    const [serviceCheckup, setServiceCheckup] = useState()
    const userApp = useSelector(state => state.userApp)

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
    })

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
        return formatter.format(price)
    }
    const onShowPrice = () => {
        // setLoading(true)
        // resultUtils.getPdfFromHis(patientHistoryId).then(res => {
        //     setLoading(false)
        //     Linking.openURL(res)
        //     NavigationService.navigate('detailPrice', { patientHistoryId })

        //     // Linking.openURL("http://10.0.0.94:2115/api/report/v1/files/reports/output/202011051141_BangKeChiPhiKhamChuaBenhNoiTruBHYTBVP_8896ef96-1d1b-4264-b345-fef9d55ba557.pdf")
        // }).catch(err => {
        //     setLoading(false)
        // })
        NavigationService.navigate('detailPrice', { patientHistoryId })
    }
    const renderTxRemind = (text) => {
        let txFormat = formatter.format(text)
        
        return txFormat.toString().replace('-', '')
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <TouchableOpacity
                    onPress={onSetShow}
                    style={[styles.buttonShowInfo, state.isShow ? { backgroundColor: '#075BB5' } : {}]}>
                    <ScaledImage source={require('@images/new/ehealth/ic_info.png')} height={19} style={state.isShow && {
                        tintColor: "#FFF"
                    }} />
                    <Text style={[styles.txtTitle, state.isShow ? { color: '#FFF' } : {}]}>CHI PHÍ KHÁM CHỮA BỆNH</Text>
                    <ScaledImage source={require('@images/new/ehealth/ic_down2.png')} height={10} style={state.isShow ? {
                        tintColor: "#FFF",
                    } : {
                            transform: [{ rotate: '-90deg' }],
                            tintColor: '#075BB5'
                        }} />
                </TouchableOpacity>
                {state.isShow ?
                    <View style={styles.groupInfo}>
                        <Text style={styles.txtHospital}>{userApp.hospital.name}</Text>
                        <View style={styles.containerServices}>

                            <Text style={[styles.servicesName, styles.fontBold]}>{'Tổng chi phí'}</Text>
                            <Text style={[styles.txtPriceService, styles.fontBold]}>{formatter.format(resultDetail?.expenses?.total)}</Text>
                        </View>
                        <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.colorGray]}>{'BHYT và miễn giảm:'}</Text>
                            <Text style={[styles.txtPriceService, styles.colorGray]}>{formatter.format(resultDetail?.expenses?.exemptions) || 0}</Text>
                        </View>
                        <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.colorGray]}>{'NB thanh toán:'}</Text>
                            <Text style={[styles.txtPriceService, styles.colorGray]}>{formatter.format(resultDetail?.expenses?.amount) || 0}</Text>
                        </View>
                        <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.colorGray]}>{'Đã trả:'}</Text>
                            <Text style={[styles.txtPriceService, styles.colorGray]}>{formatter.format(resultDetail?.expenses?.paid) || 0}</Text>
                        </View>
                        <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.colorGray]}>{'Chưa trả:'}</Text>
                            <Text style={[styles.txtPriceService, styles.colorGray]}>{formatter.format(resultDetail?.expenses?.unpaid) || 0}</Text>

                        </View>
                        <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.colorGray]}>{'Tạm ứng:'}</Text>
                            <Text style={[styles.txtPriceService, styles.colorGray]}>{formatter.format(resultDetail?.expenses?.advance) || 0}</Text>
                        </View>
                        <View style={styles.containerServices}>
                            <Text style={[styles.servicesName, styles.fontBold]}>{'Số tiền còn lại:'}</Text>
                            <Text style={[styles.txtPriceService, styles.fontBold]}>{formatter.format(resultDetail?.expenses?.remaining) || 0}</Text>
                        </View>
                        <View style={styles.lineHeight}></View>
                        {Number(resultDetail?.expenses?.remaining) > 0 ?
                            <View style={{}}>
                                <Text style={styles.txTime}>
                                    Tại thời điểm {resultDetail?.updatedDate?.toDateObject('-').format('HH:mm')} ngày {resultDetail?.updatedDate?.toDateObject('-').format('dd/MM/yyyy')} Người bệnh đang thiếu số tiền là <Text style={styles.txRed}>{renderTxRemind(resultDetail?.expenses?.remaining)}</Text>

                                </Text>
                            </View> : Number(resultDetail?.expenses?.remaining) < 0 ? <View style={{}}>
                                <Text style={styles.txTime}>
                                    Tại thời điểm {resultDetail?.updatedDate?.toDateObject('-').format('HH:mm')} ngày {resultDetail?.updatedDate?.toDateObject('-').format('dd/MM/yyyy')} Người bệnh đang dư số tiền là <Text style={styles.txRed}>{renderTxRemind(resultDetail?.expenses?.remaining)}</Text>
                                </Text>
                            </View> : null
                        }
                        {isLoading ? <ActivityIndicator style={{ alignSelf: 'flex-end', marginRight: 10 }}></ActivityIndicator> : <TouchableOpacity onPress={onShowPrice} style={styles.btnDetailPrice}>
                            <Text style={styles.txDetailPrice}>
                                Xem bảng kê chi phí
                            </Text>
                        </TouchableOpacity>}


                    </View>
                    : null
                }
            </Card>
        </View>
    )
}

export default memo(PriceIsPatient)


const styles = StyleSheet.create({
    txTime: {
        marginTop: 10,
        textAlign: 'left',
        marginLeft: 10,
        fontSize: 14,
        fontStyle: 'italic'
    },
    txRed: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 14,

    },
    btnDetailPrice: {
        padding: 5,
        alignSelf: 'flex-end'
    },
    txDetailPrice: {
        fontSize: 14,
        color: '#00000080',
        textDecorationLine: 'underline'
    },
    txtSumPrice: {
        color: '#ED1846',
        fontWeight: 'bold'
        // textDecorationLine: 'line-through'
    },
    fontBold: { fontWeight: 'bold', },
    lineHeight: {
        height: 1,
        width: '100%',
        backgroundColor: '#00000010',
        marginTop: 20,
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
    colorGray: { color: '#86899B' },
    containerServices: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingTop: 7,
        marginTop: 10
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
        marginLeft: 10
    },
    groupInfo: {
        padding: 10
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