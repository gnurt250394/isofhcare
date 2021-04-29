import React, { Component, PropTypes, PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import ImageLoad from 'mainam-react-native-image-loader';
import TotalMoney from './TotalMoney';
import CheckupResult from './CheckupResult';
import MedicalTestResult from './MedicalTestResult';
import Medicine from './Medicine';
import SurgeryResult from './SurgeryResult';
import DiagnosticResult from './DiagnosticResult';
import { Card, Icon } from 'native-base';
class ItemListResult extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        };
    }
    showMenu = () => {
        this.setState({ isShow: !this.state.isShow })
    }
    renderDetailItem = (item) => {
        if (item.id == 1 && item.isShow) {
            return (

                // dịch vụ khám
                <View style={{
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                }}>
                    <TotalMoney result={this.props.result} resultDetail={this.props.resultDetail} />
                </View>
            )
        }
        else if (item.id == 2 && item.isShow) {
            return (
                // kết quả khám
                <View style={{
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                }}>
                    <CheckupResult result={this.props.result} />
                </View>
            )
        }
        else if (item.id == 3 && item.isShow) {
            return (
                // Kết quả xét nghiệm
                <View style={{
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                }}>
                    <MedicalTestResult result={this.props.result} />

                </View>

            )
        }
        else if (item.id == 4 && item.isShow) {
            return (
                // Kết quả chẩn đoán hình ảnh
                <View style={{
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                }}>
                    <DiagnosticResult result={this.props.result} />
                </View>

            )
        }
        else if (item.id == 5 && item.isShow) {
            return (
                // Kết quả giải phẫu
                <View style={{
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                }}>
                    <SurgeryResult result={this.props.result} />
                </View>

            )
        }
        else if (item.id == 6 && item.isShow) {
            return (
                // Thuốc
                <View style={{
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                }}>
                    <Medicine result={this.props.result} />
                   

                </View>

            )
        }
    }
    render() {
        const { item } = this.props
        const { isShow } = this.state
        return (
            <View style={{ padding: 10, }}>
                <Card style={{ borderRadius: 5 }}>
                    <TouchableOpacity
                        onPress={this.props.onPress}
                        style={[styles.butonItem, {
                            backgroundColor: item.isShow ? '#3161AD' : '#d7e3f4',
                        }]}>
                        <View style={styles.groupLabel}>
                            <ScaledImage source={item.image} width={30} style={{ tintColor: item.isShow ? '#fff' : '#3161AD' }} />
                            <Text style={[styles.txtLabel, {
                                color: item.isShow ? '#fff' : '#3161AD'
                            }]}>{item.name}</Text>
                        </View>

                        <ScaledImage source={require('@images/new/ehealth/ic_arrow_right.png')} width={10} style={item.isShow ? {
                            transform: [{ rotate: '90deg' }],
                            tintColor: '#fff'

                        } : {}} />
                    </TouchableOpacity>

                    {this.renderDetailItem(item)}
                </Card>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    txtLabel: {
        paddingLeft: 10,
        fontWeight: 'bold',
        fontSize: 15
    },
    groupLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    butonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    imageStyle: {
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
    image: {
        width: 60,
        height: 60
    },
    imgLoad: {
        alignSelf: 'center',
        borderRadius: 30,
        width: 60,
        height: 60
    },
    avatar: {
        alignSelf: 'center',
        borderRadius: 30,
        width: 60,
        height: 60
    },
});
export default ItemListResult;
