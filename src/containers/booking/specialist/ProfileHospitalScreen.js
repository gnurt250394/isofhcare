import React, { Component } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    FlatList
} from "react-native";
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from "mainam-react-native-select-image";
import ImageLoad from "mainam-react-native-image-loader";
import connectionUtils from "@utils/connection-utils";
import dateUtils from "mainam-react-native-date-utils";
import StarRating from 'react-native-star-rating';
import userProvider from '@data-access/user-provider';
import questionProvider from '@data-access/question-provider';
import { Card } from 'native-base'
import Button from "@components/booking/doctor/Button";
import constants from '@resources/strings'
import bookingDoctorProvider from '@data-access/booking-doctor-provider'
import Modal from "@components/modal";
import snackbar from '@utils/snackbar-utils';
import ItemDoctorOfHospital from "../../../components/booking/specialist/ItemDoctorOfHospital";

const dataRate = [
    { id: 1, name: 'Lê Hùng', rate: 4, message: 'Bác sĩ rất ...' },
    { id: 2, name: 'Lê Hùng', rate: 4.5, message: 'Bác sĩ rất ...' },
    { id: 3, name: 'Lê Hùng', rate: 3, message: 'Bác sĩ rất ...' },
    { id: 4, name: 'Lê Hùng', rate: 5, message: 'Bác sĩ rất ...' },
]
const listDoctor = [
    {
        id: 1,
        name: 'PGS Bác sĩ ',
        specializations: [
            {
                id: 1,
                name: 'Da liễu'
            },
            {
                id: 2,
                name: 'Răng hàm mặt'
            },
            {
                id: 3,
                name: 'Răng hàm mặt'
            },
        ],
        rating: 2,
        imagePath: ''
    },
    {
        id: 2,
        name: 'PGS Bác sĩ 2',
        specializations: [
            {
                id: 1,
                name: 'Da liễu'
            }
        ],
        rating: 2,
        imagePath: ''
    },
]
class ProfileHospitalScreen extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            nameSpecialist: '',
            certificateCode: '',
            intro: '',
            rating: 0,
            isLoading: true,
            avatar: '',
            id: '',
            profileHospital: {},
            item: {},
            isVisible: false,
            showProfile: false,
            showRating: false
        };
    }
    componentDidMount() {
        this.getDetails()
    }
    getDetails = () => {
        const item = this.props.navigation.getParam('item', {})
        let id = item && item.id
        bookingDoctorProvider.detailDoctor(id).then(s => {
            if (s) {
                this.setState({ profileHospital: s, isLoading: false })
            }
        }).catch(e => {
            if (e) {
                this.setState({
                    isLoading: false
                })
            }
        })
    }

    addBooking = () => {
        this.props.navigation.navigate('selectTimeDoctor', {
            item: this.state.profileHospital,
            isNotHaveSchedule: true,
            schedules: this.state.profileHospital.schedules
        })
    }
    goToMap = () => {
        this.props.navigation.navigate("mapHospital", {
            item: this.state.profileHospital
        });
    }

    addBookingDoctor = (item) => () => {
        this.props.navigation.navigate('selectTimeDoctor', {
            item: this.state.profileHospital,
            isNotHaveSchedule: true,
            schedules: this.state.profileHospital.schedules
        })
    }
    _renderItemDoctor = ({ item, index }) => {

        return (
            <ItemDoctorOfHospital
                item={item}
                onPress={this.addBookingDoctor(item)}
            />
        )
    }
    _renderItem = ({ item, index }) => {
        return (
            <View style={[styles.containerItem,]}>
                <Text style={styles.txtName}>{item.name}</Text>
                <StarRating
                    disabled={true}
                    starSize={11}
                    containerStyle={{ width: '20%' }}
                    maxStars={5}
                    rating={item.rate}
                    starStyle={{ margin: 1, marginVertical: 7 }}
                    fullStarColor={"#fbbd04"}
                    emptyStarColor={"#fbbd04"}
                    fullStar={require("@images/ic_star.png")}
                    emptyStar={require("@images/ic_empty_star.png")}
                />
                {/* <Text numberOfLines={2}>{item.message}</Text> */}
            </View>
        )
    }
    renderPosition = (item) => {
        switch (item.position) {
            case 'Director': return 'Giám đốc'
            case 'ViceDirector': return 'Phó Giám đốc'
            case 'Manager': return 'Trưởng phòng'
            case 'DeputyManager': return 'Phó phòng'
            case 'HeadOfDepartment': return 'Trưởng khoa'
            case 'DeputyOfDepartment': return 'Phó khoa'
            case 'DepartmentChief': return 'Phụ trách khoa'
            case 'HeadNurse': return 'Điều dưỡng trưởng'
            case 'Nursing': return 'Y tá'
            case 'ChiefMedicalTechnician': return 'Kỹ thuật y trưởng'
            default: return ''
        }
    }
    ratingDoctor = () => {
        // snackbar.show('Chức năng đang phát triển')
        // return
        this.props.navigation.navigate('ratingDoctor')
    }
    _keyExtractor = (item, index) => `${item.id || index}`
    onBackdropPress = () => { this.setState({ isVisible: false }) }
    showProfile = (state) => () => {
        this.setState({ [state]: !this.state[state] })
    }
    showMapHospital=()=>{
        snackbar.show('Chức năng đang phát triển')
    }
    render() {
        const icSupport = require("@images/new/user.png");
        const { profileHospital } = this.state
        const source = profileHospital && profileHospital.imagePath
            ? { uri: profileHospital.imagePath.absoluteUrl() }
            : icSupport;

        return (
            <ActivityPanel
                title={'Thông tin cơ sở y tế'}
                isLoading={this.state.isLoading}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode='on-drag'
                    style={styles.scroll}>
                    <View style={{
                        padding: 10,
                    }}>
                        {/** profile doctor */}
                        <Card style={styles.viewImgUpload}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                <ImageLoad
                                    resizeMode="cover"
                                    imageStyle={styles.boderImage}
                                    borderRadius={45}
                                    customImagePlaceholderDefaultStyle={styles.imgPlaceHoder}
                                    placeholderSource={icSupport}
                                    style={styles.avatar}
                                    loadingStyle={{ size: "small", color: "gray" }}
                                    source={source}
                                    defaultImage={() => {
                                        return (
                                            <ScaleImage
                                                resizeMode="cover"
                                                source={icSupport}
                                                width={70}
                                                style={styles.imgDefault}
                                            />
                                        );
                                    }}
                                />
                                <View style={{ paddingLeft: 10, flex: 1 }}>
                                    <Text style={styles.nameDoctor}>{profileHospital.academicDegree}.{profileHospital.name}</Text>
                                    <Text style={{ paddingBottom: 10 }}>{this.renderPosition(profileHospital)}</Text>
                                    <View style={styles.containerButton}>
                                        <Button label="Đặt khám" style={styles.txtBooking} onPress={this.addBooking} source={require("@images/ic_service.png")} />
                                        <Button label="Xem bản đồ" style={styles.txtAdvisory} textStyle={{ color: '#00A3FF' }} onPress={this.goToMap} />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.groupQuantityBooking}>
                                    <Text>{constants.booking.quantity_booking}</Text>
                                    <Text style={styles.rating}>{profileHospital.appointments}</Text>
                                </View>
                                <TouchableOpacity onPress={this.ratingDoctor} style={styles.groupRating}>
                                    <Text>{constants.booking.rating}</Text>
                                    <Text style={[styles.rating, { color: '#00CBA7' }]}>{profileHospital.average ? profileHospital.average : 0}</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                        {/** */}

                        <Card style={styles.containerInfo}>
                            <TouchableOpacity
                                onPress={this.showProfile('showProfile')}
                                style={[styles.buttonProfile]}>
                                <Text style={styles.txtTitle}>THÔNG TIN CƠ SỞ Y TẾ</Text>
                                <ScaleImage source={require('@images/new/booking/ic_next.png')} height={15} style={{
                                    transform: [{ rotate: this.state.showProfile ? '90deg' : '0deg' }]
                                }} />
                            </TouchableOpacity>
                            {this.state.showProfile ?
                                <View style={styles.containerProfile}>
                                    <TouchableOpacity onPress={this.showMapHospital}>
                                        <Text style={styles.txtMap}>Xem sơ đồ CSYT</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.colorBold}>Liên hệ</Text>
                                    <Text style={styles.txtPhone}>Số điện thoại: <Text style={styles.txtBold}>{'0987654321'}</Text></Text>
                                    <Text style={styles.txtPhone}>Email: <Text style={styles.txtBold}>{'email@.com'}</Text></Text>
                                    <Text style={styles.txtPhone}>Website: <Text style={styles.txtBold}>{'website.com'}</Text></Text>
                                    <Text style={styles.txtPhone}>Fanpage: <Text style={styles.txtBold}>{'fanpage.com'}</Text></Text>
                                    <Text style={styles.colorBold}>Giới thiệu chung</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {profileHospital.specializations && profileHospital.specializations.length > 0 ?
                                            profileHospital.specializations.map((e, i) => {
                                                return (
                                                    <Text style={styles.txtPosition} key={i}>{e.name}{i == profileHospital.specializations.length - 1 ? '.' : ', '}</Text>
                                                )
                                            }) :
                                            null
                                        }
                                    </View>
                                    <Text style={styles.colorBold}>Dịch vụ thế mạnh</Text>
                                    <View style={styles.flex}>
                                        <View style={styles.flexRow}>
                                            <View style={{
                                                paddingLeft: 5,
                                            }}>
                                                <Text style={styles.txtPosition}>{profileHospital.experiences}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View> : null
                            }
                        </Card>
                        {/** */}

                        <Card style={styles.containerInfo}>
                            <TouchableOpacity
                                onPress={this.showProfile('showRating')}
                                style={[styles.buttonProfile]}>
                                <Text style={styles.txtTitle}>ĐÁNH GIÁ</Text>
                                <View style={styles.containerQuantityRating}>
                                    <Text style={styles.txtQuantityRating}>22 lượt</Text>
                                    <ScaleImage source={require('@images/new/booking/ic_next.png')} height={15} style={{
                                        transform: [{ rotate: this.state.showRating ? '90deg' : '0deg' }]
                                    }} />
                                </View>
                            </TouchableOpacity>
                            {this.state.showRating ?
                                <FlatList
                                    data={dataRate}
                                    renderItem={this._renderItem}
                                    keyExtractor={this._keyExtractor}
                                /> : null
                            }
                        </Card>

                        {/** */}
                        <Card style={styles.containerInfo}>
                            <View
                                style={[styles.buttonProfile]}>
                                <Text style={styles.txtTitle}>BÁC SĨ, CHUYÊN GIA Y TẾ HÀNG ĐẦU</Text>
                            </View>
                            <FlatList
                                data={listDoctor}
                                renderItem={this._renderItemDoctor}
                                keyExtractor={this._keyExtractor}
                            />
                        </Card>
                    </View>


                </ScrollView>
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    txtQuantityRating: {
        fontStyle: 'italic',
        paddingRight: 10
    },
    containerQuantityRating: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerProfile: {
        paddingLeft: 10,
        paddingBottom: 15,
    },
    txtMap: {
        color: '#3161AD',
        fontStyle: 'italic',
        textDecorationLine: 'underline'
    },
    txtBold: {
        fontWeight: 'bold'
    },
    txtPhone: {
        color: '#000'
    },
    buttonProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,

    },
    txtTitle: {
        color: '#00BA99',
        fontWeight: 'bold',

    },
    containerModal: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtDetail: {
        textDecorationLine: 'underline',
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 10
    },
    txtname: {
        color: '#000',
        fontWeight: 'bold'
    },
    txtPrice: {
        color: '#3161AD',
        paddingVertical: 5,
        fontWeight: '700'
    },
    buttonMessage: {
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    groupRating: {
        alignItems: 'center',
        paddingRight: 5,
        flex: 1
    },
    groupQuantityBooking: {
        alignItems: 'center',
        borderRightColor: '#ccc',
        borderRightWidth: 1,
        paddingRight: 5,
        flex: 1
    },
    txtName: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16
    },
    containerItem: {
        padding: 10,
        borderTopColor: '#ccc',
        borderTopWidth: 0.7
    },
    txtRate: {
        color: '#00CBA7',
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop: 9,
        paddingBottom: 7,
    },
    end: {
        backgroundColor: '#ccc',
        height: 0.6,
        width: '100%'
    },
    dots: {
        backgroundColor: '#00CBA7',
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 5,
        marginTop: 7
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    txtPosition: {
        color: '#000000',
        fontWeight: '700'
    },
    txtBooking: {
        // backgroundColor: '#00CBA7',
        marginLeft: 6,
    },
    txtAdvisory: {
        backgroundColor: '#FFF',
    },
    containerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginTop: 10,
        marginBottom: 10
    },
    backgroundHeader: {
        backgroundColor: '#27c8ad',
        height: '13%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    containerInfo: {
        flex: 1,
        marginVertical: 20,
        borderRadius: 10,
    },
    containerSeeDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtSeeDetails: {
        color: 'rgb(2,195,154)',
        textDecorationLine: 'underline',

    },
    hitSlopButton: {
        top: 10,
        bottom: 10,
        right: 10
    },
    buttonSeeDetail: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 3,
        paddingRight: 10
    },
    scroll: {
        flex: 1,
        paddingVertical: 5
    },
    txtButtonBooking: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    btnBooking: {
        backgroundColor: '#fbbd04',
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '30%',
        marginLeft: '10%',
        marginTop: 13
    },
    colorBold: {
        color: '#b3b3b3',
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 8,
        fontStyle: 'italic'
    },
    fontItalic: { fontStyle: 'italic' },
    rating: { color: '#000', fontWeight: 'bold' },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    nameDoctor: { fontSize: 16, color: '#000000', fontWeight: 'bold', paddingBottom: 5, },
    imgDefault: { width: 90, height: 90, alignSelf: "center" },
    boderImage: { borderRadius: 45, borderWidth: 2, borderColor: '#00CBA7' },
    avatar: { width: 90, height: 90, alignSelf: "flex-start", },
    imgPlaceHoder: {
        width: 90,
        height: 90,
        alignSelf: "center"
    },
    AcPanel: {
        flex: 1,
        backgroundColor: "rgb(247,249,251)"
    },
    viewBtn: {
        width: '70%',
        height: 41,
        borderRadius: 5,
        marginVertical: 20,
        backgroundColor: 'rgb(2,195,154)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewIntro: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewRating: {
        width: '100%',
        height: 100,
        backgroundColor: 'rgba(2,195,154,0.06)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewImgUpload: {
        padding: 10,
        borderRadius: 10
    },
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ProfileHospitalScreen);