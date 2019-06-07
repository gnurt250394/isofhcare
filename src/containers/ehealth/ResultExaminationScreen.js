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
                <Calendar style={{ marginBottom: 3, backgroundColor: "#FFF" }}
                    hideExtraDays={true}
                    monthFormat={'MMMM - yyyy'}
                ></Calendar>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>

                        
                        
                    </View>
                    <View style={{ height: 50 }}>
                    </View>
                </ScrollView>
            </ActivityPanel>
        )
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', backgroundColor: '#fff' },
    
})