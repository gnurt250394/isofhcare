import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import ic_back from '@images/new/ic_back.png';
import ic_msg from '@images/ic_msg.png';
const { width, height } = Dimensions.get('window');

class Actionbar extends Component {
    constructor(props) {
        super(props)
    }

    backButtonClick = () => {
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
                <View style={[styles.actionbar, this.props.actionbarStyle, { paddingTop: 10, minHeight: 60, backgroundColor:'transparent' }]}>
                    {
                        this.props.backButton ?
                            this.props.backButton :
                            !this.props.hideBackButton ?
                                <TouchableOpacity onPress={this.backButtonClick} style={[styles.buttonBack,this.props.buttonBackStyle]}>
                                    <ScaleImage source={this.props.icBack ? this.props.icBack : ic_back} style={[styles.ic_back, this.props.styleBackButton]} height={18}></ScaleImage>
                                </TouchableOpacity>
                                :
                                <View style={styles.containerBack}>
                                    <View style={[styles.ic_back, { height: 20 }]} />
                                </View>
                    }
                    {
                        this.props.titleView ?
                            <View style={this.props.titleViewStyle}>{this.props.titleView}</View> :
                            this.props.title ?
                                <Text style={[styles.title, this.props.actionbarTextColor, this.props.titleStyle]}>
                                    {this.props.title}
                                </Text>
                                :
                                this.props.image &&
                                <View style={[styles.containerImage, this.props.imageStyle]}>
                                    <ScaleImage source={this.props.image} height={32} />
                                </View>
                    }
                    <View style={styles.menuButton}>
                        {
                            this.props.menuButton
                        }
                    </View>
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    containerImage: {
        height: 45,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerBack: {
        paddingTop: 12,
        paddingBottom: 12
    },
    buttonBack: {
        width: 50,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 15
    },
    notifi: {
        width: 35,
        height: 40,
    },
    title: {
        marginRight: 55,
        color: '#4A4A4A',
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1, textAlign: 'center'
    },
    ic_back: {
        marginLeft: 10,
        marginRight: 20,
        top: 0, left: 0,
        zIndex: 100
    },
    actionbar: {
        justifyContent: 'space-between',
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)'
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