/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import snackbar from '@utils/snackbar-utils';
import DateMessage from '@components/chat/DateMessage';
import ImageLoad from 'mainam-react-native-image-loader';
import { connect } from 'react-redux';
import firebaseUtils from '@utils/firebase-utils';
import dataCacheProvider from '@data-access/datacache-provider';
import clientUtils from '@utils/client-utils';
class MyFacilityItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            unReadCount: 0,
            userId: this.props.userApp.currentUser.id
        }
    }
    openGroup(facility) {
        if (this.props.onOpenGroup)
            this.props.onOpenGroup(facility);
    }
    componentDidMount() {
        this.showData(this.props);
    }
    showData(props) {
        let facility = props.facility;
        this.snapshot = firebaseUtils.onMyGroupChange("facility_" + facility.id, (snap) => {
            if (snap.docChanges().length > 0) {
                this.getUnreadCount(facility);
            }
        });
        this.setState({
            unReadCount: 0
        }, () => {
            this.getUnreadCount(facility);
        });
    }
    getUnreadCount(facility) {
        firebaseUtils.getTotalUnReadMessageCount("facility_" + facility.id).then(x => {
            this.setState({
                unReadCount: x
            });
        }).catch(x =>
            this.setState({
                unReadCount: 0
            }));
    }
    componentWillReceiveProps(props) {
        if (this.props.facility.id != props.facility.id) {
            if (this.snapshot) {
                this.snapshot();
            }
            this.setState({
                unReadCount: 0
            });
            setTimeout(() => {
                this.showData(props);
            }, 1000);
        }
    }
    componentWillUnmount() {
        if (this.snapshot) {
            this.snapshot();
            this.snapshot = null;
        }
    }
    // shouldComponentUpdate(props, state) {
    //     if (this.props.facility != props.facility || this.state.unReadCount != state.unReadCount) {
    //         return true;
    //     }
    // }
    render() {
        const facility = this.props.facility;
        let avatar = facility.logo;
        if (avatar)
            avatar = avatar;
        else
            avatar = "";

        return <TouchableOpacity style={{ flex: 1 }} onPress={this.openGroup.bind(this, facility)}>
            <View style={{ flex: 1, padding: 10, width: 150, alignItems: 'center' }}>
                <View style={{ position: 'relative' }}>
                    <ImageLoad
                        borderRadius={30}
                        customImagePlaceholderDefaultStyle={{ width: 60, height: 60, borderRadius: 30 }}
                        resizeMode="cover"
                        placeholderSource={require("@images/user.png")}
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        imageStyle={{ borderRadius: 30 }}
                        source={{ uri: avatar }}
                    />
                    {
                        this.state.unReadCount > 0 &&
                        <Text style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'red', color: '#FFF', borderRadius: 8, overflow: 'hidden', paddingHorizontal: 5, paddingVertical: 2 }}>{this.state.unReadCount > 100 ? "99+" : this.state.unReadCount}</Text>
                    }

                </View>
                <Text style={{ fontWeight: 'bold', fontSize: 15, flex: 1, textAlign: 'center', marginTop: 10 }} numberOfLines={2}>
                    {facility.name}</Text>
            </View>
        </TouchableOpacity>
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(MyFacilityItem);