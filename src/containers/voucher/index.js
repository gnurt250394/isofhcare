import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { IndicatorViewPager } from "mainam-react-native-viewpager";
import { Card } from 'native-base'
import FillMyVocherScreen from './FillMyVoucherScreen';
import MyVoucherCodeScreen from './MyVoucherCodeScreen';
import constants from '@resources/strings';

class MyVoucherScreen extends Component {
    constructor(props) {
        super(props);
        let tabIndex = 0;
        if (this.props.navigation.state.params && this.props.navigation.state.params.selectTab)
            tabIndex = this.props.navigation.state.params.selectTab;
        this.state = {
            isMyVocher: true,
            tabIndex,
        };
    }

    onSelectMyVocher = () => {
        if (this.viewPager) this.viewPager.setPage(0);
    }
    onMyVocher = () => {
        if (this.viewPager) this.viewPager.setPage(1);
    }
    swipe(targetIndex) {
        if (this.viewPager) this.viewPager.setPage(targetIndex);

    }
    onPageScroll(e) {
        var tabIndex = e.position;
        var offset = e.offset * 100;
        if (tabIndex == -1 || (tabIndex == 1 && offset > 0)) return;
        this.setState({
            isMyVocher: tabIndex == 0
        });
    }

    comfirmVoucher = (voucher) => {
        let onSelected = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (onSelected) onSelected(voucher)
        this.props.navigation.pop()
    }
    render() {
        let booking = this.props.navigation.getParam('booking', null)
        return (
            <ActivityPanel
                title={constants.title.voucher}
                showFullScreen={true} isLoading={this.state.isLoading}>
                <View style={styles.viewBtn}>
                    <View style={styles.separateBackground}></View>
                    <TouchableOpacity onPress={this.onSelectMyVocher} style={[styles.btnGetNumber, this.state.isMyVocher ? styles.buttonSelected : {}]}>
                        <Text style={this.state.isMyVocher ? styles.unSelected : styles.selected}>{constants.voucher.input_voucher}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onMyVocher} style={[styles.btnGetNumber, , this.state.isMyVocher ? {} : styles.buttonSelected]}>
                        <Text style={this.state.isMyVocher ? styles.selected : styles.unSelected}>{constants.voucher.my_voucher}</Text>
                    </TouchableOpacity>
                </View>
                <IndicatorViewPager style={styles.container}
                    ref={viewPager => {
                        this.viewPager = viewPager;
                    }}
                    onPageScroll={this.onPageScroll.bind(this)}>
                    <View style={styles.container}>
                        <FillMyVocherScreen booking={booking} onPress={this.comfirmVoucher} parrent={this} />
                    </View>
                    <View style={styles.container}>

                        <MyVoucherCodeScreen booking={booking} onPress={this.comfirmVoucher} parrent={this} />
                    </View>

                </IndicatorViewPager>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    buttonSelected: { backgroundColor: '#27AE60' },
    selected: {
        color: '#27AE60',
        fontWeight: "bold",
    },
    unSelected: {
        color: '#fff',
        fontWeight: "bold",
    },
    container: { flex: 1 },
    viewBtn: {
        flexDirection: 'row',
        height: 40,
        margin: 10,
        borderRadius: 6,
        backgroundColor: "#ffffff",
        position: 'relative'
    },
    separateBackground: {
        borderColor: "#27ae60",
        borderWidth: 1,
        borderRadius: 6,
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0
    },
    btnGetNumber: {
        alignItems: 'center',
        paddingVertical: 8,
        justifyContent: 'center',
        flex: 1,
        borderRadius: 6,
        overflow: 'hidden'
    },
})
export default MyVoucherScreen;
