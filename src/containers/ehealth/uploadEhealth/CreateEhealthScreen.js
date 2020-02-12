import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView
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
import { Card } from "native-base";
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import connectionUtils from '@utils/connection-utils';
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";

class CreateEhealthScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHospital: [],
            isLongPress: false,
            index: '',
            refreshing: false,
            isSearch: false
        }
    }
    componentDidMount() {
        this.onRefresh()
    }
    onGetHospital = () => {
        hospitalProvider.getHistoryHospital2().then(res => {
            if (res.code == 0) {
                console.log(res.data, 'res.datares.datares.data')
                this.setState({
                    listHospital: res.data,
                    refreshing: false
                })
            } else {
                this.setState({
                    refreshing: false
                })
            }

        }).catch(err => {
            this.setState({
                refreshing: false
            })
        })
    }
    onRefresh = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.onGetHospital()
        })
    }
    onPress = (item) => {
        this.props.dispatch({ type: constants.action.action_select_hospital_ehealth, value: item })
        this.props.navigation.navigate('listProfile');
    }
    onDisable = () => {
        snackbar.show(constants.msg.ehealth.not_examination_at_hospital, 'danger')
    }
    onAddEhealth = () => {
        connectionUtils.isConnected().then(s => {
            this.props.navigation.navigate("selectHospital", {
                hospital: this.state.hospital,
                onSelected: (hospital) => {
                    // alert(JSON.stringify(hospital))
                    setTimeout(() => {
                        this.props.navigation.navigate('addNewEhealth', { hospital: hospital })
                    }, 300);
                }
            })
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        });
    }
    onBackClick = () => {
        this.props.navigation.pop()
    }
    keyExtractor = (item, index) => index.toString()
    headerComponent = () => {
        return (!this.state.refreshing && (!this.state.listHospital || this.state.listHospital.length == 0) ?
            <View style={styles.viewTxNone}>
                <Text style={styles.viewTxTime}>{constants.ehealth.not_result_ehealth_location}</Text>
            </View> : null
        )
    }
    onChangeText = () => {

    }
    renderItem = ({ item, index }) => {
        return <TouchableOpacity style={styles.details} >
            <View style={styles.containerContent}>
                <Text style={styles.bv} numberOfLines={1}>{item.hospital.name}</Text>
                <Text style={styles.bv1} numberOfLines={2}>{item.hospital.address}</Text>
            </View>
        </TouchableOpacity>
    }
    search = (text) => {
        this.setState({
            isSearch: true
        })
    }
    onFinish = () => {
        this.setState({
            isSearch: false
        })
    }
    render() {
        return (
            <ActivityPanel
                title={constants.title.uploadEhealth}
                style={styles.container}
            >
                <ScrollView style={styles.viewContent} >
                    <Form ref={ref => (this.form = ref)}>
                        <Field style={styles.viewInput}>
                            <Text style={styles.title}>CSYT đã khám (*)</Text>
                            <Field style={styles.viewField}>
                                <TextField
                                    onChangeText={text => this.search(text)}
                                    value={this.state.name}
                                    placeholder={'Chọn hoặc nhập tên CSYT'}
                                    errorStyle={styles.errorStyle}
                                    inputStyle={styles.input}
                                    underlineColorAndroid={'#fff'}
                                    placeholderTextColor='#3b3b3b'
                                    onSubmitEditing={this.onFinish}
                                    returnKeyType={'search'}
                                    validate={{
                                        rules: {
                                            required: true,
                                        },
                                        messages: {
                                            required: "Tên CSYT không được bỏ trống",
                                        }
                                    }}
                                    autoCapitalize={"none"}
                                />
                                <ScaledImage style={styles.img} source={require('@images/new/ehealth/ic_down.png')} height={15}></ScaledImage>
                            </Field>
                            {this.state.isSearch ? <FlatList
                                data={this.state.listHospital}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                            >

                            </FlatList> : <View></View>}
                            <Text style={styles.title}>Người được khám (*)</Text>
                            <Field style={styles.viewField}>
                                <TextField
                                    onChangeText={text => this.setState({ name: text })}
                                    value={this.state.name}
                                    placeholder={'Nhập tên người được khám'}
                                    errorStyle={styles.errorStyle}
                                    inputStyle={styles.input}
                                    underlineColorAndroid={'#fff'}
                                    placeholderTextColor='#3b3b3b'
                                    validate={{
                                        rules: {
                                            required: true,
                                        },
                                        messages: {
                                            required: "Tên CSYT không được bỏ trống",
                                        }
                                    }}
                                    autoCapitalize={"none"}
                                />
                                <ScaledImage style={styles.img} source={require('@images/new/ehealth/ic_down.png')} height={15}></ScaledImage>
                            </Field>
                            <Text style={styles.title}>Dịch vụ khám (*)</Text>
                            <TextField
                                onChangeText={text => this.setState({ name: text })}
                                value={this.state.name}
                                placeholder={'Nhập dịch vụ khám'}
                                errorStyle={styles.errorStyle}
                                inputStyle={styles.inputStyle}
                                underlineColorAndroid={'#fff'}
                                placeholderTextColor='#3b3b3b'
                                validate={{
                                    rules: {
                                        required: true,
                                    },
                                    messages: {
                                        required: "Tên CSYT không được bỏ trống",
                                    }
                                }}
                                autoCapitalize={"none"}
                            />
                            <Text style={styles.title}>Thời gian khám (*)</Text>
                            <TextField
                                onChangeText={text => this.setState({ name: text })}
                                value={this.state.name}
                                placeholder={'Nhập thời gian khám'}
                                errorStyle={styles.errorStyle}
                                inputStyle={styles.inputStyle}
                                underlineColorAndroid={'#fff'}
                                placeholderTextColor='#3b3b3b'
                                validate={{
                                    rules: {
                                        required: true,
                                    },
                                    messages: {
                                        required: "Tên CSYT không được bỏ trống",
                                    }
                                }}
                                autoCapitalize={"none"}
                            />
                            <Text style={styles.title}>Kết quả khám</Text>
                            <TextField
                                onChangeText={text => this.setState({ name: text })}
                                value={this.state.name}
                                placeholder={'Nhập kết quả khám'}
                                errorStyle={styles.errorStyle}
                                inputStyle={styles.inputResult}
                                underlineColorAndroid={'#fff'}
                                multiline={true}
                                numberOfLines={4}
                                placeholderTextColor='#3b3b3b'
                                validate={{
                                    rules: {
                                        required: true,
                                    },
                                    messages: {
                                        required: "Tên CSYT không được bỏ trống",
                                    }
                                }}
                                autoCapitalize={"none"}
                            />
                        </Field>
                    </Form>
                </ScrollView>

            </ActivityPanel>
        );
    }


}
const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
    img: {
    },
    viewContent: {
        paddingHorizontal: 10,
    },
    viewInput: {
        margin: 10
    },
    title: {
        fontSize: 16,
        color: '#000',
        textAlign: 'left',
        fontWeight: 'bold',
        marginTop: 10

    },
    input: {
        width: '92%',
        height: '100%',
        padding: 10,
        color: '#000'
    },
    inputStyle: {
        height: 51,
        borderRadius: 6,
        backgroundColor: '#ededed',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'flex-start'
    },
    viewField: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 6,
        alignItems: 'center',
        backgroundColor: '#ededed',

    },
    inputResult: {
        borderRadius: 6,
        backgroundColor: '#ededed',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'flex-start'
    },
    errorStyle: {
        color: "red",
        marginVertical: 20
    },
    details: {
        flexDirection: 'row',
        paddingVertical: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 0.7,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)'
    },
    containerContent: {
        flex: 1,
        marginLeft: 20
    },
    bv: {
        fontSize: 15,
        fontWeight: "bold",
        letterSpacing: 0,
        color: "#000000",
    },
    bv1: {
        fontSize: 13,
        color: "#00000050",
        marginTop: 9
    },
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps)(CreateEhealthScreen);
