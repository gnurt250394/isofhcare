import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import ic_back from '@images/ic_back.png';
const { width, height } = Dimensions.get('window');

class Actionbar extends Component {
    constructor(props) {
        super(props)
    }

    backButtonClick() {
        if (this.props.backButtonClick)
            this.props.backButtonClick();
    }

    render() {
        return (
            <View>
                <View style={[styles.actionbar, this.props.actionbarStyle, { paddingTop: this.props.hideBackButton ? 40 : 30, paddingBottom: this.props.hideBackButton ? 15 : 5 }]}
                    shadowColor='#000000' shadowOpacity={0.1} shadowOffset={{ width: 0, height: 2 }} shadowRadius={5}>
                    {
                        !this.props.hideBackButton ?

                            <TouchableOpacity onPress={() => this.backButtonClick()} style={{ paddingTop: 12, paddingBottom: 12 }}>
                                <ScaleImage source={this.props.icBack ? this.props.icBack : ic_back} style={[styles.ic_back, this.props.styleBackButton]} height={20}></ScaleImage>
                            </TouchableOpacity>
                            :
                            <View style={{ paddingTop: 12, paddingBottom: 12 }}>
                                <View style={[styles.ic_back, { height: 20 }]} />
                            </View>
                    }
                    <Text style={[styles.title, this.props.actionbarTextColor, this.props.titleStyle, { flex: 1, textAlign: 'center'}]}>
                        {this.props.title}
                    </Text>
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
});
export default Actionbar;