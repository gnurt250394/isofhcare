import React, { Component } from 'react';
import { View, Text, ImageBackground, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Card } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class HeaderCommunity extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    onChangeText = (text) => this.setState({
        value: text
    })
    render() {
        return (
            <ImageBackground style={styles.container} source={require('@images/new/community/ic_bg_header.png')}>
            <KeyboardAwareScrollView>
                    <Text style= {styles.txTitle}> CỘNG ĐỒNG HỎI ĐÁP </Text>
                    <Card style={styles.cardView}>
                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={text => this.onChangeText(text)}
                            value={this.state.value}
                        ></TextInput>
                        <View>
                        <TouchableOpacity style = {styles.btnLogin}>
                            <Text>
                                Đăng nhập
                            </Text>
                        </TouchableOpacity>

                        </View>
                    </Card>
                    </KeyboardAwareScrollView>
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardView: {
        marginHorizontal: 20,
        height: 129,

    },
    txTitle:{
        color:'#3BC796',
        fontSize:18,
        textAlign:'center',
        marginTop: 10,
    },
    btnLogin:{
        backgroundColor:'#01BF87',
        paddingVertical:5,
        paddingHorizontal:10
    }
})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(HeaderCommunity);