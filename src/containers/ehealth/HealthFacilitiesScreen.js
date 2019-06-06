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

class HealthFacilitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHospital: [],
            isLongPress: false,
            index:''
        }
    }
    componentDidMount() {
        this.onGetHospital()
    }
    onGetHospital = () => {
        hospitalProvider.getHistoryHospital2().then(res => {
            this.setState({
                listHospital:res.data
            })
        }).catch(err => {
        })
    }
    onLongPress = (index) => {
        this.setState({
            isLongPress: true,
            index:index
        })
        this.props.navigation.navigate('DemoModalScreen')

    }
    onPress = () => {
        this.props.navigation.navigate('DemoModalScreen')
    }
    renderItem = ({ item ,index}) => {
        console.log(item);
        return (
            <TouchableOpacity style ={{marginTop:10}} onPress = {this.onPress} onLongPress={() => this.onLongPress(index)}>
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
                backButton={<TouchableOpacity onPress={this.onBackClick} style={{ marginLeft: 2.5, padding: 5 }}><ScaledImage height={30} width={25} source={require('@images/new/ehealth/ic_back_write.png')}></ScaledImage></TouchableOpacity>}
                titleStyle={{ color: '#fff' }}
                actionbarStyle={{ backgroundColor: '#27AE60' }}
                title="Y BẠ ĐIỆN TỬ"
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
                            keyExtractor={(item, index) => index.toString()}

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
export default connect(mapStateToProps)(HealthFacilitiesScreen);
