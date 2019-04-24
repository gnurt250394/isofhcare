import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import { Card } from 'native-base';

const DEVICE_HEIGHT = Dimensions.get('window').height;
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import serviceTypeProvider from '@data-access/service-type-provider';
import specialistProvider from '@data-access/specialist-provider';
import DateTimePicker from 'mainam-react-native-date-picker';

import snackbar from '@utils/snackbar-utils';
import dateUtils from "mainam-react-native-date-utils";
import ImageLoad from 'mainam-react-native-image-loader';
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import Field from "mainam-react-native-form-validate/Field";

class AddBookingScreen extends Component {
    constructor() {
        super();
        this.state = {
            colorButton: 'red',
            imageUris: [],
            modalVisible: false
        }
    }
    _changeColor = () => {
        this.setState = ({ colorButton: !this.setState.colorButton })
    }
    removeImage(index) {
        var imageUris = this.state.imageUris;
        imageUris.splice(index, 1);
        this.setState({ imageUris });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    componentDidMount() {
        serviceTypeProvider.getAll().then(s => {
            this.setState({ serviceTypes: s });
        }).catch(e => {
            this.setState({ serviceTypes: e });
        });

        specialistProvider.getAll().then(s => {
            this.setState({ specialists: s });
        }).catch(e => {
            this.setState({ specialists: e });
        });
    }
    selectImage() {
        connectionUtils.isConnected().then(s => {
            if (this.imagePicker) {
                this.imagePicker.open(false, 200, 200, image => {
                    setTimeout(() => {
                        Keyboard.dismiss();
                    }, 500);
                    let imageUris = this.state.imageUris;
                    let temp = null;
                    imageUris.forEach((item) => {
                        if (item.uri == image.path)
                            temp = item;
                    })
                    if (!temp) {
                        imageUris.push({ uri: image.path, loading: true });
                        imageProvider.upload(image.path, (s, e) => {
                            if (s.success) {
                                if (s.data.code == 0 && s.data.data && s.data.data.images && s.data.data.images.length > 0) {
                                    let imageUris = this.state.imageUris;
                                    imageUris.forEach((item) => {
                                        if (item.uri == s.uri) {
                                            item.loading = false;
                                            item.url = s.data.data.images[0].image;
                                            item.thumbnail = s.data.data.images[0].thumbnail;
                                        }
                                    });
                                    this.setState({
                                        imageUris
                                    });
                                }
                            } else {
                                imageUris.forEach((item) => {
                                    if (item.uri == s.uri) {
                                        item.error = true;
                                    }
                                });
                            }
                        });
                    }
                    this.setState({ imageUris: [...imageUris] });
                });
            }
        }).catch(e => {
            snackbar.show("Không có kết nối mạng", "danger");
        });
    }
    selectProfile(profile) {
        this.setState({ profile });
    }
    addBooking() {

        let error = false;

        if (this.state.contact) {
            this.setState({ contactError: "" })
        } else {
            this.setState({ contactError: "Liên lạc với tôi không được bỏ trống" })
            error = true;
        }
        if (this.state.profile) {
            this.setState({ profileError: "" })
        } else {
            this.setState({ profileError: "Hồ sơ không được bỏ trống" })
            error = true;
        }
        if (this.state.serviceType) {
            this.setState({ serviceError: "" })
        } else {
            this.setState({ serviceError: "Dịch vụ khám không được bỏ trống" })
            error = true;
        }
        if (this.state.bookingDate) {
            this.setState({ bookingError: "" })
        } else {
            this.setState({ bookingError: "Ngày khám không được bỏ trống" })
            error = true;
        }

        if (this.state.specialist) {
            this.setState({ specialistError: "" })
        } else {
            this.setState({ specialistError: "Chuyên khoa không được bỏ trống" })
            error = true;
        }

        let validForm = this.form.isValid();
        if (!error && validForm) {
            this.props.navigation.navigate("selectHospital", {});
        }        
    }
    render() {
        let avatar = ((this.state.profile || {}).medicalRecords || {}).avatar;
        const source = avatar ? { uri: avatar.absoluteUrl() } : require("@images/new/user.png");

        return (<ActivityPanel style={{ flex: 1, backgroundColor: '#f7f9fb' }} title="Đặt Khám"
            menuButton={<TouchableOpacity style={styles.menu} onPress={() => snackbar.show("Chức năng đang phát triển")}><ScaleImage style={styles.img} height={20} source={require("@images/new/booking/ic_info.png")} /></TouchableOpacity>}
            titleStyle={{ marginLeft: 40 }}
            containerStyle={{
                backgroundColor: "#f7f9fb"
            }}
            actionbarStyle={{
                marginLeft: 10
            }}>

            <ScrollView style={styles.container}>

                <TouchableOpacity style={styles.name} onPress={() => {
                    this.props.navigation.navigate("selectProfile", { onSelected: this.selectProfile.bind(this) });
                }}>
                    {this.state.profile ?
                        <View style={{ flexDirection: 'row', height: 38, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={{ borderRadius: 20, borderWidth: 1, borderColor: '#CAC' }}
                                borderRadius={20}
                                customImagePlaceholderDefaultStyle={[styles.avatar, { width: 40, height: 40 }]}
                                placeholderSource={require("@images/new/user.png")}
                                resizeMode="cover"
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                source={source}
                                style={{
                                    alignSelf: 'center',
                                    borderRadius: 20,
                                    width: 40,
                                    height: 40
                                }}
                                defaultImage={() => {
                                    return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
                                }}
                            />
                            <Text style={styles.txtname}>{this.state.profile.medicalRecords.name}</Text>
                        </View> :
                        <View style={{ flexDirection: 'row', height: 38, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: 38, height: 38, borderRadius: 19, borderColor: 'rgba(151, 151, 151, 0.29)', borderWidth: 1 }}>
                                <ScaleImage source={require("@images/new/profile/ic_profile.png")} width={20} />
                            </View>
                            <Text style={styles.txtname}>Chọn hồ sơ</Text>
                        </View>
                    }
                    <ScaleImage style={styles.img} height={10} source={require("@images/new/booking/ic_next.png")} />
                </TouchableOpacity>
                <View style={styles.article}>
                    <TouchableOpacity style={styles.mucdichkham} onPress={() => this.setState({ toggleServiceType: true })}>
                        <ScaleImage style={styles.imgIc} width={18} source={require("@images/new/booking/ic_serviceType.png")} />
                        <Text style={styles.mdk}>Dịch vụ khám</Text>
                        <Text numberOfLines={1} style={styles.ktq}>{this.state.serviceType ? this.state.serviceType.name : "Chọn loại dịch vụ"}</Text>
                        <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                    </TouchableOpacity>
                    {
                        this.state.serviceError ?
                            <Text style={[styles.errorStyle]}>{this.state.serviceError}</Text> : null
                    }
                    <View style={styles.border}></View>
                    <TouchableOpacity style={styles.mucdichkham} onPress={() => this.setState({ toggelDateTimePickerVisible: true })}>
                        <ScaleImage style={styles.imgIc} width={18} source={require("@images/new/booking/ic_bookingDate.png")} />
                        <Text style={styles.mdk}>Ngày khám</Text>
                        <Text style={styles.ktq}>{this.state.date ? this.state.date : "Chọn ngày khám"}</Text>
                        <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                    </TouchableOpacity>
                    {
                        this.state.specialistError ?
                            <Text style={[styles.errorStyle]}>{this.state.specialistError}</Text> : null
                    }
                    <View style={styles.border}></View>
                    <TouchableOpacity style={styles.mucdichkham} onPress={() => this.setState({ toggleSpecialist: true })}>
                        <ScaleImage style={styles.imgIc} width={18} source={require("@images/new/booking/ic_specialist.png")} />
                        <Text style={styles.mdk}>Chuyên khoa</Text>
                        <Text numberOfLines={1} style={styles.ktq}>{this.state.specialist ? this.state.specialist.name : "Chọn chuyên khoa"}</Text>
                        <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                    </TouchableOpacity>
                    {
                        this.state.bookingError ?
                            <Text style={[styles.errorStyle]}>{this.state.bookingError}</Text> : null
                    }
                </View>
                <Text style={styles.lienlac}>Liên lạc với tôi qua</Text>

                <View style={styles.phoneSMS}>
                    <TouchableOpacity onPress={() => {
                        this.setState({ contact: 1 });
                    }} style={[styles.phone, this.state.contact == 1 ? styles.contact_selected : styles.contact_normal]}>
                        <ScaleImage style={styles.imgPhone} height={18} source={this.state.contact == 1 ? require("@images/new/booking/ic_phone1.png") : require("@images/new/booking/ic_phone0.png")} />
                        <Text style={[styles.tinnhan, this.state.contact == 1 ? styles.contact_text_selected : styles.contact_text_normal]}>Điện thoại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({ contact: 2 });
                    }} style={[styles.sms, this.state.contact == 2 ? styles.contact_selected : styles.contact_normal]}>
                        <ScaleImage style={styles.imgPhone} height={18} source={this.state.contact == 2 ? require("@images/new/booking/ic_send_sms1.png") : require("@images/new/booking/ic_send_sms0.png")} />
                        <Text style={[styles.tinnhan, this.state.contact == 2 ? styles.contact_text_selected : styles.contact_text_normal]}>SMS</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.contactError ?
                        <Text style={[styles.errorStyle]}>{this.state.contactError}</Text> : null
                }
                <Form
                    ref={ref => (this.form = ref)} style={styles.mota}>
                    <TextField
                        hideError={true}
                        validate={{
                            rules: {
                                required: true,
                                maxlength: 500
                            },
                            messages: {
                                required: "Mô tả triệu chứng không được bỏ trống",
                                maxlength: "Không cho phép nhập quá 500 kí tự"
                            }
                        }}

                        onValidate={(valid, messages) => {
                            if (valid) {
                                this.setState({ symptonError: "" });
                            }
                            else {
                                this.setState({ symptonError: messages });
                            }
                        }}
                        style={{ flex: 1 }}
                        inputStyle={styles.mtTr}
                        multiline={true} placeholder="Mô tả triệu chứng"></TextField>
                    <TouchableOpacity style={styles.imgMT} onPress={this.selectImage.bind(this)}>
                        <ScaleImage height={15} source={require("@images/new/booking/ic_image.png")} />
                    </TouchableOpacity>
                </Form>
                <Text style={[styles.errorStyle]}>{this.state.symptonError}</Text>

                <View style={styles.list_image}>
                    {
                        this.state.imageUris.map((item, index) => <View key={index} style={{ margin: 2, width: 88, height: 88, position: 'relative' }}>
                            <View style={{ marginTop: 8, width: 80, height: 80 }}>
                                <Image source={{ uri: item.uri }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: 8 }} />
                                {
                                    item.error ?
                                        <View style={{ position: 'absolute', left: 20, top: 20 }} >
                                            <ScaleImage source={require("@images/ic_warning.png")} width={40} />
                                        </View> :
                                        item.loading ?
                                            < View style={{ position: 'absolute', left: 20, top: 20, backgroundColor: '#FFF', borderRadius: 20 }} >
                                                <ScaleImage source={require("@images/loading.gif")} width={40} />
                                            </View>
                                            : null
                                }
                            </View>
                            <TouchableOpacity onPress={this.removeImage.bind(this, index)} style={{ position: 'absolute', top: 0, right: 0 }} >
                                <ScaleImage source={require("@images/new/ic_close.png")} width={16} />
                            </TouchableOpacity>
                        </View>)
                    }
                </View>
                <Text style={styles.des}>Mô tả triệu chứng sẽ giúp bạn được phục vụ tốt hơn</Text>
            </ScrollView>
            <View style={styles.btn}>
                <TouchableOpacity onPress={this.addBooking.bind(this)} style={styles.button}><Text style={styles.datkham}>Đặt khám</Text></TouchableOpacity>
            </View>
            <ImagePicker ref={ref => this.imagePicker = ref} />
            <Modal
                isVisible={this.state.toggleServiceType}
                onBackdropPress={() => this.setState({ toggleServiceType: false })}
                style={stylemodal.bottomModal}>
                <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                            CHỌN DỊCH VỤ KHÁM
                            </Text>
                    </View>

                    <FlatList
                        style={{ padding: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.serviceTypes}
                        ListHeaderComponent={() =>
                            !this.state.serviceTypes || this.state.serviceTypes.length == 0 ?
                                <View style={{ alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ fontStyle: 'italic' }}>Không tìm thấy dữ liệu loại dịch vụ</Text>
                                </View>
                                : null//<Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" />
                        }
                        ListFooterComponent={() => <View style={{ height: 50 }}></View>}
                        renderItem={({ item, index }) =>
                            <Card>
                                <TouchableOpacity onPress={() => { this.setState({ serviceType: item, toggleServiceType: false }) }}>
                                    <Text style={{ padding: 10, fontWeight: '300', color: this.state.serviceType == item ? "red" : "black" }}>{item.name}</Text>
                                    {/* <Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" /> */}
                                </TouchableOpacity>
                            </Card>
                        }
                    />
                </View>
            </Modal>
            <Modal
                isVisible={this.state.toggleSpecialist}
                onBackdropPress={() => this.setState({ toggleSpecialist: false })}
                style={stylemodal.bottomModal}>
                <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                            CHỌN CHUYÊN KHOA
                            </Text>
                    </View>

                    <FlatList
                        style={{ padding: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.specialists}
                        ListHeaderComponent={() =>
                            !this.state.specialists || this.state.specialists.length == 0 ?
                                <View style={{ alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ fontStyle: 'italic' }}>Không tìm thấy dữ liệu loại dịch vụ</Text>
                                </View>
                                : null//<Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" />
                        }
                        ListFooterComponent={() => <View style={{ height: 50 }}></View>}
                        renderItem={({ item, index }) =>
                            <Card>
                                <TouchableOpacity onPress={() => { this.setState({ specialist: item, toggleSpecialist: false }) }}>
                                    <Text style={{ padding: 10, fontWeight: '300', color: this.state.specialist == item ? "red" : "black" }}>{item.name}</Text>
                                    {/* <Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" /> */}
                                </TouchableOpacity>
                            </Card>
                        }
                    />
                </View>
            </Modal>
            <DateTimePicker
                isVisible={this.state.toggelDateTimePickerVisible}
                onConfirm={newDate => {
                    this.setState({ bookingDate: newDate, date: newDate.format("dd/MM/yyyy"), toggelDateTimePickerVisible: false }, () => {
                    });
                }}
                onCancel={() => {
                    this.setState({ toggelDateTimePickerVisible: false })
                }}
                date={new Date()}
                minimumDate={new Date()}
                cancelTextIOS={"Hủy bỏ"}
                confirmTextIOS={"Xác nhận"}
                date={this.state.dob || new Date()}
            />
        </ActivityPanel >
        );
    }
}

const styles = StyleSheet.create({
    menu: {
        padding: 5,
        paddingRight: 15
    },
    container: {
        flex: 1,
        backgroundColor: "#f7f9fb",
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.06)"
    },
    name: {
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.06)",
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        minHeight: 18
    },
    imgName: {
        marginLeft: 5,


    },
    txtname: {
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        flex: 1,
        marginLeft: 10
    },
    img: {
        marginRight: 5

    },
    article: {
        marginTop: 25,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.06)",

    },
    mucdichkham: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    mdk: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"

    },
    ktq: {
        flex: 1,
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "right",
        color: "#8e8e93",
        marginRight: 10,
        marginLeft: 20
    },
    border: {
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.06)",
        marginLeft: 15
    },
    imgIc: {
        marginLeft: 10
    },
    imgmdk: {
        marginRight: 5
    },
    lienlac: {
        padding: 20,
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        textAlign: 'center'
    },
    phoneSMS: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contact_selected:
    {
        borderColor: '#02c39a', borderWidth: 1,
        height: 40
    },
    contact_normal:
    {
        borderColor: 'rgba(0, 0, 0, 0.06)', borderWidth: 1,
        height: 40
    },
    contact_text_selected:
    {
        color: '#02c39a'
    },
    contact_text_normal:
    {
        color: 'rgb(142, 142, 147)'
    },
    gach: {
        borderStyle: "solid",
        borderWidth: 0.7,
        borderColor: "rgba(0, 0, 0, 0.06)",
        height: 25,
        alignItems: 'center'
    },

    phone: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

    },
    sms: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

    },
    dt: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a"
    },
    tinnhan: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
    },
    mota: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.06)",
        alignItems: 'center',
        marginTop: 20,
    },
    mtTr: {
        flex: 1,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        padding: 0,
        paddingLeft: 10
    },
    imgMT: {
        marginRight: 10
    },
    des: {
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0.2,
        color: "#4a4a4a",
        padding: 25,
        textAlign: 'center'
    },
    btn: {
        alignItems: 'center',
        padding: 30

    },
    button: {
        borderRadius: 6,
        backgroundColor: "#02c39a",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1
    },
    datkham: {
        fontSize: 16,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#ffffff",
        padding: 15,
        paddingLeft: 100,
        paddingRight: 100
    },
    imgPhone: {
        marginRight: 10
    },
    list_image: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginHorizontal: 20 },
    errorStyle: {
        color: 'red',
        marginTop: 10,
        marginLeft: 25
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(AddBookingScreen);