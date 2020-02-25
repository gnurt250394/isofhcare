import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Keyboard, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider'
import constants from "@resources/strings";
import snackbar from "@utils/snackbar-utils";
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";
import RNGooglePlaces from 'react-native-google-places';
import SearchableDropdown from 'react-native-searchable-dropdown';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
const devices_width = Dimensions.get('window').width
class InputLocationScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedItems: [],
            itemsDrug: [],
            typing: false,
            typingTimeout: 0,
            txSearch: '',
            listAddress: []
        }
        this.timeout = 0
    }
    componentDidMount() {
        let dataLocation = this.props.navigation.getParam('dataLocation', null)
        if (dataLocation) {
            let resultsLocation = dataLocation && [{
                address: dataLocation && dataLocation.address ? dataLocation.address : '',
                location: {
                    latitude: dataLocation && dataLocation.lat ? dataLocation.lat : null,
                    longitude: dataLocation && dataLocation.lng ? dataLocation.lng : null,
                }
            }]
            this.setState({
                ownerName: dataLocation && dataLocation.ownerName ? dataLocation.ownerName : '',
                ownerId: dataLocation && dataLocation.ownerId ? dataLocation.ownerId : '',
                telephone: dataLocation && dataLocation.phone ? dataLocation.phone : '',
                resultsLocation,
                address: dataLocation && dataLocation.address
            })
        }
    }
    onAddLocation = () => {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        this.setState({
            isLoading: true
        }, () => {
            let { ownerName, telephone } = this.state
            let ownerId = this.props.userApp.currentUser.id
            let dataAddress = this.state.resultsLocation
            if (!dataAddress) {
                this.setState({
                    isLoading: false
                })
                snackbar.show('Vui lòng chọn một trong các địa chỉ được gợi ý', 'danger')
                return
            }
            let data = {
                "address": dataAddress.address,
                "lat": dataAddress ? dataAddress.location.latitude : null,
                "lng": dataAddress ? dataAddress.location.longitude : null,
                "ownerId": ownerId,
                "ownerName": ownerName,
                "phone": telephone
            }
            drugProvider.addLocation(data).then(res => {
                if (res) {
                    this.setState({
                        isLoading: false
                    })
                    let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
                    if (callback) {
                        callback(res.data);
                        this.props.navigation.pop();
                    }
                } else {
                    this.setState({
                        isLoading: false
                    })
                }
            }).catch(e => {
                this.setState({
                    isLoading: false
                })
                snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
            })
        })
    }
    openSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                console.log(place);
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }
    onGetLocation = (item) => {
        this.setState({
            results: []
        }, () => {
            RNGooglePlaces.lookUpPlaceByID(item.placeID)
                .then((results) => {
                    console.log(results);
                    this.setState({
                        resultsLocation: results,
                        address: results.address
                    })
                    // place represents user's selection from the
                    // suggestions and it is a simplified Google Place object.
                })
        })
    }
    onFindLocation(text) {
        this.setState({ address: text })
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            RNGooglePlaces.getAutocompletePredictions(text)
                .then((results) => {
                    console.log(results);
                    this.setState({
                        results
                    })
                    // place represents user's selection from the
                    // suggestions and it is a simplified Google Place object.
                })
                .catch(error => console.log(error.message));
        }, 500);
    }

    render() {
        return (
            <ActivityPanel
                icBack={require('@images/new/left_arrow_white.png')}
                title={'Nhập địa chỉ'}
                iosBarStyle={'light-content'}
                actionbarStyle={styles.actionbarStyle}
                style={styles.activityPanel}
                containerStyle={styles.container}
                isLoading={this.state.isLoading}
                menuButton={<TouchableOpacity style={{ padding: 5 }} onPress={this.onAddLocation}>
                    <Text style={styles.txtSave}>{constants.actionSheet.save}</Text>
                </TouchableOpacity>}
                titleStyle={styles.txTitle}
            >
                <Form ref={ref => (this.form = ref)}>
                    <Field style={styles.viewName}>
                        <Text style={styles.txName}>Họ và tên</Text>

                        <TextField value={this.state.ownerName} validate={{
                            rules: {
                                required: true,
                            },
                            messages: {
                                required: "Họ và tên không được bỏ trống",
                            }
                        }} errorStyle={styles.errorStyle} onChangeText={text => this.setState({ ownerName: text })} placeholderTextColor={'#000'} multiline={true} inputStyle={styles.inputName} placeholder={'Nhập họ và tên'}></TextField>
                    </Field>
                    <Field style={styles.viewName}>
                        <Text style={styles.txName}>Số điện thoại</Text>
                        <TextField value={this.state.telephone} validate={{
                            rules: {
                                required: true,
                                phone: true
                            },
                            messages: {
                                required: "Số điện thoại không được bỏ trống",
                                phone: "Số điện thoại không hợp lệ"
                            }
                        }} onChangeText={text => this.setState({ telephone: text })} errorStyle={styles.errorStyle} placeholderTextColor={'#000'} multiline={true} keyboardType={'numeric'} inputStyle={styles.inputName} placeholder={'Nhập số điện thoại'}></TextField>
                    </Field>
                    {/* <TouchableOpacity onPress={this.openSearchModal} style={styles.viewLocation}>
                        <Text style={styles.txName}>Địa chỉ</Text>
                        <View style={styles.viewAddress}>
                            <Text style={styles.inputAdress}>{this.state.address ? this.state.address : 'Nhập địa chỉ'}</Text>
                        </View>
                    </TouchableOpacity> */}
                </Form>
                <View>
                    <View style={styles.viewName}>
                        <Text style={styles.txName}>Địa chỉ</Text>
                        <TextInput placeholderTextColor={'#000'} value={this.state.address} onChangeText={text => this.onFindLocation(text)} multiline={true} style={styles.inputAddress} placeholder={'Nhập địa chỉ'}></TextInput>
                    </View>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                    >
                        {this.state.results && this.state.results.length > 0 && this.state.results.map((item, index) => {
                            return (
                                <TouchableOpacity style={{ backgroundColor: '#fff', padding: 15 }} onPress={() => this.onGetLocation(item)} key={index}>
                                    <Text style={{ textAlign: 'right', color: '#000', fontSize: 14 }}>{item.secondaryText}</Text>
                                </TouchableOpacity>
                            )
                        })}
                        <KeyboardSpacer></KeyboardSpacer>
                    </ScrollView>
                </View>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5'
    },
    viewBottom: {
        height: 50
    },
    viewName: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    errorStyle: {
        color: "red",
        marginTop: 10
    },
    txName: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'left'
    },
    inputName: {
        minHeight: 48,
        textAlign: 'right',
        color: '#000',
        flexWrap: 'wrap'
    },
    inputAddress: {
        minHeight: 48,
        textAlign: 'right',
        color: '#000',
        width: '70%'
    },
    viewLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        minHeight: 48,
    },
    viewAddress: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '70%',
        padding: 5
    },
    inputAdress: {
        textAlign: 'right',
        color: '#000',
        marginRight: 5,
    },
    txtSave: {
        color: '#fff',
        marginRight: 25,
        fontSize: 14,
        fontWeight: '800'
    },
    activityPanel: {
        flex: 1,
        backgroundColor: '#fff'
    },
    txTitle: { color: '#fff', marginLeft: 50, fontSize: 18 },

})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
    };
}
export default connect(mapStateToProps)(InputLocationScreen);