import React, { Component } from 'react';
import { View, Text, ImageBackground, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';

class CommunityScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.containerHeader} source={require('@images/new/community/ic_bg_header.png')}>
                    <KeyboardAwareScrollView>
                        <Text style={styles.txTitle}> CỘNG ĐỒNG HỎI ĐÁP </Text>
                        {this.props.userApp.isLogin ? (<Card style={styles.cardView}>
                            <TouchableOpacity onPress = {() => this.props.navigation.navigate('createPost')}>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={5}
                                    editable={false}
                                    onChangeText={(text) => this.setState({ text })}
                                    placeholder={'Viết bài của bạn...'}
                                    underlineColorAndroid={'#20CAA3'}
                                    value={this.state.text}
                                ></TextInput>
                            </TouchableOpacity>
                            <View style={[styles.viewBtn, { justifyContent: 'space-between' }]}>
                                <TouchableOpacity style={[styles.btnLogin, { flexDirection: 'row', alignItems: 'center' }]}>
                                    <ScaledImage height={20} style={{ marginRight: 5 }} source={require('@images/new/community/ic_img_load.png')}></ScaledImage>
                                    <Text style={styles.txLogin}>
                                        Ảnh/Video
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnLogin, { paddingHorizontal: 40 }]}>
                                    <Text style={styles.txLogin}>
                                        Đăng
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Card>) : (
                                <Card style={styles.cardView}>
                                    <TouchableOpacity>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={5}
                                            editable={false}
                                            placeholder={'Vui lòng đăng nhập để viết bài...'}
                                            underlineColorAndroid={'#20CAA3'}
                                        ></TextInput>
                                    </TouchableOpacity>
                                    <View style={styles.viewBtn}>
                                        <TouchableOpacity style={styles.btnLogin}>
                                            <Text style={styles.txLogin}>
                                                Đăng nhập
                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.btnLogin}>
                                            <Text style={styles.txLogin}>
                                                Đăng ký
                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                            )}

                    </KeyboardAwareScrollView>
                </ImageBackground>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1

    },
    containerHeader: {
        height: 305,
        padding: 10
    },
    cardView: {
        padding: 10,
        marginTop: 30,
        borderRadius: 8,
        paddingTop: 0
    },
    txTitle: {
        color: '#3BC796',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold'
    },
    btnLogin: {
        backgroundColor: '#01BF87',
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 5
    },
    txLogin: {
        color: '#fff',
        fontSize: 14
    },
    viewBtn: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
    };
}
export default connect(mapStateToProps)(CommunityScreen);