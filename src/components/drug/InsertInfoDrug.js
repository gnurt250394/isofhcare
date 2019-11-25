import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { ScrollView } from 'react-native-gesture-handler';
import NavigationService from "@navigators/NavigationService";
import snackbar from '@utils/snackbar-utils';
import { connect } from "react-redux";
import constants from '@resources/strings';
import drugProvider from '@data-access/drug-provider'
class InsertInfoDrug extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    selectLocation = (location) => {
        let locationError = location ? "" : this.state.locationError;
        if (!location || !this.state.location || location.id != this.state.location.id) {
            this.setState({ location, locationError, zone: null })
        } else {
            this.setState({ location, locationError });
        }
    }
    onSelectLocation = () => {
        this.props.navigation.navigate('selectLocation', {
            onSelected: this.selectLocation.bind(this),
        })

    }
    addMenuDrug = () => {
        let imageUris = this.props.imageUris
        let dataDrug = this.props.dataDrug
        let addressId = this.state.location.id
        let note = this.state.note
        let id = this.props.userApp.currentUser.id
        let name = this.state.name
        if (imageUris && !dataDrug) {
            for (var i = 0; i < imageUris.length; i++) {
                if (imageUris[i].loading) {
                    snackbar.show(constants.msg.booking.image_loading, 'danger');
                    return;
                }
                if (imageUris[i].error) {
                    snackbar.show(constants.msg.booking.image_load_err, 'danger');
                    return;
                }
            }
            var images = [];
            imageUris.forEach((item) => {
                console.log('item: ', item);
                if (images)
                    images.push({
                        "action": "CREATE_OR_UPDATE",
                        "path": item.image,
                        "pathThumail": item.thumbnail
                    })
            });

            let data = {
                addressId:addressId,
                images: images,
                name: name,
                note: note,
                ownerId: id
            }
            return
        } if (dataDrug && !imageUris) {
            let data2 = {
                addressId: addressId,
                "medicines": [
                    {
                        "action": "CREATE_OR_UPDATE",
                        "id": 1,
                        "name": "Paracetamol",
                        "price": 100000,
                        "quantity": 1,
                        "unit": "mg"
                    }
                ],
                name: name,
                note: note,
                ownerId: id
            }
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewInput}>
                    <Text style={styles.txNameDrug}>Tên đơn thuốc</Text>
                    <TextInput onChangeText={text => this.setState({})} underlineColorAndroid={'#fff'} style={styles.inputNameDrug} multiline={true} placeholder={'Nhập tên đơn thuốc'}></TextInput>
                </View>
                <View style={styles.viewInput}>
                    <Text style={styles.txNameDrug}>Ghi chú</Text>
                    <TextInput placeholder={'Viết ghi chú cho đơn thuốc'} multiline={true} style={styles.inputNote}></TextInput>
                </View>
                <View style={styles.viewInput}>
                    <Text style={styles.txNameDrug}>Vị trí của bạn</Text>
                    <TouchableOpacity onPress={this.onSelectLocation} style={styles.btnLocation}>
                        <View style={styles.inputLocation}>
                            <ScaledImage source={require('@images/new/drug/ic_location.png')} height={20}></ScaledImage>
                            <Text style={styles.txLabelLocation}>Nhập địa chỉ</Text>
                        </View>
                        <ScaledImage source={require('@images/new/drug/ic_btn_location.png')} height={10}></ScaledImage>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.addMenuDrug} style={styles.btnFind}><Text style={styles.txFind}>Tìm nhà thuốc</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnSave}><Text style={styles.txSave}>Lưu lại</Text></TouchableOpacity>
                <View style={styles.viewBottom}></View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    btnSave: {
        padding: 5
    },
    btnTabScan: {
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        width: '50%',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3161ad'
    },
    btnTabInput: {
        borderBottomRightRadius: 25,
        borderTopRightRadius: 25,
        width: '50%',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3161ad'

    },
    viewInput: {
        flex: 1,
        margin: 10
    },
    txNameDrug: {
        fontSize: 14,
        color: '#000',
        textAlign: 'left',
        fontStyle: 'italic',
    },
    inputNameDrug: {
        minHeight: 48,
        width: '100%',
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    inputNote: {
        width: '100%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc',
        minHeight: 71,
        padding: 10,
    },
    btnLocation: {
        minHeight: 41,
        width: '100%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    inputLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    txLabelLocation: {
        color: '#00A3FF',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginLeft: 10,
        fontStyle: 'italic',
    },
    btnFind: {
        borderRadius: 6,
        alignSelf: 'center',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CBA7',
        paddingHorizontal: 60,
        marginTop: 30
    },
    txFind: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center'
    },
    txSave: {
        textAlign: 'center',
        color: '#3161AD',
        fontSize: 16,
        textDecorationLine: 'underline',
        fontWeight: '800',
        marginTop: 20,
    },
    viewBottom: {
        height: 50
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
    };
}
export default connect(mapStateToProps)(InsertInfoDrug);