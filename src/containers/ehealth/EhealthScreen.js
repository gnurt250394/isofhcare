import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Dimensions
} from "react-native";
import clientUtils from '@utils/client-utils';
import bookingProvider from "@data-access/booking-provider";
import { connect } from "react-redux";
import ActivityPanel from "@components/ActivityPanel";
import ScaledImage from "mainam-react-native-scaleimage";
import LinearGradient from 'react-native-linear-gradient'
import dateUtils from 'mainam-react-native-date-utils';
import hospitalProvider from '@data-access/hospital-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import { Card } from "native-base";
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';

class EhealthScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHospital: [],
            isLongPress: false,
            index: '',
            refreshing: false
        }
    }
    componentDidMount() {
        this.onRefresh()
    }
    onGetHospital = () => {
        hospitalProvider.getHistoryHospital2().then(res => {
            if (res.code == 0) {
                this.setState({
                    listHospital: res.data,
                    refreshing: false
                })
            } else {
                this.setState({
                    refreshing: false
                })
            }

        }).catch(err => {
            this.setState({
                refreshing: false
            })
        })
    }
    onRefresh = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.onGetHospital()
        })
    }
    onPress = (item) => {
        this.props.dispatch({ type: constants.action.action_select_hospital_ehealth, value: item })
        this.props.navigation.navigate('listProfile');
    }
    onDisable = () => {
        snackbar.show('Bạn chưa có lần khám gần nhất tại bệnh viện này', 'danger')
    }
    onAddEhealth = () => {
        this.props.navigation.navigate('selectLocationEhealth')
        // let hospitalId = this.props.ehealth.hospital.hospital.id
        // this.props.navigation.navigate('addNewEhealth', {
        //     hospitalId: hospitalId
        // })
    }
    renderItem = ({ item, index }) => {
        const source = item.hospital && item.hospital.avatar ? { uri: item.hospital.avatar.absoluteUrl() } : require("@images/new/user.png");

        return (
            <Card style={styles.viewItem}>
                <TouchableOpacity style={styles.btnItem} onPress={item.hospital.timeGoIn ? this.onPress.bind(this, item) : this.onDisable}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={styles.imageStyle}
                        borderRadius={30}
                        customImagePlaceholderDefaultStyle={[styles.avatar, { width: 60, height: 60 }]}
                        placeholderSource={require("@images/new/user.png")}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={styles.imgLoad}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={60} height={60} />
                        }}
                    />
                    <View style={styles.viewTx}>
                        <Text style={styles.txHospitalName}>{item.hospital.name}</Text>
                        <Text style={styles.txLastTime}>{constants.ehealth.lastTime}<Text>{item.hospital.timeGoIn ? item.hospital.timeGoIn.toDateObject('-').format('dd/MM/yyyy') : ''}</Text></Text>
                    </View>
                </TouchableOpacity>
            </Card>
        )
    }
    onBackClick = () => {
        this.props.navigation.pop()
    }
    render() {
        return (
            <ActivityPanel
                title={constants.title.ehealth}
                style={styles.container}
            >
                <View style={styles.viewContent} >
                    <TouchableOpacity onPress={this.onAddEhealth} style={styles.btnAddEhealth}><Text style={styles.txAddEhealth}>Thêm mới kết quả khám</Text></TouchableOpacity>
                    <Text style={styles.txHeader}>{constants.ehealth.ehealth_location}</Text>
                    <View style={styles.viewFlatList}>
                        <FlatList
                            data={this.state.listHospital}
                            extraData={this.state}
                            renderItem={this.renderItem}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={() => !this.state.refreshing && (!this.state.listHospital || this.state.listHospital.length == 0) ?
                                <View style={styles.viewTxNone}>
                                    <Text style={styles.viewTxTime}>{constants.ehealth.not_result_ehealth_location}</Text>
                                </View> : null
                            }
                        > </FlatList></View>
                </View>

            </ActivityPanel>
        );
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    txHeader: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    viewItem: { flexDirection: 'row', justifyContent: 'flex-start', padding: 10, borderRadius: 5 },
    btnItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    imgLoad: {
        alignSelf: 'center',
        borderRadius: 30,
        width: 60,
        height: 60
    },
    imageStyle: {
        borderRadius: 30, borderWidth: 0.5, borderColor: '#27AE60',
    },
    viewTx: { marginLeft: 10 },
    txHospitalName: { fontWeight: 'bold', color: '#5A5956', fontSize: 15 },
    txLastTime: { color: '#5A5956', marginTop: 5 },
    
    viewContent: {
        paddingHorizontal: 10, flex: 1        
    },
    viewFlatList: { flex: 1 },
    viewTxNone: { alignItems: 'center', marginTop: 50 },
    viewTxTime: { fontStyle: 'italic' },
    btnAddEhealth: {
        borderRadius: 5,
        backgroundColor: '#02C39A',
        justifyContent: 'center',
        alignItems: 'center',
        height: 41,
        marginVertical: 10,
        marginHorizontal: 5
    },
    txAddEhealth: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    }



});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps)(EhealthScreen);
