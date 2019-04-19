import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, Modal, TouchableHighlight, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import { Card } from 'native-base';

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

    render() {

        return (

            <ActivityPanel style={{ flex: 1, backgroundColor: '#f7f9fb' }} title="Đặt Khám" iosBarStyle={'light-content'}
                statusbarBackgroundColor="#f7f9fb"
                menuButton={<TouchableOpacity style={styles.menu}><ScaleImage style={styles.img} height={20} source={require("@images/new/booking/ic_info.png")} /></TouchableOpacity>}
                titleStyle={{ marginLeft: 40 }}
                containerStyle={{
                    backgroundColor: "#f7f9fb"
                }}
                actionbarStyle={{
                    backgroundColor: '#f7f9fb', marginLeft: 10
                }}>

                <ScrollView style={styles.container}>

                    <TouchableOpacity style={styles.name}>
                        <ScaleImage style={styles.imgName} height={38} source={require("@images/new/user.png")} />
                        <Text style={styles.txtname}>Lê Thị Hoàng</Text>
                        <ScaleImage style={styles.img} height={10} source={require("@images/new/booking/ic_next.png")} />
                    </TouchableOpacity>
                    <View style={styles.article}>
                        <TouchableOpacity style={styles.mucdichkham}>
                            <ScaleImage style={styles.imgIc} width={18} source={require("@images/new/booking/ic_serviceType.png")} />
                            <Text style={styles.mdk}>Dịch vụ khám</Text>
                            <Text style={styles.ktq}>Khám tổng quát</Text>
                            <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                        </TouchableOpacity>
                        <View style={styles.border}></View>
                        <TouchableOpacity style={styles.mucdichkham}>
                            <ScaleImage style={styles.imgIc} width={18} source={require("@images/new/booking/ic_bookingDate.png")} />
                            <Text style={styles.mdk}>Ngày khám</Text>
                            <Text style={styles.ktq}>Khám tổng quát</Text>
                            <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                        </TouchableOpacity>
                        <View style={styles.border}></View>
                        <TouchableOpacity style={styles.mucdichkham}>
                            <ScaleImage style={styles.imgIc} width={18} source={require("@images/new/booking/ic_specialist.png")} />
                            <Text style={styles.mdk}>Chuyên khoa</Text>
                            <Text style={styles.ktq}>Thứ 5, 4 tháng 3</Text>
                            <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.lienlac}>Liên lạc với tôi qua</Text>

                    <View style={styles.phoneSMS}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ withPhone: true });
                        }} style={[styles.phone, this.state.withPhone ? styles.contact_selected : styles.contact_normal]}>
                            <ScaleImage style={styles.imgPhone} height={18} source={this.state.withPhone ? require("@images/new/booking/ic_phone1.png") : require("@images/new/booking/ic_phone0.png")} />
                            <Text style={[styles.tinnhan, this.state.withPhone ? styles.contact_text_selected : styles.contact_text_normal]}>Điện thoại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({ withPhone: false });
                        }} style={[styles.sms, !this.state.withPhone ? styles.contact_selected : styles.contact_normal]}>
                            <ScaleImage style={styles.imgPhone} height={18} source={!this.state.withPhone ? require("@images/new/booking/ic_send_sms1.png") : require("@images/new/booking/ic_send_sms0.png")} />
                            <Text style={[styles.tinnhan, !this.state.withPhone ? styles.contact_text_selected : styles.contact_text_normal]}>SMS</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.mota}>
                        <TextInput style={styles.mtTr} placeholder="Mô tả triệu chứng" multiline={true} underlineColorAndroid='transparent' />
                        <TouchableOpacity style={styles.imgMT} onPress={this.selectImage.bind(this)}>
                            <ScaleImage height={15} source={require("@images/new/booking/ic_image.png")} />
                        </TouchableOpacity>
                    </View>
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
                    <TouchableOpacity style={styles.button}><Text style={styles.datkham}>Đặt khám</Text></TouchableOpacity>
                </View>
                <ImagePicker ref={ref => this.imagePicker = ref} />
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
        padding: 10
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
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"

    },
    ktq: {
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "right",
        color: "#8e8e93",
        marginRight: 10
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
        padding: 25
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
    list_image: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginHorizontal: 20 }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(AddBookingScreen);