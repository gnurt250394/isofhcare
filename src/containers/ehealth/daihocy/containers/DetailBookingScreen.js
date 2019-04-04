import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import DetailBookingNoCheckin from '@ehealth/daihocy/components/DetailBookingNoCheckin';
import DetailBookingHasCheckin from '@ehealth/daihocy/components/DetailBookingHasCheckin';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';


class DetailBookingScreen extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                isLoading: false
            }
    }
    onLoading(isLoading, callback) {
        this.setState({ isLoading }, callback);
    }
    render() {
        let booking = this.props.navigation.getParam("bookingDetail");
        let bookingResult = this.props.navigation.getParam("bookingResult");
        if (!booking) {
            this.props.navigation.pop();
            return null;
        }
        return (
            <ActivityPanel style={{ flex: 1, }} title="Y bạ điện tử" isLoading={this.state.isLoading} showFullScreen={true}>
                {
                    booking.hasCheckin ? <DetailBookingHasCheckin booking={booking} bookingResult={bookingResult} onLoading={this.onLoading.bind(this)} />
                        :
                        <DetailBookingNoCheckin booking={booking} activity={this} />
                }
            </ActivityPanel >
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps)(DetailBookingScreen);