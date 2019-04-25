import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, Slider } from 'react-native';
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

class SelectTimeScreen extends Component {
    constructor(props) {
        super(props);
        let serviceType = this.props.navigation.state.params.serviceType;
        let hospital = this.props.navigation.state.params.hospital;
        let profile = this.props.navigation.state.params.profile;
        let specialist = this.props.navigation.state.params.specialist;
        this.state = {
            serviceType,
            hospital,
            profile,
            specialist
        }
    }
    selectService(service) {
        this.setState({ service });
    }
    render() {
        return (<ActivityPanel style={{ flex: 1, backgroundColor: '#f7f9fb' }} title="Thời gian"
            titleStyle={{ marginLeft: 0 }}
            containerStyle={{
                backgroundColor: "#f7f9fb"
            }} actionbarStyle={{
                backgroundColor: '#ffffff',
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.06)'
            }}>


            <View style={styles.container}>
                <View style={styles.article}>
                    <TouchableOpacity style={styles.mucdichkham} onPress={() => {
                        this.props.navigation.navigate("selectService", { hospital: this.state.hospital, onSelected: this.selectService.bind(this) })
                    }}>
                        <ScaleImage style={styles.imgIc} height={15} source={require("@images/new/booking/ic_specialist.png")} />
                        <Text style={styles.mdk}>{this.state.service ? this.state.service.name : "Chọn dịch vụ"}</Text>
                        <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                    </TouchableOpacity>
                    <View style={styles.border}></View>
                    {/* <View style={styles.mucdichkham}>
                            <ScaleImage style={styles.imgIc} height={20} source={require("@images/new/bitmap3x.png")} />
                            <Text style={styles.mdk}>PGS. Trần Văn Ngọc</Text>

                        </View> */}
                </View>

                <View style={styles.chonGioKham}>
                    <Text style={styles.txtchongiokham}>Chọn giờ khám</Text>
                    <Slider style={styles.slider}></Slider>
                    <View style={styles.btn}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.txtbtn}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </View>
        </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f9fb",



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
        alignItems: 'center',
        padding: 10,


    },
    txtname: {
        fontSize: 17,
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

    border: {
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.06)",
        marginLeft: 15
    },
    imgIc: {
        marginLeft: 10,
        marginRight: 10
    },
    imgmdk: {
        marginRight: 5
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
    txtchongiokham: {
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#4a4a4a",
        textAlign: 'center',
        padding: 30
    },
    chonGioKham: {
        flex: 1, marginTop: 20,
        backgroundColor: '#fff'
    },
    btn: {
        position: 'absolute',
        alignItems: 'center',
        left: 0,
        right: 0,
        bottom: 0,
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
    txtbtn: {
        fontSize: 18,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#ffffff",
        padding: 15,
        paddingLeft: 100,
        paddingRight: 100
    },
    slider: {
        marginLeft: 20,
        marginRight: 20
    },
    circle: {
        padding: 5,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: "rgba(151, 151, 151, 0.29)",
        marginLeft: 5
    }
})
export default connect(mapStateToProps)(SelectTimeScreen);