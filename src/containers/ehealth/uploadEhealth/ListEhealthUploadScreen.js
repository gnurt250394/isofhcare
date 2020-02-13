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
import connectionUtils from '@utils/connection-utils';
import ehealthProvider from '@data-access/ehealth-provider';

class ListEhealthUpload extends Component {
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
    onGetEhealth = () => {
        ehealthProvider.uploadEhealth().then(res => {
            console.log(res, 'rrsssss')
            if (res && res.code == 200) {
                // this.props.navigation.pop()
                this.setState({
                    listEhealth: res.data,
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
            this.onGetEhealth()
        })
    }
    onPress = (item) => {
        // this.props.dispatch({ type: constants.action.action_select_hospital_ehealth, value: item })
        this.props.navigation.navigate('detailsEhealth', { id: item.id });
    }
    onDisable = () => {
        snackbar.show(constants.msg.ehealth.not_examination_at_hospital, 'danger')
    }
    onAddEhealth = () => {
        connectionUtils.isConnected().then(s => {
            this.props.navigation.navigate("selectHospital", {
                hospital: this.state.hospital,
                onSelected: (hospital) => {
                    // alert(JSON.stringify(hospital))
                    setTimeout(() => {
                        this.props.navigation.navigate('addNewEhealth', { hospital: hospital })
                    }, 300);
                }
            })
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        });
    }
    renderItem = ({ item, index }) => {
        const source = item.hospital && item.hospital.avatar ? { uri: item.hospital.avatar.absoluteUrl() } : require("@images/new/user.png");

        return (
            <Card style={styles.viewItem}>
                <TouchableOpacity style={styles.btnItem} onPress={item.timeGoIn ? this.onPress.bind(this, item) : this.onDisable}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={styles.imageStyle}
                        borderRadius={30}
                        customImagePlaceholderDefaultStyle={[styles.avatar, styles.image]}
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
                        <Text style={styles.txHospitalName}>{item.hospitalName}</Text>
                        <Text style={styles.txServiceName}>{item.medicalServiceName}</Text>
                        <Text style={styles.txLastTime}>{constants.ehealth.lastTime}<Text>{item.timeGoIn ? item.timeGoIn.toDateObject('-').format('dd/MM/yyyy') : ''}</Text></Text>
                    </View>
                </TouchableOpacity>
            </Card>
        )
    }
    onBackClick = () => {
        this.props.navigation.pop()
    }
    keyExtractor = (item, index) => index.toString()
    headerComponent = () => {
        return (!this.state.refreshing && (!this.state.listEhealth || this.state.listEhealth.length == 0) ?
            <View style={styles.viewTxNone}>
                <Text style={styles.viewTxTime}>{constants.ehealth.not_result_ehealth_location}</Text>
            </View> : null
        )
    }
    onUploadEhealth = () => {
        this.props.navigation.navigate('createEhealth')
    }
    render() {
        return (
            <ActivityPanel
                title={constants.title.ehealth}
                style={styles.container}
            >
                <View style={styles.viewContent} >
                    <View style={styles.viewFlatList}>
                        <FlatList
                            data={this.state.listEhealth}
                            extraData={this.state}
                            renderItem={this.renderItem}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={this.keyExtractor}
                            ListHeaderComponent={this.headerComponent}
                        > </FlatList>
                    </View>

                </View>
                <View style={{ height: 50 }}></View>
            </ActivityPanel>
        );
    }


}
const styles = StyleSheet.create({
    image: { width: 60, height: 60 },
    container: {
        flex: 1,
    },
    txHeader: {
        marginVertical: 20,
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold'
    },
    txBottom: {
        marginVertical: 20,
        fontSize: 16,
        color: '#3161AD',
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
    txServiceName: { color: '#5A5956', fontSize: 14 },
    txLastTime: { color: '#5A5956', marginTop: 5 },

    viewContent: {
        paddingHorizontal: 10, flex: 1
    },
    // viewFlatList: { flex: 1 },
    viewTxNone: { alignItems: 'center', marginTop: 50 },
    viewTxTime: { fontStyle: 'italic' },
    btnAddEhealth: {
        borderRadius: 5,
        backgroundColor: '#02C39A',
        justifyContent: 'center',
        alignItems: 'center',
        height: 51,
        marginTop: 30,
        marginHorizontal: 25,
        borderRadius: 10

    },
    btnUploadEhealth: {
        borderRadius: 5,
        backgroundColor: '#3161AD',
        justifyContent: 'center',
        alignItems: 'center',
        height: 51,
        marginTop: 10,
        marginHorizontal: 25,
        borderRadius: 10
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
export default connect(mapStateToProps)(ListEhealthUpload);
