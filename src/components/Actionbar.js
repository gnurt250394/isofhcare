import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import ic_back from '@images/ic_back.png';
import ic_msg from '@images/ic_msg.png';
const { width, height } = Dimensions.get('window');

class Actionbar extends Component {
    constructor(props) {
        super(props)
    }

    backButtonClick() {
        if (this.props.backButtonClick)
            this.props.backButtonClick();
    }

    showMessengerClicked() {
        if (this.props.showMessengerClicked)
            this.props.showMessengerClicked();
    }

    render() {
        return (
            <View>
                <View style={[styles.actionbar, this.props.actionbarStyle, { paddingTop: this.props.hideBackButton ? 40 : 30, paddingBottom: this.props.hideBackButton ? 15 : 5 }]}
                    shadowColor='#000000' shadowOpacity={0.1} shadowOffset={{ width: 0, height: 2 }} shadowRadius={5}>
                    {
                        !this.props.hideBackButton ?

                            <TouchableOpacity onPress={() => this.backButtonClick()} style={{ width: 45, paddingTop: 12, paddingBottom: 12 }}>
                                <ScaleImage source={this.props.icBack ? this.props.icBack : ic_back} style={[styles.ic_back, this.props.styleBackButton]} height={20}></ScaleImage>
                            </TouchableOpacity>
                            :
                            <View style={{ paddingTop: 12, paddingBottom: 12 }}>
                                <View style={[styles.ic_back, { height: 20 }]} />
                            </View>
                    }
                    {
                        this.props.title ?
                            <Text style={[styles.title, this.props.actionbarTextColor, this.props.titleStyle, { flex: 1, textAlign: 'center' }]}>
                                {this.props.title}
                            </Text>
                            :
                            this.props.image &&
                            <View style={{ height: 45, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ScaleImage source={this.props.image} height={32} />
                            </View>
                    }
                    <View style={styles.menuButton}>
                        {
                            this.props.menuButton
                        }
                    </View>
                    <View style={[styles.notifi]}>
                        {
                            this.props.showMessenger ?
                                <TouchableOpacity onPress={() => this.showMessengerClicked()} style={{ paddingTop: 12, paddingBottom: 12 }}>
                                    <ScaleImage source={this.props.ic_msg ? this.props.ic_msg : ic_msg} style={[styles.ic_msg, this.props.styleMessenger]} height={23}></ScaleImage>
                                    {this.props.badge ?
                                        <Text style={styles.badge} zIndex={2} >{this.props.badge < 100 ? this.props.badge :
                                            <Text style={{ fontSize: 9, paddingTop: 15 }}>99+</Text>}</Text> : null
                                    }
                                </TouchableOpacity>
                                :
                                <View style={{ paddingTop: 12, paddingBottom: 12 }}>
                                    <View style={{}} />
                                </View>
                        }
                    </View>
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    notifi: {
        width: 35,
        height: 40,
    },
    title: {
        marginRight: 40,
        color: 'rgb(0,151,124)',
        fontWeight: 'bold',
        fontSize: 17
    },
    ic_back: {
        marginLeft: 10,
        marginRight: 20,
        top: 0, left: 0,
        zIndex: 100
    },
    actionbar: {
        justifyContent: 'space-between',
        elevation: 5,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    badge: {
        backgroundColor: '#fb5656',
        width: 20,
        height: 20,
        position: 'absolute',
        borderRadius: 50,
        fontSize: 10,
        top: 3,
        left: 10,
        color: "#ffffff",
        paddingLeft: 4,
        paddingTop: 2
    }
});
export default Actionbar;