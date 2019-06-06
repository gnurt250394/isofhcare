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
import profileProvider from '@data-access/profile-provider';

class DemoModalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{
                name: 'Bệnh viện E',
                time: '3/8/2019',
                logo: 'http://www.benhvien115.com.vn/data/logo_footer_Benhviennhandan115.jpg'
            }],
            isShow:false
        }
    }
    showList = () => {
        this.setState({
            isShow:true
        })
    }
   componentDidMount (){
       this.onGetList()
   }
   onGetList = () => {
    profileProvider.getProfileFamily().then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
   }
    _renderItem =({item}) => {
       <View style={{flex:1}}><Text>{item.name}</Text></View>
    }

    render() {
        return (
            <ActivityPanel
                iosBarStyle={'dark-content'}
                backButton={<TouchableOpacity onPress = {()=> this.props.navigation.pop()} style={{ marginLeft: 2.5, padding: 5 }}><ScaledImage height={30} width={25} source={require('@images/new/ehealth/ic_back_write.png')}></ScaledImage></TouchableOpacity>}
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
                    <View>
                              <TouchableOpacity
                                    onPress={this.showList}
                                    style={[styles.button, { width: 200 }]}>
                                    <Text>{this.state.name || '-- Chọn loại nhà --'}</Text>
                              </TouchableOpacity>
                              {this.state.isShow ?

                                    <FlatList
                                          data={this.state.data}
                                          renderItem={this._renderItem}
                                          style={[styles.contentStyle, { width: 200,height:300 }]}
                                          keyExtractor={(item,index) => index.toString()}
                                          
                                    />
                                    :
                                    null}
                        </View>
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
    contentStyle: {
        position: 'absolute',
        maxHeight: 120,
        zIndex: 3,
        top: 38,
        alignSelf: 'center',
        width: this.props,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight:10,
        shadowColor: '#111111',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        elevation: 3,
  },
  button: {
    height: 38,
    width: '50%',
    borderColor:'gray',
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
},
    viewItem:{flexDirection:'row',justifyContent:'flex-start',paddingVertical:10,paddingHorizontal:10,borderRadius:5},

});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps)(DemoModalScreen);
