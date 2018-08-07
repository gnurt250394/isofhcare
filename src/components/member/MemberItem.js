import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';
import clientUtils from '@utils/client-utils';
import userProvider from '@data-access/user-provider';

class MemberItem extends Component {
    constructor(props) {
        super(props)
        this.onItemLongPress.bind(this);
    }

    onItemLongPress(e) {
        this.component.measure((fx, fy, width, height, px, py) => {
            console.log(fx, fy, width, height, px, py);
            if (this.props.onItemLongPress) {
                this.props.onItemLongPress(this.props.item.user, this.props.index, e, fx, fy, width, height, px, py);
            }
        });
    }


    render() {
        return (

            <TouchableOpacity ref={view => this.component = view} onPress={(e) => this.onItemLongPress(e)} onLongPress={(e) => this.onItemLongPress(e)} style={{ flex: 1, alignItems: 'center', padding: 12, borderBottomColor: 'rgb(204,204,204)', borderBottomWidth: 0.5, flexDirection: 'row' }}>
                <ImageProgress
                    indicator={Progress} resizeMode='cover' style={{ width: 47, height: 47 }} imageStyle={{ width: 47, height: 47, borderRadius: 23.5 }} source={{ uri: this.props.item.user.avatar ? this.props.item.user.avatar.absoluteUrl() : "undefined" }}
                    defaultImage={() => {
                        return <ScaleImage resizeMode='cover' source={require("@images/doctor.png")} width={47} style={{ width: 47, height: 47, borderRadius: 23.5 }} />
                    }}
                />
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={{ fontWeight: '800', fontSize: 16 }}>{this.props.item.user.degree ? this.props.item.user.degree + " " : ""}{this.props.item.user.name}</Text>
                    <Text style={{ marginTop: 5.3, fontSize: 14, color: 'rgba(0,0,0,0.6)' }}>{userProvider.getFirstPosition(this.props.item.user)}</Text>
                </View>
                {
                    this.props.item.userConference && this.props.item.userConference.checkin != 0 ?
                        <ScaleImage source={require("@images/iccheckin.png")} width={21} style={{ marginRight: 13 }} />
                        : null
                }
            </TouchableOpacity>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(MemberItem);