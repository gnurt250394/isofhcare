import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
class LoginScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Y BẠ ĐIỆN TỬ" showFullScreen={true}>
                <ScrollView style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                    }}>
                        <View style={{ width: 18, height: 18, backgroundColor: "#00977c", borderRadius: 9, marginRight: 10 }} />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            color: "#9b9b9b"
                        }}>Bệnh viện</Text>
                    </View>
                    <View style={{
                        marginLeft: 28, borderRadius: 4,
                        borderStyle: "solid",
                        borderWidth: 1,
                        padding: 10,
                        marginTop: 13,
                        borderColor: "#3160ac"
                    }}>
                        <Text>Tất cả bệnh viện</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', marginTop: 20
                    }}>
                        <View style={{ width: 18, height: 18, backgroundColor: "#00977c", borderRadius: 9, marginRight: 10 }} />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            color: "#9b9b9b"
                        }}>Bệnh viện</Text>
                    </View>
                </ScrollView>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(LoginScreen);