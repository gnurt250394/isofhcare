import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider'
import constants from "@resources/strings";
import snackbar from "@utils/snackbar-utils";
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";
import RNGooglePlaces from 'react-native-google-places';
import SearchableDropdown from 'react-native-searchable-dropdown';

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
    }
    componentDidMount() {
        let dataLocation = this.props.navigation.getParam('dataLocation', null)
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
            address: dataLocation.address
        })
    }
    onAddLocation = () => {
        let { ownerName, telephone } = this.state
        let ownerId = this.props.userApp.currentUser.id
        if (!ownerName) {
            snackbar.show('Họ và tên không được để trống.', 'danger')
            return
        }
        if (!telephone) {
            snackbar.show('Số điện thoại không được để trống.', 'danger')
            return
        }
        if (!telephone.match(/^(\+?84|0|\(\+?84\))[1-9]\d{8,9}$/g)) {
            snackbar.show('Số điện thoại không đúng định dạng.', 'danger')
            return
        }
        let dataAddress = this.state.resultsLocation
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
                let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
                if (callback) {
                    callback(res.data);
                    this.props.navigation.pop();
                }
            }
        }).catch(e => {
            snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', 'danger')
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
    onFindLocation = (text) => {
        this.setState({
            address: text
        }, () => {
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
        })
        // if (this.state.typingTimeout) {
        //     clearTimeout(this.state.typingTimeout);
        // }
        // this.setState({
        //     typing: false,
        //     typingTimeout: setTimeout(function () {
        //         RNGooglePlaces.getAutocompletePredictions(text)
        //             .then((results) => {
        //                 console.log(results);
        //                 if (results && results.length) {
        //                     var listAddress = []
        //                     for (let i = 0; i < results.length; i++) {
        //                         listAddress.push({
        //                             id: i,
        //                             name: results[i].secondaryText
        //                         })
        //                     }
        //                     this.setState({
        //                         listAddress
        //                     })

        //                     console.log(listAddress, 'listAddress')

        //                 }
        //                 // place represents user's selection from the
        //                 // suggestions and it is a simplified Google Place object.
        //             })
        //             .catch(error => console.log(error.message));  // error is a Javascript Error object
        //     }, 2000)
        // });

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
                menuButton={<TouchableOpacity style={{ padding: 5 }} onPress={this.onAddLocation}>
                    <Text style={styles.txtSave}>{constants.actionSheet.save}</Text>
                </TouchableOpacity>}
                titleStyle={styles.txTitle}
            >
                <ScaledImage width={devices_width} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage>
                <View style={styles.viewName}>
                    <Text style={styles.txName}>Họ và tên</Text>
                    <TextInput value={this.state.ownerName} onChangeText={text => this.setState({ ownerName: text })} multiline={true} style={styles.inputName} placeholder={'Nhập họ và tên'}></TextInput>
                </View>
                <View style={styles.viewName}>
                    <Text style={styles.txName}>Số điện thoại</Text>
                    <TextInput value={this.state.telephone} onChangeText={text => this.setState({ telephone: text })} multiline={true} keyboardType={'numeric'} style={styles.inputName} placeholder={'Nhập số điện thoại'}></TextInput>
                </View>
                {/* <TouchableOpacity onPress={this.openSearchModal} style={styles.viewLocation}>
                        <Text style={styles.txName}>Địa chỉ</Text>
                        <View style={styles.viewAddress}>
                            <Text style={styles.inputAdress}>{this.state.address ? this.state.address : 'Nhập địa chỉ'}</Text>
                        </View>
                    </TouchableOpacity> */}
                <View><View style={styles.viewName}>
                    <Text style={styles.txName}>Địa chỉ</Text>
                    <TextInput value={this.state.address} onChangeText={text => this.onFindLocation(text)} multiline={true} style={styles.inputName} placeholder={'Nhập địa chỉ'}></TextInput>
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
                    </ScrollView>
                </View>
                <View style={styles.viewBottom}></View>
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
        paddingHorizontal: 20
    },
    txName: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'left'
    },
    inputName: {
        width: '70%',
        minHeight: 48,
        textAlign: 'right',
        color: '#000'
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