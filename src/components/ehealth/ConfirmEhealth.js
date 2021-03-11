import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import dateUtils from 'mainam-react-native-date-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import { Card } from "native-base";
import constants from '@resources/strings';

class ConfirmEhealth extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let profile = this.props.profile
        return (
            <Card style={styles.viewItem}>
                <TouchableOpacity style={styles.btnItem} onPress={item.hospital.timeGoIn ? this.onPress.bind(this, item) : this.onDisable}>
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
                        <Text style={styles.txHospitalName}>{item.hospital.name}</Text>
                        <Text style={styles.txLastTime}>{constants.ehealth.lastTime}<Text>{item.hospital.timeGoIn ? item.hospital.timeGoIn.toDateObject('-').format('dd/MM/yyyy') : ''}</Text></Text>
                    </View>
                </TouchableOpacity>
            </Card>
        );
    }
}
const styles = StyleSheet.create({
    image: { width: 60, height: 60 },
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
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking,
        profile: state.profile

    };
}
export default connect(mapStateToProps)(ConfirmEhealth);