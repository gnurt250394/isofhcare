import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    View, StyleSheet, Image, Text, TouchableOpacity, FlatList
} from 'react-native'
import ScaleImage from 'mainam-react-native-scaleimage';
import departmentProvider from '@dhy/data-access/department-provider';
import constants from '@dhy/strings';

class TabBookingType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            index: 0
        }
    }
    selectItem(item) {
        this.props.dispatch({ type: constants.action.action_select_department, value: item });
        if (this.props.itemChange) {
            this.props.itemChange();
        }
    }
    nextItem() {
        if (this.state.listDepartment && this.state.listDepartment.length > 0) {
            var index = this.state.index + 1;
            if (index < 0)
                index = 0;
            if (index > this.state.listDepartment.length - 1)
                index = 0;
            this.setState({ index: index });
            // console.log(index);
            this.selectItem(this.state.listDepartment[index]);

        }
    }

    previewItem() {
        if (this.state.listDepartment && this.state.listDepartment.length > 0) {
            var index = this.state.index - 1;
            if (index < 0)
                index = this.state.listDepartment.length - 1;
            if (index < 0)
                index = 0;
            if (index > this.state.listDepartment.length - 1)
                index = this.state.listDepartment.length - 1;
            this.setState({ index: index });
            // console.log(index);
            this.selectItem(this.state.listDepartment[index]);
        }
    }
    componentWillMount() {
        // console.log("componentWillMount");
        departmentProvider.getListDepartment((res) => {
            if (!res)
                res = [];
            this.setState({
                listDepartment: res
            })
            if (res.length > 0) {
                this.selectItem(res[0]);
            }
        });
    }

    render() {
        return (
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => this.previewItem()}><ScaleImage style={{ padding: 5, transform: [{ rotate: '180deg' }] }} source={require("@images/ic_next2.png")} width={24}></ScaleImage></TouchableOpacity>
                <Text style={{ flex: 1, overflow: 'hidden', textAlign: 'center', padding: 5, paddingTop: 10, paddingBottom: 10, backgroundColor: '#FFF', margin: 10, borderRadius: 20, fontWeight: 'bold', color: constants.colors.primary_bold }}>
                    {this.props.booking.currentDepartment ? this.props.booking.currentDepartment.name : ""}
                </Text>

                <TouchableOpacity onPress={() => this.nextItem()} >
                    <ScaleImage style={{ padding: 5 }} source={require("@images/ic_next2.png")} width={24}></ScaleImage>
                </TouchableOpacity>
            </View>
        )
    }
}

TabBookingType.propTypes = {
    itemChange: PropTypes.func
}
export default connect(mapStateToProps)(TabBookingType);


function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}

const styles = StyleSheet.create({

    tabContainer: { flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 10 },
    tabItem: {
        flex: 1, backgroundColor: '#FFF', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        margin: 2,
        paddingLeft: 5,
        paddingRight: 5,
        minWidth: 100
    },
    tabItemSelected: {
        borderBottomColor: "#0c8c8b", borderBottomWidth: 2, flex: 1, backgroundColor: '#FFF', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        margin: 2,
        paddingLeft: 5,
        paddingRight: 5,
        minWidth: 100
    },
    tabImage: {
        width: 21, height: 21, marginBottom: 5, marginTop: 10
    },
    textTabSelected: {
        fontSize: 12,
        color: '#0c8c8b',
        fontWeight: "bold",
        textAlign: 'center',
        marginBottom: 1
    },
    tabText: {
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 1

    }

});