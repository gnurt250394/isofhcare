import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import facilityProvider from '@data-access/facility-provider';
import ItemFacility from '@components/facility/ItemFacility';
import Dash from 'mainam-react-native-dash-view';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import RNGooglePlaces from 'react-native-google-places';
class AddNewClinicScreen extends Component {
    constructor(props) {
        super(props)
        let keyword = this.props.navigation.getParam('keyword', '');
        if (keyword)
            keyword = keyword.trim();
        else
            keyword = "";


        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false,
            keyword,
            toggleTypeFacility: false,
            listSpecialist: []
        }
    }
    componentDidMount() {
        this.onRefresh();
    }

    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                this.onLoad();
            });
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        facilityProvider.search(this.state.keyword, page, size, (s, e) => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            });
            if (s) {
                switch (s.code) {
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
            }
        });
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
                this.onLoad(this.state.page)
            });
    }
    onSubmitSpecialist() {
        if (this.state.newSpecialist && this.state.newSpecialist.trim() == "") {
            return;
        }
        var listSpecialist = this.state.listSpecialist;
        listSpecialist.push(this.state.newSpecialist);
        this.setState({ newSpecialist: "" }, () => {
            setTimeout(() => {
                this.inputSpecialist.focus();
            }, 200)
        });
    }
    removeSpecialist(index) {
        var listSpecialist = this.state.listSpecialist;
        listSpecialist.splice(index, 1);
        this.setState({ listSpecialist });
    }
    openSearchModal() {
        RNGooglePlaces.openPlacePickerModal()
            .then((place) => {
                console.log(place);
                this.setState({ place });
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="THÊM MỚI PHÒNG KHÁM" showFullScreen={true}>
                <ScrollView style={{ padding: 10 }}>
                    <View style={{
                        padding: 10,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#9b9b9b"
                    }}>
                        <TextInput
                            underlineColorAndroid="transparent"
                            style={{
                                padding: 0
                            }}
                            placeholder={"Tên phòng khám"}
                        />
                    </View>
                    <View style={{
                        marginTop: 15,
                        padding: 10,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#9b9b9b",
                        flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'
                    }}>
                        {this.state.listSpecialist.map((item, index) => <View key={index} style={{
                            borderRadius: 4,
                            backgroundColor: "#00977c", position: 'relative',
                            padding: 6, paddingLeft: 5, margin: 2, maxWidth: 150, flexDirection: 'row', alignItems: 'center'
                        }}>
                            <Text numberOfLines={1} style={{ color: '#FFF', marginRight: 17 }}>{item}</Text>
                            <TouchableOpacity onPress={this.removeSpecialist.bind(this, index)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}>
                                <Text style={{ color: '#f8e71c', margin: 5, fontSize: 15, paddingRight: 5 }}>x</Text>
                            </TouchableOpacity>
                        </View>)}
                        <TextInput ref={(ref) => this.inputSpecialist = ref} value={this.state.newSpecialist} onChangeText={(s) => this.setState({ newSpecialist: s })} onSubmitEditing={this.onSubmitSpecialist.bind(this)} style={{ minWidth: 150, padding: 0, paddingHorizontal: 2 }} numberOfLines={1} underlineColorAndroid="transparent" placeholder="Nhập chuyên khoa" />
                    </View>
                    <View style={{
                        marginTop: 15,
                        padding: 10,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#9b9b9b"
                    }}>
                        <TextInput
                            underlineColorAndroid="transparent"
                            style={{
                                padding: 0
                            }}
                            placeholder={"Website"}
                        />
                    </View>
                    <View style={{
                        marginTop: 15,
                        padding: 10,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#9b9b9b"
                    }}>
                        <TextInput
                            underlineColorAndroid="transparent"
                            style={{
                                padding: 0
                            }}
                            placeholder={"Số điện thoại"}
                        />
                    </View>
                    <View style={{
                        marginTop: 15,
                        padding: 10,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#9b9b9b"
                    }}>
                        <TextInput
                            underlineColorAndroid="transparent"
                            style={{
                                padding: 0
                            }}
                            placeholder={"Địa chỉ"}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={this.openSearchModal.bind(this)}
                        style={{
                            width: 230, padding: 5,
                            marginTop: 12,
                            alignItems: 'center',
                            backgroundColor: "#2f5eac",
                            flexDirection: 'row'
                        }}>
                        <ScaledImage source={require("@images/ic_phongkham1.png")} height={36} style={{ marginRight: 12 }} />
                        <Text style={{
                            width: 161,
                            fontFamily: "SFUIText",
                            fontSize: 16,
                            fontWeight: "600",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            color: '#FFF'
                        }}>Đặt vị trí trên bản đồ</Text></TouchableOpacity>
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
export default connect(mapStateToProps)(AddNewClinicScreen);