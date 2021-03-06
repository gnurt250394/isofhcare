import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Linking, Platform, FlatList, ScrollView } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ActivityPanel from "@components/ActivityPanel";
import snackbar from "@utils/snackbar-utils";

const devices_width = Dimensions.get('window').width
export default class DrugStoreScreen extends Component {
    constructor(props) {
        super(props);
        let data = this.props.navigation.getParam('data', null)
        this.state = {
            name: data && data.name,
            address: data && data.address,
            phone: data && data.phone,
            type: data && data.type,
            ownerCertificateNumber: data && data.ownerCertificateNumber,
            registrationNumber: data && data.registrationNumber,
            standardNumber: data && data.standardNumber,
            ownerName: data && data.ownerName,
            ownerQualification: data && data.ownerQualification,
            medicines: data && data.medicines

        };
    }
    openMap = () => {
        // var scheme = Platform.OS === 'ios' ? 'maps://?daddr=' : 'https://www.google.com/maps/search/?api=1&query=';
        // var url = scheme + `${this.state.address}`;
        // Linking.openURL(url);
        this.props.navigation.navigate("mapHospital", {
            item: this.state.address
        });
    }
    renderDrugItem = ({ item, index }) => {
        return (
            <View style={styles.viewItem}>
                <Text style={styles.txName}>{`${item.name}`}</Text>
            </View>
        )
    }
    onEdit = () => {
        // let dataDetail = this.state.dataDetail
        // if (dataDetail.state == 'STORED') {
        //     if (dataDetail && dataDetail.images && dataDetail.images.length) {
        //         this.props.navigation.navigate('editDrugScan', { dataEdit: this.state.dataDetail })
        //         return
        //     } if (dataDetail && dataDetail.medicines && dataDetail.medicines.length) {
        //         this.props.navigation.navigate('editDrugInput', { dataEdit: this.state.dataDetail })
        //         return
        //     }
        // } else {
        snackbar.show('????n thu???c kh??ng ???????c ph??p thay ?????i', 'danger')
        // }
    }
    render() {
        return (
            <ActivityPanel titleStyle={styles.txTitle} isLoading={this.state.isLoading} containerStyle={styles.container} title={"Nh?? thu???c"} menuButton={<TouchableOpacity onPress={this.onEdit} style={{ padding: 5, marginRight: 16 }}><ScaledImage source={require('@images/new/drug/ic_edit.png')} height={20}></ScaledImage>
            </TouchableOpacity>}>
                <ScrollView style={{ flex: 1 }}>
                    <ScaledImage style={styles.bgdemo} width={devices_width} source={require('@images/new/drug/bg_demo.png')}></ScaledImage>
                    <Text style={styles.txNameShop}>{this.state.name.toUpperCase()}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={styles.txLocation}>{this.state.address}</Text><TouchableOpacity style={{ padding: 5 }} onPress={this.openMap}><Text style={styles.txBtn}>Xem b???n ?????</Text></TouchableOpacity></View>
                    <Text style={styles.txTitle}>Th??ng tin nh?? thu???c</Text>
                    <View style={styles.listSelect}>
                        <Text style={styles.txSelect}>Danh s??ch thu???c ????p ???ng({this.state.medicines.length})</Text>
                        <FlatList
                            data={this.state.medicines}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderDrugItem}
                        >
                        </FlatList>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>S??? ??i???n tho???i: </Text>
                        <Text style={styles.txContents}>{this.state.phone}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Lo???i h??nh NT: </Text>
                        <Text style={styles.txContents}>{this.state.type}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>?????t chu???n: </Text>
                        <Text style={styles.txContents}>{this.state.standardNumber}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>S??? ????ng k?? NT: </Text>
                        <Text style={styles.txContents}>{this.state.registrationNumber}</Text>
                    </View>
                    <Text style={styles.txTitle}>Th??ng tin ng?????i ?????i di???n</Text>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Ng?????i ?????i di???n: </Text>
                        <Text style={styles.txContents}>{this.state.ownerName}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Tr??nh ????? chuy??n m??n: </Text>
                        <Text style={styles.txContents}>{this.state.ownerQualification}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>S??? ch???ng ch??? h??nh ngh???: </Text>
                        <Text style={styles.txContents}>{this.state.ownerCertificateNumber}</Text>
                    </View>
                </ScrollView>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    bgdemo: {
        marginTop: 20
    },
    container: {
        padding: 10,
        flex: 1
    },
    viewInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txLabel: {
        color: '#000',
        fontSize: 14,
        textAlign: 'left',
        marginLeft: 10

    },
    txContents: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    txTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        fontStyle: 'italic',
        color: '#00BA99',
        textAlign: 'right',
    },
    txBtn: {
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: '#00A3FF'
    },
    txLocation: {
        fontSize: 14,
        textAlign: 'left',
        color: '#808080'
    },
    txNameShop: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left'
    },
    listSelect: {
        padding: 10,
        flex: 1,
        paddingLeft: 0,
    },
    txSelect: {
        fontStyle: 'italic',
    },
    viewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 0.5,
        paddingVertical: 10

    },
    txName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00B090',
        textAlign: 'left',
        maxWidth: '80%'
    },
    txTitle: { color: '#fff', marginLeft: 50, fontSize: 18 },

})
