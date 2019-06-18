import React, { Component, PropTypes } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';

class Header extends Component {
    constructor(props) {
        super(props)
    }
    inDevelop() {
        snackbar.show(constants.msg.app.in_development);
    }

    render() {
        return (
            <View {...this.props} style={[{ paddingTop: 40, backgroundColor: 'white', position: 'relative', paddingBottom: 38, elevation: 5 }, this.props.style]} shadowColor='#000000' shadowRadius={1} shadowOpacity={0.1} shadowOffset={{ width: 0, height: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[{ flex: 1, fontWeight: '800', textAlign: 'center', fontSize: 18, position: 'absolute', left: 0, right: 0, top: 0 }, this.props.titleStyle]}>{this.props.title}</Text>
                    <TouchableOpacity style={{ paddingLeft: 17, position: 'absolute', top: -12, paddingRight: 17, paddingBottom: 10, paddingTop: 10 }} onPress={() => { Actions.userProfile() }}>
                        <ScaleImage height={24} source={require("@images/icprofile.png")} />
                    </TouchableOpacity>

                    {
                        this.props.userApp.currentUser.type == 4 || this.props.userApp.currentUser.type == 2 ?
                            <TouchableOpacity style={{ height: 29, paddingRight: 20, position: 'absolute', right: 45, top: -5 }} onPress={() => {
                                this.inDevelop()

                                //                                Actions.groupChatScreen()
                            }}>
                                <ScaleImage height={22} source={require("@images/ictinnhan.png")} style={{ top: 5 }} />
                                {/* <Text style={{ position: 'absolute', right: 10, top: 0, backgroundColor: 'red', borderRadius: 8, padding: 1, paddingLeft: 4, paddingRight: 4, fontSize: 10, fontWeight: 'bold', color: 'white', overflow: 'hidden' }}>7</Text> */}
                            </TouchableOpacity>
                            : null
                    }
                    <TouchableOpacity style={{ height: 29, paddingRight: 20, position: 'absolute', right: 0, top: -5 }} onPress={() => {
                        this.inDevelop()
                        //                        Actions.notification()
                    }}>
                        <ScaleImage height={24} source={require("@images/icthongbao.png")} style={{ top: 5 }} />
                        {/* <Text style={{ position: 'absolute', right: 10, top: 0, backgroundColor: 'red', borderRadius: 8, padding: 1, paddingLeft: 4, paddingRight: 4, fontSize: 10, fontWeight: 'bold', color: 'white', overflow: 'hidden' }}>7</Text> */}
                    </TouchableOpacity>
                </View>

            </View>

        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(Header);