import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Keyboard
} from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import NavigationService from "@navigators/NavigationService";
import snackbar from '@utils/snackbar-utils';
import { connect } from "react-redux";
import constants from '@resources/strings';
import drugProvider from '@data-access/drug-provider'
import dataCacheProvider from '@data-access/datacache-provider';
import redux from "@redux-store";
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
class InsertInfoDrug extends Component {
    constructor(props) {
        super(props);
        const dataEdit = this.props.dataEdit

        this.state = {
            isScan: true,
            imageUris: [],
            name: dataEdit && dataEdit.name,
            note: dataEdit && dataEdit.note,
            location: dataEdit && dataEdit.address
        };
    }
    selectLocation = (location) => {
        let locationError = location ? "" : this.state.locationError;
        if (!location || !this.state.location || location.id != this.state.location.id) {
            this.setState({ location, locationError })
        } else {
            this.setState({ location, locationError });
        }
    }
    onSelectLocation = () => {
        NavigationService.navigate('selectLocation', {
            onSelected: this.selectLocation.bind(this),
        })

    }
    componentWillMount() {
        dataCacheProvider.read(this.props.userApp.currentUser.id, constants.key.storage.LOCATION_DEFAULT, (s, e) => {
            if (s) {
                if (this.props.dataEdit && this.props.dataEdit.address) {
                    this.setState({
                        location: this.props.dataEdit.address
                    })
                } else {
                    this.setState({ location: s[0] })
                }
                return
            }
            if (e) {
                return
            }
        });
    }
    onCreateSuccess = (data) => {
        this.props.dispatch(redux.addDrug(data));
        NavigationService.pop();
    }
    addMenuDrug = (isFinding) => {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        this.setState({
            isLoading: isFinding
        }, () => {
            var imageUris = this.props.imageUris
            console.log('imageUris: ', imageUris);
            var dataDrug = this.props.dataSearchDrug
            let addressId = this.state.location && this.state.location.id ? this.state.location.id : null
            let note = this.state.note
            let id = this.props.userApp.currentUser.id
            let name = this.state.name
            let idDrug = this.props.dataEdit && this.props.dataEdit.id ? this.props.dataEdit.id : null
            if (imageUris) {
                if (imageUris && imageUris.length == 0) {
                    snackbar.show('Bạn cần chọn ít nhất một ảnh!', 'danger')
                    this.setState({
                        isLoading: false
                    })
                    return
                }
                for (var i = 0; i < imageUris.length; i++) {
                    if (imageUris[i].loading) {
                        snackbar.show(constants.msg.booking.image_loading, 'danger');
                        this.setState({
                            isLoading: false
                        })
                        return;
                    }
                    if (imageUris[i].error) {
                        this.setState({
                            isLoading: false
                        })
                        snackbar.show(constants.msg.booking.image_load_err, 'danger');
                        return;
                    }
                }
                var images = [];
                imageUris.forEach((item) => {

                    if (images)
                        images.push({
                            id: item.id ? item.id : null,
                            action: item.action ? item.action : 'CREATE_OR_UPDATE',
                            pathOriginal: item.url,
                            pathThumbnail: item.thumbnail
                        })
                });

                let data = {
                    addressId: addressId,
                    images: images,
                    name: name,
                    note: note,
                    // ownerId: id,
                    "type": "IMAGE",
                    isFinding: isFinding,
                }
                drugProvider.createDrug(data, idDrug).then(res => {
                    this.setState({
                        isLoading: false
                    })
                    if (res && !this.props.dataEdit) {

                        snackbar.show('Tạo đơn thuốc thành công!', 'success')
                        this.onCreateSuccess(res)
                    } else {
                        snackbar.show('Sửa đơn thuốc thành công!', 'success')
                        this.onCreateSuccess(res)
                    }
                }).catch(err => {
                    if (err.response) {
                        let status = err.response.data && err.response.data.status
                        this.setState({
                            isLoading: false
                        })
                        switch (status) {
                            case 406:
                                snackbar.show("Đơn thuốc không được phép thay đổi", 'danger')
                                break
                            default:
                                snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                                break
                        }
                    } else {
                        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                        this.setState({
                            isLoading: false
                        })

                    }
                })
                return
            } if (dataDrug && !imageUris) {
                if (dataDrug.length == 0) {
                    this.setState({
                        isLoading: false
                    })
                    snackbar.show('Bạn cần nhập ít nhất một loại thuốc!', 'danger')
                    return
                }
                var medicines = []
                for (let i = 0; i < dataDrug.length; i++) {
                    medicines.push({
                        id: dataDrug[i].id ? dataDrug[i].id : null,
                        name: `${dataDrug[i].name ? dataDrug[i].name : ''} ${dataDrug[i].packing ? dataDrug[i].packing : ''}`,
                        // "unit": dataDrug[i].unit,
                        medicineId: dataDrug[i].medicineId,
                        action: dataDrug[i].action ? dataDrug[i].action : 'CREATE_OR_UPDATE'
                    })
                }

                let data2 = {
                    addressId: addressId,
                    medicines: medicines,
                    name: name,
                    note: note,
                    // ownerId: id,
                    isFinding: isFinding
                }
                drugProvider.createDrug(data2, idDrug).then(res => {
                    if (res && !this.props.dataEdit) {
                        snackbar.show('Tạo đơn thuốc thành công!', 'success')
                        this.setState({
                            isLoading: false
                        })
                        this.onCreateSuccess(res)
                    } else {
                        snackbar.show('Sửa đơn thuốc thành công!', 'success')
                        this.setState({
                            isLoading: false
                        })
                        this.onCreateSuccess(res)
                    }
                }).catch(err => {
                    if (err.response) {
                        this.setState({
                            isLoading: false
                        })
                        let status = err.response.data && err.response.data.status
                        switch (status) {
                            case 406:
                                snackbar.show("Đơn thuốc không được phép thay đổi", 'danger')
                                break
                            default:
                                snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
                                break
                        }
                    } else {
                        this.setState({
                            isLoading: false
                        })
                        snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')

                    }
                })
            }
        })

    }
    render() {
        return (
            <View style={styles.container}>
                <Form ref={ref => (this.form = ref)}>
                    <Field style={styles.viewInput}>
                        <Text style={styles.txNameDrug}>Tên đơn thuốc</Text>
                        <TextField
                            onChangeText={text => this.setState({ name: text })}
                            value={this.state.name}
                            placeholder={'Nhập tên đơn thuốc'}
                            errorStyle={styles.errorStyle}
                            inputStyle={styles.inputNameDrug}
                            underlineColorAndroid={'#fff'}
                            placeholderTextColor='#000'
                            validate={{
                                rules: {
                                    required: true,
                                },
                                messages: {
                                    required: "Tên đơn thuốc không được bỏ trống",
                                }
                            }}
                            autoCapitalize={"none"}
                        />
                    </Field>
                    <Field style={styles.viewInput}>
                        <Text style={styles.txNameDrug}>Ghi chú</Text>
                        <TextField
                            value={this.state.note}
                            placeholderTextColor="#000" onChangeText={text => this.setState({ note: text })}
                            errorStyle={styles.errorStyle}
                            inputStyle={styles.inputNote}
                            placeholder={'Viết ghi chú cho đơn thuốc'}
                            underlineColorAndroid={'#fff'}
                            placeholderTextColor='#000'
                            multiline={true}
                            autoCapitalize={"none"}
                        />
                    </Field>
                    <Field style={styles.viewInput}>
                        <Text style={styles.txNameDrug}>Vị trí của bạn</Text>
                        <Field style={styles.locationBtn} >
                            <ScaledImage source={require('@images/new/drug/ic_location.png')} height={20}></ScaledImage>
                            <TextField
                                value={this.state.location && this.state.location.address}
                                onPress={this.onSelectLocation}
                                placeholderTextColor="#000"
                                errorStyle={styles.errorStyle}
                                inputStyle={styles.btnLocation}
                                placeholder={'Chọn địa chỉ'}
                                underlineColorAndroid={'#fff'}
                                validate={{
                                    rules: {
                                        required: true,
                                    },
                                    messages: {
                                        required: "Địa chỉ không được bỏ trống",
                                    }
                                }}
                                placeholderTextColor='#000'
                                multiline={true}
                                editable={false}
                                autoCapitalize={"none"}
                            />
                        </Field>
                    </Field>
                    {/* <ScaledImage source={require('@images/new/drug/ic_btn_location.png')} height={10}></ScaledImage> */}
                    <TouchableOpacity disabled={this.state.isLoading} onPress={() => this.addMenuDrug(true)} style={styles.btnFind}>{this.state.isLoading ? <ActivityIndicator color={'#fff'} size={"large"}></ActivityIndicator> : <Text style={styles.txFind}>Tìm nhà thuốc</Text>}</TouchableOpacity>
                    <TouchableOpacity onPress={() => this.addMenuDrug(false)} style={styles.btnSave}><Text style={styles.txSave}>Lưu lại</Text></TouchableOpacity>
                    <View style={styles.viewBottom}></View>
                </Form>
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
    locationBtn: {
        minHeight: 41,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        flex: 1,

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
        color: '#00A3FF',
        textDecorationLine: 'underline',
        fontSize: 14,
        fontStyle: 'italic',
        flexWrap: 'wrap',

    },
    inputLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        padding: 5,
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
    },
    errorStyle: {
        color: "red",
        marginTop: 10
    },
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation,
        dataDrug: state.dataDrug
    };
}
export default connect(mapStateToProps)(InsertInfoDrug);