import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
    View, StyleSheet, Text, TouchableOpacity,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import medicalRecordProvider from '@data-access/medical-record-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
import constants from '@resources/strings';
import profileProvider from '@data-access/profile-provider'
class SelectProfileScreen extends Component {
    constructor(props) {
        super(props);
        let profile = this.props.navigation.state.params.profile;
        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            profile
        }
    }
    onRefresh() {
        if (!this.state.loading)
            this.setState(
                { refreshing: true, page: 1, finish: false, loading: true },
                () => {
                    this.onLoad();
                }
            );
    }
    componentDidMount() {
        this.onRefresh();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params && nextProps.navigation.state.params.loading) {
            this.onRefresh()
        }
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            // loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        }, () => {
            profileProvider.getListProfile().then(s => {
                this.setState({
                    // loading: false,
                    refreshing: false,
                    // loadMore: false
                }, () => {
                    switch (s.code) {
                        case 0:
                            // if (s.data && s.data.data) {
                            //     var list = [];
                            //     var finish = false;
                            //     if (s.data.data.length == 0) {
                            //         finish = true;
                            //     }
                            //     if (page != 1) {
                            //         list = this.state.data;
                            //         list.push.apply(list, s.data.data);
                            //     } else {
                            //         list = s.data.data;
                            //     }
                            //     this.setState({
                            //         data: [...list],
                            //         finish: finish
                            //     });
                            // }

                            this.setState({
                                data: s.data,

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
                    this.onLoad(this.state.page);
                }
            );
    }
    selectPofile(profile) {
        this.setState({
            disable: true
        }, () => {
            let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
            if (callback) {
                callback(profile);
            }
            this.props.navigation.pop();
        })
    }
    keyExtractor = (item, index) => index.toString()
    headerComponent = () => {
        return (
            !this.state.refreshing &&
                (!this.state.data || this.state.data.length == 0) ? (
                    <View style={{ alignItems: "center", marginTop: 50 }}>
                        <Text style={{ fontStyle: "italic" }}>
                            {constants.none_info}
                        </Text>
                    </View>
                ) : null
        )
    }
    defaultImage = () => {
        return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
    }
    onEditProfile = (item) => () => {
        this.props.navigation.navigate('editProfile1', {
            item
        })
    }
    renderRelation = (item) => {
        
        switch (item.medicalRecords.relationshipType) {
            case 'DAD':
                return 'Cha'
            case 'MOTHER':
                return 'Mẹ'
            case 'BOY':
                return 'Con trai'
            case 'DAUGHTER':
                return 'Con gái'
            case 'GRANDSON':
                return 'Cháu trai'
            case 'NIECE':
                return 'Cháu gái'
            case 'GRANDFATHER':
                return 'Ông'
            case 'GRANDMOTHER':
                return 'Bà'
            case 'WIFE':
                return 'Vợ'
            case 'HUSBAND':
                return 'Chồng'
            case 'OTHER':
                return 'Khác'
            default:
                return 'Đại diện gia đình'
        }
    }
    renderItem = ({ item, index }) => {
        const source = item.medicalRecords && item.medicalRecords.avatar ? { uri: item.medicalRecords.avatar.absoluteUrl() } : require("@images/new/user.png");

        return (
            <View style={styles.containerItem}>
                <TouchableOpacity style={styles.bn} onPress={this.selectPofile.bind(this, item)}>
                    {
                        this.state.profile && this.state.profile.medicalRecords && this.state.profile.medicalRecords.id == item.medicalRecords.id ?
                            <ScaleImage style={styles.ckeck} height={16} source={require("@images/new/profile/ic_ticker.png")} /> : <View style={styles.dots} />
                    }
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={styles.borderImage}
                        borderRadius={20}
                        customImagePlaceholderDefaultStyle={[styles.avatar, styles.placeHolderImage]}
                        placeholderSource={require("@images/new/user.png")}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={styles.image}
                        defaultImage={this.defaultImage}
                    />
                    <View style={styles.containerName}>
                        <Text numberOfLines={1} style={styles.bntext}>{item.medicalRecords.name} ({this.renderRelation(item)})</Text>
                        <Text numberOfLines={1} style={{
                            // color:'#3161AD',
                            fontStyle: 'italic',
                            color: '#FF0000',
                        }}>Thông tin chưa đủ</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.onEditProfile(item)}
                    style={styles.buttonEdit}>
                    <Text style={styles.txtEdit}>Sửa</Text>
                    <ScaleImage source={require('@images/new/booking/ic_next.png')} height={12} />
                </TouchableOpacity>
            </View>
        );
    }
    footerComponent = () => {
        return (
            this.state.data && this.state.data.length < 10 || !this.state.data ?
                (
                    <TouchableOpacity style={styles.buttonCreateProfile} onPress={this.createProfile}>
                        <Text style={styles.btntext}>Thêm hồ sơ mới</Text>
                        <ScaleImage
                            source={require("@images/new/profile/ic_plus.png")}
                            width={12}
                            style={{
                                tintColor:'#00BA99'
                            }}
                        />
                    </TouchableOpacity>
                ) : null
        )
    }
    createProfile = () => {
        this.props.navigation.navigate("editProfile1",
            {
                isDataNull: !this.state.data || this.state.data.length == 0 ? true : false,
                onCreate: this.onRefresh.bind(this)
            })
    }
    render() {
        return (
            <ActivityPanel
                title={constants.title.select_profile}
                containerStyle={{
                    backgroundColor: '#E5E5E5',
                }}
            >

                <FlatList
                    onRefresh={this.onRefresh.bind(this)}
                    refreshing={this.state.refreshing}
                    onEndReached={this.onLoadMore.bind(this)}
                    onEndReachedThreshold={1}
                    style={styles.container}
                    keyExtractor={this.keyExtractor}
                    extraData={this.state}
                    data={this.state.data}
                    ListHeaderComponent={this.headerComponent}
                    ListFooterComponent={this.footerComponent}
                    renderItem={this.renderItem}
                />

            </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
const styles = StyleSheet.create({
    dots: {
        borderColor: '#BBBBBB',
        borderWidth: 1,
        borderRadius: 8,
        width: 16,
        height: 16,
        marginRight: 15
    },
    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)',

    },
    txtEdit: {
        paddingRight: 7
    },
    buttonEdit: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '20%',
        justifyContent: 'center',
        height: '100%',
        // borderLeftColor:'#bbbbbb',
        // borderLeftWidth:1
    },
    containerName: {
        paddingLeft: 10,
        flex: 1
    },
    buttonCreateProfile: {
        marginVertical: 10,
        marginBottom: 30,
        backgroundColor: 'rgb(255, 255, 255)',
        width: '100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    placeHolderImage: { width: 40, height: 40 },
    image: {
        alignSelf: 'center',
        borderRadius: 20,
        width: 40,
        height: 40
    },
    borderImage: {
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
    AcPanel: {
        flex: 1,
        backgroundColor: '#cacaca',
    },
    container: {
        flex: 1,
        paddingTop: 20
    },
    bn: {
        position: 'relative',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,

    },
    bntext: {
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        flex: 1
    },
    ckeck: {
        marginRight: 15,
    },
    btntext: {
        fontSize: 16,
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a",
        textAlign: 'center',
        margin: 10,
        fontWeight:'bold'
    },
    btntext2: {
        fontSize: 18,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a",
        position: 'absolute',
        left: 240,
        top: 10

    }

})
export default connect(mapStateToProps)(SelectProfileScreen);