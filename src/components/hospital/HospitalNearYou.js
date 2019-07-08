import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ImageBackground } from 'react-native';
import HeaderLine from '@components/home/HeaderLine'
import ScaledImage from 'mainam-react-native-scaleimage';


class HospitalNearYou extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (
            <View style={{ backgroundColor: '#fff' }}>
                <HeaderLine onPress={this.onShowInfo} isShowViewAll={true} title={Dimensions.get("window").width <= 375 ? 'PHÒNG KHÁM,\nBỆNH VIỆN GẦN BẠN' : 'PHÒNG KHÁM, BỆNH VIỆN GẦN BẠN'} />

                <View style={styles.viewNotLocation}>
                    <ImageBackground style={styles.imgNotLocation} source={require('@images/new/home/ic_img_location.png')}>
                    <View style={styles.viewBtn}>
                    <Text style= {styles.txOpenLocation}>Vui lòng bật vị trí để sử dụng tính năng này</Text>
                        <TouchableOpacity style={styles.btnOpenLocation}><ScaledImage height={20} source = {require('@images/new/home/ic_location.png')}></ScaledImage><Text style={{color:'#fff',marginLeft:5}}>Bật ngay</Text></TouchableOpacity>
                    </View>
                    </ImageBackground>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    viewNotLocation:{
        backgroundColor: '#fff',paddingHorizontal:8
    },
    imgNotLocation:{ width: "100%", height: 164,justifyContent:'flex-end' },
    viewBtn:{backgroundColor:'rgba(0, 0, 0, 0.5)',marginHorizontal:20,paddingVertical:10,marginBottom:5,borderRadius:5,justifyContent:'center',alignItems:'center'},
    btnOpenLocation:{justifyContent:'center',alignItems:'center',flexDirection:'row',borderRadius:5,backgroundColor:'#4BBA7B',padding:5,width:100,marginTop:10},
    txOpenLocation:{color:'#fff',fontStyle:'italic'}
});
export default HospitalNearYou;