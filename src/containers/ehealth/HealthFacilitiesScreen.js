import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import bookingProvider from "@data-access/booking-provider";
import { connect } from "react-redux";
import ActivityPanel from "@components/ActivityPanel";
import dateUtils from "mainam-react-native-date-utils";
import ScaledImage from "mainam-react-native-scaleimage";
import LinearGradient from 'react-native-linear-gradient'

class HealthFacilitiesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHospital: [{
                name: 'Bệnh viện E',
                time: '3/8/2019',
                logo: 'http://www.benhvien115.com.vn/data/logo_footer_Benhviennhandan115.jpg'
            }]
        }
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity  onPress={ () =>alert('ssa')}>
            <LinearGradient    
                                colors={['#FF913D', '#FF682F', '#FF6137',]}
                                locations={[0, 0.7, 1]}
                                style={styles.viewItem} >
                <View style={{justifyContent:'center',alignItems:'center'}}><ScaledImage height={60} width={60} style={{borderRadius: 30,borderWidth: 0.5,borderColor:'#27AE60',}} uri={item.logo}></ScaledImage></View>
                <View style={{paddingHorizontal:15,}}>
                <Text style={{fontWeight:'bold',color:'#fff'}}>{item.name}</Text>
                <Text style={{color:'#fff'}}>Lần gần nhất: {item.time}</Text>
                </View>
                </LinearGradient>
                </TouchableOpacity>
        )
    }
    render() {
        return (
            <ActivityPanel
                iosBarStyle={'dark-content'}
                backButton={<TouchableOpacity style={{ marginLeft: 2.5, padding: 5 }}><ScaledImage height={30} width={25} source={require('@images/new/ehealth/ic_back_write.png')}></ScaledImage></TouchableOpacity>}
                statusbarBackgroundColor="#27AE60"
                titleStyle={{ color: '#fff' }}
                actionbarStyle={{ backgroundColor: '#27AE60' }}
                title="Y BẠ ĐIỆN TỬ"
                style={styles.container}
            >
                <View style={{
                    paddingHorizontal: 10,flex:1
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
    viewItem:{flexDirection:'row',justifyContent:'flex-start',paddingVertical:10,paddingHorizontal:10,borderRadius:5},

});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps)(HealthFacilitiesScreen);
