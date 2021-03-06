import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ticketProvider from '@data-access/ticket-provider';
import ScaledImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import ImageLoad from "mainam-react-native-image-loader";
import dateUtils from "mainam-react-native-date-utils";
import constants from '@resources/strings';

class TicketHistory extends Component {
    state = {
        data: [],
        loading: true,
    }
    componentDidMount() {
        this.onRefresh()
    }
    onRefresh = () => {
        this.setState({
            loading: true
        }, () => {
            this.onGetList()
        })
    }
    getInfo(data) {
        let obj = data.split("|");
        if (obj.length < 7)
            throw "";
        let info = {};
        info.qrCode = data;
        info.id = obj[0];
        info.bod = obj[2];
        info.gender = obj[3] == 1 ? 1 : 0;
        let bytearr = this.toByteArray(obj[1]);
        info.fullname = this.fromUTF8Array(bytearr);
        info.startDate = obj[6];
        info.hospitalCode = obj[5];
        bytearr = this.toByteArray(obj[4]);
        info.address = this.fromUTF8Array(bytearr) + "";


        return info;
    }
    fromUTF8Array(data) { // array of bytes
        var str = '',
            i;

        for (i = 0; i < data.length; i++) {
            var value = data[i];

            if (value < 0x80) {
                str += String.fromCharCode(value);
            } else if (value > 0xBF && value < 0xE0) {
                str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
                i += 1;
            } else if (value > 0xDF && value < 0xF0) {
                str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
                i += 2;
            } else {
                // surrogate pair
                var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

                str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
                i += 3;
            }
        }

        return str;
    }
    toByteArray(hexString) {
        var result = [];
        for (var i = 0; i < hexString.length; i += 2) {
            result.push(parseInt(hexString.substr(i, 2), 16));
        }
        return result;
    }

    onGetList = () => {
        ticketProvider.getHistoryTicket().then(res => {
            let item = res.data.numberHospital.find(item => !item.numberHospital.number);

            this.setState({
                isShowContent: item,
                data: res.data.numberHospital,
                loading: false
            })
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }
    renderTime = (item, index) => {
        if (!item.informationUserHospital)
            return null;
        let notiTime = item.informationUserHospital.createdDate.toDateObject('-');
        if (index == 0) {
            let date = new Date();
            if (date.ddmmyyyy() == notiTime.ddmmyyyy())
                return <Text style={styles.txtNotiTime}>H??m nay</Text>
            else
                return <Text style={styles.txtNotiTime}>{notiTime.format('dd/MM/yyyy')}</Text>
        }
        else {
            let preNoti = this.state.data[index - 1];

            if (!preNoti || !preNoti.informationUserHospital)
                return null;

            let preNotiDate = preNoti.informationUserHospital.createdDate.toDateObject('-');
            if (preNotiDate.ddmmyyyy() != notiTime.ddmmyyyy())
                return <Text style={styles.txtNotiTime}>{notiTime.format('dd/MM/yyyy')}</Text>
        }
        return null
    }
    defaultImage = () => {
        const icSupport = require("@images/new/user.png");
        return (
            <ScaledImage
                resizeMode="cover"
                source={icSupport}
                width={60}
                style={styles.placeHolderImage}
            />
        );
    }
    renderItems = ({ item, index }) => {
        if (!item.hospital || !item.numberHospital || !item.informationUserHospital)
            return null;
        let hospital = item.hospital;
        let numberHospital = item.numberHospital;
        let informationUserHospital = item.informationUserHospital;
        let info = this.getInfo(informationUserHospital.scanCode);
        const icSupport = require("@images/new/user.png");
        const source = this.props.userApp.isLogin ? (this.props.userApp.currentUser.avatar ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() } : icSupport) : icSupport;

        return (
            <View>
                {this.renderTime(item, index)}
                <TouchableOpacity style={styles.itemView}>
                    <View style={styles.containerHeader}>
                        <View style={styles.row}>
                            <Text style={styles.txtFullName}>{info.fullname}</Text>
                            <ScaledImage style={{ marginLeft: 10, }} height={18} source={require("@images/new/ticket/ic_verified.png")} ></ScaledImage>
                        </View>
                        {numberHospital.number ?
                            <TouchableOpacity style={styles.buttonNumberHospital}>
                                <Text style={styles.txtNumberHospital}>{constants.ehealth.ticket}: {numberHospital.number}</Text>
                            </TouchableOpacity> : null
                        }
                    </View>
                    <View style={styles.row}>
                        <View style={styles.containerImage}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={styles.borderImage}
                                borderRadius={30}
                                customImagePlaceholderDefaultStyle={styles.placeHolderImage}
                                placeholderSource={icSupport}
                                style={styles.placeHolderImage}
                                resizeMode="cover"
                                loadingStyle={{ size: "small", color: "gray" }}
                                source={source}
                                defaultImage={this.defaultImage}
                            />
                            <Text style={styles.txtInfoUserHospital}>{informationUserHospital.isofhCareValue}</Text>
                        </View>
                        <View style={styles.containerInfo}>
                            <Text style={styles.txtName}>{hospital.name}</Text>
                            <Text style={styles.txtPhone}>S??T: <Text style={styles.txtPhoneUser}>{this.props.userApp.currentUser.phone}</Text></Text>
                            <Text style={styles.txtPhone}>Ng??y sinh: <Text style={styles.txtDateUser}>{info.bod}</Text></Text>
                            <Text numberOfLines={2} style={styles.txtAddress}>?????a ch???: {info.address}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    headerComponent = () => {
        return (
            !this.state.loading && (!this.state.data || this.state.data.length == 0) ?
                <View style={styles.containerNoneData}>
                    <Text style={styles.txtNoneData}>{constants.none_data}</Text>
                </View> : null
        )
    }
    keyExtractor = (item, index) => index.toString()
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.isShowContent ? (
                    <View style={styles.containerContent}>
                        <Text style={styles.txtContent}>{constants.msg.ehealth.please_wait_minutes_if_no_message}</Text>
                    </View>
                ) : null}
                <View style={styles.containerFlatlist}>


                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={styles.flex}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.loading}
                        data={this.state.data}
                        extraData={this.state}
                        ListHeaderComponent={this.headerComponent}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItems}
                    ></FlatList>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    txtNoneData: { fontStyle: 'italic' },
    containerNoneData: {
        alignItems: 'center',
        marginTop: 50
    },
    flex: { flex: 1 },
    containerFlatlist: {
        flex: 1,
        padding: 14
    },
    txtContent: {
        textAlign: 'center',
        color: '#000',
        fontSize: 14
    },
    containerContent: {
        width: '100%',
        marginBottom: 10,
        backgroundColor: "rgba(39, 174, 96, 0.18)",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    txtAddress: {
        fontSize: 14,
        marginTop: 5,
        flex: 1
    },
    txtDateUser: {
        fontWeight: 'bold',
        color: '#4A4A4A'
    },
    txtPhoneUser: {
        color: '#F05673',
        fontWeight: 'bold'
    },
    txtPhone: {
        fontSize: 14,
        marginTop: 5
    },
    txtName: { fontSize: 14 },
    containerInfo: {
        justifyContent: 'center',
        padding: 10,
        flex: 1
    },
    txtInfoUserHospital: {
        fontWeight: 'bold',
        color: '#27AE60',
        marginTop: 5,
        maxWidth: 50
    },
    placeHolderImage: {
        width: 60,
        height: 60,
        alignSelf: "center"
    },
    borderImage: {
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
    containerImage: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 15,
        paddingRight: 10
    },
    txtNumberHospital: {
        color: '#fff',
        fontSize: 14
    },
    buttonNumberHospital: {
        borderRadius: 12,
        backgroundColor: '#0A9BE1',
        paddingVertical: 3,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtFullName: {
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 14
    },
    row: { flexDirection: 'row' },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        alignItems: 'center',
        borderBottomColor: "rgba(0, 0, 0, 0.06)",
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    txtNotiTime: {
        marginTop: 10,
        color: "#4a4a4a"
    },
    AcPanel: {
        flex: 1,
        backgroundColor: '#cacaca',
    },
    itemView: {
        borderRadius: 6,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(39, 174, 96, 0.42)",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 6,
        shadowOpacity: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#27ae60",
        marginVertical: 10
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        navigation: state.navigation
    };
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(TicketHistory);