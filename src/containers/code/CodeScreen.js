import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Clipboard } from 'react-native'
import ActivityPanel from '@components/ActivityPanel'
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux'
import Modal from "@components/modal";
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';

const CodeScreen = () => {
    const [state, _setState] = useState({
        isVisible: false
    })
    const setState = (data = {}) => {
        _setState((state) => ({
            ...state, ...data
        }))
    }
    const userApp = useSelector((state) => state.auth.userApp)
    console.log('userApp: ', userApp);
    const onQrClick = () => {
        setState({
            isVisible: true,
        })
    }
    const onCopyCode = (nummber) => () => {
        if (!nummber) {
            return
        }
        Clipboard.setString(nummber)
        snackbar.show(constants.booking.copy_success, 'success')
    }
    const onBackdropPress = () => setState({ isVisible: false })
    return (
        <ActivityPanel
            title="Mã iSofHcare"
        >

            <View style={styles.containerLabel}>
                <Text style={styles.txtLabel}>Gửi mã iSofHcare cho bạn bè, người thân của bạn. Nhập mã giới thiệu khi đăng ký tài khoản để người giới thiệu được cộng điểm nhé.</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.txtQr}>Quét mã QR code để giới thiệu</Text>
                <TouchableOpacity
                    onPress={onQrClick}
                    style={{
                        alignSelf: 'center'
                    }}>
                    <QRCode
                        value={userApp?.currentUser?.uid || " "}
                        logo={require('@images/new/logo.png')}
                        logoSize={20}
                        size={100}
                        color="#3161AD"
                        logoBackgroundColor='transparent'
                    />
                </TouchableOpacity>
                <Text style={styles.txtTitleCode}>Mã iSofHcare của bạn</Text>
                <View style={styles.containerCode}>
                    <Text style={styles.txtCode} numberOfLines={1}>{userApp?.currentUser?.uid || " "}</Text>
                    <TouchableOpacity onPress={onCopyCode(userApp?.currentUser?.uid)} style={styles.buttonCopy}>
                        <Text style={styles.txtCopy}>Sao chép</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                isVisible={state.isVisible}
                onBackdropPress={onBackdropPress}
                backdropOpacity={0.5}
                animationInTiming={500}
                animationOutTiming={500}
                style={styles.modal}
                backdropTransitionInTiming={1000}
                backdropTransitionOutTiming={1000}
            >
                <QRCode
                    value={userApp?.currentUser?.uid|| " "}
                    logo={require('@images/new/logo.png')}
                    logoSize={40}
                    size={250}
                    color="#3161AD"
                    logoBackgroundColor='transparent'
                />
            </Modal>
        </ActivityPanel>
    )
}

export default CodeScreen


const styles = StyleSheet.create({
    txtCopy: {
        color: '#FFF'
    },
    buttonCopy: {
        backgroundColor: '#00CBA7',
        height: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    txtCode: {
        flex: 1,
        paddingHorizontal: 10,
        color: '#3161AD'
    },
    containerCode: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 45,
        borderRadius: 5,
        marginTop: 10
    },
    txtTitleCode: {
        fontWeight: 'bold',
        paddingTop: 20,
    },
    txtQr: {
        fontWeight: 'bold',
        paddingTop: 20,
        paddingBottom: 10
    },
    container: {
        padding: 15,
        backgroundColor: '#f2f2f2',
        flex: 1
    },
    txtLabel: {
        color: '#FFF',
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerLabel: {
        backgroundColor: '#3161AD',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,

    },
})