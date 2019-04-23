import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet,ScrollView, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import { Card } from 'native-base';

class CreateProfile extends Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {
        return (
            <ActivityPanel style={styles.AcPanel} title="Thêm hồ sơ" iosBarStyle={'light-content'}
                backButton={<TouchableOpacity><Text style={styles.btnhuy}>Huỷ</Text></TouchableOpacity>}
                statusbarBackgroundColor="rgb(247,249,251)"
                containerStyle={{
                    backgroundColor: "rgb(247,249,251)"
                }}
                titleStyle={{marginLeft: 55}}
                menuButton={<TouchableOpacity><Text style={styles.btnmenu}>Lưu</Text></TouchableOpacity>}
                actionbarStyle={{
                    backgroundColor: 'rgb(247,249,251)'
                }}>
<ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.avatar}>
                            {/* <ScaleImage style={styles.ic_avatar} height={70} source={require("@images/new/CarterCrew_circle.png")} />  
                            <ScaleImage style={styles.ic_icon} height={15} source={require("@images/new/ic_account_add.png")} />   */}
                        </View>
                    </View>
                    <View style={styles.view1}>
                        <Text style={styles.textho1}>Họ</Text>
                        <Text style={styles.textho2}>Nguyễn Thị</Text>
                    </View>
                    <View style={styles.view1}>
                        <Text style={styles.textho1}>Tên</Text>
                        <Text style={styles.textho2}>Hằng</Text>
                    </View>
                    <View style={styles.view2}>
                        <Text style={styles.textho1}>Giới tính</Text>
                        <Text style={styles.textho2}>Nữ</Text>
                        {/* <ScaleImage style={styles.next} height={11} source={require("@images/new/ic_next.png")} /> */}
                    </View>
                    <View style={styles.view2}>
                        <Text style={styles.textho1}>Ngày sinh</Text>
                        <Text style={styles.textho2}>29-12-1994</Text>
                        {/* <ScaleImage style={styles.next} height={11} source={require("@images/new/ic_next.png")} /> */}
                    </View>
                    <View style={styles.view3}>
                        <Text style={styles.textho1}>Email</Text>
                        <Text style={styles.textho2}>huongnt@isofh.com</Text>
                    </View>
                        <Text style={styles.textbot}>Vui lòng nhập email với người trên 16 tuổi</Text>
                </View>
                </ScrollView>
            </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
const styles = StyleSheet.create({
    AcPanel: {
        flex: 1,
        backgroundColor: 'rgb(247,249,251)',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgb(247,249,251)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.07)'
    },
    btnhuy:{
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        marginLeft:10
    },
    header:{alignItems:'center'},
    avatar: {
        alignItems:'center',
        paddingTop:20,
        width:70
        
    },
    add: {
        position:'absolute',
  
    },
    view1: {
        backgroundColor: 'rgb(255,255,255)',
        position: 'relative',
        top: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)'
    },
    textho1: {
        padding: 10,
        fontSize: 17,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"
    },
    textho2: {
        position: 'absolute',
        top: 10,
        right: 40,
        fontSize: 17,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
    },
    view2: {
        backgroundColor: 'rgb(255,255,255)',   
        top: 40,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)'
    },
    next: {
        position: 'absolute',
        top: 17,
        right: 25
    },
    view3: {
        backgroundColor: 'rgb(255,255,255)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
        
        top: 60,
    },
    textbot: {
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0.2,
        color: "#4a4a4a",
        position:'relative',
        top:70,
        padding:10
    },
    btnmenu:{
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#0a7ffe",
        marginRight: 35,
    },
    ic_icon:{
        position:'absolute',
        bottom:0,
        right:8
    }
   
   
    
})
export default connect(mapStateToProps)(CreateProfile);