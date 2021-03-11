import React, { Component } from "react";
import {
    TouchableOpacity, StyleSheet, View, ScrollView, Dimensions
} from "react-native";
import ScaleImage from "mainam-react-native-scaleimage";
import ImageLoad from 'mainam-react-native-image-loader';
import profileProvider from '@data-access/profile-provider'
import NavigationService from "@navigators/NavigationService";
import { connect } from "react-redux";
import redux from '@redux-store';
import snackbar from "@utils/snackbar-utils";

const { width, height } = Dimensions.get('screen')
class ListProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: []
        };
    }
    componentDidMount() {
        this.onLoad()

    }
    onLoad = () => {
        profileProvider.getListProfile().then(s => {

            this.setState({
                refreshing: false,
            }, async () => {
                switch (s.code) {
                    case 0:
                        if (s?.data?.length) {
                            let hospitalId = this.props.userApp?.hospital?.id
                            let dataProfile = s.data
                            dataProfile = dataProfile.filter(obj => obj?.medicalRecords?.value && obj?.medicalRecords?.hospitalId == hospitalId)
                            this.setState({
                                dataProfile,

                            });
                            if (!this.state.index) {
                                this.setState({
                                    index: 0
                                })
                                await this.props.dispatch(redux.profileEhealth(dataProfile[0]));
                                this.props.onSeletedProfile()
                            }
                        }
                        break;
                    default:
                        console.log('default');
                        this.setState({ refreshing: false })
                        break
                }
            });
        }).catch(e => {
            this.setState({
                refreshing: false,
            });
        })
    }
    onPressProfile = async (item, index) => {

        this.setState({
            index
        })
        await this.props.dispatch(redux.profileEhealth(item));
        this.props.onSeletedProfile()
    }
    renderProfile = (item, index) => {
        const source = item.medicalRecords && item.medicalRecords.avatar ? { uri: item.medicalRecords.avatar.absoluteUrl() } : require("@images/new/user.png");
        if (index == this.state.index) {
            return (
                <TouchableOpacity disabled={this.state.disabled} onPress={() => this.onPressProfile(item, index)} style={styles.btnPress} key={index}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={[styles.imageStyle, { borderRadius: 10 }]}
                        borderRadius={10}
                        customImagePlaceholderDefaultStyle={styles.placeholderStyle}
                        placeholderSource={source}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={styles.img}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={source} width={70} height={70} />
                        }}
                    /></TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.onPressProfile(item, index)} style={styles.btnItem} key={index}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={[styles.imageStyle, { borderRadius: 8 }]}
                        borderRadius={5}
                        customImagePlaceholderDefaultStyle={styles.defaultImage}
                        placeholderSource={source}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={styles.imgLoad}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={source} width={60} height={60} />
                        }}
                    /></TouchableOpacity>
            )
        }

    }
    onCreateProfile = () => {
        snackbar.show('Tính năng đang phát triển')
        return
        NavigationService.navigate('createProfile')
    }
    render() {

        return (
            <ScrollView pagingEnabled={true} style={styles.container} showsHorizontalScrollIndicator={false} horizontal={true}>
                <View style={styles.viewItem}>
                    {
                        this.state.dataProfile.length ? this.state.dataProfile.map((item, index) =>
                            this.renderProfile(item, index)
                        ) : null
                    }
                    {/* {this.state.dataProfile && <TouchableOpacity onPress={this.onCreateProfile} style={styles.btnAdd} >
                        <ScaleImage resizeMode='cover' style={styles.imgAdd} source={require("@images/new/ehealth/ic_add_profile.png")} width={60} height={60} />
                    </TouchableOpacity>} */}
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    imageStyle: {
        borderRadius: 30, borderWidth: 0.5, borderColor: '#27AE60',
    },
    container: {
        maxHeight: width / 4,
    },
    viewItem: { flexWrap: 'nowrap', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    imgAdd: { borderRadius: 10 },
    btnAdd: { width: 60, height: 60, borderRadius: 10, marginTop: 10 },
    imgLoad: {
        alignSelf: 'center',
        borderRadius: 10,
        width: width / 6,
        height: width / 6
    },
    defaultImage: { width: 60, height: 60, borderRadius: 10 },
    btnItem: { width: width / 6, height: width / 6, borderRadius: 10, marginRight: 5 },
    img: {
        alignSelf: 'center',
        borderRadius: 10,
        width: 70,
        height: 70
    },
    placeholderStyle: { width: 70, height: 70, borderRadius: 10 },
    btnPress: { width: width / 5, height: width / 5, borderRadius: 10, marginRight: 5, }
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        profile: state.profile,
        hospital: state?.ehealth?.hospital || -1
    };
}
export default connect(mapStateToProps)(ListProfile);