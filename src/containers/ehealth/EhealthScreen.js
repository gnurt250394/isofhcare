import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    TouchableWithoutFeedback
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
        this.props.navigation.navigate('listProfile')
    }
    renderItem = ({ item, index }) => {
        const source = item.hospital && item.hospital.avatar ? { uri: item.hospital.avatar.absoluteUrl() } : require("@images/new/user.png");

        return (
            <TouchableOpacity style={{ marginTop: 10, }} onPress={this.onPress.bind(this, item)}>
                <View style={{
                    flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 10,

                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#d5d9db"
                }}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={{
                            borderRadius: 40, borderWidth: 0.5, borderColor: '#27AE60',
                        }}
                        borderRadius={40}
                        customImagePlaceholderDefaultStyle={[styles.avatar, { width: 80, height: 80 }]}
                        placeholderSource={require("@images/new/user.png")}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={{
                            alignSelf: 'center',
                            borderRadius: 40,
                            width: 80,
                            height: 80
                        }}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={80} height={80} />
                        }}
                    />
                    <View style={{ padding: 15, }}>
                        <Text style={{ fontWeight: 'bold', color: '#5A5956', fontSize: 15 }}>{item.hospital.name}</Text>
                        <Text style={{ color: '#5A5956', marginTop: 5 }}>{constants.ehealth.lastTime}<Text>{item.hospital.timeGoIn ? item.hospital.timeGoIn.toDateObject('-').format('dd/MM/yyyy') : ''}</Text></Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    onBackClick = () => {
        this.props.navigation.pop()
    }
    render() {
        return (
            <ActivityPanel
                icBack={require('@images/new/left_arrow_white.png')}
                titleStyle={{ color: '#fff' }}
                actionbarStyle={{ backgroundColor: '#27AE60' }}
                title={constants.title.ehealth}

                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#22b060"
                actionbarStyle={{
                    backgroundColor: '#22b060',
                    borderBottomWidth: 0
                }}

                titleStyle={{
                    color: '#FFF'
                }}
                style={styles.container}
            >
                <View style={{
                    paddingHorizontal: 10, flex: 1, backgroundColor: '#f0f5f9'
                }} >
                    <Text style={styles.txHeader}>{constants.ehealth.ehealth_location}</Text>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={this.state.listHospital}
                            extraData={this.state}
                            renderItem={this.renderItem}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={() => !this.state.refreshing && (!this.state.listHospital || this.state.listHospital.length == 0) ?
                                <View style={{ alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ fontStyle: 'italic' }}>{constants.ehealth.not_result_ehealth_location}</Text>
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
        fontSize: 18
    },
    viewItem: { flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5 },

});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps)(EhealthScreen);
