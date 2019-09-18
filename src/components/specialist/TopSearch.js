import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';

import specialistProvider from '@data-access/specialist-provider';
import constants from '@resources/strings';

class TopSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        specialistProvider.getTop(6, (s, e) => {
            if (s) {
                this.setState({ data: s });
            }
        });
    }

    onItemClick(item) {
        if (this.props.onItemClick)
            this.props.onItemClick(item);
    }
    onClickSeeAll = () => this.props.navigation.navigate("specialist")
    render() {
        return (
            this.state.data && this.state.data.length > 0 ?
                <View style={styles.flex}>
                    <View style={styles.containerSeeAll}>
                        <Text style={styles.txtTitleSeeAll} numberOfLines={1} ellipsizeMode='tail'>{constants.ehealth.specialist_searched}</Text>
                        <TouchableOpacity onPress={this.onClickSeeAll}><Text style={styles.txtSeeAll}>{constants.ehealth.see_all}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.containerItem}>
                        {
                            this.state.data.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={this.onItemClick.bind(this, item)}
                                    style={styles.buttonSpecialist}>
                                    <Text style={styles.txtSpecialist}
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                    >{item.specialist.name}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>

                </View> : null);
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(TopSearch);

const styles = StyleSheet.create({
    txtSpecialist: {
        color: '#FFF',
        fontWeight: 'bold',
        maxWidth: 80,
        fontSize: 13
    },
    buttonSpecialist: {
        margin: 3,
        padding: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 16,
        backgroundColor: 'rgb(0,151,124)'
    },
    containerItem: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: 14
    },
    txtSeeAll: {
        fontSize: 14,
        color: 'rgb(74,144,226)',
        marginRight: 3,
        marginTop: 2
    },
    txtTitleSeeAll: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        paddingRight: 10
    },
    containerSeeAll: {
        flexDirection: 'row',
        marginTop: 23
    },
    flex: {
        flex: 1
    },
})