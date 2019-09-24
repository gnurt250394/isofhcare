import React, { Component, PropTypes } from 'react';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import ItemDisease from '@components/disease/ItemDisease';
// import facilityProvider from '@data-access/facility-provider';
import diseaseProvider from '@data-access/disease-provider';
class ListDisease extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        diseaseProvider.getTop(6, (s, e) => {
            if (s) {
                this.setState({ data: s });
            }
        });
    }

    render() {

        if (this.state.data && this.state.data.length > 0)
            return (<View style={styles.flex}>
                <View style={styles.header}>
                    <Text style={styles.txtheader} numberOfLines={1} ellipsizeMode='tail'>Bệnh được tìm nhiều</Text>
                    {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate("searchFacilityResult", { keyword: "" }) }}><Text style={{ fontSize: 14, color: 'rgb(74,144,226)', marginRight: 3, marginTop: 2 }}>Xem tất cả</Text></TouchableOpacity> */}
                </View>
                <View style={styles.containerListDisease}>
                    {
                        this.state.data.map((item, index) => {
                            return <ItemDisease key={index} disease={item} />
                        })
                    }
                </View>
            </View>);
        return null;
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ListDisease);

const styles = StyleSheet.create({
    containerListDisease: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: 14
    },
    txtheader: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        paddingRight: 10
    },
    header: {
        flexDirection: 'row',
        marginTop: 23
    },
    flex: { flex: 1 },
})