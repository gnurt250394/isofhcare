import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, TextInput, Switch } from 'react-native'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import ScaledImage from 'mainam-react-native-scaleimage'
import ActivityPanel from "@components/ActivityPanel";
import { Card } from 'native-base';

export default class ResultExaminationScreen extends Component {
    state = {
        switchValue: false
    }
    onSetAlarm = () => {
        this.setState({ switchValue: !this.state.switchValue })
    }
    render() {
        return (
            <ActivityPanel
                title="Y BẠ ĐIỆN TỬ"
                style={{ backgroundColor: '#fff' }}
                containerStyle={styles.container}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <Calendar style={styles.calendar}></Calendar>
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={{ color: '#fff' }}>KẾT QUẢ KHÁM</Text>
                        </TouchableOpacity>
                        <Card style={styles.cardView}>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <View style={styles.viewLine}></View>
                                <Text style={{ marginLeft: 5, color: '#9caac4', fontSize: 18 }}>Bạn cần làm gì</Text>
                            </View>
                            <Text style={{ color: '#bdc6d8', fontSize: 15 }}>Suggestion</Text>
                            <View style={styles.viewBTnSuggest}>
                                <TouchableOpacity style={[styles.btnReExamination, { backgroundColor: '#4CD565', }]}>
                                    <Text style={{ color: '#fff' }}>Lịch tái khám</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnReExamination, { backgroundColor: '#00B1FF', }]}>
                                    <Text style={{ color: '#fff' }}>Khám lại</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnReExamination, { backgroundColor: '#2E66E7', }]}>
                                    <Text style={{ color: '#fff' }}>Chia sẻ y bạ</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={styles.txLabel}>Ghi chú</Text>
                                <TextInput multiline={true} underlineColorAndroid={'#fff'} style={[styles.txContent,{height:41}]} placeholder={'Nhập ghi chú'}></TextInput>
                            </View>
                            <View>
                                <Text style={styles.txLabel}>Thời gian</Text>
                                <TouchableOpacity><Text style={styles.txContent}>06:00 AM</Text></TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View >
                                    <Text style={styles.txLabel}>Nhắc uống thuốc</Text>
                                   <TouchableOpacity><Text style={styles.txContent}>08:30</Text></TouchableOpacity>
                                </View>
                                <Switch onValueChange={this.onSetAlarm} trackColor={{
                                    true: "yellow",
                                    false: "purple",
                                }}
                                    value={this.state.switchValue} ></Switch>
                            </View>
                        </Card>
                    </View>
                    <View style={{height:50}}>
                    </View>
                </ScrollView>
            </ActivityPanel>
        )
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: '#fff' },
    viewCalendar: { height: 150, justifyContent: 'center', alignItems: 'center', marginTop: 100, width: '100%' },
    calendar: { width: '100%', },
    viewBtn: {
        width: '70%',
        height: 41,
        borderRadius: 5,
        marginVertical: 20,
        backgroundColor: '#27AE60',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardView: {
        width: 327,
        borderRadius: 5,
        height: 365,
        paddingHorizontal: 20,
    },
    viewLine: {
        backgroundColor: '#4CD565',
        height: '100%',
        width: 1
    },
    viewBTnSuggest: {
        flexDirection: 'row'
    },
    btnReExamination: {
        padding: 2, borderRadius: 3, marginRight: 5, marginVertical: 10, paddingHorizontal: 5
    },
    txLabel: {
        color: '#9caac4',
        fontSize: 15
    },
    txContent: {
        color: '#554a4c',
        marginTop: 5, marginBottom: 25,
    }
})