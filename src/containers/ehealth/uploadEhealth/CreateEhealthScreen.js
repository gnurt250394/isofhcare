import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
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
import ehealthProvider from '@data-access/ehealth-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import { Card } from "native-base";
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import connectionUtils from '@utils/connection-utils';
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import profileProvider from '@data-access/profile-provider'
import DateTimePicker from "mainam-react-native-date-picker";

class CreateEhealthScreen extends Component {
    constructor(props) {
        super(props);
        let location = {};
        this.params = {}
        this.state = {
            listHospital: [],
            isLongPress: false,
            index: '',
            refreshing: false,
            isSearch: false,
            size: 10,
            page: 1,
            imageUris: [],
        }
    }
    componentDidMount() {
        this.onRefresh()
        // this.onLoadProfile()
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState(
                {
                    loadMore: true,
                    refreshing: false,
                    loading: true,
                    page: this.state.page + 1
                },
                () => {
                    this.onLoad()
                }
            );
    }
    onSelectDate = () => this.setState({ toggelDateTimePickerVisible: true })
    onConfirmDate = newDate => {
        this.setState(
            {
                dob: newDate,
                date: newDate.format("dd/MM/yyyy"),
                toggelDateTimePickerVisible: false
            },
            () => {
            }
        );
    }
    onCancelDate = () => {
        this.setState({ toggelDateTimePickerVisible: false });
    }
    onLoad() {
        const { page, size } = this.state;
        let stringQuyery = this.state.hospitalName ? this.state.hospitalName.trim() : ""
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        }, () => {
            let promise = null;
            if (this.state.region) {
                promise = hospitalProvider.getByLocation(page, size, this.state.region.latitude, this.state.region.longitude, stringQuyery, -1, 1);
            }
            else {
                promise = hospitalProvider.getByLocation(page, size, 190, 190, stringQuyery, -1, 1);
            };
            promise.then(s => {
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadMore: false
                }, () => {
                    switch (s.code) {
                        case 500:
                            // alert(JSON.stringify(s));
                            snackbar.show(constants.msg.error_occur, "danger");
                            break;
                        case 0:
                            var list = [];
                            var finish = false;
                            if (s.data.data.length == 0) {
                                finish = true;
                            }
                            if (page != 1) {
                                list = this.state.data;
                                list.push.apply(list, s.data.data);
                            }
                            else {
                                list = s.data.data;
                            }
                            this.setState({
                                data: [...list],
                                finish: finish
                            });
                            break;
                    }
                });
            }).catch(e => {
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadMore: false
                });
            })
        });
    }
    onRefresh = () => {
        if (!this.state.loading)
            this.setState(
                { refreshing: true, page: 1, finish: false, loading: true },
                () => {
                    this.onLoad();
                }
            );
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
    onSelectHospital = (item) => {
        this.setState({
            isSearch: false,
            hospitalId: item.id,
            hospitalName: item.name,
        })
    }
    renderItem = ({ item, index }) => {
        return <TouchableOpacity onPress={() => this.onSelectHospital(item.hospital)} style={styles.details} >
            <View style={styles.containerContent}>
                <Text style={styles.bv} numberOfLines={1}>{item.hospital.name}</Text>
                <Text style={styles.bv1} numberOfLines={2}>{item.hospital.address}</Text>
            </View>
        </TouchableOpacity>
    }
    onSelectProfile = (value) => {
        this.setState({
            medicalRecordId: value.id,
            name: value.name,
            isProfile: false
        })
    }
    renderItemProfile = ({ item, index }) => {
        return <TouchableOpacity onPress={() => this.onSelectProfile(item.medicalRecords)} style={styles.details} >
            <View style={styles.containerContent}>
                <Text style={styles.bv} numberOfLines={1}>{item.medicalRecords.name}</Text>
            </View>
        </TouchableOpacity>
    }
    search = (text) => {
        console.log('text: ', text);
        this.setState({
            isSearch: true,
            hospitalName: text,
        })
    }
    onLoadProfile = () => {
        this.setState({
            isProfile: !this.state.isProfile
        }, () => {
            if (this.state.isProfile) {
                profileProvider.getListProfile().then(s => {
                    switch (s.code) {
                        case 0:
                            if (s.data) {
                                this.setState({
                                    dataProfile: s.data,
                                });
                            }
                            break;
                    }
                }).catch(e => {

                })
            }
        })
    }
    selectImage = () => {
        if (this.state.imageUris && this.state.imageUris.length >= 5) {
            snackbar.show(constants.msg.booking.image_without_five, "danger");
            return;
        }
        connectionUtils.isConnected().then(s => {
            if (this.imagePicker) {
                this.imagePicker.show({
                    multiple: true,
                    mediaType: 'photo',
                    maxFiles: 5,
                    compressImageMaxWidth: 500,
                    compressImageMaxHeight: 500
                }).then(images => {
                    let listImages = [];
                    if (images.length)
                        listImages = [...images];
                    else
                        listImages.push(images);
                    let imageUris = this.state.imageUris;
                    listImages.forEach(image => {
                        if (imageUris.length >= 5)
                            return;
                        let temp = null;
                        imageUris.forEach((item) => {
                            if (item.uri == image.path)
                                temp = item;
                        })
                        if (!temp) {
                            imageUris.push({ uri: image.path, loading: true });
                            imageProvider.upload(image.path, (s, e) => {
                                if (s.success) {
                                    if (s.data.code == 0 && s.data.data && s.data.data.images && s.data.data.images.length > 0) {
                                        let imageUris = this.state.imageUris;
                                        imageUris.forEach((item) => {
                                            if (item.uri == s.uri) {
                                                item.loading = false;
                                                item.url = s.data.data.images[0].image;
                                                item.thumbnail = s.data.data.images[0].thumbnail;
                                            }
                                        });
                                        this.setState({
                                            imageUris
                                        });
                                    }
                                } else {
                                    imageUris.forEach((item) => {
                                        if (item.uri == s.uri) {
                                            item.error = true;
                                        }
                                    });
                                }
                            });
                        }
                    })
                    this.setState({ imageUris: [...imageUris] });
                    console.log('imageUris: ', [...imageUris]);
                });

            }
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        });
    }
    removeImage(index) {
        var imageUris = this.state.imageUris;
        imageUris.splice(index, 1);
        this.setState({ imageUris });
    }
    onCreate = () => {
        var images = []
        console.log(this.state.imageUris, ' this.state.imageUris this.state.imageUris this.state.imageUris')
        for (let i = 0; i < this.state.imageUris.length; i++) {
            images.push(this.state.imageUris[i].url)
        }
        if (!this.form.isValid()) {
            return
        }
        let params = {
            "hospitalId": this.state.hospitalId,
            "hospitalName": this.state.hospitalName,
            "images": this.state.imageUris.length ? images : [],
            "medicalRecordId": this.state.medicalRecordId,
            "medicalServiceName": this.state.medicalServiceName,
            "result": this.state.result ? this.state.result : '',
            "timeGoIn": this.state.dob.format('yyyy-MM-dd')
        }
        ehealthProvider.uploadEhealth(params).then(res => {
            console.log(res, 'rrsssss')
            if (res && res.code == 200) {
                this.props.navigation.replace('listEhealthUpload')
            }
        }).catch(err => {
            console.log(err)
        })
    }
    onFocus = () => {
        this.setState({
            isSearch: true,
        }, () => {
            this.onRefresh()
        })
    }
    render() {
        return (
            <ActivityPanel
                title={constants.title.uploadEhealth}
                style={styles.container}
            >
                <ScrollView style={styles.viewContent} bounces={false} keyboardShouldPersistTaps='handled' >
                    <Text style={styles.txTitle}>Vui lòng nhập các thông tin sau</Text>
                    <Form ref={ref => (this.form = ref)}>
                        <Field style={styles.viewInput}>

                            <Text style={styles.title}>CSYT đã khám (*)</Text>
                            <TextField
                                onFocus={this.onFocus}
                                onChangeText={text => this.search(text)}
                                value={this.state.hospitalName}
                                placeholder={'Nhập CSYT đã khám'}
                                errorStyle={styles.errorStyle}
                                inputStyle={styles.inputStyle}
                                underlineColorAndroid={'#fff'}
                                returnKeyType='done'
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
                            {this.state.isSearch ? <FlatList
                                data={this.state.data}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                                onEndReached={this.onLoadMore.bind(this)}
                                onEndReachedThreshold={1}
                                onRefresh={this.onRefresh.bind(this)}
                                refreshing={this.state.refreshing}
                            >

                            </FlatList> : <View></View>}
                            <Text style={styles.title}>Người được khám (*)</Text>
                            <TextField
                                onChangeText={text => this.setState({ name: text })}
                                value={this.state.name}
                                placeholder={'Chọn tên người được khám'}
                                errorStyle={styles.errorStyle}
                                inputStyle={styles.inputStyle}
                                underlineColorAndroid={'#fff'}
                                placeholderTextColor='#3b3b3b'
                                editable={false}
                                onPress={this.onLoadProfile}
                                validate={{
                                    rules: {
                                        required: true,
                                    },
                                    messages: {
                                        required: "Chưa chọn người được khám",
                                    }
                                }}
                                autoCapitalize={"none"}
                            />
                            {this.state.isProfile ? <FlatList
                                data={this.state.dataProfile}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItemProfile}
                            >

                            </FlatList> : <View></View>}
                            <Text style={styles.title}>Dịch vụ khám (*)</Text>
                            <TextField
                                onChangeText={text => this.setState({ medicalServiceName: text })}
                                value={this.state.medicalServiceName}
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
                                        required: "Dịch vụ khám không được bỏ trống",
                                    }
                                }}
                                autoCapitalize={"none"}
                            />
                            <Text style={styles.title}>Thời gian khám (*)</Text>
                            <TextField
                                value={this.state.date}
                                editable={false}
                                onPress={this.onSelectDate}
                                placeholder={'Chọn thời gian khám'}
                                errorStyle={styles.errorStyle}
                                inputStyle={styles.inputStyle}
                                underlineColorAndroid={'#fff'}
                                placeholderTextColor='#3b3b3b'
                                validate={{
                                    rules: {
                                        required: true,
                                    },
                                    messages: {
                                        required: "Chưa chọn thời gian khám",
                                    }
                                }}
                                autoCapitalize={"none"}
                            />
                            <Text style={styles.title}>Kết quả khám</Text>
                            <TextField
                                onChangeText={text => this.setState({ result: text })}
                                value={this.state.result}
                                placeholder={'Nhập kết quả khám'}
                                errorStyle={styles.errorStyle}
                                inputStyle={styles.inputResult}
                                underlineColorAndroid={'#fff'}
                                multiline={true}
                                numberOfLines={4}
                                placeholderTextColor='#3b3b3b'
                                autoCapitalize={"none"}
                            />
                        </Field>
                    </Form>
                    <View style={styles.viewUploadImg}>
                        <View>
                            <Text style={styles.title}>
                                Hoặc tải lên hình ảnh
                            </Text>
                            <Text style={[styles.title, { fontSize: 14 }]}>
                                (.jpg, .png, gif)
                            </Text>
                        </View>
                        <TouchableOpacity onPress={this.selectImage} style={{ alignSelf: 'flex-end' }}><ScaledImage source={require('@images/new/ehealth/ic_upload.png')} height={50}></ScaledImage></TouchableOpacity>
                    </View>

                    <View style={styles.list_image}>
                        {
                            this.state.imageUris && this.state.imageUris.map((item, index) => <View key={index} style={styles.containerImagePicker}>
                                <View style={styles.groupImagePicker}>
                                    <Image source={{ uri: item.uri }} resizeMode="cover" style={styles.imagePicker} />
                                    {
                                        item.error ?
                                            <View style={styles.groupImageError} >
                                                <ScaledImage source={require("@images/ic_warning.png")} width={40} />
                                            </View> :
                                            item.loading ?
                                                <View style={styles.groupImageLoading} >
                                                    <ScaledImage source={require("@images/loading.gif")} width={40} />
                                                </View>
                                                : null
                                    }
                                </View>
                                <TouchableOpacity onPress={this.removeImage.bind(this, index)} style={styles.buttonClose} >
                                    <ScaledImage source={require("@images/new/ic_close.png")} width={16} />
                                </TouchableOpacity>
                            </View>)
                        }
                    </View>

                    <TouchableOpacity onPress={this.onCreate} style={styles.btnUploadEhealth}><Text style={styles.txAddEhealth}>{'Hoàn thành'}</Text></TouchableOpacity>
                    <View style={{ height: 50 }}></View>
                </ScrollView>
                <DateTimePicker
                    isVisible={this.state.toggelDateTimePickerVisible}
                    onConfirm={this.onConfirmDate}
                    onCancel={this.onCancelDate}
                    date={new Date()}
                    maximumDate={new Date()}
                    cancelTextIOS={constants.actionSheet.cancel2}
                    confirmTextIOS={constants.actionSheet.confirm}
                    date={this.state.dob || new Date()}
                />
                <ImagePicker ref={ref => this.imagePicker = ref} />
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
    buttonClose: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    viewUploadImg: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 },
    list_image: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginHorizontal: 20 },
    txCamera: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
    groupImageLoading: {
        position: 'absolute',
        left: 20,
        top: 20,
        backgroundColor: '#FFF',
        borderRadius: 20
    },
    groupImageError: {
        position: 'absolute',
        left: 20,
        top: 20
    },
    imagePicker: {
        width: 80,
        height: 80,
        borderRadius: 5
    },
    groupImagePicker: {
        marginTop: 8,
        width: 80,
        height: 80
    },
    containerImagePicker: {
        margin: 2,
        width: 88,
        height: 88,
        position: 'relative'
    },
    txTitle: {
        fontWeight: '600',
        fontSize: 18,
        textAlign: 'center',
        color: '#000',
        marginTop: 20
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
        fontWeight: '600',
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
        justifyContent: 'flex-start',
        color: '#000'
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
        fontWeight: "600",
        letterSpacing: 0,
        color: "#000000",
    },
    bv1: {
        fontSize: 13,
        color: "#00000050",
        marginTop: 9
    },
    btnUploadEhealth: {
        borderRadius: 5,
        backgroundColor: '#3161AD',
        justifyContent: 'center',
        alignItems: 'center',
        height: 58,
        marginTop: 10,
        marginHorizontal: 60,
        borderRadius: 10
    },
    txAddEhealth: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    }
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps)(CreateEhealthScreen);
