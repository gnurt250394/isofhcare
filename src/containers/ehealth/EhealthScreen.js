import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
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
    onLongPress = (index) => {
        this.setState({
            isLongPress: true,
            index: index
        })
        this.props.navigation.navigate('DemoModalScreen')

    }
    onRefresh = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.onGetHospital()
        })
    }
    onPress = () => {
        this.props.navigation.navigate('DemoModalScreen')
    }
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ marginTop: 10 }} onPress={this.onPress} onLongPress={() => this.onLongPress(index)}>
                {
                    this.state.isLongPress && this.state.index == index ? (
                        <LinearGradient
                            colors={['#FF913D', '#FF682F', '#FF6137',]}
                            locations={[0, 0.7, 1]}
                            style={styles.viewItem} >
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}><ScaledImage height={60} width={60} style={{ borderRadius: 30, borderWidth: 0.5, borderColor: '#27AE60', }} uri={item.hospital.avatar.absoluteUrl()}></ScaledImage></View>
                            <View style={{ paddingHorizontal: 15, }}>
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>{item.hospital.name}</Text>
                                <Text style={{ color: '#fff' }}>Lần gần nhất: {item.hospital.timeGoIn.toDateObject('-').format('dd-MM-yyyy')}</Text>
                            </View>
                        </LinearGradient>
                    ) : (
                            <View style={[styles.viewItem, { borderWidth: 1, borderColor: '#D5D9DB' }]}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}><ScaledImage height={60} width={60} style={{ borderRadius: 30, borderWidth: 0.5, borderColor: '#27AE60', }} uri={item.hospital.avatar.absoluteUrl()}></ScaledImage></View>
                                <View style={{ paddingHorizontal: 15, }}>
                                    <Text style={{ fontWeight: 'bold', color: '#5A5956' }}>{item.hospital.name}</Text>
                                    <Text style={{ color: '#5A5956' }}>Lần gần nhất: {item.hospital.timeGoIn.toDateObject('-').format('dd-MM-yyyy')}</Text>
                                </View>
                            </View>
                        )
                }
            </TouchableOpacity>
        )
    }
    onBackClick = () => {
        this.props.navigation.pop()
    }
    render() {
        return (
            <ActivityPanel
                iosBarStyle={'dark-content'}
                icBack = {require('@images/new/left_arrow_white.png')}
                titleStyle={{ color: '#fff' }}
                actionbarStyle={{ backgroundColor: '#27AE60' }}
                title="Y BẠ ĐIỆN TỬ"
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
                    paddingHorizontal: 10, flex: 1
                }} >
                    <Text style={styles.txHeader}>Các cơ sở y tế đã khám</Text>
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
                                    <Text style={{ fontStyle: 'italic' }}>Hiện tại chưa có thông tin</Text>
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
        marginVertical: 15
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
