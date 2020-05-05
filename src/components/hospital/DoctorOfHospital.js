import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList
} from "react-native";
import { connect } from "react-redux";
import { Card } from 'native-base'
import bookingDoctorProvider from '@data-access/booking-doctor-provider'
import { withNavigation } from 'react-navigation'
import ItemDoctorOfHospital from "@components/booking/specialist/ItemDoctorOfHospital";
class DoctorOfHospital extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            item: {},
            listDoctor: [],
            page: 0,
            size: 20,
        };
    }
    componentDidMount() {
        this.getDoctor()
    }

    getDoctor = () => {
        const { page, size } = this.state
        let idDoctor = this.props.idDoctor
        bookingDoctorProvider.getListDoctorWithHospital(idDoctor, page, size).then(res => {
            if (res && res.length) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        }).catch((err) => {
            this.formatData([])

        })
    }
    formatData = (data) => {
        if (data.length == 0) {
            if (this.state.page == 0) {
                this.setState({ listDoctor: [] })
            }
        } else {
            if (this.state.page == 0) {
                this.setState({ listDoctor: data })
            } else {
                this.setState(preState => {
                    return { listDoctor: [...preState.listDoctor, ...data] }
                })
            }
        }
    }

    addBookingDoctor = (item) => () => {
        // alert('dddd')
        // return
        this.props.navigation.navigate('selectTimeDoctor', {
            item,
            isNotHaveSchedule: true,
        })
    }
    detailDoctor = (item) => () => {
        this.props.navigation.navigate('detailsDoctor', {
            item,
            disableBooking: this.state.disableBooking
        })
    }
    _renderItemDoctor = ({ item, index }) => {

        return (
            <ItemDoctorOfHospital
                disableBooking={this.state.disableBooking}
                item={item}
                onPressDoctor={this.detailDoctor(item)}
                onPress={this.addBookingDoctor(item)}
            />
        )
    }
    _keyExtractor = (item, index) => `${item.id || index}`

    render() {
        return (
            <FlatList
                data={this.state.listDoctor}
                renderItem={this._renderItemDoctor}
                keyExtractor={this._keyExtractor}
                extraData={this.state}
            />
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
        // fontWeight: 'bold'
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
        // fontWeight: '700'
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
        borderRadius: 5,
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
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 8,
        // fontStyle: 'italic',
        fontWeight: 'bold'
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
    imgDefault: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderColor: '#00CBA7',
        borderWidth: 0.2
    },
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
        borderRadius: 5
    },
});
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        navigation: state.navigation

    };
}
export default connect(mapStateToProps)(withNavigation(DoctorOfHospital));
